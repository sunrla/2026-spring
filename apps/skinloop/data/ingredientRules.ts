import type { IngredientCautionLevel, IngredientEvidenceStatus, IngredientTag } from '@/types/skinloop';

export type IngredientRule = {
  tag: IngredientTag;
  label: string;
  labelKo: string;
  shortDescriptionKo: string;
  routineMeaningKo: string;
  cautionLevel: IngredientCautionLevel;
  evidenceStatus: IngredientEvidenceStatus;
  sourceLabel: 'MVP 데모 룰';
  disclaimerKo: string;
  keywords: string[];
};

const sharedDisclaimer = '이 정보는 루틴 관리를 위한 참고 정보이며 의학적 진단이나 치료를 제공하지 않습니다.';

export const ingredientRules: IngredientRule[] = [
  {
    tag: 'fragrance-related',
    label: 'fragrance-related',
    labelKo: '향 관련 성분',
    shortDescriptionKo: '향료 또는 향 성분으로 분류되는 성분이 포함되어 있습니다.',
    routineMeaningKo: '민감도나 자극감 기록이 높은 사용자는 신규 도입 시 주의해서 관찰할 수 있습니다.',
    cautionLevel: 'medium',
    evidenceStatus: 'demo-rule',
    sourceLabel: 'MVP 데모 룰',
    disclaimerKo: sharedDisclaimer,
    keywords: ['fragrance', 'parfum', '향료', 'linalool', 'limonene', 'citronellol', 'geraniol'],
  },
  {
    tag: 'exfoliating-acid',
    label: 'exfoliating acid',
    labelKo: '각질 케어 산 성분',
    shortDescriptionKo: 'AHA, BHA, PHA처럼 각질 케어 목적으로 자주 분류되는 산 성분이 감지되었습니다.',
    routineMeaningKo: '사용 빈도와 다른 활성 성분의 중복 여부를 함께 보며 루틴 변화를 천천히 관찰할 수 있습니다.',
    cautionLevel: 'caution',
    evidenceStatus: 'demo-rule',
    sourceLabel: 'MVP 데모 룰',
    disclaimerKo: sharedDisclaimer,
    keywords: ['aha', 'bha', 'pha', 'salicylic acid', 'glycolic acid', 'lactic acid', '살리실산', '글리콜릭', '락틱'],
  },
  {
    tag: 'moisturizing',
    label: 'moisturizing',
    labelKo: '보습 관련 성분',
    shortDescriptionKo: '수분감 또는 피부 장벽 루틴에서 자주 언급되는 보습 관련 성분이 포함되어 있습니다.',
    routineMeaningKo: '건조감 점수와 함께 기록하면 보습 루틴의 체감 변화를 비교하는 데 도움이 될 수 있습니다.',
    cautionLevel: 'low',
    evidenceStatus: 'demo-rule',
    sourceLabel: 'MVP 데모 룰',
    disclaimerKo: sharedDisclaimer,
    keywords: ['glycerin', 'hyaluronic acid', 'ceramide', 'panthenol', 'squalane', '글리세린', '히알루론산', '세라마이드', '판테놀'],
  },
  {
    tag: 'sunscreen',
    label: 'sunscreen',
    labelKo: '자외선 차단 관련 성분',
    shortDescriptionKo: '선케어 제품에서 자주 쓰이는 자외선 차단 관련 성분이 감지되었습니다.',
    routineMeaningKo: '아침 루틴과 사용 빈도 기록을 함께 보면 선케어 습관을 점검하는 데 도움이 됩니다.',
    cautionLevel: 'low',
    evidenceStatus: 'demo-rule',
    sourceLabel: 'MVP 데모 룰',
    disclaimerKo: sharedDisclaimer,
    keywords: ['zinc oxide', 'titanium dioxide', 'uv filter', 'ethylhexyl methoxycinnamate', '징크옥사이드', '티타늄디옥사이드'],
  },
  {
    tag: 'preservative',
    label: 'preservative',
    labelKo: '보존 성분',
    shortDescriptionKo: '화장품 보존 목적으로 자주 분류되는 성분이 포함되어 있습니다.',
    routineMeaningKo: '대부분의 제품에서 흔히 볼 수 있는 태그이며, 다른 태그와 함께 루틴 맥락을 확인하는 참고 정보입니다.',
    cautionLevel: 'low',
    evidenceStatus: 'demo-rule',
    sourceLabel: 'MVP 데모 룰',
    disclaimerKo: sharedDisclaimer,
    keywords: ['phenoxyethanol', 'ethylhexylglycerin', 'paraben', 'sodium benzoate', '페녹시에탄올', '파라벤'],
  },
  {
    tag: 'potential-irritation-caution',
    label: 'potential irritation caution',
    labelKo: '자극 가능성 주의',
    shortDescriptionKo: '일부 사용자에게 자극감 관찰 포인트가 될 수 있는 성분 키워드가 감지되었습니다.',
    routineMeaningKo: '새 제품 도입 시 한 번에 여러 제품을 바꾸지 않고 사용자 기록과 함께 확인하는 방식이 적절합니다.',
    cautionLevel: 'caution',
    evidenceStatus: 'demo-rule',
    sourceLabel: 'MVP 데모 룰',
    disclaimerKo: sharedDisclaimer,
    keywords: ['retinol', 'retinal', 'alcohol denat', 'menthol', 'peppermint', 'essential oil', '레티놀', '멘톨', '에탄올'],
  },
];

export const tagLabels: Record<IngredientTag, string> = Object.fromEntries(
  ingredientRules.map((rule) => [rule.tag, rule.label]),
) as Record<IngredientTag, string>;

export const tagKoreanLabels: Record<IngredientTag, string> = Object.fromEntries(
  ingredientRules.map((rule) => [rule.tag, rule.labelKo]),
) as Record<IngredientTag, string>;
