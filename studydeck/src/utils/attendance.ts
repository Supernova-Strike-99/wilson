import type { AttendanceRecord, AttendanceStatus, AttendanceSummary, Occurrence, Subject } from '../types';

/**
 * Attendance % formula:
 * (present + late × 0.5 + excused) / total × 100
 */
export function calcAttendancePercent(records: AttendanceRecord[]): number {
  if (records.length === 0) return 100;
  let score = 0;
  for (const r of records) {
    if (r.status === 'present') score += 1;
    else if (r.status === 'late') score += 0.5;
    else if (r.status === 'excused') score += 1;
    // absent = 0
  }
  return Math.round((score / records.length) * 100 * 10) / 10;
}

/**
 * Get color band for percentage.
 */
export function getPctClass(pct: number, threshold = 75): string {
  if (pct >= 85) return 'pct-green';
  if (pct >= threshold) return 'pct-yellow';
  return 'pct-red';
}

/**
 * Calculate how many more classes can be missed before dropping below threshold.
 */
export function safeToMiss(records: AttendanceRecord[], upcomingCount: number, threshold = 75): number {
  const total = records.length + upcomingCount;
  if (total === 0) return 0;

  let currentScore = 0;
  for (const r of records) {
    if (r.status === 'present') currentScore += 1;
    else if (r.status === 'late') currentScore += 0.5;
    else if (r.status === 'excused') currentScore += 1;
  }

  // If we attend all future classes, our score = currentScore + upcomingCount
  // We need (currentScore + upcomingCount - X) / total >= threshold/100
  // X <= currentScore + upcomingCount - total * threshold/100
  const maxMiss = Math.floor(currentScore + upcomingCount - total * (threshold / 100));
  return Math.max(0, maxMiss);
}

/**
 * Build per-subject attendance summaries.
 */
export function buildAttendanceSummaries(
  subjects: Subject[],
  occurrences: Occurrence[],
  records: AttendanceRecord[],
  threshold = 75,
): AttendanceSummary[] {
  const occBySubject = new Map<string, Occurrence[]>();
  for (const o of occurrences) {
    if (o.status === 'cancelled') continue;
    const sid = o.subject_id || '';
    if (!occBySubject.has(sid)) occBySubject.set(sid, []);
    occBySubject.get(sid)!.push(o);
  }

  const recByOcc = new Map<string, AttendanceRecord>();
  for (const r of records) {
    recByOcc.set(r.occurrence_id, r);
  }

  return subjects
    .filter((s) => !s.archived)
    .map((s) => {
      const subOccs = occBySubject.get(s.id) || [];
      const subRecords = subOccs
        .map((o) => recByOcc.get(o.id))
        .filter(Boolean) as AttendanceRecord[];
      const pct = calcAttendancePercent(subRecords);
      const counts = { present: 0, absent: 0, late: 0, excused: 0 };
      for (const r of subRecords) counts[r.status]++;

      return {
        subject_id: s.id,
        subject_title: s.title,
        subject_color: s.color,
        subject_emoji: s.emoji,
        total: subRecords.length,
        ...counts,
        percentage: pct,
        safe_to_miss: safeToMiss(subRecords, Math.max(0, subOccs.length - subRecords.length), threshold),
      };
    });
}

/**
 * Filter records in date range.
 */
export function filterByDateRange(records: AttendanceRecord[], from: string, to: string): AttendanceRecord[] {
  return records.filter((r) => r.marked_at >= from && r.marked_at <= to);
}

export function statusLabel(s: AttendanceStatus): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
