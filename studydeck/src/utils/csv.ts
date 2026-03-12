import type { ClassEvent, AttendanceRecord } from '../types';

/**
 * Parse CSV timetable into ClassEvent-like objects.
 * Expected columns: title, subject_code, weekdays (comma-sep numbers), start_time, end_time, location, is_online, start_week, end_week
 */
export function parseCSV(csv: string): Partial<ClassEvent>[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const results: Partial<ClassEvent>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map((v) => v.trim());
    const row: any = {};
    headers.forEach((h, idx) => { row[h] = vals[idx] || ''; });
    results.push({
      title: row.title || '',
      weekdays: (row.weekdays || '').split(';').map(Number).filter((n: number) => !isNaN(n)),
      start_time: row.start_time || '',
      end_time: row.end_time || '',
      location: row.location || '',
      is_online: row.is_online === 'true',
      start_week: parseInt(row.start_week) || 1,
      end_week: parseInt(row.end_week) || 16,
    });
  }
  return results;
}

/**
 * Export attendance records to CSV string.
 */
export function exportAttendanceCSV(records: AttendanceRecord[], getLabel: (occId: string) => string): string {
  const header = 'Date,Subject,Status,Note';
  const rows = records.map((r) => {
    const label = getLabel(r.occurrence_id);
    return `${r.marked_at.slice(0, 10)},${label},${r.status},"${r.note || ''}"`;
  });
  return [header, ...rows].join('\n');
}

/**
 * Trigger browser download of a string as a file.
 */
export function downloadFile(content: string, filename: string, mime = 'text/csv') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
