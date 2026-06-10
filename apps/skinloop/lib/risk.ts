import { tagKoreanLabels } from '@/data/ingredientRules';
import { collectTagsFromProducts } from '@/lib/ingredients';
import type { IngredientTag, Product, RoutineRiskResult, SkinProfile } from '@/types/skinloop';

const cautionIngredientTags: IngredientTag[] = [
  'fragrance-related',
  'exfoliating-acid',
  'potential-irritation-caution',
];

export function analyzeRoutine(profile: SkinProfile | null, products: Product[]): RoutineRiskResult {
  const tagCounts = collectTagsFromProducts(products);
  const cautionTags = cautionIngredientTags.filter((tag) => (tagCounts.get(tag) ?? 0) > 0);
  const explanations: string[] = [];
  let score = 0;

  if (!profile) {
    explanations.push('피부 설문 정보가 아직 없어 제품 성분 태그 중심으로만 확인했습니다.');
  } else {
    if (profile.sensitivity >= 4) {
      score += 2;
      explanations.push('민감도 점수가 높아 새 루틴 변경은 천천히 관찰하는 편이 안전합니다.');
    }

    if (profile.redness >= 4 || profile.breakouts >= 4) {
      score += 1;
      explanations.push('붉어짐 또는 트러블 관련 점수가 높아 반복 사용 패턴을 함께 보는 것이 좋습니다.');
    }

    if (profile.dryness >= 4 && tagCounts.has('moisturizing')) {
      explanations.push('보습 관련 성분이 포함되어 있어 건조감 기록과 함께 변화를 비교할 수 있습니다.');
    }
  }

  if (products.length === 0) {
    explanations.push('등록된 제품이 없어 루틴 위험도는 낮게 표시되지만, 실제 판단에는 제품 정보가 더 필요합니다.');
  }

  cautionTags.forEach((tag) => {
    score += tag === 'potential-irritation-caution' ? 2 : 1;
    explanations.push(`${tagKoreanLabels[tag]} 태그가 있어 입력된 정보 기준으로 주의가 필요할 수 있습니다.`);
  });

  if ((tagCounts.get('exfoliating-acid') ?? 0) >= 2) {
    score += 1;
    explanations.push('각질 케어 산 성분 태그가 여러 번 나타나 사용 빈도 확인이 필요할 수 있습니다.');
  }

  if (score >= 4) {
    return {
      level: 'Caution',
      summary: '입력된 정보 기준으로 주의가 필요할 수 있습니다.',
      explanations: [...explanations, '이 결과는 가능성 기반의 루틴 참고 정보이며 진단이 아닙니다.'],
      cautionTags,
    };
  }

  if (score >= 2) {
    return {
      level: 'Medium',
      summary: '몇 가지 루틴 요소는 관찰하면서 조정하는 것이 좋습니다.',
      explanations: [...explanations, '이 결과는 가능성 기반의 루틴 참고 정보이며 진단이 아닙니다.'],
      cautionTags,
    };
  }

  return {
    level: 'Low',
    summary: '현재 입력만으로는 큰 주의 신호가 많지 않습니다.',
    explanations: [...explanations, '이 결과는 가능성 기반의 루틴 참고 정보이며 진단이 아닙니다.'],
    cautionTags,
  };
}
