import db from './db';
import { v4 as uuid } from 'uuid';

console.log('Seeding database...');

// User
db.prepare(`INSERT OR IGNORE INTO users (id, email, settings) VALUES (?, ?, ?)`).run(
  'user-1', 'student@studydeck.dev', JSON.stringify({ attendance_threshold: 75 })
);

// Subjects
const subjects = [
  { id: 'sub-1', title: 'Mathematics III', code: 'MATH301', color: 'indigo', emoji: '📐', teacher: 'Dr. Priya Sharma', credits: 4, semester: 'Spring 2026' },
  { id: 'sub-2', title: 'Data Structures', code: 'CS201', color: 'green', emoji: '🌲', teacher: 'Prof. Amit Verma', credits: 3, semester: 'Spring 2026' },
  { id: 'sub-3', title: 'Digital Electronics', code: 'ECE202', color: 'amber', emoji: '⚡', teacher: 'Dr. Sunita Rao', credits: 3, semester: 'Spring 2026' },
];
const insertSubject = db.prepare(`INSERT OR IGNORE INTO subjects (id, user_id, title, code, color, emoji, teacher, credits, semester) VALUES (?, 'user-1', ?, ?, ?, ?, ?, ?, ?)`);
for (const s of subjects) insertSubject.run(s.id, s.title, s.code, s.color, s.emoji, s.teacher, s.credits, s.semester);

// Class events
const events = [
  { id: 'evt-1', subject_id: 'sub-1', title: 'Math Lecture', weekdays: [1,3,5], start_time: '09:00', end_time: '10:00', location: 'Room 201' },
  { id: 'evt-2', subject_id: 'sub-2', title: 'DS Lecture', weekdays: [2,4], start_time: '11:00', end_time: '12:00', location: 'Lab 3A' },
  { id: 'evt-3', subject_id: 'sub-2', title: 'DS Lab', weekdays: [5], start_time: '14:00', end_time: '16:00', location: 'Lab 3A' },
  { id: 'evt-4', subject_id: 'sub-3', title: 'DE Lecture', weekdays: [1,3], start_time: '10:00', end_time: '11:00', location: 'Room 305' },
  { id: 'evt-5', subject_id: 'sub-3', title: 'DE Lab', weekdays: [4], start_time: '14:00', end_time: '16:00', location: 'Electronics Lab' },
];
const insertEvent = db.prepare(`INSERT OR IGNORE INTO class_events (id, subject_id, title, weekdays, start_time, end_time, location) VALUES (?, ?, ?, ?, ?, ?, ?)`);
for (const e of events) insertEvent.run(e.id, e.subject_id, e.title, JSON.stringify(e.weekdays), e.start_time, e.end_time, e.location);

// Tasks
const insertTask = db.prepare(`INSERT OR IGNORE INTO tasks (id, subject_id, user_id, title, due_date, priority) VALUES (?, ?, 'user-1', ?, ?, ?)`);
insertTask.run('task-1', 'sub-1', 'Complete Assignment 3 — Integration', '2026-02-15', 'p1');
insertTask.run('task-2', 'sub-2', 'Implement AVL tree', '2026-02-14', 'p2');
insertTask.run('task-3', 'sub-3', 'Lab report — Flip-flop circuits', '2026-02-10', 'p1');

console.log('✅ Seed data inserted.');
