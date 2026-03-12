import { describe, it, expect } from 'vitest';
import { calcAttendancePercent, safeToMiss, getPctClass, filterByDateRange } from '../attendance';
import type { AttendanceRecord } from '../../types';

function makeRecord(status: 'present' | 'absent' | 'late' | 'excused', occId = 'occ-1'): AttendanceRecord {
  return { id: `att-${Math.random()}`, occurrence_id: occId, user_id: 'u1', status, marked_at: '2026-02-01T00:00:00Z', note: '' };
}

describe('calcAttendancePercent', () => {
  it('returns 100% for empty records', () => {
    expect(calcAttendancePercent([])).toBe(100);
  });

  it('returns 100% for all present', () => {
    const records = [makeRecord('present'), makeRecord('present'), makeRecord('present')];
    expect(calcAttendancePercent(records)).toBe(100);
  });

  it('returns 0% for all absent', () => {
    const records = [makeRecord('absent'), makeRecord('absent'), makeRecord('absent')];
    expect(calcAttendancePercent(records)).toBe(0);
  });

  it('returns 100% for all excused', () => {
    const records = [makeRecord('excused'), makeRecord('excused')];
    expect(calcAttendancePercent(records)).toBe(100);
  });

  it('counts late as 0.5', () => {
    // 2 late out of 2 => (0.5 + 0.5) / 2 = 50%
    const records = [makeRecord('late'), makeRecord('late')];
    expect(calcAttendancePercent(records)).toBe(50);
  });

  it('calculates mixed statuses correctly', () => {
    // 1 present (1) + 1 late (0.5) + 1 absent (0) + 1 excused (1) = 2.5 / 4 = 62.5%
    const records = [makeRecord('present'), makeRecord('late'), makeRecord('absent'), makeRecord('excused')];
    expect(calcAttendancePercent(records)).toBe(62.5);
  });

  it('handles single present', () => {
    expect(calcAttendancePercent([makeRecord('present')])).toBe(100);
  });

  it('handles single absent', () => {
    expect(calcAttendancePercent([makeRecord('absent')])).toBe(0);
  });
});

describe('safeToMiss', () => {
  it('returns 0 for no records and no upcoming', () => {
    expect(safeToMiss([], 0, 75)).toBe(0);
  });

  it('calculates correctly with all present and 5 upcoming at 75%', () => {
    const records = [makeRecord('present'), makeRecord('present'), makeRecord('present')];
    // Total = 3 + 5 = 8. current score = 3. Score with all upcoming = 3 + 5 = 8.
    // Need (8 - X) / 8 >= 0.75 => X <= 8 - 6 = 2
    expect(safeToMiss(records, 5, 75)).toBe(2);
  });

  it('returns 0 when already below threshold', () => {
    const records = [makeRecord('absent'), makeRecord('absent'), makeRecord('absent'), makeRecord('absent')];
    // Score = 0, total = 4+1 = 5. Need (0+1-X)/5 >= 0.75 => 1-X >= 3.75 => X <= -2.75 → 0
    expect(safeToMiss(records, 1, 75)).toBe(0);
  });

  it('handles edge case: all excused', () => {
    const records = [makeRecord('excused'), makeRecord('excused')];
    // Score = 2, total = 2+3 = 5. Score+upcoming = 2+3 = 5. Need (5-X)/5 >= 0.75 => X <= 1.25 → 1
    expect(safeToMiss(records, 3, 75)).toBe(1);
  });
});

describe('getPctClass', () => {
  it('returns green for >= 85', () => {
    expect(getPctClass(85)).toBe('pct-green');
    expect(getPctClass(100)).toBe('pct-green');
  });

  it('returns yellow for 75-84', () => {
    expect(getPctClass(75)).toBe('pct-yellow');
    expect(getPctClass(84)).toBe('pct-yellow');
  });

  it('returns red for < 75', () => {
    expect(getPctClass(74)).toBe('pct-red');
    expect(getPctClass(0)).toBe('pct-red');
  });
});

describe('filterByDateRange', () => {
  it('filters records within range', () => {
    const records = [
      { ...makeRecord('present'), marked_at: '2026-01-15T00:00:00Z' },
      { ...makeRecord('present'), marked_at: '2026-02-01T00:00:00Z' },
      { ...makeRecord('present'), marked_at: '2026-02-15T00:00:00Z' },
      { ...makeRecord('present'), marked_at: '2026-03-01T00:00:00Z' },
    ];
    const result = filterByDateRange(records, '2026-02-01', '2026-02-28');
    expect(result.length).toBe(2);
  });
});
