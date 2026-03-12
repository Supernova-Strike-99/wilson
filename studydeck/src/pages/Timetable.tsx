import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { getWeekStart, getWeekDates, TIME_SLOTS, DAY_NAMES, formatTime, todayStr } from '../utils/occurrences';
import { COLOR_MAP } from '../types';
import type { Occurrence } from '../types';

export default function Timetable() {
  const { occurrences, subjects, openModal, attendance } = useStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [weekOffset, setWeekOffset] = useState(0);

  const today = todayStr();
  const baseWeekStart = getWeekStart();
  const weekStart = new Date(baseWeekStart);
  weekStart.setDate(weekStart.getDate() + weekOffset * 7);
  const weekDates = getWeekDates(weekStart);
  const weekDateStrs = weekDates.map((d) => d.toISOString().slice(0, 10));

  const weekOccs = useMemo(() =>
    occurrences.filter((o) => weekDateStrs.includes(o.date) && o.status === 'scheduled'),
    [occurrences, weekDateStrs]
  );

  const attMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const a of attendance) m.set(a.occurrence_id, a.status);
    return m;
  }, [attendance]);

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Timetable</h1>
          <div className="flex gap-1 ml-4">
            <button className="btn-icon" onClick={() => setWeekOffset((w) => w - 1)} aria-label="Previous week">◀</button>
            <button className="btn-sm btn-ghost" onClick={() => setWeekOffset(0)}>Today</button>
            <button className="btn-icon" onClick={() => setWeekOffset((w) => w + 1)} aria-label="Next week">▶</button>
          </div>
        </div>
        <div className="flex gap-1 bg-bg-card rounded-lg p-0.5 border border-border">
          <button className={`btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('grid')}>Grid</button>
          <button className={`btn-sm ${view === 'list' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setView('list')}>List</button>
        </div>
      </div>

      <p className="text-sm text-text-muted mb-4">
        {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </p>

      {view === 'grid' ? (
        <WeeklyGrid weekDates={weekDates} weekDateStrs={weekDateStrs} occs={weekOccs} today={today} attMap={attMap} />
      ) : (
        <ListView weekDates={weekDates} weekDateStrs={weekDateStrs} occs={weekOccs} today={today} attMap={attMap} />
      )}
    </div>
  );
}

function WeeklyGrid({ weekDates, weekDateStrs, occs, today, attMap }: {
  weekDates: Date[]; weekDateStrs: string[]; occs: Occurrence[]; today: string; attMap: Map<string, string>;
}) {
  const { subjects, openModal } = useStore();

  // Group occs by day
  const occsByDay = useMemo(() => {
    const m = new Map<string, Occurrence[]>();
    for (const ds of weekDateStrs) m.set(ds, []);
    for (const o of occs) m.get(o.date)?.push(o);
    return m;
  }, [occs, weekDateStrs]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Day headers */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] gap-px mb-px">
          <div /> {/* Time column spacer */}
          {weekDates.map((d, i) => {
            const dateStr = weekDateStrs[i];
            const isToday = dateStr === today;
            return (
              <div key={i} className={`text-center py-2 text-sm ${isToday ? 'text-accent font-semibold' : 'text-text-muted'}`}>
                <div>{DAY_NAMES[d.getDay()]}</div>
                <div className={`text-lg font-bold ${isToday ? 'w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mx-auto' : ''}`}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border border-border rounded-xl overflow-hidden">
          {TIME_SLOTS.map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div className="py-3 px-2 text-xs text-text-muted text-right border-b border-border bg-bg">
                {formatTime(`${hour}:00`)}
              </div>
              {/* Day cells */}
              {weekDateStrs.map((dateStr, di) => {
                const cellOccs = (occsByDay.get(dateStr) || []).filter((o) => {
                  const h = parseInt(o.start_datetime.slice(11, 13));
                  return h === hour;
                });
                return (
                  <div key={`${hour}-${di}`} className="min-h-[52px] border-b border-l border-border p-0.5 relative">
                    {cellOccs.map((occ) => {
                      const sub = subjects.find((s) => s.id === occ.subject_id);
                      const color = sub ? COLOR_MAP[sub.color] : '#6366f1';
                      const att = attMap.get(occ.id);
                      return (
                        <button
                          key={occ.id}
                          className="w-full text-left p-1.5 rounded-md text-xs cursor-pointer transition-all hover:brightness-110"
                          style={{ background: `${color}22`, borderLeft: `3px solid ${color}` }}
                          onClick={() => openModal('occurrence', { occurrenceId: occ.id })}
                          title={`${occ.title} (${occ.location})`}
                        >
                          <div className="font-medium truncate" style={{ color }}>{sub?.emoji} {occ.title}</div>
                          <div className="text-text-muted truncate">{occ.location}</div>
                          {att && <span className={`badge att-${att} text-[9px] mt-0.5`}>{att[0].toUpperCase()}</span>}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ListView({ weekDates, weekDateStrs, occs, today, attMap }: {
  weekDates: Date[]; weekDateStrs: string[]; occs: Occurrence[]; today: string; attMap: Map<string, string>;
}) {
  const { subjects, openModal } = useStore();

  return (
    <div className="space-y-4">
      {weekDateStrs.map((dateStr, i) => {
        const dayOccs = occs.filter((o) => o.date === dateStr).sort((a, b) => a.start_datetime.localeCompare(b.start_datetime));
        const isToday = dateStr === today;
        if (dayOccs.length === 0) return null;
        return (
          <div key={dateStr}>
            <p className={`text-sm font-medium mb-2 ${isToday ? 'text-accent' : 'text-text-muted'}`}>
              {DAY_NAMES[weekDates[i].getDay()]} {weekDates[i].getDate()} {isToday && '— Today'}
            </p>
            <div className="space-y-1.5">
              {dayOccs.map((occ) => {
                const sub = subjects.find((s) => s.id === occ.subject_id);
                const att = attMap.get(occ.id);
                return (
                  <button
                    key={occ.id}
                    className="card w-full text-left px-4 py-3 flex items-center gap-3 cursor-pointer"
                    onClick={() => openModal('occurrence', { occurrenceId: occ.id })}
                  >
                    <div className="w-1.5 h-8 rounded-full" style={{ background: sub ? COLOR_MAP[sub.color] : '#6366f1' }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium">{sub?.emoji} {occ.title}</span>
                      <p className="text-xs text-text-muted">{formatTime(occ.start_datetime.slice(11, 16))} – {formatTime(occ.end_datetime.slice(11, 16))} · {occ.location}</p>
                    </div>
                    {att && <span className={`badge att-${att} text-[10px]`}>{att}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
