import { useStore } from '../store';
import { exportAttendanceCSV, downloadFile } from '../utils/csv';
import { exportICS } from '../utils/ics';

export default function Settings() {
  const { settings, updateSettings, attendance, occurrences, subjects } = useStore();

  function handleExportCSV() {
    const csv = exportAttendanceCSV(attendance, (occId) => {
      const occ = occurrences.find((o) => o.id === occId);
      const sub = subjects.find((s) => s.id === occ?.subject_id);
      return sub?.title || occ?.title || 'Unknown';
    });
    downloadFile(csv, 'studydeck-attendance.csv');
  }

  function handleExportICS() {
    const ics = exportICS(occurrences);
    downloadFile(ics, 'studydeck-timetable.ics', 'text/calendar');
  }

  function handleExportJSON() {
    const data = {
      subjects: useStore.getState().subjects,
      classEvents: useStore.getState().classEvents,
      occurrences: useStore.getState().occurrences,
      attendance: useStore.getState().attendance,
      notes: useStore.getState().notes,
      tasks: useStore.getState().tasks,
    };
    downloadFile(JSON.stringify(data, null, 2), 'studydeck-backup.json', 'application/json');
  }

  function handleImportCSV() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      // TODO: parse and import
      alert(`CSV loaded: ${text.split('\n').length - 1} rows found. Import logic coming soon.`);
    };
    input.click();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-6 animate-fade-in">
      <h1 className="text-xl font-bold">Settings</h1>

      {/* Attendance Threshold */}
      <section className="card p-5 space-y-4">
        <h2 className="text-sm font-medium">Attendance Threshold</h2>
        <div className="flex items-center gap-4">
          <input
            type="range" min={50} max={100} step={5}
            value={settings.attendance_threshold}
            onChange={(e) => updateSettings({ attendance_threshold: +e.target.value })}
            className="flex-1 accent-accent"
          />
          <span className="text-lg font-bold text-accent w-14 text-right">{settings.attendance_threshold}%</span>
        </div>
        <p className="text-xs text-text-muted">Subjects below this threshold will show warning badges.</p>
      </section>

      {/* Notifications */}
      <section className="card p-5 space-y-4">
        <h2 className="text-sm font-medium">Notifications</h2>
        <ToggleSetting
          label="Enable notifications"
          checked={settings.notifications_enabled}
          onChange={(v) => updateSettings({ notifications_enabled: v })}
        />
        <div>
          <label className="text-xs text-text-muted mb-1 block">Reminder lead time</label>
          <select className="select w-48" value={settings.notification_lead_time}
            onChange={(e) => updateSettings({ notification_lead_time: +e.target.value })}>
            {[5, 10, 15, 30].map((m) => <option key={m} value={m}>{m} minutes before</option>)}
          </select>
        </div>
      </section>

      {/* Appearance */}
      <section className="card p-5 space-y-4">
        <h2 className="text-sm font-medium">Appearance</h2>
        <ToggleSetting
          label="High contrast mode"
          checked={settings.high_contrast}
          onChange={(v) => {
            updateSettings({ high_contrast: v });
            document.documentElement.classList.toggle('high-contrast', v);
          }}
        />
      </section>

      {/* Export / Import */}
      <section className="card p-5 space-y-4">
        <h2 className="text-sm font-medium">Data</h2>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary btn-sm" onClick={handleExportCSV}>📊 Export Attendance CSV</button>
          <button className="btn-secondary btn-sm" onClick={handleExportICS}>📅 Export Timetable ICS</button>
          <button className="btn-secondary btn-sm" onClick={handleExportJSON}>💾 Full Backup JSON</button>
          <button className="btn-secondary btn-sm" onClick={handleImportCSV}>📁 Import CSV</button>
        </div>
      </section>

      {/* Sync */}
      <section className="card p-5 space-y-4">
        <h2 className="text-sm font-medium">Sync</h2>
        <ToggleSetting
          label="Enable server sync"
          checked={settings.sync_enabled}
          onChange={(v) => updateSettings({ sync_enabled: v })}
        />
        <p className="text-xs text-text-muted">
          {settings.sync_enabled
            ? 'Data will be synced with the server when online.'
            : 'All data is stored locally in your browser. Enable sync to back up to a server.'}
        </p>
      </section>

      {/* Account */}
      <section className="card p-5 space-y-4">
        <h2 className="text-sm font-medium">Account</h2>
        <p className="text-sm text-text-muted">Currently using anonymous local mode.</p>
        <button className="btn-primary btn-sm">Create Account to Back Up</button>
      </section>

      {/* Keyboard Shortcuts */}
      <section className="card p-5">
        <h2 className="text-sm font-medium mb-3">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            ['N', 'New subject'], ['T', 'New class event'], ['A', 'Quick mark attendance'],
            ['/', 'Search / commands'], ['?', 'Show shortcuts'], ['Esc', 'Close modal'],
          ].map(([key, desc]) => (
            <div key={key} className="flex items-center justify-between py-1">
              <span className="text-text-secondary">{desc}</span>
              <span className="kbd">{key}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ToggleSetting({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm">{label}</span>
      <div className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${checked ? 'bg-accent' : 'bg-bg-hover'}`}
        onClick={() => onChange(!checked)}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-5' : 'left-1'}`} />
      </div>
    </label>
  );
}
