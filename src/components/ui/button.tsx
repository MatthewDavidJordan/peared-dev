import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-80 disabled:cursor-not-allowed group',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground enabled:hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90',
        outline:
          'border border-input bg-background enabled:hover:bg-accent enabled:hover:text-accent-foreground',
        accent: 'bg-accent text-accent-foreground enabled:hover:bg-accent/90',
        primaryToAccent:
          'relative overflow-hidden bg-primary text-primary-foreground z-10 before:pointer-events-none before:absolute before:inset-0 before:bg-accent/80 before:transform before:scale-x-0 before:origin-left before:transition-transform before:duration-500 before:z-0 enabled:hover:before:scale-x-100 disabled:before:scale-x-0 before:-z-10',
        secondary: 'bg-secondary text-secondary-foreground enabled:hover:bg-secondary/80',
        ghost: 'enabled:hover:bg-accent enabled:hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 enabled:hover:underline',
        secondaryLink: 'text-secondary underline-offset-4 enabled:hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
