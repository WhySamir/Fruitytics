import type { ReactNode } from 'react';
import clsx from 'clsx';

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: number | { x?: number; y?: number };
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const Grid = ({
  children,
  className = '',
  cols = 1,
  gap = 4,
  responsive,
}: GridProps) => {
  // Handle gap (could be number or object with x/y)
  const getGapClasses = () => {
    if (typeof gap === 'number') {
      return `gap-${gap}`;
    }
    const classes = [];
    if (gap.x) classes.push(`gap-x-${gap.x}`);
    if (gap.y) classes.push(`gap-y-${gap.y}`);
    return classes.join(' ');
  };

  // Responsive column classes
  const getColsClasses = () => {
    const classes = [`grid-cols-${cols}`];

    if (responsive) {
      if (responsive.sm) classes.push(`sm:grid-cols-${responsive.sm}`);
      if (responsive.md) classes.push(`md:grid-cols-${responsive.md}`);
      if (responsive.lg) classes.push(`lg:grid-cols-${responsive.lg}`);
      if (responsive.xl) classes.push(`xl:grid-cols-${responsive.xl}`);
    }

    return classes.join(' ');
  };

  return (
    <div className={clsx('grid', getColsClasses(), getGapClasses(), className)}>
      {children}
    </div>
  );
};

export default Grid;
