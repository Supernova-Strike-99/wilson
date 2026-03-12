import { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useStore } from '../store';
import * as db from '../db/indexeddb';
import { COLOR_MAP } from '../types';
import { formatTime } from '../utils/occurrences';
import type { AttendanceStatus, AttendanceRecord } from '../types';

export default function OccurrenceModal({ occurrenceId }: { occurrenceId: string }) {
  const { closeModal, occurrences, attendance, subjects, addAttendance, updateAttendance } = useStore();
  const occ = occurrences.find((o) => o.id === occurrenceId);
  const sub = subjects.find((s) => s.id === occ?.subject_id);
  const existing = attendance.find((a) => a.occurrence_id === occurrenceId);
  const [status, setStatus] = useState<AttendanceStatus | ''>(existing?.status || '');
  const [note, setNote] = useState(existing?.note || '');

  if (!occ) return null;

  async function save() {
    if (!status) return;
    if (existing) {
      const updated = { ...existing, status: status as AttendanceStatus, note, marked_at: new Date().toISOString() };
      await db.attendance.put(updated);
      updateAttendance(existing.id, updated);
    } else {
      const rec: AttendanceRecord = {
        id: uuid(), occurrence_id: occurrenceId, user_id: 'local-user',
        status: status as AttendanceStatus, marked_at: new Date().toISOString(), note,
      };
      await db.attendance.put(rec);
      addAttendance(rec);
    }
    closeModal();
  }

  const startTime = occ.start_datetime.slice(11, 16);
  const endTime = occ.end_datetime.slice(11, 16);

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-10 rounded-full" style={{ background: sub ? COLOR_MAP[sub.color] : '#6366f1' }} />
            <div>
              <h2 className="text-lg font-semibold">{occ.title || sub?.title}</h2>
              <p className="text-sm text-text-muted">
                {occ.date} · {formatTime(startTime)} – {formatTime(endTime)}
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={closeModal} aria-label="Close">✕</button>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-5">
          {occ.location && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>📍</span> <span>{occ.location}</span>
            </div>
          )}
          {sub && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <span>{sub.emoji}</span> <span>{sub.title} ({sub.code})</span>
            </div>
          )}
        </div>

        {/* Attendance */}
        <div className="mb-4">
          <label className="text-xs text-text-muted mb-2 block">Attendance</label>
          <div className="grid grid-cols-4 gap-2">
            {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((s) => (
              <button key={s} onClick={() => setStatus(s)}
                className={`py-2.5 rounded-lg text-sm font-medium capitalize transition-all ${
                  status === s ? `att-${s} ring-1 ring-white/20` : 'bg-bg-hover text-text-muted hover:text-white'
                }`}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-5">
          <label className="text-xs text-text-muted mb-1 block">Note (optional)</label>
          <textarea className="input min-h-[60px] resize-none" placeholder="Add a note..."
            value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <button className="btn-primary flex-1" onClick={save} disabled={!status}>Save</button>
          <button className="btn-secondary" onClick={closeModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
