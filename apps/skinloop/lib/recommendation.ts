import { getIngredientTagExplanations } from '@/lib/ingredients';
import type {
  IngredientTag,
  IngredientTagExplanation,
  Product,
  RecommendationStep,
  RoutineRecommendation,
  SkinProfile,
  WeeklyLog,
} from '@/types/skinloop';

type BuildRecommendationInput = {
  profile: SkinProfile | null;
  products: Product[];
  logs: WeeklyLog[];
  tagExplanations?: IngredientTagExplanation[];
};

const safetyNote =
  '이 추천은 로컬 MVP 룰 기반의 루틴 참고 정보이며 의학적 진단이나 치료를 제공하지 않습니다.';

export function buildRoutineRecommendation({
  profile,
  products,
  logs,
  tagExplanations,
}: BuildRecommendationInput): RoutineRecommendation {
  const explanations = tagExplanations ?? getIngredientTagExplanations(products.map((product) => product.ingredientText).join(', '));
  const tags = new Set<IngredientTag>(explanations.map((item) => item.tag));
  const recentLogs = [...logs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const averageIrritation = average(recentLogs.map((log) => log.irritationScore));
  const averageDryness = average(recentLogs.map((log) => log.drynessScore));
  const averageOiliness = average(recentLogs.map((log) => log.oilinessScore));

  const basisSummary = buildBasisSummary(profile, products, explanations, logs);
  const morningRoutine = buildMorningRoutine(profile, products, tags, averageDryness, averageOiliness);
  const eveningRoutine = buildEveningRoutine(profile, tags, averageIrritation, averageDryness);
  const avoidList = buildAvoidList(profile, products, tags, averageIrritation);
  const observationPlan = buildObservationPlan(profile, products, tags, logs);

  return {
    dataCompletenessScore: calculateCompletenessScore(profile, products, explanations, logs),
    basisSummary,
    morningRoutine,
    eveningRoutine,
    avoidList,
    observationPlan,
    reasonSummary: buildReasonSummary(profile, products, tags, recentLogs, averageIrritation, averageDryness),
    safetyNote,
    generatedAt: new Date().toISOString(),
  };
}

function buildBasisSummary(
  profile: SkinProfile | null,
  products: Product[],
  explanations: IngredientTagExplanation[],
  logs: WeeklyLog[],
) {
  const summary = [
    profile
      ? '피부 설문 프로필이 저장되어 루틴 기준으로 사용되었습니다.'
      : '피부 설문 프로필이 없어 추천 품질이 제한됩니다.',
    products.length
      ? `등록 제품 ${products.length}개와 성분 텍스트를 기준으로 확인했습니다.`
      : '등록 제품이 없어 현재 루틴 구성 확인이 제한됩니다.',
    explanations.length
      ? `감지된 성분 태그 ${explanations.length}개를 루틴 관찰 신호로 사용했습니다.`
      : '감지된 성분 태그가 없어 제품 성분 기반 안내가 제한됩니다.',
    logs.length
      ? `주간 로그 ${logs.length}개를 최근 피부 기록 참고 신호로 사용했습니다.`
      : '주간 로그가 없어 최근 변화 흐름은 반영하지 못했습니다.',
  ];

  return summary;
}

function buildMorningRoutine(
  profile: SkinProfile | null,
  products: Product[],
  tags: Set<IngredientTag>,
  averageDryness: number,
  averageOiliness: number,
): RecommendationStep[] {
  const steps: RecommendationStep[] = [
    {
      title: '가벼운 아침 세안으로 시작',
      description: '현재 입력 기준으로 아침에는 루틴 단계를 단순하게 시작하고 피부 느낌을 기록합니다.',
      reason: '아침 루틴을 짧게 유지하면 어떤 제품 변화가 피부 기록에 영향을 주는지 비교하기 쉽습니다.',
      relatedSignals: ['루틴 관찰', profile ? '설문 저장됨' : '설문 미입력'],
    },
  ];

  if ((profile?.dryness ?? 0) >= 4 || averageDryness >= 4 || tags.has('moisturizing')) {
    steps.push({
      title: '보습/장벽 보조 단계 관찰',
      description: '건조감 기록이 높거나 보습 관련 태그가 있어 보습 제품 사용 후 건조감 점수를 함께 봅니다.',
      reason: '건조감 신호가 있을 때는 제품을 늘리기보다 보습 단계와 기록 변화를 함께 확인하는 편이 좋습니다.',
      relatedSignals: ['건조감 신호', tags.has('moisturizing') ? 'moisturizing 태그' : '보습 태그 없음'],
    });
  } else {
    steps.push({
      title: '기본 보습 단계 유지',
      description: '현재 루틴에서 보습 단계가 있다면 동일한 사용량과 빈도로 기록을 이어갑니다.',
      reason: '변수를 줄이면 새 변화가 있을 때 비교가 쉬워집니다.',
      relatedSignals: ['루틴 일관성'],
    });
  }

  if ((profile?.oiliness ?? 0) >= 4 || averageOiliness >= 4) {
    steps.push({
      title: '가벼운 제형 위주로 레이어링',
      description: '유분감 점수가 높아 여러 겹을 빠르게 추가하기보다 가벼운 단계부터 관찰합니다.',
      reason: '유분감 기록이 높은 경우 루틴 단계를 늘릴수록 체감 변화가 섞일 수 있습니다.',
      relatedSignals: ['유분감 점수 높음'],
    });
  }

  if (!hasSunscreenSignal(products, tags)) {
    steps.push({
      title: '아침 선케어 등록 여부 확인',
      description: '등록 제품이나 성분 태그에서 선케어 신호가 없어 아침 루틴 기록에 선케어 여부를 추가해 봅니다.',
      reason: '선케어는 아침 루틴의 사용 습관을 확인하기 좋은 항목입니다.',
      relatedSignals: ['sunscreen 태그 없음', '선케어 제품 미등록 가능성'],
    });
  } else {
    steps.push({
      title: '선케어 사용 기록 유지',
      description: '선케어 관련 제품 또는 태그가 있어 아침 사용 여부를 주간 로그와 함께 확인합니다.',
      reason: '제품을 확정 평가하기보다 사용 일관성을 먼저 보는 데 도움이 됩니다.',
      relatedSignals: ['sunscreen 태그 또는 선케어 제품'],
    });
  }

  return steps;
}

function buildEveningRoutine(
  profile: SkinProfile | null,
  tags: Set<IngredientTag>,
  averageIrritation: number,
  averageDryness: number,
): RecommendationStep[] {
  const steps: RecommendationStep[] = [
    {
      title: '저녁에는 변화 제품을 하나만 선택',
      description: '현재 입력 기준으로 한 주에 하나의 루틴 변화만 관찰하는 방식을 권장합니다.',
      reason: '여러 제품을 동시에 바꾸면 어떤 신호가 어떤 변화와 연결되는지 보기 어렵습니다.',
      relatedSignals: ['루틴 실험', '사용자 기록'],
    },
  ];

  if ((profile?.sensitivity ?? 0) >= 4 || averageIrritation >= 4) {
    steps.push({
      title: '자극감 기록이 높은 날은 단계 줄이기',
      description: '기록된 자극감 점수가 높아 저녁 루틴에서 새 제품 추가를 늦추고 관찰 중심으로 운영합니다.',
      reason: '민감도 또는 자극감 신호가 높을 때는 천천히 바꾸는 편이 비교에 유리합니다.',
      relatedSignals: ['민감도/자극감 신호', `최근 평균 자극감 ${formatScore(averageIrritation)}`],
    });
  }

  if (tags.has('exfoliating-acid')) {
    steps.push({
      title: '각질 케어 태그 제품은 빈도 기록',
      description: '각질 케어 산 성분 태그가 감지되어 사용 요일과 체감 변화를 함께 기록합니다.',
      reason: '사용 빈도를 남기면 건조감, 자극감 기록과 비교하기 쉽습니다.',
      relatedSignals: ['exfoliating acid 태그'],
    });
  }

  if (averageDryness >= 4) {
    steps.push({
      title: '건조감 높은 주에는 보습 단계 고정',
      description: '최근 건조감 기록이 높아 보습 단계는 자주 바꾸지 않고 같은 방식으로 관찰합니다.',
      reason: '건조감이 높을 때 루틴을 자주 바꾸면 원인보다 변수가 늘어날 수 있습니다.',
      relatedSignals: [`최근 평균 건조감 ${formatScore(averageDryness)}`],
    });
  }

  return steps;
}

function buildAvoidList(
  profile: SkinProfile | null,
  products: Product[],
  tags: Set<IngredientTag>,
  averageIrritation: number,
): RecommendationStep[] {
  const items: RecommendationStep[] = [];

  if (!products.length) {
    items.push({
      title: '제품 등록 없이 루틴 판단 확정하기',
      description: '등록 제품이 없어 추천 범위가 제한됩니다. 현재 사용하는 제품부터 등록해 보세요.',
      reason: '제품 정보가 있어야 성분 태그와 루틴 구성을 함께 확인할 수 있습니다.',
      relatedSignals: ['등록 제품 없음'],
    });
  }

  if (tags.has('exfoliating-acid')) {
    items.push({
      title: '각질 케어/활성 성분을 한 번에 여러 개 추가하기',
      description: '각질 케어 산 성분 태그가 감지되어 중복 사용은 관찰 항목으로 분리하는 편이 좋습니다.',
      reason: '중복 변화는 건조감이나 자극감 기록 해석을 어렵게 만들 수 있습니다.',
      relatedSignals: ['exfoliating acid 태그'],
    });
  }

  if (tags.has('fragrance-related') && ((profile?.sensitivity ?? 0) >= 4 || (profile?.redness ?? 0) >= 4)) {
    items.push({
      title: '향 관련 태그 제품을 빠르게 늘리기',
      description: '향 관련 태그와 높은 민감도/붉어짐 신호가 함께 있어 신규 도입 시 관찰을 권장합니다.',
      reason: '제품 적합성을 확정하지 않고 사용자 기록과 함께 확인하기 위한 안내입니다.',
      relatedSignals: ['fragrance-related 태그', '민감도 또는 붉어짐 점수 높음'],
    });
  }

  if ((profile?.sensitivity ?? 0) >= 4 || averageIrritation >= 4) {
    items.push({
      title: '자극감 높은 주에 새 제품 여러 개 시작하기',
      description: '기록된 자극감 점수가 높아 새 제품은 하나씩 천천히 관찰하는 편이 좋습니다.',
      reason: '변경 항목을 줄이면 사용자 기록과 함께 확인하기 쉽습니다.',
      relatedSignals: ['자극감 관찰', `최근 평균 자극감 ${formatScore(averageIrritation)}`],
    });
  }

  if (!items.length) {
    items.push({
      title: '루틴 변화를 기록 없이 진행하기',
      description: '현재 큰 주의 신호가 많지 않더라도 사용 빈도와 피부 기록을 함께 남기는 편이 좋습니다.',
      reason: '기록이 있어야 다음 추천의 데이터 완성도가 올라갑니다.',
      relatedSignals: ['기록 기반 추천'],
    });
  }

  return items;
}

function buildObservationPlan(
  profile: SkinProfile | null,
  products: Product[],
  tags: Set<IngredientTag>,
  logs: WeeklyLog[],
) {
  const plan = [
    '1일차: 현재 루틴을 그대로 사용하고 건조감, 유분감, 붉어짐, 자극감 기준점을 기록합니다.',
    '2-3일차: 새 제품을 추가하지 않고 같은 사용 빈도를 유지하며 변화 메모를 남깁니다.',
    '4-5일차: 바꾸고 싶은 제품이 있다면 하나만 선택하고 사용 시간과 양을 기록합니다.',
    '6일차: 주간 로그에 수면 시간과 스트레스 점수를 함께 입력합니다.',
    '7일차: 제품별 사용 빈도와 피부 기록을 비교하고 다음 주에 유지할 항목을 정합니다.',
  ];

  if (!profile) {
    plan.unshift('시작 전: 설문을 저장하면 추천 기준이 더 분명해집니다.');
  }

  if (!products.length) {
    plan.unshift('시작 전: 현재 사용하는 제품을 먼저 등록하면 제품 태그 기반 관찰이 가능합니다.');
  }

  if (tags.has('fragrance-related') || tags.has('exfoliating-acid')) {
    plan.push('추가 관찰: 향 관련 또는 각질 케어 태그가 있는 제품은 사용 요일을 따로 메모합니다.');
  }

  if (!logs.length) {
    plan.push('다음 단계: 최소 1개의 주간 로그를 저장하면 다음 추천에서 최근 기록이 반영됩니다.');
  }

  return plan;
}

function buildReasonSummary(
  profile: SkinProfile | null,
  products: Product[],
  tags: Set<IngredientTag>,
  recentLogs: WeeklyLog[],
  averageIrritation: number,
  averageDryness: number,
) {
  const reasons = [];

  if (!profile) {
    reasons.push('설문 정보가 없어 기본 루틴 관찰 중심으로 구성했습니다');
  } else {
    reasons.push(
      `설문 기준 건조감 ${profile.dryness}/5, 유분감 ${profile.oiliness}/5, 민감도 ${profile.sensitivity}/5를 반영했습니다`,
    );
  }

  if (!products.length) {
    reasons.push('등록 제품이 없어 제품 기반 추천은 제한됩니다');
  } else {
    reasons.push(`등록 제품 ${products.length}개와 감지 태그 ${tags.size}개를 반영했습니다`);
  }

  if (recentLogs.length) {
    reasons.push(
      `최근 로그 기준 평균 자극감은 ${formatScore(averageIrritation)}, 평균 건조감은 ${formatScore(averageDryness)}입니다`,
    );
  } else {
    reasons.push('주간 로그가 없어 최근 변화 추세는 반영하지 못했습니다');
  }

  return `현재 입력 기준으로는 ${reasons.join('. ')}. 제품 적합성을 확정하지 않으며, 루틴 관리를 위한 참고 정보입니다.`;
}

function calculateCompletenessScore(
  profile: SkinProfile | null,
  products: Product[],
  explanations: IngredientTagExplanation[],
  logs: WeeklyLog[],
) {
  const score =
    (profile ? 30 : 0) +
    Math.min(30, products.length * 10) +
    Math.min(20, explanations.length * 4) +
    Math.min(20, logs.length * 5);

  return Math.min(100, score);
}

function hasSunscreenSignal(products: Product[], tags: Set<IngredientTag>) {
  return tags.has('sunscreen') || products.some((product) => product.category === 'sunscreen');
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function formatScore(value: number) {
  if (!value) return '기록 없음';
  return `${value.toFixed(1)}/5`;
}
