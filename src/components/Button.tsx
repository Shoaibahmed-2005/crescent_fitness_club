import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-none";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(255,0,51,0.4)] border border-primary",
      secondary: "bg-surfaceHighlight text-white hover:bg-white/10 border border-white/10 hover:border-white/20",
      outline: "bg-transparent text-primary border border-primary hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(255,0,51,0.2)]",
      ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5",
      md: "text-sm px-6 py-2.5",
      lg: "text-base px-8 py-3.5",
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
