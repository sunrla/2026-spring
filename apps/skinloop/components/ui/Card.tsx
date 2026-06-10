import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cx('rounded-lg border border-slate-200 bg-white p-5 shadow-soft', className)}
      {...props}
    >
      {children}
    </div>
  );
}
