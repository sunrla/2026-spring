import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export function SectionHeader({ eyebrow, title, description, children }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="text-sm font-bold uppercase tracking-normal text-loop-leaf">{eyebrow}</p> : null}
        <h1 className="mt-1 text-3xl font-bold tracking-normal text-loop-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
