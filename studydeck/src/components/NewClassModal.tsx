import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useStore } from '../store';
import * as db from '../db/indexeddb';
import type { ClassEvent } from '../types';
import { DAY_NAMES } from '../utils/occurrences';

export default function NewClassModal() {
  const { closeModal, addClassEvent, subjects } = useStore();
  const activeSubjects = subjects.filter((s) => !s.archived);

  const [subjectId, setSubjectId] = useState(activeSubjects[0]?.id || '');
  const [title, setTitle] = useState('');
  const [weekdays, setWeekdays] = useState<number[]>([1]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [startWeek, setStartWeek] = useState(1);
  const [endWeek, setEndWeek] = useState(16);

  function toggleDay(d: number) {
    setWeekdays((wds) => wds.includes(d) ? wds.filter((w) => w !== d) : [...wds, d].sort());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectId || !title.trim() || weekdays.length === 0) return;
    const event: ClassEvent = {
      id: uuid(), subject_id: subjectId, title: title.trim(), weekdays,
      start_time: startTime, end_time: endTime, location: location.trim(),
      is_online: isOnline, start_week: startWeek, end_week: endWeek,
      recurrence_rule: 'WEEKLY', exceptions: [],
    };
    await db.classEvents.put(event);
    addClassEvent(event);
    closeModal();
  }

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">New Class Event</h2>
          <button className="btn-icon" onClick={closeModal} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block">Subject *</label>
            <select className="select" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {activeSubjects.map((s) => <option key={s.id} value={s.id}>{s.emoji} {s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Class Title *</label>
            <input className="input" placeholder="e.g., Math Lecture" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          {/* Weekday toggles */}
          <div>
            <label className="text-xs text-text-muted mb-2 block">Days *</label>
            <div className="flex gap-1.5">
              {DAY_NAMES.map((name, i) => (
                <button key={i} type="button" onClick={() => toggleDay(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                    weekdays.includes(i) ? 'bg-accent text-white' : 'bg-bg-hover text-text-muted hover:text-white'
                  }`}
                >{name}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Start Time</label>
              <input className="input" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">End Time</label>
              <input className="input" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-text-muted mb-1 block">Location</label>
              <input className="input" placeholder="Room 201" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer pt-5">
              <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-accent" />
              <span className="text-sm text-text-secondary">Online</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Start Week</label>
              <input className="input" type="number" min={1} value={startWeek} onChange={(e) => setStartWeek(+e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">End Week</label>
              <input className="input" type="number" min={1} value={endWeek} onChange={(e) => setEndWeek(+e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary flex-1">Create Class</button>
            <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
