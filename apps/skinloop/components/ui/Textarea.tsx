import type { TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        className={cx(
          'mt-2 min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-loop-leaf focus:ring-4 focus:ring-loop-mint/50',
          className,
        )}
        {...props}
      />
    </label>
  );
}
