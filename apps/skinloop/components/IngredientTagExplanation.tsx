import { Badge } from '@/components/ui/Badge';
import type { IngredientCautionLevel, IngredientTagExplanation as IngredientTagExplanationData } from '@/types/skinloop';

type IngredientTagExplanationProps = {
  explanations: IngredientTagExplanationData[];
  emptyMessage?: string;
};

const cautionTone: Record<IngredientCautionLevel, 'green' | 'amber' | 'rose'> = {
  low: 'green',
  medium: 'amber',
  caution: 'rose',
};

const cautionLabel: Record<IngredientCautionLevel, string> = {
  low: '낮음',
  medium: '중간',
  caution: '주의',
};

export function IngredientTagExplanation({
  explanations,
  emptyMessage = '감지된 성분 태그 설명이 아직 없습니다.',
}: IngredientTagExplanationProps) {
  if (explanations.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {explanations.map((item) => (
        <article key={item.tag} className="rounded-md border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h4 className="text-base font-black text-loop-ink">{item.labelKo}</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge>{item.tag}</Badge>
                <Badge tone={cautionTone[item.cautionLevel]}>주의 수준: {cautionLabel[item.cautionLevel]}</Badge>
                <Badge tone="blue">{item.evidenceStatus}</Badge>
              </div>
            </div>
            <Badge tone="blue">{item.sourceLabel}</Badge>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-normal text-slate-500">감지된 성분</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.matchedIngredients.map((ingredient) => (
                <Badge key={ingredient} tone="slate">
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-700">{item.shortDescriptionKo}</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{item.routineMeaningKo}</p>
          <p className="mt-3 rounded-md bg-slate-50 p-3 text-xs font-semibold leading-5 text-slate-600">
            {item.disclaimerKo}
          </p>
        </article>
      ))}
    </div>
  );
}
