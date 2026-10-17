export type TestMode = 'time' | 'words' | 'quote' | 'custom' | 'weak';

export type TimeOption = 15 | 30 | 60 | 120;
export type WordCountOption = 10 | 25 | 50 | 100;
export type QuoteLengthOption = 'short' | 'medium' | 'long';

export interface Quote {
  id: string;
  text: string;
  author: string;
  source?: string;
  length: QuoteLengthOption;
}

export interface WpmSample {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  mode: TestMode;
  modeConfig: string; // e.g. "30s", "50 words", "Quote", "Weak Drill"
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  duration: number; // in seconds
  correctChars: number;
  errorChars: number;
  extraChars: number;
  missedChars: number;
  wpmSamples: WpmSample[];
  keyErrors: Record<string, number>;
  keyAttempts: Record<string, number>;
}

export interface WeakKeyStat {
  key: string;
  errors: number;
  attempts: number;
  errorRate: number; // 0 to 100
}

export interface UserPreferences {
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  smoothCaret: boolean;
  liveStats: boolean;
  showKeytips: boolean;
  punctuation: boolean;
  numbers: boolean;
}
