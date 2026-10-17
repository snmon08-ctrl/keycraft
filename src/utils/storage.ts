import { TestResult, UserPreferences, WeakKeyStat } from '../types/typing';

const STORAGE_KEYS = {
  RESULTS: 'keycraft_results_v1',
  PREFERENCES: 'keycraft_prefs_v1',
  WEAK_KEYS: 'keycraft_weak_keys_v1',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  soundEnabled: true,
  soundVolume: 0.35,
  smoothCaret: true,
  liveStats: true,
  showKeytips: true,
  punctuation: false,
  numbers: false,
};

export function getStoredResults(): TestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    if (!raw) return [];
    const list: TestResult[] = JSON.parse(raw);
    return list.map((r) => ({
      ...r,
      accuracy: r.accuracy <= 1 && r.accuracy > 0 ? Math.round(r.accuracy * 100) : r.accuracy,
    }));
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getStoredResults();
    const updated = [result, ...existing].slice(0, 100); // keep last 100 tests
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(updated));

    // Update aggregated weak keys
    updateAggregatedWeakKeys(result.keyErrors, result.keyAttempts);
  } catch (e) {
    console.error('Failed to save test result', e);
  }
}

function updateAggregatedWeakKeys(
  errors: Record<string, number>,
  attempts: Record<string, number>
): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEAK_KEYS);
    const existing: Record<string, { errors: number; attempts: number }> = raw ? JSON.parse(raw) : {};

    Object.keys(attempts).forEach((key) => {
      const lower = key.toLowerCase();
      if (!existing[lower]) {
        existing[lower] = { errors: 0, attempts: 0 };
      }
      existing[lower].attempts += attempts[key] || 0;
    });

    Object.keys(errors).forEach((key) => {
      const lower = key.toLowerCase();
      if (!existing[lower]) {
        existing[lower] = { errors: 0, attempts: 0 };
      }
      existing[lower].errors += errors[key] || 0;
    });

    localStorage.setItem(STORAGE_KEYS.WEAK_KEYS, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to update weak keys', e);
  }
}

export function getAggregatedWeakKeys(): WeakKeyStat[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WEAK_KEYS);
    if (!raw) return [];
    const data: Record<string, { errors: number; attempts: number }> = JSON.parse(raw);

    const stats: WeakKeyStat[] = Object.entries(data)
      .map(([key, val]) => {
        const errorRate = val.attempts > 0 ? (val.errors / val.attempts) * 100 : 0;
        return {
          key,
          errors: val.errors,
          attempts: val.attempts,
          errorRate: Math.round(errorRate * 10) / 10,
        };
      })
      .filter((s) => s.errors > 0)
      .sort((a, b) => b.errors - a.errors);

    return stats;
  } catch {
    return [];
  }
}

export function getPersonalBests(): Record<string, number> {
  const results = getStoredResults();
  const bests: Record<string, number> = {};

  results.forEach((r) => {
    const key = `${r.mode}_${r.modeConfig}`;
    if (!bests[key] || r.wpm > bests[key]) {
      bests[key] = Math.round(r.wpm);
    }
  });

  return bests;
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save preferences', e);
  }
}

export function clearAllStoredData(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
    localStorage.removeItem(STORAGE_KEYS.WEAK_KEYS);
  } catch (e) {
    console.error('Failed to clear data', e);
  }
}
