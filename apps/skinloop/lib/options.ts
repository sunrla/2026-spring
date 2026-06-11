import type { ProductCategory, SkinGoal } from '@/types/skinloop';

export const skinGoalOptions: Array<{ value: SkinGoal; label: string }> = [
  { value: 'balance', label: '유수분 균형' },
  { value: 'hydration', label: '건조감 관찰' },
  { value: 'calm', label: '자극감 관찰' },
  { value: 'barrierCalm', label: '장벽 안정과 자극감 관찰' },
  { value: 'texture', label: '피부결 관리' },
  { value: 'routine', label: '꾸준한 루틴 만들기' },
];

export const productCategoryOptions: Array<{ value: ProductCategory; label: string }> = [
  { value: 'cleanser', label: '클렌저' },
  { value: 'toner', label: '토너/미스트' },
  { value: 'serum', label: '세럼/앰플' },
  { value: 'moisturizer', label: '보습제/크림' },
  { value: 'sunscreen', label: '선케어' },
  { value: 'mask', label: '마스크/팩' },
  { value: 'other', label: '기타' },
];

export const frequencyOptions = ['매일 2회', '매일 1회', '주 3-4회', '주 1-2회', '가끔 사용'];
