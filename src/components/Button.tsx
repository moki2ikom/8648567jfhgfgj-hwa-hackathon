'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ochre' | 'outline' | 'ghost' | 'light';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading, disabled, children, type = 'button', ...props },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-sm font-mono text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-200 disabled:opacity-45 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-ink text-bone-50 hover:bg-moss',
      ochre: 'bg-ochre text-ink hover:bg-ochre-light',
      outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-bone-50',
      ghost: 'text-ink/70 hover:text-ink hover:bg-ink/5',
      light: 'border border-bone-50/30 text-bone-50 hover:bg-bone-50 hover:text-ink',
    };

    const sizes = {
      sm: 'px-4 py-2 text-[10px]',
      md: 'px-6 py-3',
      lg: 'px-8 py-4',
    };

    return (
      <button
        ref={ref}
        type={type}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path
              className="opacity-80"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
