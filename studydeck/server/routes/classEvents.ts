import { Router } from 'express';
import db from '../db';
import { v4 as uuid } from 'uuid';

const router = Router();

// GET /api/v1/class-events
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM class_events ORDER BY start_time ASC').all();
  res.json(rows.map((r: any) => ({ ...r, weekdays: JSON.parse(r.weekdays || '[]'), exceptions: JSON.parse(r.exceptions || '[]') })));
});

// POST /api/v1/class-events
router.post('/', (req, res) => {
  const { subject_id, title, weekdays, start_time, end_time, location, is_online, start_week, end_week } = req.body;
  const id = uuid();
  db.prepare(`INSERT INTO class_events (id, subject_id, title, weekdays, start_time, end_time, location, is_online, start_week, end_week) VALUES (?,?,?,?,?,?,?,?,?,?)`)
    .run(id, subject_id, title, JSON.stringify(weekdays || []), start_time, end_time, location || '', is_online ? 1 : 0, start_week || 1, end_week || 16);
  res.status(201).json({ id, subject_id, title, weekdays, start_time, end_time, location, is_online, start_week, end_week });
});

// PATCH /api/v1/class-events/:id
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM class_events WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const { title, weekdays, start_time, end_time, location, is_online, start_week, end_week } = req.body;
  db.prepare(`UPDATE class_events SET title=COALESCE(?,title), weekdays=COALESCE(?,weekdays), start_time=COALESCE(?,start_time), end_time=COALESCE(?,end_time), location=COALESCE(?,location), is_online=COALESCE(?,is_online), start_week=COALESCE(?,start_week), end_week=COALESCE(?,end_week) WHERE id=?`)
    .run(title, weekdays ? JSON.stringify(weekdays) : null, start_time, end_time, location, is_online != null ? (is_online ? 1 : 0) : null, start_week, end_week, req.params.id);
  res.json({ ok: true });
});

// DELETE /api/v1/class-events/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM class_events WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
