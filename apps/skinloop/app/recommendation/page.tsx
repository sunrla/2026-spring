'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { collectTagsFromProducts } from '@/lib/ingredients';
import { readLocal, storageKeys } from '@/lib/storage';
import type { Product, SkinProfile } from '@/types/skinloop';

function buildMockRecommendation(profile: SkinProfile | null, products: Product[]) {
  const tags = collectTagsFromProducts(products);
  const avoidList = [
    '동시에 여러 제품을 바꾸기',
    '자극감이 느껴지는 날 각질 케어 제품을 추가하기',
  ];

  if ((tags.get('fragrance-related') ?? 0) > 0) {
    avoidList.push('향 관련 태그가 있는 제품을 한 번에 여러 개 겹쳐 쓰기');
  }

  if ((tags.get('exfoliating-acid') ?? 0) > 0) {
    avoidList.push('각질 케어 산 성분 제품을 매일 여러 단계에 반복하기');
  }

  if (profile?.sensitivity && profile.sensitivity >= 4) {
    avoidList.push('민감도 점수가 높은 주에 새 제품을 빠르게 늘리기');
  }

  return {
    morning: [
      '순한 세안 또는 물 세안으로 시작',
      '가벼운 보습 제품으로 건조감 기록과 비교',
      '자외선 차단 제품 사용 여부를 매일 체크',
    ],
    evening: [
      '하루 동안 사용한 선케어와 메이크업을 부드럽게 세정',
      '현재 루틴에서 하나의 변화만 선택해 1주 단위로 관찰',
      '건조감이나 자극감이 높게 기록된 날은 루틴 단계를 줄여 비교',
    ],
    avoidList,
    reasonSummary:
      '현재 설문과 제품 태그를 기준으로, 루틴 변화는 한 번에 하나씩 적용하고 주간 로그로 변화를 확인하는 방식이 MVP 기준 추천 방향입니다.',
  };
}

export default function RecommendationPage() {
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProfile(readLocal<SkinProfile | null>(storageKeys.profile, null));
    setProducts(readLocal<Product[]>(storageKeys.products, []));
  }, []);

  const recommendation = useMemo(() => buildMockRecommendation(profile, products), [profile, products]);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Mock recommendation"
        title="AI 루틴 추천 Mock"
        description="실제 AI API를 호출하지 않는 데모 결과입니다. 루틴 참고 정보이며 의학적 조언이 아닙니다."
      >
        <Badge tone="blue">No external API</Badge>
      </SectionHeader>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-loop-ink">아침 루틴</h2>
            <Badge tone="green">Morning</Badge>
          </div>
          <ol className="mt-5 space-y-3">
            {recommendation.morning.map((item, index) => (
              <li key={item} className="flex gap-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-black text-loop-leaf ring-1 ring-slate-200">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-loop-ink">저녁 루틴</h2>
            <Badge tone="blue">Evening</Badge>
          </div>
          <ol className="mt-5 space-y-3">
            {recommendation.evening.map((item, index) => (
              <li key={item} className="flex gap-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-black text-loop-leaf ring-1 ring-slate-200">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="text-xl font-black text-loop-ink">피하면 좋은 사용 패턴</h2>
          <ul className="mt-5 space-y-3">
            {recommendation.avoidList.map((item) => (
              <li key={item} className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-900">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-loop-ink">추천 이유 요약</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">{recommendation.reasonSummary}</p>
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-800">
            이 화면은 루틴 가이드를 위한 mock 결과입니다. 의학적 진단, 치료, 처방을 제공하지 않습니다.
          </p>
          <Link
            href="/logs"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-loop-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            주간 기록 남기기
          </Link>
        </Card>
      </div>
    </div>
  );
}
