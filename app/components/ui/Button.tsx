import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';
import clsx from 'clsx';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable Button component
 */
export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  
  const variantClasses = clsx({
    // Primary variant
    'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
    // Secondary variant
    'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
    // Ghost variant
    'text-gray-900 hover:bg-gray-100': variant === 'ghost',
  });
  
  const sizeClasses = clsx({
    'px-3 py-1.5 text-sm': size === 'sm',
    'px-4 py-2 text-base': size === 'md',
    'px-6 py-3 text-lg': size === 'lg',
  });
  
  const buttonClasses = clsx(baseClasses, variantClasses, sizeClasses, className);
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
}