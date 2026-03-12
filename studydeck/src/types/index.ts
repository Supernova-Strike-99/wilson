// ── StudyDeck Type Definitions ──

export type SubjectColor = 'red' | 'orange' | 'amber' | 'lime' | 'green' | 'teal' | 'cyan' | 'blue' | 'indigo' | 'purple' | 'pink' | 'rose';

export const SUBJECT_COLORS: SubjectColor[] = ['red','orange','amber','lime','green','teal','cyan','blue','indigo','purple','pink','rose'];

export const COLOR_MAP: Record<SubjectColor, string> = {
  red: '#ef4444', orange: '#f97316', amber: '#f59e0b', lime: '#84cc16',
  green: '#22c55e', teal: '#14b8a6', cyan: '#06b6d4', blue: '#3b82f6',
  indigo: '#6366f1', purple: '#a855f7', pink: '#ec4899', rose: '#f43f5e',
};

export interface Subject {
  id: string;
  title: string;
  code: string;
  color: SubjectColor;
  emoji: string;
  teacher: string;
  credits: number;
  semester: string;
  pinned: boolean;
  archived: boolean;
  created_at: string;
}

export interface ClassEvent {
  id: string;
  subject_id: string;
  title: string;
  weekdays: number[]; // 0=Sun..6=Sat
  start_time: string; // "HH:mm"
  end_time: string;
  location: string;
  is_online: boolean;
  start_week: number;
  end_week: number;
  recurrence_rule: string;
  exceptions: string[]; // ISO date strings to skip
}

export interface Occurrence {
  id: string;
  class_event_id: string;
  date: string; // YYYY-MM-DD
  start_datetime: string;
  end_datetime: string;
  status: 'scheduled' | 'cancelled';
  is_adhoc: boolean;
  // Joined fields for display
  subject_id?: string;
  subject_title?: string;
  subject_color?: SubjectColor;
  subject_emoji?: string;
  location?: string;
  title?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  occurrence_id: string;
  user_id: string;
  status: AttendanceStatus;
  marked_at: string;
  note: string;
}

export type BlockType = 'heading' | 'text' | 'checklist' | 'code' | 'image' | 'divider' | 'quote';

export interface NoteBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  level?: number; // for headings: 1, 2, 3
}

export interface Note {
  id: string;
  subject_id?: string;
  occurrence_id?: string;
  title: string;
  content_blocks: NoteBlock[];
  created_at: string;
  updated_at: string;
}

export type TaskPriority = 'p1' | 'p2' | 'p3';
export type TaskStatus = 'todo' | 'done';

export interface Task {
  id: string;
  subject_id: string;
  user_id: string;
  title: string;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
}

export interface UserSettings {
  attendance_threshold: number;
  high_contrast: boolean;
  notifications_enabled: boolean;
  notification_lead_time: number; // minutes
  theme: 'dark' | 'light';
  sync_enabled: boolean;
}

export interface User {
  id: string;
  email: string;
  settings: UserSettings;
}

export interface AttendanceSummary {
  subject_id: string;
  subject_title: string;
  subject_color: SubjectColor;
  subject_emoji: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
  safe_to_miss: number;
}

export interface SyncQueueItem {
  id: string;
  entity_type: string;
  entity_id: string;
  action: 'create' | 'update' | 'delete';
  payload: unknown;
  created_at: string;
}
