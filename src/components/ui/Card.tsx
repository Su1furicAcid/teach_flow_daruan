import { cn } from '@/lib/utils/class';
import { forwardRef } from 'react';

type CardProps = {
  className?: string;
  children: React.ReactNode;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'none';
} & React.HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, shadow = 'md', padding = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl bg-white transition-shadow',
        {
          'shadow-sm': shadow === 'sm',
          'shadow-md': shadow === 'md',
          'shadow-lg': shadow === 'lg',
          'p-2': padding === 'xs',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'p-0': padding === 'none',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';