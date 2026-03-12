import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import { useStore } from '../store';
import * as db from '../db/indexeddb';
import { todayStr } from '../utils/occurrences';
import { COLOR_MAP } from '../types';
import type { AttendanceRecord, AttendanceStatus } from '../types';

export default function QuickAttendanceModal() {
  const { closeModal, occurrences, attendance, addAttendance, addToast, subjects } = useStore();
  const today = todayStr();

  const todayOccs = useMemo(() =>
    occurrences.filter((o) => o.date === today && o.status === 'scheduled'),
    [occurrences, today]
  );

  const existingByOcc = useMemo(() => {
    const map = new Map<string, AttendanceRecord>();
    for (const a of attendance) map.set(a.occurrence_id, a);
    return map;
  }, [attendance]);

  async function markAll(status: AttendanceStatus) {
    const newRecords: AttendanceRecord[] = [];
    for (const occ of todayOccs) {
      if (existingByOcc.has(occ.id)) continue;
      const rec: AttendanceRecord = {
        id: uuid(), occurrence_id: occ.id, user_id: 'local-user',
        status, marked_at: new Date().toISOString(), note: '',
      };
      await db.attendance.put(rec);
      newRecords.push(rec);
    }
    for (const r of newRecords) addAttendance(r);
    addToast({ id: uuid(), message: `Marked ${newRecords.length} classes as ${status}`, actionLabel: 'Undo' });
    closeModal();
  }

  async function markSingle(occId: string, status: AttendanceStatus) {
    const existing = existingByOcc.get(occId);
    if (existing) {
      const updated = { ...existing, status, marked_at: new Date().toISOString() };
      await db.attendance.put(updated);
      useStore.getState().updateAttendance(existing.id, updated);
    } else {
      const rec: AttendanceRecord = {
        id: uuid(), occurrence_id: occId, user_id: 'local-user',
        status, marked_at: new Date().toISOString(), note: '',
      };
      await db.attendance.put(rec);
      addAttendance(rec);
    }
  }

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Quick Mark — Today</h2>
          <button className="btn-icon" onClick={closeModal} aria-label="Close">✕</button>
        </div>

        {todayOccs.length === 0 ? (
          <p className="text-center text-text-muted py-8">No classes scheduled for today</p>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {todayOccs.map((occ) => {
                const sub = subjects.find((s) => s.id === occ.subject_id);
                const existing = existingByOcc.get(occ.id);
                return (
                  <div key={occ.id} className="card px-4 py-3 flex items-center gap-3">
                    <div className="w-2 h-8 rounded-full shrink-0" style={{ background: sub ? COLOR_MAP[sub.color] : '#6366f1' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{occ.title || sub?.title}</p>
                      <p className="text-xs text-text-muted">{occ.start_datetime.slice(11, 16)} — {occ.location}</p>
                    </div>
                    <div className="flex gap-1">
                      {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((s) => (
                        <button key={s} onClick={() => markSingle(occ.id, s)}
                          className={`btn-sm rounded-md text-[11px] uppercase tracking-wide ${
                            existing?.status === s ? `att-${s} font-bold` : 'btn-ghost'
                          }`}
                        >{s[0]}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1" onClick={() => markAll('present')}>
                ✓ Mark All Present
              </button>
              <button className="btn-secondary" onClick={closeModal}>Done</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
