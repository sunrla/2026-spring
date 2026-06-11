'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { getIngredientTagExplanations } from '@/lib/ingredients';
import { buildRoutineRecommendation } from '@/lib/recommendation';
import { readLocal, storageKeys } from '@/lib/storage';
import type { Product, RecommendationStep, RoutineRecommendation, SkinProfile, WeeklyLog } from '@/types/skinloop';

export default function RecommendationPage() {
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<WeeklyLog[]>([]);

  useEffect(() => {
    setProfile(readLocal<SkinProfile | null>(storageKeys.profile, null));
    setProducts(readLocal<Product[]>(storageKeys.products, []));
    setLogs(readLocal<WeeklyLog[]>(storageKeys.logs, []));
  }, []);

  const recommendation = useMemo(
    () => buildRoutineRecommendation({ profile, products, logs }),
    [profile, products, logs],
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Routine recommendation"
        title="입력 기반 루틴 추천 v1"
        description="설문, 등록 제품, 감지 성분 태그, 주간 로그를 바탕으로 로컬 MVP 룰이 생성한 루틴 참고 정보입니다."
      >
        <Badge tone="blue">Local rule-based MVP</Badge>
      </SectionHeader>

      <BasisCards
        profile={profile}
        products={products}
        logs={logs}
        recommendation={recommendation}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <RoutineCard title="아침 루틴" badge="Morning" badgeTone="green" steps={recommendation.morningRoutine} />
        <RoutineCard title="저녁 루틴" badge="Evening" badgeTone="blue" steps={recommendation.eveningRoutine} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <RoutineCard title="피하거나 관찰할 항목" badge="Avoid / observe" badgeTone="amber" steps={recommendation.avoidList} />

        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-black text-loop-ink">1주 관찰 계획</h2>
            <Badge tone="green">1 week</Badge>
          </div>
          <ol className="mt-5 space-y-3">
            {recommendation.observationPlan.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-3 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-black text-loop-leaf ring-1 ring-slate-200">
                  {index + 1}
                </span>
                {item}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <h2 className="text-xl font-black text-loop-ink">추천 이유 요약</h2>
          <p className="mt-4 text-sm leading-7 text-slate-700">{recommendation.reasonSummary}</p>
          <div className="mt-5">
            <h3 className="text-sm font-bold text-slate-700">사용된 기준</h3>
            <ul className="mt-3 space-y-2">
              {recommendation.basisSummary.map((item) => (
                <li key={item} className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-loop-ink">안전 안내</h2>
          <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 p-4 text-sm font-semibold leading-6 text-rose-800">
            {recommendation.safetyNote}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            제품 적합성을 확정하지 않으며, 사용자 기록과 함께 확인하는 루틴 관찰용 참고 정보입니다.
          </p>
          <p className="mt-4 text-xs font-semibold text-slate-500">
            생성 시각: {new Date(recommendation.generatedAt).toLocaleString('ko-KR')}
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

function BasisCards({
  profile,
  products,
  logs,
  recommendation,
}: {
  profile: SkinProfile | null;
  products: Product[];
  logs: WeeklyLog[];
  recommendation: RoutineRecommendation;
}) {
  const detectedTagCount = getIngredientTagExplanations(
    products.map((product) => product.ingredientText).join(', '),
  ).length;

  const cards = [
    { label: '설문 저장 여부', value: profile ? '저장됨' : '미입력', tone: profile ? 'green' : 'amber' },
    { label: '등록 제품 수', value: `${products.length}개`, tone: products.length ? 'green' : 'amber' },
    { label: '감지 태그 수', value: `${detectedTagCount}개`, tone: detectedTagCount ? 'green' : 'slate' },
    { label: '주간 로그 수', value: `${logs.length}개`, tone: logs.length ? 'green' : 'slate' },
    { label: '데이터 완성도', value: `${recommendation.dataCompletenessScore}%`, tone: completenessTone(recommendation.dataCompletenessScore) },
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.label}>
          <p className="text-sm font-bold text-slate-500">{card.label}</p>
          <div className="mt-3">
            <Badge tone={card.tone}>{card.value}</Badge>
          </div>
        </Card>
      ))}
    </div>
  );
}

function RoutineCard({
  title,
  badge,
  badgeTone,
  steps,
}: {
  title: string;
  badge: string;
  badgeTone: 'green' | 'amber' | 'blue';
  steps: RecommendationStep[];
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-loop-ink">{title}</h2>
        <Badge tone={badgeTone}>{badge}</Badge>
      </div>
      <div className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <article key={`${step.title}-${index}`} className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <div className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-black text-loop-leaf ring-1 ring-slate-200">
                {index + 1}
              </span>
              <div>
                <h3 className="text-base font-black text-loop-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{step.description}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">이유: {step.reason}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {step.relatedSignals.map((signal) => (
                    <Badge key={signal}>{signal}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}

function completenessTone(score: number): 'green' | 'amber' | 'rose' {
  if (score >= 70) return 'green';
  if (score >= 40) return 'amber';
  return 'rose';
}
