import { Router } from 'express';
import db from '../db';

const router = Router();

// POST /api/v1/import/csv
router.post('/import/csv', (req, res) => {
  // Stub: expects { csv: "..." } in body
  const { csv } = req.body;
  if (!csv) return res.status(400).json({ error: 'Missing csv field' });
  const lines = (csv as string).trim().split('\n');
  const count = lines.length - 1; // minus header
  // TODO: parse and insert
  res.json({ message: `Parsed ${count} rows. Import processing TBD.`, count });
});

// POST /api/v1/import/ics
router.post('/import/ics', (req, res) => {
  const { ics } = req.body;
  if (!ics) return res.status(400).json({ error: 'Missing ics field' });
  const events = (ics as string).split('BEGIN:VEVENT').length - 1;
  res.json({ message: `Found ${events} events. Import processing TBD.`, count: events });
});

// GET /api/v1/export/attendance.csv
router.get('/export/attendance.csv', (req, res) => {
  const userId = (req.headers['x-user-id'] as string) || 'user-1';
  const rows = db.prepare(`
    SELECT o.date, s.title as subject, a.status, a.note
    FROM attendance a
    JOIN occurrences o ON a.occurrence_id = o.id
    JOIN class_events ce ON o.class_event_id = ce.id
    JOIN subjects s ON ce.subject_id = s.id
    WHERE a.user_id = ?
    ORDER BY o.date ASC
  `).all(userId) as any[];

  const header = 'Date,Subject,Status,Note';
  const csvRows = rows.map((r) => `${r.date},"${r.subject}",${r.status},"${r.note || ''}"`);
  const csv = [header, ...csvRows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=studydeck-attendance.csv');
  res.send(csv);
});

// GET /api/v1/export/timetable.ics
router.get('/export/timetable.ics', (_req, res) => {
  const events = db.prepare(`
    SELECT ce.title, ce.start_time, ce.end_time, ce.location, ce.weekdays, s.title as subject_title
    FROM class_events ce JOIN subjects s ON ce.subject_id = s.id
  `).all() as any[];

  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//StudyDeck//EN'];
  for (const e of events) {
    lines.push('BEGIN:VEVENT', `SUMMARY:${e.title} (${e.subject_title})`, `LOCATION:${e.location}`, `DESCRIPTION:Weekdays: ${e.weekdays}`, 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename=studydeck-timetable.ics');
  res.send(lines.join('\r\n'));
});

export default router;
