import { Router } from 'express';
import db from '../db';
import { v4 as uuid } from 'uuid';

const router = Router();

// GET /api/v1/subjects
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] || 'user-1';
  const rows = db.prepare('SELECT * FROM subjects WHERE user_id = ? AND archived = 0 ORDER BY pinned DESC, title ASC').all(userId);
  res.json(rows);
});

// GET /api/v1/subjects/:id
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// POST /api/v1/subjects
router.post('/', (req, res) => {
  const { title, code, color, emoji, teacher, credits, semester } = req.body;
  const userId = req.headers['x-user-id'] || 'user-1';
  const id = uuid();
  db.prepare(`INSERT INTO subjects (id, user_id, title, code, color, emoji, teacher, credits, semester) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, userId, title, code || '', color || 'indigo', emoji || '📚', teacher || '', credits || 3, semester || '');
  res.status(201).json({ id, title, code, color, emoji, teacher, credits, semester });
});

// PATCH /api/v1/subjects/:id
router.patch('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM subjects WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Not found' });
  const fields = ['title', 'code', 'color', 'emoji', 'teacher', 'credits', 'semester', 'pinned', 'archived'];
  const updates: string[] = [];
  const values: any[] = [];
  for (const f of fields) {
    if (req.body[f] !== undefined) { updates.push(`${f} = ?`); values.push(req.body[f]); }
  }
  if (updates.length > 0) {
    values.push(req.params.id);
    db.prepare(`UPDATE subjects SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }
  res.json({ ...existing, ...req.body });
});

// DELETE /api/v1/subjects/:id (soft delete)
router.delete('/:id', (req, res) => {
  db.prepare('UPDATE subjects SET archived = 1 WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
