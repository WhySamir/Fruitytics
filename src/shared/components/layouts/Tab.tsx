import type { FC, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

interface TabItem {
  label: string;
  component?: FC<Record<string, unknown>>;
  props?: Record<string, unknown>;
  content?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  count?: number;
}

interface TabProps {
  items: TabItem[];
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  fitContent?: boolean;
  variant?: 'underline' | 'pill' | 'segment' | 'card';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  tabBarClassName?: string;
  contentClassName?: string;
  align?: 'start' | 'center' | 'end';
  showSlider?: boolean;
  paramKey?: string;
}

const Tab: FC<TabProps> = ({
  items,
  activeIndex,
  onTabChange,
  fitContent = false,
  variant = 'card',
  size = 'md',
  fullWidth = false,
  className = '',
  tabBarClassName = '',
  contentClassName = '',
  align = 'start',
  showSlider = true,
  paramKey = 'tab',
}) => {
  const { state, pathname, search } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderDimensions, setSliderDimensions] = useState({
    width: 0,
    left: 0,
    shouldAnimate: false,
  });

  const tabParam = searchParams.get(paramKey);
  const urlActiveIndex = tabParam
    ? items.findIndex(
        (item) => item.label.toLowerCase() === tabParam.toLowerCase()
      )
    : 0;
  const safeUrlActiveIndex = urlActiveIndex === -1 ? 0 : urlActiveIndex;

  const effectiveActiveIndex =
    typeof activeIndex === 'number' ? activeIndex : safeUrlActiveIndex;

  useEffect(() => {
    const activeTabRef = tabRefs.current[effectiveActiveIndex];
    if (activeTabRef && containerRef.current) {
      const { offsetWidth: width, offsetLeft: left } = activeTabRef;
      const containerLeft = containerRef.current.getBoundingClientRect().left;
      setSliderDimensions((prev) => ({
        width,
        left: left - containerLeft,
        shouldAnimate: prev.width !== 0,
      }));
    }
  }, [effectiveActiveIndex]);

  const sizeClasses = {
    sm: {
      tab: 'text-xs px-3 py-1.5',
      icon: 'h-3 w-3',
      count: 'text-xs min-w-5 h-5 px-1.5',
    },
    md: {
      tab: 'text-sm px-4 py-2',
      icon: 'h-4 w-4',
      count: 'text-xs min-w-6 h-6 px-2',
    },
    lg: {
      tab: 'text-base px-5 py-2.5',
      icon: 'h-5 w-5',
      count: 'text-sm min-w-7 h-7 px-2.5',
    },
  };

  const variantClasses = {
    underline: {
      container: clsx(
        'overflow-x-auto overflow-y-hidden',
        'scrollbar-hide',
        'min-h-[42px]'
      ),
      tab: clsx(
        'border-b-2 border-transparent -mb-px px-4 py-2.5',
        'hover:text-primary hover:border-gray-300',
        'transition-all duration-200 ease-out'
      ),
      active: 'text-primary font-semibold',
      disabled: 'text-gray-400 cursor-not-allowed hover:border-transparent',
    },
    pill: {
      container: clsx(
        'gap-1 p-1',
        'overflow-x-auto overflow-y-hidden',
        'scrollbar-hide',
        'bg-gray-100/50 rounded-full',
        'inline-flex'
      ),
      tab: clsx(
        'rounded-full px-4 py-1.5 z-10',
        'hover:bg-white hover:text-gray-900',
        'transition-all duration-200 ease-out'
      ),
      active: 'bg-primary text-white shadow-sm font-semibold',
      disabled: 'text-gray-400 cursor-not-allowed hover:bg-transparent',
    },
    segment: {
      container: clsx(
        'p-1',
        'overflow-x-auto overflow-y-hidden',
        'scrollbar-hide',
        'bg-gray-100/50 rounded-lg',
        'inline-flex'
      ),
      tab: clsx(
        'rounded-md px-4 py-2',
        'hover:bg-white/80 hover:text-gray-900',
        'transition-all duration-200 ease-out'
      ),
      active: 'bg-white text-primary shadow-sm font-semibold',
      disabled: 'text-gray-400 cursor-not-allowed hover:bg-transparent',
    },
    card: {
      container: clsx(
        'gap-2 p-1',
        'overflow-x-auto overflow-y-hidden',
        'scrollbar-hide',
        'flex-nowrap'
      ),
      tab: clsx(
        'border rounded-lg px-4 py-3',
        'hover:border-gray-300 hover:shadow-sm',
        'transition-all duration-200 ease-out',
        'min-w-[120px]' // Minimum width for card tabs
      ),
      active: 'border-primary text-primary shadow-sm bg-primary/5',
      disabled: 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50',
    },
  };

  const handleTabClick = (index: number, label: string) => {
    const item = items[index];
    if (item?.disabled) return;

    if (onTabChange) {
      onTabChange(index);
    } else {
      const currentParams = new URLSearchParams(search);
      currentParams.set(paramKey, label);
      navigate(`${pathname}?${currentParams.toString()}`, { state });
    }
  };

  const {
    component: Component,
    props,
    content,
  } = items[effectiveActiveIndex] || {};

  return (
    <div className={clsx('w-full', className)}>
      <div
        ref={containerRef}
        className={clsx(
          'relative flex flex-nowrap p-1 ',
          {
            'justify-start': align === 'start',
            'justify-center': align === 'center' && !fitContent,
            'justify-end': align === 'end' && !fitContent,
            'w-full': fullWidth,
            'inline-flex': !fullWidth && fitContent,
          },
          variantClasses[variant].container,
          tabBarClassName
        )}
      >
        {showSlider &&
          variant === 'underline' &&
          sliderDimensions.width > 0 && (
            <div
              className={clsx(
                'absolute bg-primary',
                sliderDimensions.shouldAnimate
                  ? 'transition-all duration-300 ease-out'
                  : ''
              )}
              style={{
                width: `${sliderDimensions.width}px`,
                transform: `translateX(${sliderDimensions.left}px)`,
              }}
            />
          )}

        {showSlider && variant === 'pill' && sliderDimensions.width > 0 && (
          <div
            className={clsx(
              'absolute h-[calc(100%-8px)] top-1 bg-white rounded-full',
              sliderDimensions.shouldAnimate
                ? 'transition-all duration-300 ease-out'
                : '',
              'shadow-sm'
            )}
            style={{
              width: `${sliderDimensions.width}px`,
              transform: `translateX(${sliderDimensions.left}px)`,
            }}
          />
        )}

        {items.map((item, index) => {
          const isActive = effectiveActiveIndex === index;
          const isDisabled = item.disabled;

          return (
            <button
              key={index}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              onClick={() => handleTabClick(index, item.label)}
              disabled={isDisabled}
              className={clsx(
                'flex items-center justify-center gap-2',
                'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1',
                'flex-shrink-0',
                'whitespace-nowrap',
                sizeClasses[size].tab,
                isActive && variantClasses[variant].active,
                isDisabled && variantClasses[variant].disabled,
                !isActive &&
                  !isDisabled && {
                    'text-gray-600': variant !== 'card',
                    'text-gray-700 bg-white': variant === 'card',
                  },
                {
                  'flex-1': fullWidth && variant !== 'card',
                  'min-w-fit': !fullWidth && variant !== 'card',
                  'opacity-60': isDisabled,
                  'cursor-pointer': !isDisabled,
                  'cursor-not-allowed': isDisabled,
                },

                variantClasses[variant].tab
              )}
              aria-selected={isActive}
              role="tab"
            >
              {item.icon && (
                <span className={clsx('flex-shrink-0', sizeClasses[size].icon)}>
                  {item.icon}
                </span>
              )}

              <span className="truncate">{item.label}</span>

              {item.count !== undefined && (
                <span
                  className={clsx(
                    'flex items-center justify-center',
                    'rounded-full font-medium',
                    sizeClasses[size].count,
                    isActive && variant === 'pill' && 'bg-primary text-white',
                    isActive &&
                      variant !== 'pill' &&
                      'bg-primary/10 text-primary',
                    !isActive && 'bg-gray-100 text-gray-700'
                  )}
                >
                  {item.count > 99 ? '99+' : item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className={clsx('mt-4', contentClassName)} role="tabpanel">
        {content || (Component && <Component {...props} />)}
      </div>
    </div>
  );
};

export default Tab;
