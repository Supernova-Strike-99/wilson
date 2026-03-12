import { Router } from 'express';
import db from '../db';
import { v4 as uuid } from 'uuid';

const router = Router();

// POST /api/v1/occurrences/:id/attendance
router.post('/occurrences/:id/attendance', (req, res) => {
  const { status, note } = req.body;
  const userId = (req.headers['x-user-id'] as string) || 'user-1';
  const occId = req.params.id;
  // Check if already marked
  const existing = db.prepare('SELECT * FROM attendance WHERE occurrence_id = ? AND user_id = ?').get(occId, userId) as any;
  if (existing) {
    db.prepare('UPDATE attendance SET status = ?, note = ?, marked_at = datetime("now") WHERE id = ?').run(status, note || '', existing.id);
    return res.json({ ...existing, status, note });
  }
  const id = uuid();
  db.prepare('INSERT INTO attendance (id, occurrence_id, user_id, status, note) VALUES (?,?,?,?,?)').run(id, occId, userId, status, note || '');
  res.status(201).json({ id, occurrence_id: occId, user_id: userId, status, note });
});

// PATCH /api/v1/attendance/:id
router.patch('/attendance/:id', (req, res) => {
  const { status, note } = req.body;
  db.prepare('UPDATE attendance SET status = COALESCE(?, status), note = COALESCE(?, note), marked_at = datetime("now") WHERE id = ?')
    .run(status, note, req.params.id);
  res.json({ ok: true });
});

// POST /api/v1/attendance/bulk
router.post('/attendance/bulk', (req, res) => {
  const { occurrence_ids, status } = req.body;
  const userId = (req.headers['x-user-id'] as string) || 'user-1';
  const insert = db.prepare('INSERT OR REPLACE INTO attendance (id, occurrence_id, user_id, status, note) VALUES (?,?,?,?,?)');
  const txn = db.transaction((ids: string[]) => {
    for (const occId of ids) {
      insert.run(uuid(), occId, userId, status, '');
    }
  });
  txn(occurrence_ids || []);
  res.json({ marked: (occurrence_ids || []).length });
});

// GET /api/v1/timetable?from=&to=
router.get('/timetable', (req, res) => {
  const { from, to } = req.query;
  let query = 'SELECT o.*, ce.title as event_title, ce.subject_id, s.title as subject_title, s.color as subject_color, s.emoji as subject_emoji, ce.location FROM occurrences o JOIN class_events ce ON o.class_event_id = ce.id JOIN subjects s ON ce.subject_id = s.id';
  const params: string[] = [];
  if (from && to) { query += ' WHERE o.date >= ? AND o.date <= ?'; params.push(from as string, to as string); }
  query += ' ORDER BY o.start_datetime ASC';
  const rows = db.prepare(query).all(...params);
  res.json(rows);
});

export default router;
