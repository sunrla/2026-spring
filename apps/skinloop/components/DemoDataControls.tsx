'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { clearDemoData, seedDemoData } from '@/lib/demoData';
import { cx } from '@/lib/cx';

type DemoDataControlsProps = {
  compact?: boolean;
  className?: string;
};

export function DemoDataControls({ compact = false, className }: DemoDataControlsProps) {
  const [status, setStatus] = useState('');

  const refreshSoon = () => {
    window.setTimeout(() => {
      window.location.reload();
    }, 650);
  };

  const handleSeed = () => {
    seedDemoData();
    setStatus('데모 데이터가 적용되었습니다.');
    refreshSoon();
  };

  const handleClear = () => {
    clearDemoData();
    setStatus('로컬 데모 데이터가 초기화되었습니다.');
    refreshSoon();
  };

  return (
    <div
      className={cx(
        compact
          ? 'flex flex-col gap-2 sm:items-end'
          : 'rounded-lg border border-slate-200 bg-slate-50 p-4',
        className,
      )}
    >
      <div className={cx('flex flex-col gap-2', compact ? 'sm:flex-row' : 'sm:flex-row')}>
        <Button
          type="button"
          onClick={handleSeed}
          className={compact ? 'min-h-9 px-3 py-1.5 text-xs' : undefined}
        >
          데모 데이터 채우기
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleClear}
          className={compact ? 'min-h-9 px-3 py-1.5 text-xs' : undefined}
        >
          로컬 데이터 초기화
        </Button>
      </div>
      {status ? (
        <p className={cx('text-sm font-semibold text-loop-leaf', compact ? 'text-xs' : 'mt-3')} role="status">
          {status}
        </p>
      ) : null}
    </div>
  );
}
