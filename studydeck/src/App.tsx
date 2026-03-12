import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useStore } from './store';
import { SEED_DATA } from './data/seed';
import * as db from './db/indexeddb';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import SubjectPage from './pages/SubjectPage';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  const {
    setSubjects, setClassEvents, setOccurrences, setAttendance, setTasks,
    setCommandPaletteOpen, setShortcutsOverlayOpen, openModal,
  } = useStore();

  // Load data from IndexedDB on mount
  useEffect(() => {
    async function init() {
      await db.seedDatabase(SEED_DATA);
      const [subjects, classEvents, occurrences, attendance, tasks] = await Promise.all([
        db.subjects.getAll(),
        db.classEvents.getAll(),
        db.occurrences.getAll(),
        db.attendance.getAll(),
        db.tasks.getAll(),
      ]);
      setSubjects(subjects);
      setClassEvents(classEvents);
      setOccurrences(occurrences);
      setAttendance(attendance);
      setTasks(tasks);
    }
    init();
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;

      switch (e.key) {
        case '/':
          e.preventDefault();
          setCommandPaletteOpen(true);
          break;
        case 'n':
          e.preventDefault();
          openModal('new-subject');
          break;
        case 't':
          e.preventDefault();
          openModal('new-class');
          break;
        case 'a':
          e.preventDefault();
          openModal('quick-attendance');
          break;
        case '?':
          e.preventDefault();
          setShortcutsOverlayOpen(true);
          break;
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/subject/:id" element={<SubjectPage />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
