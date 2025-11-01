import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { cn } from '@/lib/utils/class';

export const Label = forwardRef<HTMLLabelElement, ComponentPropsWithoutRef<'label'>>(
  ({ className, children, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
);

Label.displayName = 'Label';