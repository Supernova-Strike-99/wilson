export default function EmptyState({ icon, title, description, action, actionLabel }: {
  icon: string; title: string; description: string;
  action?: () => void; actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-text-muted mb-4 max-w-sm">{description}</p>
      {action && (
        <button className="btn-primary" onClick={action}>{actionLabel || 'Get started'}</button>
      )}
    </div>
  );
}
