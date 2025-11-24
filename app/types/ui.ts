/**
 * UI Component Type Definitions
 *
 * @description Centralized type definitions for all UI components
 * Provides type safety and better IDE autocomplete
 */

import { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger';

/**
 * Button size types
 */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Tab identifier types
 */
export type TabId = 'titles' | 'insights' | 'image' | 'hashtags' | 'series' | 'seo';

/**
 * Color scheme types
 */
export type ColorScheme =
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'gray';

/**
 * Badge variant types
 */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/**
 * Loading state types
 */
export interface LoadingStates {
  titles: boolean;
  insights: boolean;
  image: boolean;
  hashtags: boolean;
}

/**
 * Button component props
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

/**
 * Card component props
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
  colorScheme?: ColorScheme;
  children: ReactNode;
}

/**
 * Badge component props
 */
export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

/**
 * Tab component props
 */
export interface TabProps {
  id: TabId;
  label: string;
  icon: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

/**
 * Tabs container props
 */
export interface TabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  children?: ReactNode;
}

/**
 * Copy button props
 */
export interface CopyButtonProps {
  text: string;
  itemId: string;
  label?: string;
  className?: string;
  onCopy?: (text: string) => void;
}

/**
 * Error message props
 */
export interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

/**
 * Loading spinner props
 */
export interface LoadingSpinnerProps {
  size?: ButtonSize;
  className?: string;
}

/**
 * Gradient card props
 */
export interface GradientCardProps extends HTMLAttributes<HTMLDivElement> {
  fromColor: string;
  toColor: string;
  children: ReactNode;
}

/**
 * Section props
 */
export interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

/**
 * Container props
 */
export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
  children: ReactNode;
}
