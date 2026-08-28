import { RSVPRecord, GuestbookRecord, AdminStats } from '../types';

const STORAGE_KEY_RSVPS = 'zh_wedding_rsvps_store';
const STORAGE_KEY_GUESTBOOK = 'zh_wedding_guestbook_store';

// Helper to get local records
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

export const dataStore = {
  // --- AUTHENTICATION ---
  verifyAdminPin(pin: string): boolean {
    const clean = (pin || '').trim().toUpperCase();
    return clean === 'ZH2027' || clean === '2027' || clean === 'ADMIN';
  },

  async loginAdmin(pin: string): Promise<boolean> {
    const cleanPin = (pin || '').trim().toUpperCase();
    // Direct valid match for guaranteed offline & Vercel reliability
    const isDirectMatch = this.verifyAdminPin(cleanPin);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: cleanPin }),
      });
      if (res.ok) {
        return true;
      }
    } catch {
      // Server offline or static Vercel build
    }

    return isDirectMatch;
  },

  // --- STATS ---
  async getStats(): Promise<AdminStats> {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const rsvps = getLocalRsvps();
    const gb = getLocalGuestbook();
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
    let serverRsvps: RSVPRecord[] = [];
    try {
      const res = await fetch('/api/rsvp');
      if (res.ok) {
        serverRsvps = await res.json();
      }
    } catch (e) {
      console.warn('API /api/rsvp unreachable, using local store');
    }

    const localRsvps = getLocalRsvps();
    // Merge server and local without duplicates (by id or name)
    const map = new Map<string, RSVPRecord>();
    localRsvps.forEach((r) => map.set(r.name.toLowerCase(), r));
    serverRsvps.forEach((r) => map.set(r.name.toLowerCase(), r));

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
    const newRecord: RSVPRecord = {
      id: `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: record.name.trim(),
      attending: record.attending,
      guestCount: record.attending === 'yes' ? Math.max(1, record.guestCount) : 0,
      contact: record.contact ? record.contact.trim() : '',
      notes: record.notes ? record.notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    // Save locally first
    const current = getLocalRsvps();
    const existingIdx = current.findIndex(
      (r) => r.name.toLowerCase() === newRecord.name.toLowerCase()
    );
    if (existingIdx >= 0) {
      current[existingIdx] = { ...newRecord, id: current[existingIdx].id };
    } else {
      current.unshift(newRecord);
    }
    saveLocalRsvps(current);

    // Try posting to server
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.rsvp) {
          return { success: true, rsvp: data.rsvp };
        }
      }
    } catch {
      // Proceed with local copy
    }

    return { success: true, rsvp: newRecord };
  },

  async deleteRsvp(id: string): Promise<boolean> {
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
    let serverNotes: GuestbookRecord[] = [];
    try {
      const res = await fetch(`/api/guestbook${all ? '?all=true' : ''}`);
      if (res.ok) {
        serverNotes = await res.json();
      }
    } catch (e) {
      console.warn('API /api/guestbook unreachable, using local store');
    }

    const localNotes = getLocalGuestbook();
    const map = new Map<string, GuestbookRecord>();
    localNotes.forEach((n) => map.set(n.id, n));
    serverNotes.forEach((n) => map.set(n.id, n));

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    saveLocalGuestbook(merged);

    if (all) {
      return merged;
    }
    return merged.filter((n) => n.status === 'approved');
  },

  async submitGuestbook(entry: {
    name: string;
    message: string;
    photoUrl?: string;
  }): Promise<{ success: boolean; entry: GuestbookRecord }> {
    const newEntry: GuestbookRecord = {
      id: `gb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: entry.name.trim(),
      message: entry.message.trim(),
      photoUrl: entry.photoUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const current = getLocalGuestbook();
    current.unshift(newEntry);
    saveLocalGuestbook(current);

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.entry) {
          return { success: true, entry: data.entry };
        }
      }
    } catch {
      // fallback
    }

    return { success: true, entry: newEntry };
  },

  async updateGuestbookStatus(id: string, status: 'pending' | 'approved' | 'hidden'): Promise<boolean> {
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
    saveLocalGuestbook([]);
    try {
      await fetch('/api/guestbook/all', { method: 'DELETE' });
    } catch {
      // ignore
    }
    return true;
  },
};
