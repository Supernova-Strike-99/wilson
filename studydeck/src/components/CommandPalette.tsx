import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function CommandPalette() {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { subjects, setCommandPaletteOpen, openModal } = useStore();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setCommandPaletteOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const commands = [
    { label: 'Go to Dashboard', icon: '⬡', action: () => { navigate('/'); setCommandPaletteOpen(false); } },
    { label: 'Go to Timetable', icon: '▦', action: () => { navigate('/timetable'); setCommandPaletteOpen(false); } },
    { label: 'Go to Analytics', icon: '◈', action: () => { navigate('/analytics'); setCommandPaletteOpen(false); } },
    { label: 'Go to Settings', icon: '⚙', action: () => { navigate('/settings'); setCommandPaletteOpen(false); } },
    { label: 'New Subject', icon: '➕', action: () => { openModal('new-subject'); setCommandPaletteOpen(false); }, kbd: 'N' },
    { label: 'New Class Event', icon: '📅', action: () => { openModal('new-class'); setCommandPaletteOpen(false); }, kbd: 'T' },
    { label: 'Quick Mark Attendance', icon: '✓', action: () => { openModal('quick-attendance'); setCommandPaletteOpen(false); }, kbd: 'A' },
    ...subjects.filter((s) => !s.archived).map((s) => ({
      label: `${s.emoji} ${s.title}`,
      icon: '',
      action: () => { navigate(`/subject/${s.id}`); setCommandPaletteOpen(false); },
    })),
  ];

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={() => setCommandPaletteOpen(false)}>
      <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()} style={{ marginTop: '-10vh' }}>
        <div className="card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search commands, subjects..."
              className="w-full bg-transparent border-none outline-none text-sm placeholder:text-text-muted"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search commands"
            />
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="text-center text-text-muted text-sm py-6">No results found</p>
            )}
            {filtered.map((cmd, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-bg-hover transition-colors"
                onClick={cmd.action}
              >
                {cmd.icon && <span className="w-5 text-center">{cmd.icon}</span>}
                <span className="flex-1">{cmd.label}</span>
                {(cmd as any).kbd && <span className="kbd">{(cmd as any).kbd}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
