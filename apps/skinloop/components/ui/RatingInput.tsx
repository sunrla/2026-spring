import type { Rating } from '@/types/skinloop';
import { cx } from '@/lib/cx';

type RatingInputProps = {
  label: string;
  value: Rating;
  lowLabel?: string;
  highLabel?: string;
  onChange: (value: Rating) => void;
};

const ratings: Rating[] = [1, 2, 3, 4, 5];

export function RatingInput({
  label,
  value,
  lowLabel = '낮음',
  highLabel = '높음',
  onChange,
}: RatingInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs font-medium text-slate-500">
          {lowLabel} · {highLabel}
        </p>
      </div>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {ratings.map((rating) => (
          <button
            key={rating}
            type="button"
            aria-pressed={value === rating}
            onClick={() => onChange(rating)}
            className={cx(
              'min-h-11 rounded-md border text-sm font-bold transition',
              value === rating
                ? 'border-loop-leaf bg-loop-leaf text-white'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-loop-leaf hover:bg-white',
            )}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}
