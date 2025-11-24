/**
 * UI Components Index
 *
 * @description Central export point for all UI components
 * Enables clean imports: import { Button, Card } from '@/app/components/ui'
 */

// Existing components
export { Button } from './Button/Button';
export { Card, GradientCard, ScoreCard, ContentCard } from './Card/Card';
export { Badge } from './Badge/Badge';
export { CopyButton } from './CopyButton/CopyButton';
export { ErrorMessage } from './ErrorMessage/ErrorMessage';
export { LoadingSpinner } from './LoadingSpinner/LoadingSpinner';
export { Tab, TabsContainer, TabPanel } from './Tabs/Tabs';

// New components
export { EmptyState, NoDataEmptyState, NoResultsEmptyState, ErrorEmptyState } from './EmptyState';
export { SectionHeader, CompactSectionHeader, SectionDivider, SectionHeaderWithUnderline } from './SectionHeader';
export { ProgressBar, CircularProgress, SegmentedProgressBar } from './ProgressBar';
export { BadgeList, HashtagList } from './BadgeList';
export { InfoCard, StatCard, FeatureCard } from './InfoCard';

// Type exports
export type { EmptyStateProps } from './EmptyState';
export type { SectionHeaderProps } from './SectionHeader';
export type { ProgressBarProps } from './ProgressBar';
export type { BadgeListProps } from './BadgeList';
export type { InfoCardProps } from './InfoCard';
