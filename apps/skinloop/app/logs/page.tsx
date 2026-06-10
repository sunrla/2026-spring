'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RatingInput } from '@/components/ui/RatingInput';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Textarea } from '@/components/ui/Textarea';
import { makeId, readLocal, storageKeys, writeLocal } from '@/lib/storage';
import { skinScoreForLog } from '@/lib/trends';
import type { Rating, WeeklyLog } from '@/types/skinloop';

type LogForm = Omit<WeeklyLog, 'id' | 'createdAt'>;

const emptyLog: LogForm = {
  drynessScore: 3,
  oilinessScore: 3,
  rednessScore: 3,
  irritationScore: 3,
  breakoutCount: 0,
  sleepHours: 7,
  stressScore: 3,
  memo: '',
};

export default function LogsPage() {
  const [form, setForm] = useState<LogForm>(emptyLog);
  const [logs, setLogs] = useState<WeeklyLog[]>([]);

  useEffect(() => {
    setLogs(readLocal<WeeklyLog[]>(storageKeys.logs, []));
  }, []);

  const updateRating = (key: keyof Pick<LogForm, 'drynessScore' | 'oilinessScore' | 'rednessScore' | 'irritationScore' | 'stressScore'>) => {
    return (value: Rating) => setForm((current) => ({ ...current, [key]: value }));
  };

  const saveLog = () => {
    const nextLog: WeeklyLog = {
      ...form,
      id: makeId('log'),
      createdAt: new Date().toISOString(),
    };
    const nextLogs = [nextLog, ...logs].slice(0, 20);
    setLogs(nextLogs);
    writeLocal(storageKeys.logs, nextLogs);
    setForm(emptyLog);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Weekly log"
        title="주간 피부 로그"
        description="피부 느낌과 생활 맥락을 함께 기록합니다. 점수는 사용자가 느끼는 정도를 1-5로 저장합니다."
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="grid gap-6 sm:grid-cols-2">
            <RatingInput label="건조감 점수" value={form.drynessScore} onChange={updateRating('drynessScore')} />
            <RatingInput label="유분감 점수" value={form.oilinessScore} onChange={updateRating('oilinessScore')} />
            <RatingInput label="붉어짐 점수" value={form.rednessScore} onChange={updateRating('rednessScore')} />
            <RatingInput label="자극감 점수" value={form.irritationScore} onChange={updateRating('irritationScore')} />
            <RatingInput label="스트레스 점수" value={form.stressScore} onChange={updateRating('stressScore')} />
            <Input
              label="수면 시간"
              type="number"
              min={0}
              step={0.5}
              value={form.sleepHours}
              onChange={(event) =>
                setForm((current) => ({ ...current, sleepHours: Number(event.target.value) }))
              }
            />
            <Input
              label="트러블 개수"
              type="number"
              min={0}
              value={form.breakoutCount}
              onChange={(event) =>
                setForm((current) => ({ ...current, breakoutCount: Math.max(0, Number(event.target.value)) }))
              }
            />
            <div className="sm:col-span-2">
              <Textarea
                label="메모"
                value={form.memo}
                onChange={(event) => setForm((current) => ({ ...current, memo: event.target.value }))}
                placeholder="예: 새 제품 없이 기존 루틴 유지, 수면 부족, 건조감 있음"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">
            <Button type="button" onClick={saveLog}>
              로그 저장
            </Button>
          </div>
        </Card>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-loop-ink">최근 기록</h2>
          {logs.length === 0 ? (
            <Card>
              <p className="text-sm leading-6 text-slate-600">아직 저장된 주간 로그가 없습니다.</p>
            </Card>
          ) : (
            logs.map((log) => (
              <Card key={log.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      {new Date(log.createdAt).toLocaleString('ko-KR')}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-loop-ink">
                      스킨 점수 {skinScoreForLog(log)}
                    </h3>
                  </div>
                  <p className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">
                    자극감 {log.irritationScore}/5
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  건조 {log.drynessScore} · 유분 {log.oilinessScore} · 붉어짐 {log.rednessScore} · 트러블 {log.breakoutCount}개 · 수면 {log.sleepHours}h
                </p>
                {log.memo ? <p className="mt-3 text-sm leading-6 text-slate-700">{log.memo}</p> : null}
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
