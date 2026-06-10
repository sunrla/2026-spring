import type { InputHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, className, ...props }: InputProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className={cx(
          'mt-2 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-loop-leaf focus:ring-4 focus:ring-loop-mint/50',
          className,
        )}
        {...props}
      />
    </label>
  );
}
