import { RSVPRecord, GuestbookRecord, AdminStats } from '../types';
import { supabase } from './supabase';

const STORAGE_KEY_RSVPS = 'zh_wedding_rsvps_store';
const STORAGE_KEY_GUESTBOOK = 'zh_wedding_guestbook_store';

function getLocalRsvps(): RSVPRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RSVPS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local RSVPs:', e);
  }
  return [];
}

function saveLocalRsvps(rsvps: RSVPRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_RSVPS, JSON.stringify(rsvps));
  } catch (e) {
    console.error('Error saving local RSVPs:', e);
  }
}

function getLocalGuestbook(): GuestbookRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_GUESTBOOK);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading local Guestbook:', e);
  }
  return [];
}

function saveLocalGuestbook(notes: GuestbookRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY_GUESTBOOK, JSON.stringify(notes));
  } catch (e) {
    console.error('Error saving local Guestbook:', e);
  }
}

// Convert Supabase row to RSVPRecord
function mapSupabaseRsvp(row: any): RSVPRecord {
  return {
    id: String(row.id || `rsvp-${Date.now()}`),
    name: String(row.name || ''),
    attending: (row.attending === 'no' ? 'no' : 'yes') as 'yes' | 'no',
    guestCount: Number(row.guest_count ?? row.guestCount ?? (row.attending === 'no' ? 0 : 1)),
    contact: String(row.contact || ''),
    notes: String(row.notes || ''),
    createdAt: String(row.created_at || row.createdAt || new Date().toISOString()),
  };
}

// Convert Supabase row to GuestbookRecord
function mapSupabaseGuestbook(row: any): GuestbookRecord {
  return {
    id: String(row.id || `gb-${Date.now()}`),
    name: String(row.name || ''),
    message: String(row.message || ''),
    photoUrl: String(row.photo_url || row.photoUrl || ''),
    status: (['pending', 'approved', 'hidden'].includes(row.status)
      ? row.status
      : 'pending') as 'pending' | 'approved' | 'hidden',
    createdAt: String(row.created_at || row.createdAt || new Date().toISOString()),
  };
}

export const dataStore = {
  // --- AUTHENTICATION ---
  verifyAdminPin(pin: string): boolean {
    const clean = (pin || '').trim().toUpperCase();
    return clean === 'ZH2027' || clean === '2027' || clean === 'ADMIN';
  },

  async loginAdmin(pin: string): Promise<boolean> {
    const cleanPin = (pin || '').trim().toUpperCase();
    return this.verifyAdminPin(cleanPin);
  },

  // --- STATS ---
  async getStats(): Promise<AdminStats> {
    const [rsvps, gb] = await Promise.all([this.getRsvps(), this.getGuestbook(true)]);

    const confirmed = rsvps.filter((r) => r.attending === 'yes');
    const declined = rsvps.filter((r) => r.attending === 'no');
    const totalConfirmedGuests = confirmed.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);

    return {
      rsvp: {
        confirmedCount: confirmed.length,
        declinedCount: declined.length,
        totalConfirmedGuests,
        totalResponses: rsvps.length,
      },
      guestbook: {
        pendingCount: gb.filter((g) => g.status === 'pending').length,
        approvedCount: gb.filter((g) => g.status === 'approved').length,
        hiddenCount: gb.filter((g) => g.status === 'hidden').length,
        totalNotes: gb.length,
      },
    };
  },

  // --- RSVP ---
  async getRsvps(): Promise<RSVPRecord[]> {
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        const records = data.map(mapSupabaseRsvp);
        saveLocalRsvps(records);
        return records;
      }
      if (error) {
        console.warn('Supabase rsvps fetch note:', error.message);
      }
    } catch (err) {
      console.warn('Supabase fetch exception, falling back:', err);
    }

    // Fallback to local / API
    let apiRsvps: RSVPRecord[] = [];
    try {
      const res = await fetch('/api/rsvp');
      if (res.ok) {
        apiRsvps = await res.json();
      }
    } catch {
      // ignore
    }

    const localRsvps = getLocalRsvps();
    const map = new Map<string, RSVPRecord>();
    localRsvps.forEach((r) => map.set(r.name.toLowerCase(), r));
    apiRsvps.forEach((r) => map.set(r.name.toLowerCase(), r));

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    saveLocalRsvps(merged);
    return merged;
  },

  async submitRsvp(record: {
    name: string;
    attending: 'yes' | 'no';
    guestCount: number;
    contact?: string;
    notes?: string;
  }): Promise<{ success: boolean; rsvp: RSVPRecord }> {
    const id = `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newRecord: RSVPRecord = {
      id,
      name: record.name.trim(),
      attending: record.attending,
      guestCount: record.attending === 'yes' ? Math.max(1, record.guestCount) : 0,
      contact: record.contact ? record.contact.trim() : '',
      notes: record.notes ? record.notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Supabase Cloud Database
    try {
      const { error } = await supabase.from('rsvps').upsert([
        {
          id: newRecord.id,
          name: newRecord.name,
          attending: newRecord.attending,
          guest_count: newRecord.guestCount,
          contact: newRecord.contact,
          notes: newRecord.notes,
          created_at: newRecord.createdAt,
        },
      ]);
      if (error) {
        console.warn('Supabase RSVP write warning:', error.message);
      }
    } catch (err) {
      console.warn('Supabase insert failed:', err);
    }

    // 2. Cache in local storage
    const current = getLocalRsvps();
    const existingIdx = current.findIndex(
      (r) => r.name.toLowerCase() === newRecord.name.toLowerCase()
    );
    if (existingIdx >= 0) {
      current[existingIdx] = newRecord;
    } else {
      current.unshift(newRecord);
    }
    saveLocalRsvps(current);

    // 3. Sync to API if available
    try {
      await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
    } catch {
      // ignore
    }

    return { success: true, rsvp: newRecord };
  },

  async deleteRsvp(id: string): Promise<boolean> {
    try {
      await supabase.from('rsvps').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }

    const current = getLocalRsvps().filter((r) => r.id !== id);
    saveLocalRsvps(current);

    try {
      await fetch(`/api/rsvp/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    return true;
  },

  async clearAllRsvps(): Promise<boolean> {
    try {
      await supabase.from('rsvps').delete().neq('id', '___non_existent___');
    } catch (e) {
      console.warn('Supabase clear all error:', e);
    }

    saveLocalRsvps([]);
    try {
      await fetch('/api/rsvp/all', { method: 'DELETE' });
    } catch {
      // ignore
    }
    return true;
  },

  // --- GUESTBOOK ---
  async getGuestbook(all: boolean = false): Promise<GuestbookRecord[]> {
    try {
      let query = supabase.from('guestbook').select('*').order('created_at', { ascending: false });

      if (!all) {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        const records = data.map(mapSupabaseGuestbook);
        if (all) {
          saveLocalGuestbook(records);
        }
        return records;
      }
      if (error) {
        console.warn('Supabase guestbook fetch note:', error.message);
      }
    } catch (err) {
      console.warn('Supabase guestbook error:', err);
    }

    // Fallback to local / API
    let apiNotes: GuestbookRecord[] = [];
    try {
      const res = await fetch(`/api/guestbook${all ? '?all=true' : ''}`);
      if (res.ok) {
        apiNotes = await res.json();
      }
    } catch {
      // ignore
    }

    const localNotes = getLocalGuestbook();
    const map = new Map<string, GuestbookRecord>();
    localNotes.forEach((n) => map.set(n.id, n));
    apiNotes.forEach((n) => map.set(n.id, n));

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (all) {
      saveLocalGuestbook(merged);
      return merged;
    }
    return merged.filter((n) => n.status === 'approved');
  },

  async submitGuestbook(entry: {
    name: string;
    message: string;
    photoUrl?: string;
  }): Promise<{ success: boolean; entry: GuestbookRecord }> {
    const id = `gb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newEntry: GuestbookRecord = {
      id,
      name: entry.name.trim(),
      message: entry.message.trim(),
      photoUrl: entry.photoUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Supabase Cloud Database
    try {
      const { error } = await supabase.from('guestbook').insert([
        {
          id: newEntry.id,
          name: newEntry.name,
          message: newEntry.message,
          photo_url: newEntry.photoUrl,
          status: newEntry.status,
          created_at: newEntry.createdAt,
        },
      ]);
      if (error) {
        console.warn('Supabase guestbook insert note:', error.message);
      }
    } catch (err) {
      console.warn('Supabase guestbook insert failed:', err);
    }

    // 2. Cache locally
    const current = getLocalGuestbook();
    current.unshift(newEntry);
    saveLocalGuestbook(current);

    // 3. API sync
    try {
      await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch {
      // ignore
    }

    return { success: true, entry: newEntry };
  },

  async updateGuestbookStatus(
    id: string,
    status: 'pending' | 'approved' | 'hidden'
  ): Promise<boolean> {
    try {
      await supabase.from('guestbook').update({ status }).eq('id', id);
    } catch (e) {
      console.warn('Supabase status update error:', e);
    }

    const current = getLocalGuestbook();
    const target = current.find((g) => g.id === id);
    if (target) {
      target.status = status;
      saveLocalGuestbook(current);
    }

    try {
      await fetch(`/api/guestbook/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch {
      // ignore
    }
    return true;
  },

  async deleteGuestbook(id: string): Promise<boolean> {
    try {
      await supabase.from('guestbook').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }

    const current = getLocalGuestbook().filter((g) => g.id !== id);
    saveLocalGuestbook(current);

    try {
      await fetch(`/api/guestbook/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    return true;
  },

  async clearAllGuestbook(): Promise<boolean> {
    try {
      await supabase.from('guestbook').delete().neq('id', '___non_existent___');
    } catch (e) {
      console.warn('Supabase clear error:', e);
    }

    saveLocalGuestbook([]);
    try {
      await fetch('/api/guestbook/all', { method: 'DELETE' });
    } catch {
      // ignore
    }
    return true;
  },
};
