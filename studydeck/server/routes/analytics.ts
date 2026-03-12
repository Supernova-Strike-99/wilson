import { Router } from 'express';
import db from '../db';

const router = Router();

// GET /api/v1/analytics/attendance?from=&to=&subject_id=
router.get('/attendance', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'user-1';
  const { from, to, subject_id } = req.query;

  let query = `SELECT s.id as subject_id, s.title as subject_title, s.color as subject_color, s.emoji as subject_emoji,
    COUNT(a.id) as total,
    SUM(CASE WHEN a.status='present' THEN 1 ELSE 0 END) as present,
    SUM(CASE WHEN a.status='absent' THEN 1 ELSE 0 END) as absent,
    SUM(CASE WHEN a.status='late' THEN 1 ELSE 0 END) as late,
    SUM(CASE WHEN a.status='excused' THEN 1 ELSE 0 END) as excused
    FROM attendance a
    JOIN occurrences o ON a.occurrence_id = o.id
    JOIN class_events ce ON o.class_event_id = ce.id
    JOIN subjects s ON ce.subject_id = s.id
    WHERE a.user_id = ?`;

  const params: any[] = [userId];
  if (from) { query += ' AND o.date >= ?'; params.push(from); }
  if (to) { query += ' AND o.date <= ?'; params.push(to); }
  if (subject_id) { query += ' AND s.id = ?'; params.push(subject_id); }

  query += ' GROUP BY s.id';
  const rows = db.prepare(query).all(...params);

  const result = (rows as any[]).map((r) => ({
    ...r,
    percentage: r.total > 0 ? Math.round(((r.present + r.late * 0.5 + r.excused) / r.total) * 1000) / 10 : 100,
  }));
  res.json(result);
});

// GET /api/v1/analytics/heatmap
router.get('/heatmap', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'user-1';
  const rows = db.prepare(`
    SELECT o.date, a.status FROM attendance a
    JOIN occurrences o ON a.occurrence_id = o.id
    WHERE a.user_id = ?
    ORDER BY o.date
  `).all(userId);
  res.json(rows);
});

export default router;
