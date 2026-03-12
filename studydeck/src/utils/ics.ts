import type { ClassEvent, Occurrence } from '../types';
import { DAY_NAMES_FULL } from './occurrences';

/**
 * Parse a simple .ics file and extract VEVENT entries as ClassEvent-like data.
 */
export function parseICS(icsContent: string): Partial<ClassEvent>[] {
  const events: Partial<ClassEvent>[] = [];
  const blocks = icsContent.split('BEGIN:VEVENT');

  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split('END:VEVENT')[0];
    const get = (key: string) => {
      const match = block.match(new RegExp(`${key}[^:]*:(.*)`));
      return match ? match[1].trim() : '';
    };

    const summary = get('SUMMARY');
    const dtstart = get('DTSTART');
    const dtend = get('DTEND');
    const location = get('LOCATION');
    const rrule = get('RRULE');

    // Parse date/time
    const startDate = parseICSDate(dtstart);
    const endDate = parseICSDate(dtend);

    if (startDate && endDate) {
      const weekday = startDate.getDay();
      events.push({
        title: summary,
        weekdays: [weekday],
        start_time: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
        end_time: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
        location: location,
        recurrence_rule: rrule,
        start_week: 1,
        end_week: 16,
      });
    }
  }
  return events;
}

function parseICSDate(str: string): Date | null {
  if (!str) return null;
  // Handle format: 20260212T090000 or 20260212T090000Z
  const clean = str.replace(/[^0-9T]/g, '');
  if (clean.length < 15) return null;
  const y = parseInt(clean.slice(0, 4));
  const m = parseInt(clean.slice(4, 6)) - 1;
  const d = parseInt(clean.slice(6, 8));
  const h = parseInt(clean.slice(9, 11));
  const min = parseInt(clean.slice(11, 13));
  return new Date(y, m, d, h, min);
}

/**
 * Export occurrences to .ics format.
 */
export function exportICS(occurrences: Occurrence[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//StudyDeck//EN',
    'CALSCALE:GREGORIAN',
  ];

  for (const occ of occurrences) {
    if (occ.status === 'cancelled') continue;
    const start = new Date(occ.start_datetime);
    const end = new Date(occ.end_datetime);
    lines.push(
      'BEGIN:VEVENT',
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `SUMMARY:${occ.title || occ.subject_title || 'Class'}`,
      `LOCATION:${occ.location || ''}`,
      `UID:${occ.id}@studydeck`,
      'END:VEVENT',
    );
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function formatICSDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
