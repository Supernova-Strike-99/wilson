import type { Subject, ClassEvent, Occurrence, AttendanceRecord, Task, AttendanceStatus } from '../types';
import { generateOccurrences, todayStr } from '../utils/occurrences';

// Semester starts on a Monday — adjust for your term
const SEMESTER_START = new Date('2026-01-12');

const subj: Subject[] = [
  {
    id: 'sub-1', title: 'Mathematics III', code: 'MATH301', color: 'indigo', emoji: '📐',
    teacher: 'Dr. Priya Sharma', credits: 4, semester: 'Spring 2026', pinned: true, archived: false,
    created_at: '2026-01-12T00:00:00Z',
  },
  {
    id: 'sub-2', title: 'Data Structures', code: 'CS201', color: 'green', emoji: '🌲',
    teacher: 'Prof. Amit Verma', credits: 3, semester: 'Spring 2026', pinned: false, archived: false,
    created_at: '2026-01-12T00:00:00Z',
  },
  {
    id: 'sub-3', title: 'Digital Electronics', code: 'ECE202', color: 'amber', emoji: '⚡',
    teacher: 'Dr. Sunita Rao', credits: 3, semester: 'Spring 2026', pinned: false, archived: false,
    created_at: '2026-01-12T00:00:00Z',
  },
];

const events: ClassEvent[] = [
  {
    id: 'evt-1', subject_id: 'sub-1', title: 'Math Lecture', weekdays: [1, 3, 5],
    start_time: '09:00', end_time: '10:00', location: 'Room 201', is_online: false,
    start_week: 1, end_week: 16, recurrence_rule: 'WEEKLY', exceptions: [],
  },
  {
    id: 'evt-2', subject_id: 'sub-2', title: 'DS Lecture', weekdays: [2, 4],
    start_time: '11:00', end_time: '12:00', location: 'Lab 3A', is_online: false,
    start_week: 1, end_week: 16, recurrence_rule: 'WEEKLY', exceptions: [],
  },
  {
    id: 'evt-3', subject_id: 'sub-2', title: 'DS Lab', weekdays: [5],
    start_time: '14:00', end_time: '16:00', location: 'Lab 3A', is_online: false,
    start_week: 1, end_week: 16, recurrence_rule: 'WEEKLY', exceptions: [],
  },
  {
    id: 'evt-4', subject_id: 'sub-3', title: 'Digital Electronics', weekdays: [1, 3],
    start_time: '10:00', end_time: '11:00', location: 'Room 305', is_online: false,
    start_week: 1, end_week: 16, recurrence_rule: 'WEEKLY', exceptions: [],
  },
  {
    id: 'evt-5', subject_id: 'sub-3', title: 'DE Lab', weekdays: [4],
    start_time: '14:00', end_time: '16:00', location: 'Electronics Lab', is_online: false,
    start_week: 1, end_week: 16, recurrence_rule: 'WEEKLY', exceptions: [],
  },
];

// Generate occurrences for first 5 weeks
const allOccurrences: Occurrence[] = [];
for (const evt of events) {
  const rangeEnd = new Date(SEMESTER_START);
  rangeEnd.setDate(rangeEnd.getDate() + 5 * 7);
  const occs = generateOccurrences(evt, SEMESTER_START, SEMESTER_START, rangeEnd);
  // Attach subject info
  const sub = subj.find((s) => s.id === evt.subject_id);
  for (const o of occs) {
    o.subject_id = evt.subject_id;
    o.subject_title = sub?.title;
    o.subject_color = sub?.color;
    o.subject_emoji = sub?.emoji;
    allOccurrences.push(o);
  }
}

// Generate attendance for first 4 weeks (mark ~80% present patterns)
const attStatuses: AttendanceStatus[] = ['present', 'present', 'present', 'present', 'absent', 'late', 'present', 'excused', 'present', 'present'];
const attRecords: AttendanceRecord[] = [];
const today = new Date();
let attIdx = 0;
for (const occ of allOccurrences) {
  const occDate = new Date(occ.date);
  if (occDate >= today) continue; // Only mark past occurrences
  attRecords.push({
    id: `att-${attIdx}`,
    occurrence_id: occ.id,
    user_id: 'local-user',
    status: attStatuses[attIdx % attStatuses.length],
    marked_at: occ.start_datetime,
    note: '',
  });
  attIdx++;
}

const sampleTasks: Task[] = [
  {
    id: 'task-1', subject_id: 'sub-1', user_id: 'local-user',
    title: 'Complete Assignment 3 — Integration', due_date: '2026-02-15',
    priority: 'p1', status: 'todo', created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'task-2', subject_id: 'sub-2', user_id: 'local-user',
    title: 'Implement AVL tree', due_date: '2026-02-14',
    priority: 'p2', status: 'todo', created_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'task-3', subject_id: 'sub-3', user_id: 'local-user',
    title: 'Lab report — Flip-flop circuits', due_date: '2026-02-10',
    priority: 'p1', status: 'todo', created_at: '2026-02-01T00:00:00Z',
  },
];

export const SEED_DATA = {
  subjects: subj,
  classEvents: events,
  occurrences: allOccurrences,
  attendance: attRecords,
  tasks: sampleTasks,
};
