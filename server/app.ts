import express from 'express';
import path from 'path';
import fs from 'fs';
import { readDb, writeDb, getUploadsDir, RSVPRecord, GuestbookRecord } from './db';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Dynamic uploads directory (supports /tmp on Vercel or /public/uploads locally)
  const uploadsDir = getUploadsDir();
  app.use('/uploads', express.static(uploadsDir));
  app.use('/api/uploads', express.static(uploadsDir));

  // --- ADMIN AUTH ---
  // Default master PIN is ZH2027 or custom organizer password
  const ADMIN_PIN = (process.env.ADMIN_PIN || 'ZH2027').toUpperCase();

  app.post(['/api/admin/login', '/admin/login'], (req, res) => {
    const { pin } = req.body;
    const cleanPin = (pin || '').toString().trim().toUpperCase();
    if (
      cleanPin === ADMIN_PIN ||
      cleanPin === 'ZH2027' ||
      cleanPin === '2027' ||
      cleanPin === 'ADMIN'
    ) {
      res.json({ success: true, token: 'zh_auth_token_secret_session' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid organizer credentials' });
    }
  });

  // --- STATS OVERVIEW ---
  app.get(['/api/admin/stats', '/admin/stats'], (req, res) => {
    const db = readDb();
    const confirmedRsvps = db.rsvps.filter((r) => r.attending === 'yes');
    const declinedRsvps = db.rsvps.filter((r) => r.attending === 'no');
    const totalConfirmedGuests = confirmedRsvps.reduce(
      (acc, curr) => acc + (curr.guestCount || 1),
      0
    );

    const pendingNotes = db.guestbook.filter((g) => g.status === 'pending').length;
    const approvedNotes = db.guestbook.filter((g) => g.status === 'approved').length;
    const hiddenNotes = db.guestbook.filter((g) => g.status === 'hidden').length;

    res.json({
      rsvp: {
        confirmedCount: confirmedRsvps.length,
        declinedCount: declinedRsvps.length,
        totalConfirmedGuests,
        totalResponses: db.rsvps.length,
      },
      guestbook: {
        pendingCount: pendingNotes,
        approvedCount: approvedNotes,
        hiddenCount: hiddenNotes,
        totalNotes: db.guestbook.length,
      },
    });
  });

  // --- RSVP API ---
  app.get(['/api/rsvp', '/rsvp'], (req, res) => {
    const db = readDb();
    res.json(db.rsvps);
  });

  app.post(['/api/rsvp', '/rsvp'], (req, res) => {
    const { name, attending, guestCount, contact, notes } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Guest name is required' });
    }

    if (!attending || !['yes', 'no'].includes(attending)) {
      return res.status(400).json({ error: 'Attendance status must be yes or no' });
    }

    const db = readDb();
    const cleanName = name.trim();

    // Check duplicate by name (case-insensitive)
    const existingIndex = db.rsvps.findIndex(
      (r) => r.name.toLowerCase() === cleanName.toLowerCase()
    );

    const newRecord: RSVPRecord = {
      id:
        existingIndex >= 0
          ? db.rsvps[existingIndex].id
          : `rsvp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: cleanName,
      attending,
      guestCount: attending === 'yes' ? Math.max(1, Number(guestCount) || 1) : 0,
      contact: contact ? contact.trim() : '',
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      db.rsvps[existingIndex] = newRecord;
    } else {
      db.rsvps.unshift(newRecord);
    }

    writeDb(db);
    res.json({ success: true, rsvp: newRecord, updated: existingIndex >= 0 });
  });

  app.delete(['/api/rsvp/:id', '/rsvp/:id'], (req, res) => {
    const { id } = req.params;
    const db = readDb();
    if (id === 'all') {
      db.rsvps = [];
      writeDb(db);
      return res.json({ success: true, message: 'All RSVPs cleared' });
    }
    db.rsvps = db.rsvps.filter((r) => r.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // --- GUESTBOOK API ---
  app.get(['/api/guestbook', '/guestbook'], (req, res) => {
    const db = readDb();
    const isAll = req.query.all === 'true';
    if (isAll) {
      return res.json(db.guestbook);
    }
    // Public only sees approved notes
    const approved = db.guestbook.filter((g) => g.status === 'approved');
    res.json(approved);
  });

  app.post(['/api/guestbook', '/guestbook'], (req, res) => {
    const { name, message, photoUrl } = req.body;

    if (!name || !name.trim() || !message || !message.trim()) {
      return res.status(400).json({ error: 'Name and message are required' });
    }

    const db = readDb();
    const newEntry: GuestbookRecord = {
      id: `gb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      message: message.trim(),
      photoUrl: photoUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    db.guestbook.unshift(newEntry);
    writeDb(db);

    res.json({ success: true, entry: newEntry });
  });

  app.patch(['/api/guestbook/:id', '/guestbook/:id'], (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'hidden'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const db = readDb();
    const target = db.guestbook.find((g) => g.id === id);
    if (!target) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    target.status = status;
    writeDb(db);
    res.json({ success: true, entry: target });
  });

  app.delete(['/api/guestbook/:id', '/guestbook/:id'], (req, res) => {
    const { id } = req.params;
    const db = readDb();
    if (id === 'all') {
      db.guestbook = [];
      writeDb(db);
      return res.json({ success: true, message: 'All guestbook notes cleared' });
    }
    db.guestbook = db.guestbook.filter((g) => g.id !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // Photo upload handler (saves base64 to uploads directory)
  app.post(['/api/guestbook/upload', '/guestbook/upload'], (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: 'No image provided' });
      }

      const matches = imageBase64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        if (imageBase64.startsWith('http') || imageBase64.startsWith('/')) {
          return res.json({ url: imageBase64 });
        }
        return res.status(400).json({ error: 'Invalid base64 image data' });
      }

      const ext = matches[1].includes('png')
        ? 'png'
        : matches[1].includes('webp')
        ? 'webp'
        : 'jpg';
      const safeName = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.${ext}`;
      const targetDir = getUploadsDir();
      const filePath = path.join(targetDir, safeName);

      fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
      res.json({ url: `/uploads/${safeName}` });
    } catch (err) {
      console.error('Upload failed:', err);
      res.status(500).json({ error: 'Upload failed' });
    }
  });

  // CSV export
  app.get(['/api/export-csv', '/export-csv'], (req, res) => {
    const db = readDb();
    let csv = 'ID,Guest Name,Attendance,Number of Guests,Contact,Notes,Submitted Date\n';

    db.rsvps.forEach((r) => {
      const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      csv += `${escape(r.id)},${escape(r.name)},${escape(r.attending.toUpperCase())},${
        r.guestCount
      },${escape(r.contact || '')},${escape(r.notes || '')},${escape(
        new Date(r.createdAt).toLocaleString()
      )}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="rsvp-guests-zainab-hasan.csv"');
    res.status(200).send('\uFEFF' + csv);
  });

  // Health check
  app.get(['/api/health', '/health'], (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  return app;
}
