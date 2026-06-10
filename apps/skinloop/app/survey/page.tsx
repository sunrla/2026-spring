'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { RatingInput } from '@/components/ui/RatingInput';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { skinGoalOptions } from '@/lib/options';
import { readLocal, storageKeys, writeLocal } from '@/lib/storage';
import type { Rating, SkinGoal, SkinProfile } from '@/types/skinloop';

const emptyProfile: SkinProfile = {
  dryness: 3,
  oiliness: 3,
  sensitivity: 3,
  redness: 3,
  breakouts: 3,
  mainGoal: 'balance',
  updatedAt: '',
};

export default function SurveyPage() {
  const [profile, setProfile] = useState<SkinProfile>(emptyProfile);
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    const saved = readLocal<SkinProfile | null>(storageKeys.profile, null);
    if (saved) {
      setProfile(saved);
      setSavedAt(saved.updatedAt);
    }
  }, []);

  const updateRating = (key: keyof Pick<SkinProfile, 'dryness' | 'oiliness' | 'sensitivity' | 'redness' | 'breakouts'>) => {
    return (value: Rating) => setProfile((current) => ({ ...current, [key]: value }));
  };

  const saveProfile = () => {
    const nextProfile = { ...profile, updatedAt: new Date().toISOString() };
    writeLocal(storageKeys.profile, nextProfile);
    setProfile(nextProfile);
    setSavedAt(nextProfile.updatedAt);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Onboarding"
        title="피부 프로필 설문"
        description="현재 루틴을 평가하기 위한 기본 맥락을 저장합니다. 점수는 사용자가 느끼는 정도를 1-5로 기록합니다."
      />

      <Card>
        <div className="grid gap-6 lg:grid-cols-2">
          <RatingInput label="건조감" value={profile.dryness} onChange={updateRating('dryness')} />
          <RatingInput label="유분감" value={profile.oiliness} onChange={updateRating('oiliness')} />
          <RatingInput label="민감도" value={profile.sensitivity} onChange={updateRating('sensitivity')} />
          <RatingInput label="붉어짐" value={profile.redness} onChange={updateRating('redness')} />
          <RatingInput label="트러블 경향" value={profile.breakouts} onChange={updateRating('breakouts')} />

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">가장 중요한 스킨케어 목표</span>
            <select
              value={profile.mainGoal}
              onChange={(event) =>
                setProfile((current) => ({ ...current, mainGoal: event.target.value as SkinGoal }))
              }
              className="mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-950 outline-none transition focus:border-loop-leaf focus:ring-4 focus:ring-loop-mint/50"
            >
              {skinGoalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-slate-600">
            저장된 설문은 이 브라우저의 localStorage에만 보관됩니다.
            {savedAt ? ` 마지막 저장: ${new Date(savedAt).toLocaleString('ko-KR')}` : ''}
          </p>
          <Button type="button" onClick={saveProfile}>
            설문 저장
          </Button>
        </div>
      </Card>
    </div>
  );
}
