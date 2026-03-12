import { openDB, IDBPDatabase } from 'idb';
import type { Subject, ClassEvent, Occurrence, AttendanceRecord, Note, Task, SyncQueueItem } from '../types';

const DB_NAME = 'studydeck';
const DB_VERSION = 1;

type StudyDeckDB = IDBPDatabase;

let dbPromise: Promise<StudyDeckDB> | null = null;

function getDB(): Promise<StudyDeckDB> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('subjects')) db.createObjectStore('subjects', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('classEvents')) db.createObjectStore('classEvents', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('occurrences')) {
          const store = db.createObjectStore('occurrences', { keyPath: 'id' });
          store.createIndex('by_date', 'date');
          store.createIndex('by_event', 'class_event_id');
        }
        if (!db.objectStoreNames.contains('attendance')) {
          const store = db.createObjectStore('attendance', { keyPath: 'id' });
          store.createIndex('by_occurrence', 'occurrence_id');
        }
        if (!db.objectStoreNames.contains('notes')) {
          const store = db.createObjectStore('notes', { keyPath: 'id' });
          store.createIndex('by_subject', 'subject_id');
        }
        if (!db.objectStoreNames.contains('tasks')) {
          const store = db.createObjectStore('tasks', { keyPath: 'id' });
          store.createIndex('by_subject', 'subject_id');
        }
        if (!db.objectStoreNames.contains('syncQueue')) db.createObjectStore('syncQueue', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

// ── Generic CRUD ──
async function getAll<T>(store: string): Promise<T[]> {
  const db = await getDB();
  return db.getAll(store);
}

async function put<T>(store: string, item: T): Promise<void> {
  const db = await getDB();
  await db.put(store, item);
}

async function del(store: string, id: string): Promise<void> {
  const db = await getDB();
  await db.delete(store, id);
}

// ── Subjects ──
export const subjects = {
  getAll: () => getAll<Subject>('subjects'),
  put: (s: Subject) => put('subjects', s),
  delete: (id: string) => del('subjects', id),
};

// ── ClassEvents ──
export const classEvents = {
  getAll: () => getAll<ClassEvent>('classEvents'),
  put: (c: ClassEvent) => put('classEvents', c),
  delete: (id: string) => del('classEvents', id),
};

// ── Occurrences ──
export const occurrences = {
  getAll: () => getAll<Occurrence>('occurrences'),
  put: (o: Occurrence) => put('occurrences', o),
  delete: (id: string) => del('occurrences', id),
  getByDate: async (date: string): Promise<Occurrence[]> => {
    const db = await getDB();
    return db.getAllFromIndex('occurrences', 'by_date', date);
  },
};

// ── Attendance ──
export const attendance = {
  getAll: () => getAll<AttendanceRecord>('attendance'),
  put: (a: AttendanceRecord) => put('attendance', a),
  delete: (id: string) => del('attendance', id),
  getByOccurrence: async (occId: string): Promise<AttendanceRecord[]> => {
    const db = await getDB();
    return db.getAllFromIndex('attendance', 'by_occurrence', occId);
  },
};

// ── Notes ──
export const notes = {
  getAll: () => getAll<Note>('notes'),
  put: (n: Note) => put('notes', n),
  delete: (id: string) => del('notes', id),
};

// ── Tasks ──
export const tasks = {
  getAll: () => getAll<Task>('tasks'),
  put: (t: Task) => put('tasks', t),
  delete: (id: string) => del('tasks', id),
};

// ── Sync Queue ──
export const syncQueue = {
  getAll: () => getAll<SyncQueueItem>('syncQueue'),
  put: (item: SyncQueueItem) => put('syncQueue', item),
  delete: (id: string) => del('syncQueue', id),
  clear: async () => {
    const db = await getDB();
    await db.clear('syncQueue');
  },
};

// ── Seed ──
export async function seedDatabase(data: {
  subjects: Subject[];
  classEvents: ClassEvent[];
  occurrences: Occurrence[];
  attendance: AttendanceRecord[];
  tasks: Task[];
}) {
  const existingSubjects = await subjects.getAll();
  if (existingSubjects.length > 0) return; // Already seeded
  for (const s of data.subjects) await subjects.put(s);
  for (const c of data.classEvents) await classEvents.put(c);
  for (const o of data.occurrences) await occurrences.put(o);
  for (const a of data.attendance) await attendance.put(a);
  for (const t of data.tasks) await tasks.put(t);
}
