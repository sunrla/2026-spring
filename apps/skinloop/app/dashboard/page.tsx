'use client';

import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { tagKoreanLabels } from '@/data/ingredientRules';
import { collectTagsFromProducts } from '@/lib/ingredients';
import { readLocal, storageKeys } from '@/lib/storage';
import { average, sampleLogs, skinScoreForLog } from '@/lib/trends';
import type { Product, WeeklyLog } from '@/types/skinloop';

function trendText(values: number[]) {
  if (values.length < 2) return '기록 필요';
  const first = values[0];
  const last = values[values.length - 1];
  if (last > first) return '상승 흐름';
  if (last < first) return '하락 흐름';
  return '유지 흐름';
}

function sortLogsForTrend(logs: WeeklyLog[]) {
  return [...logs].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLogs(readLocal<WeeklyLog[]>(storageKeys.logs, []));
    setProducts(readLocal<Product[]>(storageKeys.products, []));
  }, []);

  const usingSampleData = logs.length === 0;
  const logsForView = useMemo(() => (usingSampleData ? sampleLogs : sortLogsForTrend(logs)), [logs, usingSampleData]);
  const skinScores = logsForView.map(skinScoreForLog);
  const irritationScores = logsForView.map((log) => log.irritationScore);
  const consistency = Math.min(100, Math.round((logsForView.length / 4) * 100));
  const tagCounts = collectTagsFromProducts(products);
  const suspectedFactors = [
    average(logsForView.map((log) => log.stressScore)) >= 4 ? '스트레스 점수 높음' : null,
    average(logsForView.map((log) => log.sleepHours)) < 6 ? '수면 시간 낮음' : null,
    (tagCounts.get('fragrance-related') ?? 0) > 0 ? tagKoreanLabels['fragrance-related'] : null,
    (tagCounts.get('exfoliating-acid') ?? 0) > 0 ? tagKoreanLabels['exfoliating-acid'] : null,
    (tagCounts.get('potential-irritation-caution') ?? 0) > 0 ? tagKoreanLabels['potential-irritation-caution'] : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Progress"
        title="진행 대시보드"
        description="주간 로그를 기반으로 간단한 변화 흐름을 보여줍니다. 기록이 없을 때는 데모용 샘플 데이터를 표시합니다."
      >
        {usingSampleData ? <Badge tone="blue">샘플 데이터</Badge> : <Badge tone="green">내 기록</Badge>}
      </SectionHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm font-bold text-slate-500">skin score trend</p>
          <p className="mt-3 text-3xl font-black text-loop-ink">{trendText(skinScores)}</p>
          <p className="mt-2 text-sm text-slate-600">평균 {average(skinScores)}점</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-slate-500">irritation trend</p>
          <p className="mt-3 text-3xl font-black text-loop-ink">{trendText(irritationScores)}</p>
          <p className="mt-2 text-sm text-slate-600">평균 {average(irritationScores)}/5</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-slate-500">routine consistency</p>
          <p className="mt-3 text-3xl font-black text-loop-ink">{consistency}%</p>
          <p className="mt-2 text-sm text-slate-600">최근 4주 기준 기록 밀도</p>
        </Card>
        <Card>
          <p className="text-sm font-bold text-slate-500">registered products</p>
          <p className="mt-3 text-3xl font-black text-loop-ink">{products.length}</p>
          <p className="mt-2 text-sm text-slate-600">현재 localStorage 기준</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <h2 className="text-xl font-black text-loop-ink">스킨 점수 흐름</h2>
          <div className="mt-5 space-y-3">
            {skinScores.map((score, index) => (
              <div key={`${score}-${index}`} className="grid grid-cols-[72px_1fr_48px] items-center gap-3">
                <span className="text-sm font-semibold text-slate-500">{index + 1}주차</span>
                <div className="h-4 rounded-md bg-slate-100">
                  <div className="h-full rounded-md bg-loop-leaf" style={{ width: `${Math.min(100, score)}%` }} />
                </div>
                <span className="text-right text-sm font-black text-loop-ink">{score}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-loop-ink">자극감 흐름</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            낮아지는 흐름은 루틴 관찰에서 참고할 수 있는 신호입니다.
          </p>
          <div className="mt-5 space-y-3">
            {irritationScores.map((score, index) => (
              <div key={`${score}-${index}`} className="grid grid-cols-[72px_1fr_48px] items-center gap-3">
                <span className="text-sm font-semibold text-slate-500">{index + 1}주차</span>
                <div className="h-4 rounded-md bg-slate-100">
                  <div className="h-full rounded-md bg-amber-400" style={{ width: `${Math.min(100, score * 20)}%` }} />
                </div>
                <span className="text-right text-sm font-black text-loop-ink">{score}/5</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black text-loop-ink">의심 가능한 위험 요인</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            아래 항목은 기록과 태그에서 반복적으로 보이는 참고 신호입니다. 확정 원인으로 해석하지 않습니다.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {suspectedFactors.length === 0 ? (
              <Badge tone="green">두드러진 반복 신호 없음</Badge>
            ) : (
              suspectedFactors.map((factor) => (
                <Badge key={factor} tone="amber">
                  {factor}
                </Badge>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
