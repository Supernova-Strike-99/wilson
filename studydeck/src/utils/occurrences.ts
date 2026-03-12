import type { ClassEvent, Occurrence } from '../types';
import { v4 as uuid } from 'uuid';

/**
 * Generate all occurrences for a ClassEvent within a date range.
 * Uses start_week and end_week to determine semester boundaries.
 */
export function generateOccurrences(
  event: ClassEvent,
  semesterStart: Date, // e.g., 2026-01-12 (Monday of week 1)
  rangeFrom?: Date,
  rangeTo?: Date,
): Occurrence[] {
  const results: Occurrence[] = [];
  const exceptionsSet = new Set(event.exceptions || []);

  for (let week = event.start_week; week <= event.end_week; week++) {
    for (const wd of event.weekdays) {
      // semester start + (week-1)*7 + day offset
      const date = new Date(semesterStart);
      const semStartDay = semesterStart.getDay(); // 0=sun
      const dayOffset = (wd - semStartDay + 7) % 7;
      date.setDate(semesterStart.getDate() + (week - 1) * 7 + dayOffset);

      const dateStr = toDateStr(date);

      // Skip exceptions
      if (exceptionsSet.has(dateStr)) continue;

      // Range filter
      if (rangeFrom && date < rangeFrom) continue;
      if (rangeTo && date > rangeTo) continue;

      const [sh, sm] = event.start_time.split(':').map(Number);
      const [eh, em] = event.end_time.split(':').map(Number);

      const startDt = new Date(date);
      startDt.setHours(sh, sm, 0, 0);
      const endDt = new Date(date);
      endDt.setHours(eh, em, 0, 0);

      results.push({
        id: uuid(),
        class_event_id: event.id,
        date: dateStr,
        start_datetime: startDt.toISOString(),
        end_datetime: endDt.toISOString(),
        status: 'scheduled',
        is_adhoc: false,
        subject_id: event.subject_id,
        title: event.title,
        location: event.location,
      });
    }
  }

  return results.sort((a, b) => a.start_datetime.localeCompare(b.start_datetime));
}

/**
 * Get today's date string.
 */
export function todayStr(): string {
  return toDateStr(new Date());
}

export function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Get the Monday of the current week.
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get all dates for a week starting from Monday.
 */
export function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
}

/**
 * Format time string for display.
 */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Day name abbreviations.
 */
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Time slots for timetable grid (7-21 = 7am to 9pm).
 */
export const TIME_SLOTS = Array.from({ length: 15 }, (_, i) => i + 7);
