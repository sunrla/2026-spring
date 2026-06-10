import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: 'green' | 'amber' | 'rose' | 'blue' | 'slate';
};

const tones = {
  green: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  rose: 'bg-rose-50 text-rose-800 ring-rose-200',
  blue: 'bg-sky-50 text-sky-800 ring-sky-200',
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function Badge({ children, className, tone = 'slate', ...props }: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
