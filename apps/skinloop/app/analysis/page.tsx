'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { tagLabels } from '@/data/ingredientRules';
import { parseIngredientText } from '@/lib/ingredients';
import { analyzeRoutine } from '@/lib/risk';
import { readLocal, storageKeys } from '@/lib/storage';
import type { IngredientTag, Product, RiskLevel, SkinProfile } from '@/types/skinloop';

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

  useEffect(() => {
    setProfile(readLocal<SkinProfile | null>(storageKeys.profile, null));
    setProducts(readLocal<Product[]>(storageKeys.products, []));
  }, []);

  const result = useMemo(() => analyzeRoutine(profile, products), [profile, products]);
  const allTags = Array.from(
    new Set(products.flatMap((product) => parseIngredientText(product.ingredientText).flatMap((ingredient) => ingredient.tags))),
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Risk analysis"
        title="루틴 위험도 참고"
        description="피부 설문, 등록 제품, mock 성분 태그를 조합해 참고용 위험도를 보여줍니다. 이 화면은 제품 적합성을 확정하지 않습니다."
      />

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
