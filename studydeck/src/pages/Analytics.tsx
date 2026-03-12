import { useMemo } from 'react';
import { useStore } from '../store';
import { buildAttendanceSummaries, calcAttendancePercent, getPctClass } from '../utils/attendance';
import { COLOR_MAP } from '../types';
import { DAY_NAMES, todayStr } from '../utils/occurrences';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export default function Analytics() {
  const { subjects, occurrences, attendance, settings } = useStore();
  const activeSubjects = subjects.filter((s) => !s.archived);
  const today = todayStr();

  const summaries = useMemo(() =>
    buildAttendanceSummaries(activeSubjects, occurrences, attendance, settings.attendance_threshold),
    [activeSubjects, occurrences, attendance]
  );

  // Weekly trend data (last 8 weeks)
  const trendData = useMemo(() => {
    const weeks: { label: string; pct: number }[] = [];
    const now = new Date();
    for (let w = 7; w >= 0; w--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - w * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6);
      const wStart = weekStart.toISOString().slice(0, 10);
      const wEnd = weekEnd.toISOString().slice(0, 10);
      const weekAtt = attendance.filter((a) => a.marked_at.slice(0, 10) >= wStart && a.marked_at.slice(0, 10) <= wEnd);
      const pct = weekAtt.length > 0 ? calcAttendancePercent(weekAtt) : 0;
      weeks.push({ label: `W${8 - w}`, pct });
    }
    return weeks;
  }, [attendance]);

  // Weekday heatmap
  const weekdayData = useMemo(() => {
    const counts: Record<number, { total: number; missed: number }> = {};
    for (let i = 0; i < 7; i++) counts[i] = { total: 0, missed: 0 };
    for (const occ of occurrences) {
      if (occ.status === 'cancelled' || occ.date > today) continue;
      const day = new Date(occ.date).getDay();
      counts[day].total++;
      const att = attendance.find((a) => a.occurrence_id === occ.id);
      if (att?.status === 'absent') counts[day].missed++;
    }
    return Object.entries(counts).map(([day, data]) => ({
      day: DAY_NAMES[parseInt(day)],
      missed: data.missed,
      total: data.total,
      rate: data.total > 0 ? Math.round((data.missed / data.total) * 100) : 0,
    }));
  }, [occurrences, attendance, today]);

  // At-risk subjects
  const atRisk = summaries.filter((s) => s.percentage < settings.attendance_threshold);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 md:pb-6 animate-fade-in">
      <h1 className="text-xl font-bold">Analytics</h1>

      {/* Attendance Trend */}
      <section className="card p-5">
        <h2 className="text-sm font-medium text-text-muted mb-4">Attendance Trend — Last 8 Weeks</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="pct" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Attendance %" />
              {/* Threshold line */}
              <Line type="monotone" dataKey={() => settings.attendance_threshold} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Threshold" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Subject Comparison */}
      <section className="card p-5">
        <h2 className="text-sm font-medium text-text-muted mb-4">Subject Comparison</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={summaries} layout="vertical">
              <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
              <YAxis type="category" dataKey="subject_title" axisLine={false} tickLine={false} width={120} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#181818', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]} name="Attendance %">
                {summaries.map((s, i) => (
                  <Cell key={i} fill={COLOR_MAP[s.subject_color]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Weekday Heatmap */}
        <section className="card p-5">
          <h2 className="text-sm font-medium text-text-muted mb-4">Missed Classes by Day</h2>
          <div className="grid grid-cols-7 gap-2">
            {weekdayData.map((d) => (
              <div key={d.day} className="text-center">
                <div
                  className="w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold mb-1"
                  style={{
                    background: d.rate > 30 ? 'rgba(239,68,68,0.3)' : d.rate > 10 ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.15)',
                    color: d.rate > 30 ? '#f87171' : d.rate > 10 ? '#fbbf24' : '#4ade80',
                  }}
                >
                  {d.missed}
                </div>
                <span className="text-[10px] text-text-muted">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* At Risk */}
        <section className="card p-5">
          <h2 className="text-sm font-medium text-text-muted mb-4">
            {atRisk.length > 0 ? '⚠ At Risk Subjects' : '✅ All Good'}
          </h2>
          {atRisk.length === 0 ? (
            <p className="text-sm text-text-muted py-4">All subjects are above the {settings.attendance_threshold}% threshold.</p>
          ) : (
            <div className="space-y-3">
              {atRisk.map((s) => (
                <div key={s.subject_id} className="flex items-center gap-3">
                  <span>{s.subject_emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.subject_title}</p>
                    <div className="w-full bg-bg-hover rounded-full h-1.5 mt-1">
                      <div className="h-1.5 rounded-full bg-danger" style={{ width: `${s.percentage}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold pct-red">{s.percentage}%</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
