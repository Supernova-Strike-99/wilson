import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { calcAttendancePercent, getPctClass, safeToMiss } from '../utils/attendance';
import { formatTime, todayStr } from '../utils/occurrences';
import { COLOR_MAP } from '../types';
import type { AttendanceRecord, NoteBlock, Task } from '../types';
import { v4 as uuid } from 'uuid';
import * as db from '../db/indexeddb';
import EmptyState from '../components/EmptyState';

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subjects, occurrences, attendance, tasks, notes, openModal, addTask, updateTask } = useStore();
  const [tab, setTab] = useState<'overview' | 'notes' | 'tasks'>('overview');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const subject = subjects.find((s) => s.id === id);
  if (!subject) return <EmptyState icon="❓" title="Subject not found" description="This subject doesn't exist." action={() => navigate('/')} actionLabel="Go home" />;

  const subOccs = useMemo(() =>
    occurrences.filter((o) => o.subject_id === id && o.status === 'scheduled').sort((a, b) => a.start_datetime.localeCompare(b.start_datetime)),
    [occurrences, id]
  );

  const subAttendance = useMemo(() =>
    attendance.filter((a) => subOccs.some((o) => o.id === a.occurrence_id)),
    [attendance, subOccs]
  );

  const pct = calcAttendancePercent(subAttendance);
  const today = todayStr();
  const pastOccs = subOccs.filter((o) => o.date <= today);
  const futureOccs = subOccs.filter((o) => o.date > today);
  const safeMiss = safeToMiss(subAttendance, futureOccs.length);

  const attMap = useMemo(() => {
    const m = new Map<string, AttendanceRecord>();
    for (const a of attendance) m.set(a.occurrence_id, a);
    return m;
  }, [attendance]);

  const subTasks = tasks.filter((t) => t.subject_id === id);
  const subNotes = notes.filter((n) => n.subject_id === id);

  async function addNewTask() {
    if (!newTaskTitle.trim()) return;
    const task: Task = {
      id: uuid(), subject_id: id!, user_id: 'local-user',
      title: newTaskTitle.trim(), due_date: '', priority: 'p2', status: 'todo',
      created_at: new Date().toISOString(),
    };
    await db.tasks.put(task);
    addTask(task);
    setNewTaskTitle('');
  }

  async function toggleTask(taskId: string) {
    const t = tasks.find((x) => x.id === taskId);
    if (!t) return;
    const updated = { ...t, status: (t.status === 'todo' ? 'done' : 'todo') as Task['status'] };
    await db.tasks.put(updated);
    updateTask(taskId, { status: updated.status });
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${COLOR_MAP[subject.color]}22` }}>
          {subject.emoji}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{subject.title}</h1>
          <p className="text-sm text-text-muted">{subject.code} · {subject.teacher} · {subject.credits} credits · {subject.semester}</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${getPctClass(pct)}`}>{pct}%</p>
          <p className="text-xs text-text-muted">attendance</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-3 text-center">
          <p className="text-lg font-bold">{subAttendance.filter((a) => a.status === 'present').length}</p>
          <p className="text-xs text-text-muted">Present</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold">{subAttendance.filter((a) => a.status === 'absent').length}</p>
          <p className="text-xs text-text-muted">Absent</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-lg font-bold text-accent">{safeMiss}</p>
          <p className="text-xs text-text-muted">Can miss</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-4">
        {(['overview', 'notes', 'tasks'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-accent text-white' : 'border-transparent text-text-muted hover:text-white'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-text-muted mb-2">Attendance History</h3>
          {pastOccs.length === 0 && <p className="text-sm text-text-muted py-4">No past classes yet</p>}
          {pastOccs.slice().reverse().slice(0, 30).map((occ) => {
            const att = attMap.get(occ.id);
            return (
              <button key={occ.id} className="card w-full text-left px-4 py-2.5 flex items-center gap-3 cursor-pointer"
                onClick={() => openModal('occurrence', { occurrenceId: occ.id })}>
                <div className="w-1 h-6 rounded-full" style={{ background: COLOR_MAP[subject.color] }} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm">{occ.title}</span>
                  <span className="text-xs text-text-muted ml-2">{occ.date} · {formatTime(occ.start_datetime.slice(11, 16))}</span>
                </div>
                {att ? (
                  <span className={`badge att-${att.status} text-xs`}>{att.status}</span>
                ) : (
                  <span className="text-xs text-text-muted">Not marked</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {tab === 'tasks' && (
        <div className="space-y-2">
          <div className="flex gap-2 mb-3">
            <input className="input flex-1" placeholder="Add a task..." value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNewTask()} />
            <button className="btn-primary btn-sm" onClick={addNewTask}>Add</button>
          </div>
          {subTasks.length === 0 && <p className="text-sm text-text-muted py-4">No tasks yet</p>}
          {subTasks.map((t) => (
            <div key={t.id} className="card px-4 py-2.5 flex items-center gap-3">
              <button onClick={() => toggleTask(t.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  t.status === 'done' ? 'bg-accent border-accent text-white' : 'border-border hover:border-accent'
                }`}>
                {t.status === 'done' && '✓'}
              </button>
              <span className={`text-sm flex-1 ${t.status === 'done' ? 'line-through text-text-muted' : ''}`}>{t.title}</span>
              {t.priority === 'p1' && <span className="badge bg-danger/20 text-danger text-[10px]">P1</span>}
              {t.due_date && <span className={`text-xs ${t.due_date < today && t.status === 'todo' ? 'text-danger' : 'text-text-muted'}`}>{t.due_date}</span>}
            </div>
          ))}
        </div>
      )}

      {tab === 'notes' && (
        <div className="space-y-2">
          {subNotes.length === 0 && (
            <EmptyState icon="📝" title="No notes yet" description="Start taking notes for this subject." />
          )}
          {subNotes.map((n) => (
            <div key={n.id} className="card px-4 py-3">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-text-muted mt-1">{new Date(n.updated_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
