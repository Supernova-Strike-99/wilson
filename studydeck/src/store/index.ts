import { create } from 'zustand';
import type { Subject, ClassEvent, Occurrence, AttendanceRecord, Note, Task, UserSettings } from '../types';

interface AppState {
  // Data
  subjects: Subject[];
  classEvents: ClassEvent[];
  occurrences: Occurrence[];
  attendance: AttendanceRecord[];
  notes: Note[];
  tasks: Task[];

  // UI
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  shortcutsOverlayOpen: boolean;
  activeModal: null | { type: string; data?: any };
  toasts: { id: string; message: string; action?: () => void; actionLabel?: string }[];
  settings: UserSettings;
  syncStatus: 'synced' | 'syncing' | 'offline';

  // Actions
  setSubjects: (s: Subject[]) => void;
  addSubject: (s: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  setClassEvents: (c: ClassEvent[]) => void;
  addClassEvent: (c: ClassEvent) => void;

  setOccurrences: (o: Occurrence[]) => void;
  addOccurrence: (o: Occurrence) => void;

  setAttendance: (a: AttendanceRecord[]) => void;
  addAttendance: (a: AttendanceRecord) => void;
  updateAttendance: (id: string, updates: Partial<AttendanceRecord>) => void;

  setNotes: (n: Note[]) => void;
  addNote: (n: Note) => void;

  setTasks: (t: Task[]) => void;
  addTask: (t: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;

  toggleSidebar: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setShortcutsOverlayOpen: (open: boolean) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  addToast: (toast: AppState['toasts'][0]) => void;
  removeToast: (id: string) => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  setSyncStatus: (s: AppState['syncStatus']) => void;
}

export const useStore = create<AppState>((set) => ({
  subjects: [],
  classEvents: [],
  occurrences: [],
  attendance: [],
  notes: [],
  tasks: [],

  sidebarOpen: true,
  commandPaletteOpen: false,
  shortcutsOverlayOpen: false,
  activeModal: null,
  toasts: [],
  settings: {
    attendance_threshold: 75,
    high_contrast: false,
    notifications_enabled: true,
    notification_lead_time: 10,
    theme: 'dark',
    sync_enabled: false,
  },
  syncStatus: 'offline',

  setSubjects: (subjects) => set({ subjects }),
  addSubject: (s) => set((st) => ({ subjects: [...st.subjects, s] })),
  updateSubject: (id, updates) => set((st) => ({
    subjects: st.subjects.map((s) => (s.id === id ? { ...s, ...updates } : s)),
  })),
  deleteSubject: (id) => set((st) => ({
    subjects: st.subjects.map((s) => (s.id === id ? { ...s, archived: true } : s)),
  })),

  setClassEvents: (classEvents) => set({ classEvents }),
  addClassEvent: (c) => set((st) => ({ classEvents: [...st.classEvents, c] })),

  setOccurrences: (occurrences) => set({ occurrences }),
  addOccurrence: (o) => set((st) => ({ occurrences: [...st.occurrences, o] })),

  setAttendance: (attendance) => set({ attendance }),
  addAttendance: (a) => set((st) => ({ attendance: [...st.attendance, a] })),
  updateAttendance: (id, updates) => set((st) => ({
    attendance: st.attendance.map((a) => (a.id === id ? { ...a, ...updates } : a)),
  })),

  setNotes: (notes) => set({ notes }),
  addNote: (n) => set((st) => ({ notes: [...st.notes, n] })),

  setTasks: (tasks) => set({ tasks }),
  addTask: (t) => set((st) => ({ tasks: [...st.tasks, t] })),
  updateTask: (id, updates) => set((st) => ({
    tasks: st.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
  })),

  toggleSidebar: () => set((st) => ({ sidebarOpen: !st.sidebarOpen })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setShortcutsOverlayOpen: (open) => set({ shortcutsOverlayOpen: open }),
  openModal: (type, data) => set({ activeModal: { type, data } }),
  closeModal: () => set({ activeModal: null }),
  addToast: (toast) => set((st) => ({ toasts: [...st.toasts, toast] })),
  removeToast: (id) => set((st) => ({ toasts: st.toasts.filter((t) => t.id !== id) })),
  updateSettings: (updates) => set((st) => ({ settings: { ...st.settings, ...updates } })),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
}));
