import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency, parseCurrency } from '@/utils/currency';
import { cn } from '@/lib/utils';

/**
 * Props for CurrencyInput component
 */
export interface CurrencyInputProps {
  /** Current numeric value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Input label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Error message to display */
  error?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Input ID for accessibility */
  id?: string;
}

/**
 * A specialized input component for Indian currency (₹)
 * 
 * Features:
 * - Displays rupee symbol (₹) prefix
 * - Formats numbers with Indian numbering system (10,11,566)
 * - Real-time formatting as user types
 * - Validates numeric input only
 * - Accessible with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <CurrencyInput
 *   label="Loan Amount"
 *   value={loanAmount}
 *   onChange={setLoanAmount}
 *   placeholder="Enter amount"
 *   error={amountError}
 * />
 * ```
 */
export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder = 'Enter amount',
      error,
      disabled = false,
      className,
      id,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState<string>('');
    const [isFocused, setIsFocused] = React.useState(false);
    const inputId = id || `currency-input-${React.useId()}`;

    // Update display value when value prop changes (only when not focused)
    React.useEffect(() => {
      if (!isFocused) {
        setDisplayValue(value > 0 ? formatCurrency(value).replace('₹', '') : '');
      }
    }, [value, isFocused]);

    /**
     * Handle input change - parse and validate numeric input
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow empty input
      if (inputValue === '') {
        setDisplayValue('');
        onChange(0);
        return;
      }

      // Remove non-numeric characters except comma, dot, and minus
      const cleaned = inputValue.replace(/[^\d,.-]/g, '');
      
      // Parse the value
      const numericValue = parseCurrency(cleaned);
      
      // Validate: must be non-negative
      if (numericValue < 0) {
        return;
      }

      // Update display value (keep user's input format while typing)
      setDisplayValue(cleaned);
      
      // Update parent with numeric value
      onChange(numericValue);
    };

    /**
     * Handle focus - show raw numeric value for editing
     */
    const handleFocus = () => {
      setIsFocused(true);
      // Show unformatted value for easier editing
      if (value > 0) {
        setDisplayValue(value.toString());
      }
    };

    /**
     * Handle blur - format the value
     */
    const handleBlur = () => {
      setIsFocused(false);
      // Format the value when user leaves the input
      if (value > 0) {
        setDisplayValue(formatCurrency(value).replace('₹', ''));
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
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
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
          <span
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              error && 'text-destructive',
              disabled && 'opacity-50'
            )}
            aria-hidden="true"
          >
            ₹
          </span>
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
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'pl-8',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
          />
        </div>
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

CurrencyInput.displayName = 'CurrencyInput';

// Made with Bob
