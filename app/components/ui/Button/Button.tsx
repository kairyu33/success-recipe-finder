/**
 * Button Component
 *
 * @description Reusable button with multiple variants and sizes
 * Supports loading states, icons, and full customization
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={handleClick}>
 *   Click Me
 * </Button>
 *
 * <Button variant="outline" isLoading leftIcon={<Icon />}>
 *   Loading...
 * </Button>
 * ```
 */

'use client';

import { ButtonProps } from '@/app/types/ui';
import { cn, variantClasses } from '@/app/utils/ui/classNames';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

const buttonVariants = {
  primary:
    'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-primary',
  secondary:
    'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white',
  outline:
    'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-primary-900/20',
  ghost:
    'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
  success:
    'bg-success-600 hover:bg-success-700 text-white shadow-md hover:shadow-success',
  danger:
    'bg-danger-600 hover:bg-danger-700 text-white shadow-md hover:shadow-lg',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

/**
 * Versatile button component with multiple styling options
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2';

  const buttonClass = cn(
    baseClasses,
    variantClasses(buttonSizes[size], buttonVariants, variant),
    className
  );

  // Map button sizes to appropriate spinner sizes
  const spinnerSize = size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg';

  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size={spinnerSize} />}
      {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}
