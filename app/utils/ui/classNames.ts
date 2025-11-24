/**
 * ClassName Utility
 *
 * @description Conditional className builder for dynamic styling
 * Handles undefined, null, and boolean values gracefully
 *
 * @example
 * ```tsx
 * <div className={cn(
 *   'base-class',
 *   isActive && 'active-class',
 *   isDisabled && 'disabled-class',
 *   customClass
 * )} />
 * ```
 */

type ClassValue = string | number | boolean | undefined | null;

/**
 * Combines multiple class names conditionally
 *
 * @param classes - Array of class values (strings, booleans, undefined)
 * @returns Combined class string
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Creates variant-based class names
 *
 * @description Helper for component variants with base classes
 *
 * @param base - Base class names applied to all variants
 * @param variants - Object mapping variant names to class names
 * @param activeVariant - Currently active variant
 * @returns Combined class string
 *
 * @example
 * ```tsx
 * const buttonClass = variantClasses(
 *   'px-4 py-2 rounded',
 *   {
 *     primary: 'bg-blue-600 text-white',
 *     secondary: 'bg-gray-200 text-gray-900',
 *   },
 *   variant
 * );
 * ```
 */
export function variantClasses<T extends string>(
  base: string,
  variants: Record<T, string>,
  activeVariant: T
): string {
  return cn(base, variants[activeVariant]);
}

/**
 * Conditionally apply classes based on state
 *
 * @param condition - Boolean condition
 * @param trueClasses - Classes to apply when true
 * @param falseClasses - Classes to apply when false
 * @returns Appropriate class string
 *
 * @example
 * ```tsx
 * <button className={conditionalClasses(
 *   isActive,
 *   'bg-blue-600 text-white',
 *   'bg-gray-200 text-gray-600'
 * )} />
 * ```
 */
export function conditionalClasses(
  condition: boolean,
  trueClasses: string,
  falseClasses?: string
): string {
  return condition ? trueClasses : falseClasses || '';
}
