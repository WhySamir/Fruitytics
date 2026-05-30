import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ColumnProps {
  children: ReactNode;
  className?: string;
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  offset?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  alignSelf?: 'start' | 'center' | 'end' | 'stretch';
  responsive?: boolean;
}

const Column = ({
  children,
  className = '',
  span = 'full',
  offset = 0,
  alignSelf = 'stretch',
  responsive = false,
}: ColumnProps) => {
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
    6: 'col-span-6',
    7: 'col-span-7',
    8: 'col-span-8',
    9: 'col-span-9',
    10: 'col-span-10',
    11: 'col-span-11',
    12: 'col-span-12',
    full: 'col-span-full',
  };

  const offsetClasses = {
    0: 'col-start-1',
    1: 'col-start-2',
    2: 'col-start-3',
    3: 'col-start-4',
    4: 'col-start-5',
    5: 'col-start-6',
    6: 'col-start-7',
    7: 'col-start-8',
    8: 'col-start-9',
    9: 'col-start-10',
    10: 'col-start-11',
    11: 'col-start-12',
  };

  const alignSelfClasses = {
    start: 'self-start',
    center: 'self-center',
    end: 'self-end',
    stretch: 'self-stretch',
  };

  return (
    <div
      className={clsx(
        spanClasses[span],
        offsetClasses[offset],
        alignSelfClasses[alignSelf],
        responsive && 'col-span-full sm:col-span-6 lg:col-span-4',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Column;
