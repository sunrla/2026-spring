import type { IngredientTag } from '@/types/skinloop';

export type IngredientRule = {
  tag: IngredientTag;
  label: string;
  keywords: string[];
};

export const ingredientRules: IngredientRule[] = [
  {
    tag: 'fragrance-related',
    label: '향 관련',
    keywords: ['fragrance', 'parfum', '향료', 'linalool', 'limonene', 'citronellol', 'geraniol'],
  },
  {
    tag: 'exfoliating-acid',
    label: '각질 케어 산 성분',
    keywords: ['aha', 'bha', 'pha', 'salicylic acid', 'glycolic acid', 'lactic acid', '살리실산', '글리콜릭', '락틱'],
  },
  {
    tag: 'moisturizing',
    label: '보습 관련',
    keywords: ['glycerin', 'hyaluronic acid', 'ceramide', 'panthenol', 'squalane', '글리세린', '히알루론산', '세라마이드', '판테놀'],
  },
  {
    tag: 'sunscreen',
    label: '자외선 차단 관련',
    keywords: ['zinc oxide', 'titanium dioxide', 'uv filter', 'ethylhexyl methoxycinnamate', '징크옥사이드', '티타늄디옥사이드'],
  },
  {
    tag: 'preservative',
    label: '보존 성분',
    keywords: ['phenoxyethanol', 'ethylhexylglycerin', 'paraben', 'sodium benzoate', '페녹시에탄올', '파라벤'],
  },
  {
    tag: 'potential-irritation-caution',
    label: '자극 가능성 주의',
    keywords: ['retinol', 'retinal', 'alcohol denat', 'menthol', 'peppermint', 'essential oil', '레티놀', '멘톨', '에탄올'],
  },
];

export const tagLabels: Record<IngredientTag, string> = {
  'fragrance-related': 'fragrance-related',
  'exfoliating-acid': 'exfoliating acid',
  moisturizing: 'moisturizing',
  sunscreen: 'sunscreen',
  preservative: 'preservative',
  'potential-irritation-caution': 'potential irritation caution',
};

export const tagKoreanLabels: Record<IngredientTag, string> = {
  'fragrance-related': '향 관련',
  'exfoliating-acid': '각질 케어 산 성분',
  moisturizing: '보습 관련',
  sunscreen: '자외선 차단 관련',
  preservative: '보존 성분',
  'potential-irritation-caution': '자극 가능성 주의',
};
