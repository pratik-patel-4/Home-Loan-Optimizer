import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Props for SectionCard component
 */
export interface SectionCardProps {
  /** Section title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional icon from lucide-react */
  icon?: LucideIcon;
  /** Children content */
  children: React.ReactNode;
  /** Whether the section is collapsible */
  collapsible?: boolean;
  /** Default open state (only for collapsible) */
  defaultOpen?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional CSS classes for content area */
  contentClassName?: string;
}

/**
 * A container card for grouping related content
 * 
 * Features:
 * - Title with optional icon
 * - Optional description
 * - Children content area
 * - Collapsible option
 * - Responsive layout
 * - Accessible with proper ARIA attributes
 * 
 * @example
 * ```tsx
 * import { Activity } from 'lucide-react';
 * 
 * <SectionCard
 *   title="Loan Health Analyzer"
 *   description="Analyze your current loan status"
 *   icon={Activity}
 *   collapsible
 *   defaultOpen
 * >
 *   {/* Calculator content *\/}
 * </SectionCard>
 * ```
 */
export const SectionCard = React.forwardRef<HTMLDivElement, SectionCardProps>(
  (
    {
      title,
      description,
      icon: Icon,
      children,
      collapsible = false,
      defaultOpen = true,
      className,
      contentClassName,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    const contentId = React.useId();

    const toggleOpen = () => {
      if (collapsible) {
        setIsOpen(!isOpen);
      }
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'transition-all',
          className
        )}
      >
        <CardHeader
          className={cn(
            collapsible && 'cursor-pointer hover:bg-muted/50 transition-colors',
            'relative'
          )}
          onClick={toggleOpen}
          role={collapsible ? 'button' : undefined}
          aria-expanded={collapsible ? isOpen : undefined}
          aria-controls={collapsible ? contentId : undefined}
          tabIndex={collapsible ? 0 : undefined}
          onKeyDown={collapsible ? (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleOpen();
            }
          } : undefined}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {Icon && (
                <div className="mt-0.5">
                  <Icon 
                    className="h-5 w-5 text-primary" 
                    aria-hidden="true"
                  />
                </div>
              )}
              <div className="flex-1 space-y-1">
                <CardTitle className="text-xl font-semibold">
                  {title}
                </CardTitle>
                {description && (
                  <CardDescription className="text-sm">
                    {description}
                  </CardDescription>
                )}
              </div>
            </div>
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 shrink-0"
                aria-label={isOpen ? 'Collapse section' : 'Expand section'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOpen();
                }}
              >
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        {(!collapsible || isOpen) && (
          <CardContent
            id={contentId}
            className={cn(
              'pt-0',
              contentClassName
            )}
          >
            {children}
          </CardContent>
        )}
      </Card>
    );
  }
);

SectionCard.displayName = 'SectionCard';

// Made with Bob
