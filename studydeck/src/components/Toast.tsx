import { useEffect } from 'react';
import { useStore } from '../store';

export default function Toast({ id, message, action, actionLabel }: {
  id: string; message: string; action?: () => void; actionLabel?: string;
}) {
  const removeToast = useStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), 5000);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div className="card px-4 py-3 flex items-center gap-3 animate-slide-up min-w-[280px]">
      <span className="text-sm flex-1">{message}</span>
      {action && (
        <button className="text-accent text-sm font-medium hover:underline" onClick={() => { action(); removeToast(id); }}>
          {actionLabel || 'Undo'}
        </button>
      )}
      <button className="btn-icon text-xs" onClick={() => removeToast(id)} aria-label="Dismiss">✕</button>
    </div>
  );
}
