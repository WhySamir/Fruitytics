import type { ReactNode } from 'react';
import clsx from 'clsx';

interface RowProps {
  children: ReactNode;
  className?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  responsive?: boolean;
}

const Row = ({
  children,
  className = '',
  gap = 'md',
  align = 'center',
  justify = 'start',
  wrap = false,
  responsive = false,
}: RowProps) => {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-1 sm:gap-2',
    md: 'gap-2 sm:gap-3 md:gap-4',
    lg: 'gap-4 sm:gap-6',
    xl: 'gap-6 sm:gap-8',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div
      className={clsx(
        'flex flex-row',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        responsive && 'flex-col sm:flex-row',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Row;
