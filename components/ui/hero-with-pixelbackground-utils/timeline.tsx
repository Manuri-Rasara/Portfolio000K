'use client';

import * as React from 'react';

type TimelineProps = {
  children: React.ReactNode;
  rotation?: number;
  initialLeft?: number;
  minWidth?: number;
  containerClassName?: string;
  handleClassName?: string;
  handleIndicatorClassName?: string;
};

type TimelineTextProps = {
  children: React.ReactNode;
  className?: string;
};

export function TimelineText({ children, className = '' }: TimelineTextProps) {
  return <span className={className}>{children}</span>;
}

export function Timeline({
  children,
  rotation = 0,
  initialLeft = 0,
  minWidth = 56,
  containerClassName = '',
  handleClassName = '',
  handleIndicatorClassName = '',
}: TimelineProps) {
  return (
    <div
      className={['relative inline-flex items-center justify-center', containerClassName]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: `rotate(${rotation}deg)`,
        paddingLeft: `${initialLeft}px`,
      }}
    >
      <div
        className={[
          'relative inline-flex min-w-0 items-center justify-center rounded-full border border-zinc-200 bg-white px-3 shadow-[0_0_0_1px_rgba(0,0,0,0.02)]',
          handleClassName,
        ]
          .filter(Boolean)
          .join(' ')}
        style={{ minWidth: `${minWidth}px` }}
      >
        <div
          aria-hidden="true"
          className={[
            'absolute -left-1 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-zinc-300 bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.7)]',
            handleIndicatorClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
