import type { WeeklyLog } from '@/types/skinloop';

export function skinScoreForLog(log: WeeklyLog) {
  const comfort =
    6 - log.drynessScore +
    6 - log.oilinessScore +
    6 - log.rednessScore +
    6 - log.irritationScore +
    6 - log.stressScore;
  const sleepBonus = Math.min(2, Math.max(0, log.sleepHours - 5));
  const breakoutPenalty = Math.min(4, log.breakoutCount);

  return Math.max(0, Math.round((comfort + sleepBonus - breakoutPenalty) * 4));
}

export function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export const sampleLogs: WeeklyLog[] = [
  {
    id: 'sample-1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    drynessScore: 4,
    oilinessScore: 3,
    rednessScore: 3,
    irritationScore: 4,
    breakoutCount: 2,
    sleepHours: 6,
    stressScore: 4,
    memo: '샘플 기록',
  },
  {
    id: 'sample-2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    drynessScore: 3,
    oilinessScore: 3,
    rednessScore: 2,
    irritationScore: 3,
    breakoutCount: 1,
    sleepHours: 7,
    stressScore: 3,
    memo: '샘플 기록',
  },
  {
    id: 'sample-3',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    drynessScore: 3,
    oilinessScore: 2,
    rednessScore: 2,
    irritationScore: 2,
    breakoutCount: 1,
    sleepHours: 7.5,
    stressScore: 2,
    memo: '샘플 기록',
  },
];
