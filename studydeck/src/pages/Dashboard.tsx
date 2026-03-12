import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { todayStr, formatTime, DAY_NAMES_FULL } from '../utils/occurrences';
import { calcAttendancePercent, getPctClass, buildAttendanceSummaries } from '../utils/attendance';
import { COLOR_MAP } from '../types';
import EmptyState from '../components/EmptyState';

export default function Dashboard() {
  const { subjects, occurrences, attendance, tasks, openModal, settings } = useStore();
  const navigate = useNavigate();
  const today = todayStr();
  const now = new Date();
  const dayName = DAY_NAMES_FULL[now.getDay()];

  const activeSubjects = useMemo(() => subjects.filter((s) => !s.archived), [subjects]);

  // Today's classes
  const todayOccs = useMemo(() =>
    occurrences
      .filter((o) => o.date === today && o.status === 'scheduled')
      .sort((a, b) => a.start_datetime.localeCompare(b.start_datetime)),
    [occurrences, today]
  );

  // What's next — next 2 upcoming classes
  const nowISO = now.toISOString();
  const upcoming = useMemo(() =>
    todayOccs.filter((o) => o.start_datetime > nowISO).slice(0, 2),
    [todayOccs, nowISO]
  );

  // Attendance summaries
  const summaries = useMemo(() =>
    buildAttendanceSummaries(activeSubjects, occurrences, attendance, settings.attendance_threshold),
    [activeSubjects, occurrences, attendance, settings.attendance_threshold]
  );

  // Overall attendance
  const overallPct = useMemo(() => {
    const allRecs = attendance.filter((a) => a.user_id === 'local-user');
    return calcAttendancePercent(allRecs);
  }, [attendance]);

  // Overdue tasks
  const overdueTasks = useMemo(() =>
    tasks.filter((t) => t.status === 'todo' && t.due_date < today),
    [tasks, today]
  );

  // Attendance map for today
  const attMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of attendance) m.set(a.occurrence_id, a.status);
    return m;
  }, [attendance]);

  // This week stats
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  const thisWeekAttendance = useMemo(() =>
    attendance.filter((a) => a.marked_at.slice(0, 10) >= weekStartStr && a.marked_at.slice(0, 10) <= today),
    [attendance, weekStartStr, today]
  );
  const weekPresent = thisWeekAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;

  if (activeSubjects.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="Welcome to StudyDeck"
        description="Start by adding your first subject. Press N or click below."
        action={() => openModal('new-subject')}
        actionLabel="+ New Subject"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-text-muted text-sm">{dayName}, {today}</p>
          <h1 className="text-2xl font-bold mt-1">Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'} 👋</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary btn-sm" onClick={() => openModal('quick-attendance')}>
            ✓ Mark Today
          </button>
          <button className="btn-secondary btn-sm" onClick={() => openModal('new-subject')}>+</button>
        </div>
      </div>

      {/* What's Next */}
      {upcoming.length > 0 && (
        <div className="card p-4 border-accent/30 bg-accent/5">
          <p className="text-xs text-accent font-medium uppercase tracking-wider mb-2">What's Next</p>
          <div className="space-y-2">
            {upcoming.map((occ) => {
              const sub = activeSubjects.find((s) => s.id === occ.subject_id);
              const startMin = Math.round((new Date(occ.start_datetime).getTime() - now.getTime()) / 60000);
              return (
                <div key={occ.id} className="flex items-center gap-3">
                  <div className="w-1.5 h-8 rounded-full" style={{ background: sub ? COLOR_MAP[sub.color] : '#6366f1' }} />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{occ.title || sub?.title}</span>
                    <span className="text-xs text-text-muted ml-2">{occ.location}</span>
                  </div>
                  <span className="text-xs text-accent font-medium">
                    {startMin > 0 ? `in ${startMin} min` : 'Now'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Overall Attendance" value={`${overallPct}%`} className={getPctClass(overallPct)} />
        <StatCard label="Today's Classes" value={String(todayOccs.length)} />
        <StatCard label="This Week" value={`${weekPresent}/${thisWeekAttendance.length}`} />
        <StatCard label="Overdue Tasks" value={String(overdueTasks.length)} className={overdueTasks.length > 0 ? 'pct-red' : ''} />
      </div>

      {/* Today's Timeline */}
      {todayOccs.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-text-muted mb-3">Today's Schedule</h2>
          <div className="space-y-2">
            {todayOccs.map((occ) => {
              const sub = activeSubjects.find((s) => s.id === occ.subject_id);
              const attStatus = attMap.get(occ.id);
              const isPast = occ.end_datetime < nowISO;
              return (
                <button
                  key={occ.id}
                  className="card w-full text-left px-4 py-3 flex items-center gap-3 group cursor-pointer"
                  onClick={() => openModal('occurrence', { occurrenceId: occ.id })}
                >
                  <div className="w-1.5 h-10 rounded-full shrink-0" style={{ background: sub ? COLOR_MAP[sub.color] : '#6366f1' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{sub?.emoji} {occ.title || sub?.title}</span>
                      {attStatus && <span className={`badge att-${attStatus} text-[10px]`}>{attStatus}</span>}
                    </div>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatTime(occ.start_datetime.slice(11, 16))} – {formatTime(occ.end_datetime.slice(11, 16))} · {occ.location}
                    </p>
                  </div>
                  <span className={`text-xs ${isPast ? 'text-text-muted' : 'text-accent'}`}>
                    {isPast ? 'Done' : '→'}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Subject Cards */}
      <section>
        <h2 className="text-sm font-medium text-text-muted mb-3">Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {summaries.map((s) => {
            const sub = activeSubjects.find((x) => x.id === s.subject_id)!;
            const nextOcc = occurrences.find((o) => o.subject_id === s.subject_id && o.date >= today && o.status === 'scheduled');
            const isWarning = s.percentage < settings.attendance_threshold;
            return (
              <button
                key={s.subject_id}
                className="card text-left p-4 cursor-pointer group"
                onClick={() => navigate(`/subject/${s.subject_id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{sub.emoji}</span>
                    <div>
                      <p className="font-medium text-sm">{sub.title}</p>
                      <p className="text-xs text-text-muted">{sub.code} · {sub.credits} credits</p>
                    </div>
                  </div>
                  {isWarning && <span className="text-xs bg-danger/20 text-danger px-2 py-0.5 rounded-full">⚠ Low</span>}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-2xl font-bold ${getPctClass(s.percentage, settings.attendance_threshold)}`}>{s.percentage}%</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {s.present}P · {s.absent}A · {s.late}L · {s.excused}E
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">Can miss</p>
                    <p className="text-sm font-semibold">{s.safe_to_miss}</p>
                  </div>
                </div>
                {nextOcc && (
                  <p className="text-xs text-text-muted mt-2 pt-2 border-t border-border">
                    Next: {nextOcc.date} {formatTime(nextOcc.start_datetime.slice(11, 16))}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-danger mb-3">⚠ Overdue Tasks</h2>
          <div className="space-y-2">
            {overdueTasks.map((t) => {
              const sub = activeSubjects.find((s) => s.id === t.subject_id);
              return (
                <div key={t.id} className="card px-4 py-3 flex items-center gap-3 border-danger/30">
                  <span className="text-xs">{sub?.emoji}</span>
                  <span className="text-sm flex-1">{t.title}</span>
                  <span className="text-xs text-danger">Due {t.due_date}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className={`text-xl font-bold ${className}`}>{value}</p>
    </div>
  );
}
