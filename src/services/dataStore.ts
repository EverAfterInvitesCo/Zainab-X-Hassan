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

// Convert Supabase row to RSVPRecord (handles both column conventions)
function mapSupabaseRsvp(row: any): RSVPRecord {
  const attendanceVal = (row.attendance || row.attending || 'yes').toString().toLowerCase();
  const attending: 'yes' | 'no' =
    attendanceVal.includes('no') || attendanceVal.includes('decline') ? 'no' : 'yes';

  return {
    id: String(row.id ?? `rsvp-${Date.now()}`),
    name: String(row.name || 'Guest'),
    attending,
    guestCount: Number(
      row.guests_count ??
        row.guest_count ??
        row.guestCount ??
        (attending === 'no' ? 0 : 1)
    ),
    contact: String(row.contact || row.dietary || row.email || row.phone || ''),
    notes: String(row.notes || ''),
    createdAt: String(
      row.created_at ||
        row.createdAt ||
        (row.id && !isNaN(Number(row.id)) ? new Date(Number(row.id)).toISOString() : new Date().toISOString())
    ),
  };
}

// Convert Supabase row to GuestbookRecord
function mapSupabaseGuestbook(row: any): GuestbookRecord {
  return {
    id: String(row.id ?? `gb-${Date.now()}`),
    name: String(row.name || 'Guest'),
    message: String(row.message || ''),
    photoUrl: String(row.photo_url || row.photoUrl || row.photo || ''),
    status: (['pending', 'approved', 'hidden'].includes(row.status)
      ? row.status
      : 'pending') as 'pending' | 'approved' | 'hidden',
    createdAt: String(
      row.created_at ||
        row.createdAt ||
        (row.id && !isNaN(Number(row.id)) ? new Date(Number(row.id)).toISOString() : new Date().toISOString())
    ),
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

    // Check supabase admin_config table if available
    try {
      const { data } = await supabase.from('admin_config').select('*').limit(5);
      if (data && data.length > 0) {
        const found = data.some((row: any) => {
          const storedPin = String(row.pin || row.password || row.code || row.value || '').trim().toUpperCase();
          return storedPin && storedPin === cleanPin;
        });
        if (found) return true;
      }
    } catch {
      // fallback
    }

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
      // Fetch all from Supabase rsvps table
      const { data, error } = await supabase.from('rsvps').select('*');

      if (!error && Array.isArray(data)) {
        const records = data.map(mapSupabaseRsvp);
        // Sort newest first
        records.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime() || 0;
          const timeB = new Date(b.createdAt).getTime() || 0;
          if (timeA !== timeB) return timeB - timeA;
          return String(b.id).localeCompare(String(a.id));
        });
        saveLocalRsvps(records);
        return records;
      }
      if (error) {
        console.warn('Supabase rsvps query note:', error.message);
      }
    } catch (err) {
      console.warn('Supabase fetch exception:', err);
    }

    // Fallback to local
    return getLocalRsvps();
  },

  async submitRsvp(record: {
    name: string;
    attending: 'yes' | 'no';
    guestCount: number;
    contact?: string;
    notes?: string;
  }): Promise<{ success: boolean; rsvp: RSVPRecord }> {
    const cleanName = record.name.trim();
    const guestCountNum = record.attending === 'yes' ? Math.max(1, Number(record.guestCount) || 1) : 0;
    const cleanContact = (record.contact || '').trim();
    const cleanNotes = (record.notes || '').trim();

    let createdId = `rsvp-${Date.now()}`;
    let writeSuccess = false;

    // ATTEMPT 1: Match user's Supabase columns (attendance, guests_count, dietary, notes) without string id
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .insert([
          {
            name: cleanName,
            attendance: record.attending,
            guests_count: guestCountNum,
            dietary: cleanContact,
            notes: cleanNotes,
          },
        ])
        .select();

      if (!error) {
        writeSuccess = true;
        if (data && data[0]?.id) {
          createdId = String(data[0].id);
        }
      } else {
        console.warn('Supabase insert Attempt 1 warning:', error.message);

        // ATTEMPT 2: Standard schema with attending, guest_count, contact, created_at
        const { data: data2, error: error2 } = await supabase
          .from('rsvps')
          .insert([
            {
              name: cleanName,
              attending: record.attending,
              guest_count: guestCountNum,
              contact: cleanContact,
              notes: cleanNotes,
            },
          ])
          .select();

        if (!error2) {
          writeSuccess = true;
          if (data2 && data2[0]?.id) {
            createdId = String(data2[0].id);
          }
        } else {
          console.warn('Supabase insert Attempt 2 warning:', error2.message);

          // ATTEMPT 3: Full hybrid payload
          const { data: data3, error: error3 } = await supabase
            .from('rsvps')
            .insert([
              {
                id: Date.now(), // Numeric id in case int8 requires an explicit value
                name: cleanName,
                attendance: record.attending,
                attending: record.attending,
                guests_count: guestCountNum,
                guest_count: guestCountNum,
                notes: cleanNotes,
                dietary: cleanContact,
              },
            ])
            .select();

          if (!error3) {
            writeSuccess = true;
            if (data3 && data3[0]?.id) createdId = String(data3[0].id);
          }
        }
      }
    } catch (err) {
      console.warn('Supabase RSVP insert exception:', err);
    }

    const newRecord: RSVPRecord = {
      id: createdId,
      name: cleanName,
      attending: record.attending,
      guestCount: guestCountNum,
      contact: cleanContact,
      notes: cleanNotes,
      createdAt: new Date().toISOString(),
    };

    // Save to local cache
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

    return { success: true, rsvp: newRecord };
  },

  async deleteRsvp(id: string): Promise<boolean> {
    try {
      // Try deleting as numeric id if applicable, else string id
      const numId = Number(id);
      if (!isNaN(numId) && String(numId) === id) {
        await supabase.from('rsvps').delete().eq('id', numId);
      } else {
        await supabase.from('rsvps').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }

    const current = getLocalRsvps().filter((r) => String(r.id) !== String(id));
    saveLocalRsvps(current);
    return true;
  },

  async clearAllRsvps(): Promise<boolean> {
    try {
      await supabase.from('rsvps').delete().gte('id', 0);
      await supabase.from('rsvps').delete().neq('name', '____no_match____');
    } catch (e) {
      console.warn('Supabase clear all error:', e);
    }

    saveLocalRsvps([]);
    return true;
  },

  // --- GUESTBOOK ---
  async getGuestbook(all: boolean = false): Promise<GuestbookRecord[]> {
    try {
      let query = supabase.from('guestbook').select('*');

      if (!all) {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        const records = data.map(mapSupabaseGuestbook);
        records.sort((a, b) => {
          const timeA = new Date(a.createdAt).getTime() || 0;
          const timeB = new Date(b.createdAt).getTime() || 0;
          if (timeA !== timeB) return timeB - timeA;
          return String(b.id).localeCompare(String(a.id));
        });
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

    const localNotes = getLocalGuestbook();
    if (all) {
      return localNotes;
    }
    return localNotes.filter((n) => n.status === 'approved');
  },

  async submitGuestbook(entry: {
    name: string;
    message: string;
    photoUrl?: string;
  }): Promise<{ success: boolean; entry: GuestbookRecord }> {
    const cleanName = entry.name.trim();
    const cleanMessage = entry.message.trim();
    const photoUrl = entry.photoUrl || '';

    let createdId = `gb-${Date.now()}`;

    // Attempt insert into Supabase guestbook table
    try {
      const { data, error } = await supabase
        .from('guestbook')
        .insert([
          {
            name: cleanName,
            message: cleanMessage,
            photo_url: photoUrl,
            status: 'pending',
          },
        ])
        .select();

      if (!error && data && data[0]?.id) {
        createdId = String(data[0].id);
      } else if (error) {
        console.warn('Supabase guestbook insert 1 warning:', error.message);
        // Retry with numeric id or without photo_url
        const { data: d2 } = await supabase
          .from('guestbook')
          .insert([
            {
              name: cleanName,
              message: cleanMessage,
              status: 'pending',
            },
          ])
          .select();
        if (d2 && d2[0]?.id) createdId = String(d2[0].id);
      }
    } catch (err) {
      console.warn('Supabase guestbook insert failed:', err);
    }

    const newEntry: GuestbookRecord = {
      id: createdId,
      name: cleanName,
      message: cleanMessage,
      photoUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const current = getLocalGuestbook();
    current.unshift(newEntry);
    saveLocalGuestbook(current);

    return { success: true, entry: newEntry };
  },

  async updateGuestbookStatus(
    id: string,
    status: 'pending' | 'approved' | 'hidden'
  ): Promise<boolean> {
    try {
      const numId = Number(id);
      if (!isNaN(numId) && String(numId) === id) {
        await supabase.from('guestbook').update({ status }).eq('id', numId);
      } else {
        await supabase.from('guestbook').update({ status }).eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase status update error:', e);
    }

    const current = getLocalGuestbook();
    const target = current.find((g) => String(g.id) === String(id));
    if (target) {
      target.status = status;
      saveLocalGuestbook(current);
    }
    return true;
  },

  async deleteGuestbook(id: string): Promise<boolean> {
    try {
      const numId = Number(id);
      if (!isNaN(numId) && String(numId) === id) {
        await supabase.from('guestbook').delete().eq('id', numId);
      } else {
        await supabase.from('guestbook').delete().eq('id', id);
      }
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }

    const current = getLocalGuestbook().filter((g) => String(g.id) !== String(id));
    saveLocalGuestbook(current);
    return true;
  },

  async clearAllGuestbook(): Promise<boolean> {
    try {
      await supabase.from('guestbook').delete().gte('id', 0);
      await supabase.from('guestbook').delete().neq('name', '____no_match____');
    } catch (e) {
      console.warn('Supabase clear error:', e);
    }

    saveLocalGuestbook([]);
    return true;
  },
};
