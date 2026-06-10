'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { IngredientTagExplanation } from '@/components/IngredientTagExplanation';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { tagLabels } from '@/data/ingredientRules';
import { getIngredientTagExplanations } from '@/lib/ingredients';
import { analyzeRoutine } from '@/lib/risk';
import { readLocal, storageKeys } from '@/lib/storage';
import type { IngredientTag, Product, RiskLevel, SkinProfile, WeeklyLog } from '@/types/skinloop';

const riskTone: Record<RiskLevel, 'green' | 'amber' | 'rose'> = {
  Low: 'green',
  Medium: 'amber',
  Caution: 'rose',
};

const tagTone: Record<IngredientTag, 'green' | 'amber' | 'rose' | 'blue' | 'slate'> = {
  'fragrance-related': 'amber',
  'exfoliating-acid': 'rose',
  moisturizing: 'green',
  sunscreen: 'blue',
  preservative: 'slate',
  'potential-irritation-caution': 'rose',
};

export default function AnalysisPage() {
  const [profile, setProfile] = useState<SkinProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<WeeklyLog[]>([]);

  useEffect(() => {
    setProfile(readLocal<SkinProfile | null>(storageKeys.profile, null));
    setProducts(readLocal<Product[]>(storageKeys.products, []));
    setLogs(readLocal<WeeklyLog[]>(storageKeys.logs, []));
  }, []);

  const result = useMemo(() => analyzeRoutine(profile, products), [profile, products]);
  const combinedIngredientText = products.map((product) => product.ingredientText).join(', ');
  const tagExplanations = useMemo(
    () => getIngredientTagExplanations(combinedIngredientText),
    [combinedIngredientText],
  );
  const allTags = tagExplanations.map((item) => item.tag);

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Risk analysis"
        title="루틴 위험도 참고"
        description="피부 설문, 등록 제품, 감지된 성분 태그, 주간 기록을 함께 보는 가능성 기반 참고 화면입니다. 제품 적합성을 확정하지 않습니다."
      />

      <Card>
        <h2 className="text-xl font-black text-loop-ink">분석 기준</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          이 결과는 사용자 기록과 함께 확인하는 루틴 관찰용 참고 정보입니다.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <BasisItem label="피부 설문" value={profile ? '저장됨' : '미입력'} tone={profile ? 'green' : 'amber'} />
          <BasisItem label="등록 제품" value={`${products.length}개`} tone={products.length ? 'green' : 'amber'} />
          <BasisItem label="감지 태그" value={`${allTags.length}개`} tone={allTags.length ? 'green' : 'slate'} />
          <BasisItem label="주간 기록" value={`${logs.length}개`} tone={logs.length ? 'green' : 'slate'} />
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500">현재 risk level</p>
            <div className="mt-3 flex items-center gap-3">
              <Badge tone={riskTone[result.level]}>{result.level}</Badge>
              <h2 className="text-2xl font-black text-loop-ink">{result.summary}</h2>
            </div>
          </div>
          <Badge tone="rose">진단 아님</Badge>
        </div>

        <p className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
          이 결과는 가능성 기반의 루틴 참고 정보이며 진단이 아닙니다.
        </p>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h3 className="text-base font-bold text-loop-ink">감지된 성분 태그</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {allTags.length === 0 ? (
                <Badge>제품 성분 태그가 아직 없습니다</Badge>
              ) : (
                allTags.map((tag) => (
                  <Badge key={tag} tone={tagTone[tag]}>
                    {tagLabels[tag]}
                  </Badge>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-loop-ink">설명</h3>
            <ul className="mt-3 space-y-2">
              {result.explanations.map((item) => (
                <li key={item} className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-black text-loop-ink">성분 태그 설명</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          등록된 제품의 성분 텍스트에서 어떤 성분이 어떤 태그를 만들었는지 보여줍니다.
        </p>
        <div className="mt-4">
          <IngredientTagExplanation
            explanations={tagExplanations}
            emptyMessage="등록된 제품 성분에서 설명할 태그가 아직 감지되지 않았습니다."
          />
        </div>
      </Card>

      {(!profile || products.length === 0) ? (
        <Card className="border-dashed bg-white/80">
          <p className="text-sm leading-6 text-slate-600">
            더 의미 있는 참고 결과를 보려면 설문과 제품 등록을 먼저 완료하세요.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/survey"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-loop-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              설문으로 이동
            </Link>
            <Link
              href="/products"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-500"
            >
              제품 등록으로 이동
            </Link>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function BasisItem({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 'green' | 'amber' | 'slate';
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <div className="mt-2">
        <Badge tone={tone}>{value}</Badge>
      </div>
    </div>
  );
}
