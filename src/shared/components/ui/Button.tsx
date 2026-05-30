import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}: ButtonProps) => {
  const variantStyles = {
    primary:
      'bg-accent border border-accent text-zinc-950 font-bold hover:opacity-85 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'border border-accent text-accent bg-transparent hover:bg-accent/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'text-accent bg-transparent hover:bg-accent/5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
    text:
      'text-zinc-500 hover:text-accent bg-transparent underline underline-offset-[3px] disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const sizeStyles = {
    xs: 'text-[9px] tracking-wider px-2 py-1',
    sm: 'text-[10px] tracking-widest px-3 py-1.5',
    md: 'text-xs tracking-widest px-4 py-2',
    lg: 'text-sm tracking-widest px-4 py-2.5',
  };

  const classes = clsx(
    'inline-flex items-center justify-center font-label uppercase transition-all duration-150 select-none outline-none rounded-none',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    loading && 'cursor-wait opacity-75',
    className
  );

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-3 w-3 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          PROCESSING...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
