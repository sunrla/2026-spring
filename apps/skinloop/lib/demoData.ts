import { readLocal, storageKeys, writeLocal } from '@/lib/storage';
import type { Product, SkinProfile, WeeklyLog } from '@/types/skinloop';

const weekInMs = 1000 * 60 * 60 * 24 * 7;

const demoProductIds = ['demo-product-toner', 'demo-product-cream', 'demo-product-serum'];
const demoLogIds = ['demo-log-week-1', 'demo-log-week-2', 'demo-log-week-3', 'demo-log-week-4'];

export const skinLoopStorageKeys = [
  storageKeys.profile,
  storageKeys.products,
  storageKeys.logs,
] as const;

export function seedDemoData() {
  const now = Date.now();
  const updatedAt = new Date(now).toISOString();

  const profile: SkinProfile = {
    dryness: 4,
    oiliness: 3,
    sensitivity: 4,
    redness: 3,
    breakouts: 3,
    mainGoal: 'barrierCalm',
    updatedAt,
  };

  const products: Product[] = [
    {
      id: 'demo-product-toner',
      name: 'Demo Lab 진정 토너',
      brand: 'Demo Lab',
      category: 'toner',
      ingredientText: 'Water, Glycerin, Panthenol, Fragrance, Limonene, Phenoxyethanol',
      frequency: '매일 1회',
      createdAt: new Date(now - weekInMs * 3).toISOString(),
      dataSource: 'sample',
      verificationStatus: 'needs-user-review',
      catalogProductId: 'sample-calm-toner',
    },
    {
      id: 'demo-product-cream',
      name: 'SkinLoop 장벽 수분 크림',
      brand: 'SkinLoop Lab',
      category: 'moisturizer',
      ingredientText: 'Water, Glycerin, Ceramide NP, Squalane, Sodium Benzoate',
      frequency: '매일 1회',
      createdAt: new Date(now - weekInMs * 2).toISOString(),
      dataSource: 'sample',
      verificationStatus: 'needs-user-review',
      catalogProductId: 'sample-barrier-cream',
    },
    {
      id: 'demo-product-serum',
      name: 'Routine Lab 각질 케어 세럼',
      brand: 'Routine Lab',
      category: 'serum',
      ingredientText: 'Water, Glycerin, Salicylic Acid, Niacinamide, Phenoxyethanol',
      frequency: '주 2회',
      createdAt: new Date(now - weekInMs).toISOString(),
      dataSource: 'sample',
      verificationStatus: 'needs-user-review',
    },
  ];

  const logs: WeeklyLog[] = [
    {
      id: 'demo-log-week-4',
      createdAt: new Date(now).toISOString(),
      drynessScore: 3,
      oilinessScore: 3,
      rednessScore: 2,
      irritationScore: 2,
      breakoutCount: 1,
      sleepHours: 7.5,
      stressScore: 2,
      memo: '보습 단계는 유지하고 각질 케어 세럼은 정해진 요일에만 사용했습니다.',
    },
    {
      id: 'demo-log-week-3',
      createdAt: new Date(now - weekInMs).toISOString(),
      drynessScore: 3,
      oilinessScore: 3,
      rednessScore: 3,
      irritationScore: 3,
      breakoutCount: 1,
      sleepHours: 7,
      stressScore: 3,
      memo: '새 제품을 추가하지 않고 사용 빈도를 일정하게 유지했습니다.',
    },
    {
      id: 'demo-log-week-2',
      createdAt: new Date(now - weekInMs * 2).toISOString(),
      drynessScore: 4,
      oilinessScore: 3,
      rednessScore: 3,
      irritationScore: 3,
      breakoutCount: 2,
      sleepHours: 6.5,
      stressScore: 3,
      memo: '향 관련 태그가 있는 토너 사용 후 자극감 점수를 함께 기록했습니다.',
    },
    {
      id: 'demo-log-week-1',
      createdAt: new Date(now - weekInMs * 3).toISOString(),
      drynessScore: 4,
      oilinessScore: 3,
      rednessScore: 4,
      irritationScore: 4,
      breakoutCount: 3,
      sleepHours: 6,
      stressScore: 4,
      memo: '발표용 기준 주차입니다. 기존 루틴을 유지하며 첫 기록을 저장했습니다.',
    },
  ];

  writeLocal(storageKeys.profile, profile);
  writeLocal(storageKeys.products, products);
  writeLocal(storageKeys.logs, logs);
}

export function clearDemoData() {
  if (typeof window === 'undefined') return;

  skinLoopStorageKeys.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

export function hasDemoData() {
  const profile = readLocal<SkinProfile | null>(storageKeys.profile, null);
  const products = readLocal<Product[]>(storageKeys.products, []);
  const logs = readLocal<WeeklyLog[]>(storageKeys.logs, []);

  return Boolean(
    profile?.mainGoal === 'barrierCalm' ||
      products.some((product) => demoProductIds.includes(product.id)) ||
      logs.some((log) => demoLogIds.includes(log.id)),
  );
}
