import { useStore } from '../store';

const SHORTCUTS = [
  { key: 'N', desc: 'New subject' },
  { key: 'T', desc: 'New timetable entry' },
  { key: 'A', desc: 'Quick mark attendance' },
  { key: '/', desc: 'Open command palette' },
  { key: '?', desc: 'Show this overlay' },
  { key: 'Esc', desc: 'Close modal / overlay' },
];

export default function ShortcutsOverlay() {
  const close = () => useStore.getState().setShortcutsOverlayOpen(false);

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal-content max-w-sm" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button className="btn-icon" onClick={close} aria-label="Close">✕</button>
        </div>
        <div className="space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-text-secondary">{s.desc}</span>
              <span className="kbd">{s.key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
