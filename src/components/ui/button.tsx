import * as React from 'react'
import { cn } from '@/lib/utils/class'
import { cva } from 'class-variance-authority'

export type ButtonProps = {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-purple-600 text-white hover:bg-purple-700',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
        outline: 'border-2 border-purple-200 bg-transparent hover:bg-purple-50',
        ghost: 'hover:bg-purple-50 text-purple-900'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-8 text-base'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'