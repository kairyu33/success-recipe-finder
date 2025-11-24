/**
 * UI Constants
 *
 * @description Centralized UI-related constants for consistent styling
 * Provides single source of truth for colors, sizes, and animations
 */

/**
 * Color palette definitions
 */
export const COLORS = {
  blue: {
    50: 'from-blue-50 to-indigo-50',
    100: 'from-blue-100 to-indigo-100',
    dark: 'from-gray-700 to-indigo-900/30',
    border: 'border-blue-100 dark:border-gray-600',
    text: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  purple: {
    50: 'from-purple-50 to-pink-50',
    100: 'from-purple-100 to-pink-100',
    dark: 'from-purple-900/20 to-pink-900/20',
    border: 'border-purple-100 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  green: {
    50: 'from-green-50 to-emerald-50',
    100: 'from-green-100 to-emerald-100',
    dark: 'from-green-900/20 to-emerald-900/20',
    border: 'border-green-100 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  orange: {
    50: 'from-orange-50 to-yellow-50',
    100: 'from-orange-100 to-yellow-100',
    dark: 'from-orange-900/20 to-yellow-900/20',
    border: 'border-orange-100 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  indigo: {
    50: 'from-indigo-50 to-purple-50',
    100: 'from-indigo-100 to-purple-100',
    dark: 'from-indigo-900/20 to-purple-900/20',
    border: 'border-indigo-100 dark:border-indigo-800',
    text: 'text-indigo-700 dark:text-indigo-300',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  pink: {
    50: 'from-pink-50 to-rose-50',
    100: 'from-pink-100 to-rose-100',
    dark: 'from-pink-900/20 to-rose-900/20',
    border: 'border-pink-100 dark:border-pink-800',
    text: 'text-pink-700 dark:text-pink-300',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
  },
  amber: {
    50: 'from-amber-50 to-yellow-50',
    100: 'from-amber-100 to-yellow-100',
    dark: 'from-amber-900/20 to-yellow-900/20',
    border: 'border-amber-100 dark:border-amber-800',
    text: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  teal: {
    50: 'from-teal-50 to-cyan-50',
    100: 'from-teal-100 to-cyan-100',
    dark: 'from-teal-900/20 to-cyan-900/20',
    border: 'border-teal-100 dark:border-teal-800',
    text: 'text-teal-700 dark:text-teal-300',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
} as const;

/**
 * Animation class names
 */
export const ANIMATIONS = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  scaleIn: 'animate-scale-in',
  spin: 'animate-spin',
} as const;

/**
 * Spacing constants
 */
export const SPACING = {
  section: 'py-12 px-4 sm:px-6 lg:px-8',
  container: 'max-w-7xl mx-auto',
  cardPadding: 'p-6 md:p-8',
  buttonPadding: {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    xl: 'px-8 py-4',
  },
} as const;

/**
 * Border radius constants
 */
export const RADIUS = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  full: 'rounded-full',
} as const;

/**
 * Shadow constants
 */
export const SHADOWS = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  hover: 'hover:shadow-lg',
} as const;

/**
 * Transition constants
 */
export const TRANSITIONS = {
  all: 'transition-all',
  colors: 'transition-colors',
  transform: 'transition-transform',
  shadow: 'transition-shadow',
  duration: {
    fast: 'duration-150',
    normal: 'duration-200',
    slow: 'duration-300',
  },
} as const;

/**
 * Icon sizes
 */
export const ICON_SIZES = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
} as const;

/**
 * Text sizes
 */
export const TEXT_SIZES = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
} as const;
