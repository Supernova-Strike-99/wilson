import { NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import Toast from './Toast';
import CommandPalette from './CommandPalette';
import ShortcutsOverlay from './ShortcutsOverlay';
import NewSubjectModal from './NewSubjectModal';
import NewClassModal from './NewClassModal';
import QuickAttendanceModal from './QuickAttendanceModal';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⬡' },
  { to: '/timetable', label: 'Timetable', icon: '▦' },
  { to: '/analytics', label: 'Analytics', icon: '◈' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, toggleSidebar, commandPaletteOpen, shortcutsOverlayOpen, activeModal, syncStatus, toasts } = useStore();
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-border bg-bg transition-all duration-200 ${sidebarOpen ? 'w-56' : 'w-16'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-border">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">S</div>
          {sidebarOpen && <span className="font-semibold text-sm tracking-tight">StudyDeck</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center px-0' : ''}`
              }
            >
              <span className="text-base">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Subjects quick links */}
        {sidebarOpen && <SubjectsSidebarSection />}

        {/* Bottom */}
        <div className="px-2 py-3 border-t border-border">
          <button onClick={toggleSidebar} className="sidebar-item w-full" aria-label="Toggle sidebar">
            <span className="text-base">{sidebarOpen ? '◁' : '▷'}</span>
            {sidebarOpen && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-6 h-14 border-b border-border bg-bg shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden btn-icon" onClick={toggleSidebar} aria-label="Menu">☰</button>
            <h1 className="text-sm font-medium text-text-secondary capitalize">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.slice(1).split('/')[0]}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              className="btn-secondary btn-sm hidden sm:flex gap-2"
              onClick={() => useStore.getState().setCommandPaletteOpen(true)}
            >
              <span className="text-text-muted text-xs">Search...</span>
              <span className="kbd">/</span>
            </button>
            {/* Sync badge */}
            <div className="flex items-center gap-1.5 text-xs text-text-muted" title={`Status: ${syncStatus}`}>
              <span className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced' ? 'bg-success' : syncStatus === 'syncing' ? 'bg-warning animate-pulse' : 'bg-text-muted'
              }`} />
              {syncStatus === 'offline' ? 'Local' : syncStatus}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-bg border-t border-border flex z-40">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2 text-xs ${isActive ? 'text-accent' : 'text-text-muted'}`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Overlays */}
      {commandPaletteOpen && <CommandPalette />}
      {shortcutsOverlayOpen && <ShortcutsOverlay />}
      {activeModal?.type === 'new-subject' && <NewSubjectModal />}
      {activeModal?.type === 'new-class' && <NewClassModal />}
      {activeModal?.type === 'quick-attendance' && <QuickAttendanceModal />}
      {activeModal?.type === 'occurrence' && <OccurrenceModalWrapper />}

      {/* Toasts */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 space-y-2">
        {toasts.map((t) => <Toast key={t.id} {...t} />)}
      </div>
    </div>
  );
}

function SubjectsSidebarSection() {
  const subjects = useStore((s) => s.subjects.filter((x) => !x.archived));
  return (
    <div className="px-2 py-3 border-t border-border">
      <p className="px-3 text-[10px] uppercase tracking-wider text-text-muted mb-2">Subjects</p>
      <div className="space-y-0.5">
        {subjects.slice(0, 6).map((s) => (
          <NavLink key={s.id} to={`/subject/${s.id}`} className="sidebar-item">
            <span>{s.emoji}</span>
            <span className="truncate">{s.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function OccurrenceModalWrapper() {
  const { activeModal } = useStore();
  if (activeModal?.type !== 'occurrence') return null;
  // Dynamically import to avoid circular deps
  const OccurrenceModal = require('./OccurrenceModal').default;
  return <OccurrenceModal occurrenceId={activeModal.data?.occurrenceId} />;
}
