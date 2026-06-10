import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Props for PercentageInput component
 */
export interface PercentageInputProps {
  /** Current percentage value (0-100) */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Input label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum allowed percentage (default: 0) */
  min?: number;
  /** Maximum allowed percentage (default: 100) */
  max?: number;
  /** Number of decimal places (default: 2) */
  decimals?: number;
  /** Error message to display */
  error?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Input ID for accessibility */
  id?: string;
  /** Helper text to display below input */
  helperText?: string;
}

/**
 * A specialized input component for percentage values
 * 
 * Features:
 * - Displays % symbol suffix
 * - Validates percentage range (0-100 by default)
 * - Supports decimal percentages (e.g., 10.60%)
 * - Keyboard navigation support
 * - Accessible with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <PercentageInput
 *   label="Interest Rate"
 *   value={interestRate}
 *   onChange={setInterestRate}
 *   placeholder="Enter rate"
 *   decimals={2}
 * />
 * ```
 */
export const PercentageInput = React.forwardRef<HTMLInputElement, PercentageInputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder = 'Enter percentage',
      min = 0,
      max = 100,
      decimals = 2,
      error,
      disabled = false,
      className,
      id,
      helperText,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState<string>('');
    const [isFocused, setIsFocused] = React.useState(false);
    const inputId = id || `percentage-input-${React.useId()}`;

    // Update display value when value prop changes (only when not focused)
    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(value > 0 ? value.toFixed(decimals) : '');
      }
    }, [value, isFocused, decimals]);

    /**
     * Validate percentage against min/max constraints
     */
    const validatePercentage = (num: number): number => {
      let validated = num;
      
      if (validated < min) {
        validated = min;
      }
      
      if (validated > max) {
        validated = max;
      }
      
      // Round to specified decimal places
      validated = Math.round(validated * Math.pow(10, decimals)) / Math.pow(10, decimals);
      
      return validated;
    };

    /**
     * Handle input change - parse and validate percentage input
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow empty input
      if (inputValue === '') {
        setDisplayValue('');
        onChange(0);
        return;
      }

      // Remove non-numeric characters except dot
      const cleaned = inputValue.replace(/[^\d.]/g, '');
      
      // Prevent multiple decimal points
      const parts = cleaned.split('.');
      const formatted = parts.length > 2 
        ? `${parts[0]}.${parts.slice(1).join('')}` 
        : cleaned;
      
      // Parse the value
      const numericValue = parseFloat(formatted);
      
      // Check if valid number
      if (isNaN(numericValue)) {
        return;
      }

      // Update display value (keep user's input format while typing)
      setDisplayValue(formatted);
      
      // Validate and update parent
      const validated = validatePercentage(numericValue);
      onChange(validated);
    };

    /**
     * Handle focus - prepare for editing
     */
    const handleFocus = () => {
      setIsFocused(true);
      // Show value without trailing zeros for easier editing
      if (value > 0) {
        setDisplayValue(value.toString());
      }
    };

    /**
     * Handle blur - validate and format the value
     */
    const handleBlur = () => {
      setIsFocused(false);
      if (value > 0) {
        const validated = validatePercentage(value);
        setDisplayValue(validated.toFixed(decimals));
        if (validated !== value) {
          onChange(validated);
        }
      } else {
        setDisplayValue('');
      }
    };

    /**
     * Handle keyboard input - prevent invalid characters
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter
      if (
        [8, 9, 27, 13, 46].includes(e.keyCode) ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right, up, down
        (e.keyCode >= 35 && e.keyCode <= 40)
      ) {
        // Handle up/down arrow keys for increment/decrement
        if (e.keyCode === 38) { // Up arrow
          e.preventDefault();
          const step = Math.pow(10, -decimals);
          const newValue = validatePercentage(value + step);
          onChange(newValue);
        } else if (e.keyCode === 40) { // Down arrow
          e.preventDefault();
          const step = Math.pow(10, -decimals);
          const newValue = validatePercentage(value - step);
          onChange(newValue);
        }
        return;
      }
      
      // Ensure that it is a number or decimal point
      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105) &&
        e.keyCode !== 190 && // decimal point
        e.keyCode !== 110 // numpad decimal
      ) {
        e.preventDefault();
      }
    };

    return (
      <div className={cn('space-y-2', className)}>
        <Label 
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium',
            error && 'text-destructive'
          )}
        >
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error 
                ? `${inputId}-error` 
                : helperText 
                ? `${inputId}-helper` 
                : undefined
            }
            className={cn(
              'pr-8',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
          />
          <span
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              error && 'text-destructive',
              disabled && 'opacity-50'
            )}
            aria-hidden="true"
          >
            %
          </span>
        </div>
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

PercentageInput.displayName = 'PercentageInput';

// Made with Bob
