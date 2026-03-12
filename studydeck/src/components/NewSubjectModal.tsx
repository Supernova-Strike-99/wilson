import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useStore } from '../store';
import * as db from '../db/indexeddb';
import { SUBJECT_COLORS, COLOR_MAP } from '../types';
import type { Subject, SubjectColor } from '../types';

const EMOJIS = ['📐', '🌲', '⚡', '🧪', '🎨', '📚', '🔬', '🖥️', '📝', '🎯', '🧮', '💡'];

export default function NewSubjectModal() {
  const { closeModal, addSubject } = useStore();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('');
  const [color, setColor] = useState<SubjectColor>('indigo');
  const [emoji, setEmoji] = useState('📚');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState('Spring 2026');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const subject: Subject = {
      id: uuid(), title: title.trim(), code: code.trim(), color, emoji, teacher: teacher.trim(),
      credits, semester, pinned: false, archived: false, created_at: new Date().toISOString(),
    };
    await db.subjects.put(subject);
    addSubject(subject);
    closeModal();
  }

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">New Subject</h2>
          <button className="btn-icon" onClick={closeModal} aria-label="Close">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-text-muted mb-1 block">Title *</label>
            <input className="input" placeholder="e.g., Mathematics III" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">Code</label>
              <input className="input" placeholder="MATH301" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">Credits</label>
              <input className="input" type="number" min={1} max={10} value={credits} onChange={(e) => setCredits(+e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Teacher</label>
            <input className="input" placeholder="Dr. Sharma" value={teacher} onChange={(e) => setTeacher(e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-text-muted mb-1 block">Semester</label>
            <input className="input" placeholder="Spring 2026" value={semester} onChange={(e) => setSemester(e.target.value)} />
          </div>
          {/* Color picker */}
          <div>
            <label className="text-xs text-text-muted mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {SUBJECT_COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-all ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-bg scale-110' : 'hover:scale-105'}`}
                  style={{ background: COLOR_MAP[c] }} aria-label={c}
                />
              ))}
            </div>
          </div>
          {/* Emoji picker */}
          <div>
            <label className="text-xs text-text-muted mb-2 block">Icon</label>
            <div className="flex gap-2 flex-wrap">
              {EMOJIS.map((e) => (
                <button key={e} type="button" onClick={() => setEmoji(e)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${emoji === e ? 'bg-bg-hover ring-1 ring-accent' : 'hover:bg-bg-hover'}`}
                >{e}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="btn-primary flex-1">Create Subject</button>
            <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
