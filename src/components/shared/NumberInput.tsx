import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Props for NumberInput component
 */
export interface NumberInputProps {
  /** Current numeric value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Input label */
  label: string;
  /** Placeholder text */
  placeholder?: string;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment for arrow keys */
  step?: number;
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
 * A generic number input component with validation
 * 
 * Features:
 * - Accepts only numeric values
 * - Optional min/max validation
 * - Optional step increment
 * - Keyboard navigation support
 * - Accessible with proper ARIA labels
 * 
 * @example
 * ```tsx
 * <NumberInput
 *   label="Loan Tenure"
 *   value={tenure}
 *   onChange={setTenure}
 *   min={1}
 *   max={30}
 *   step={1}
 *   placeholder="Enter years"
 * />
 * ```
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      label,
      placeholder = 'Enter number',
      min,
      max,
      step = 1,
      error,
      disabled = false,
      className,
      id,
      helperText,
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState<string>('');
    const inputId = id || `number-input-${React.useId()}`;

    // Update display value when value prop changes
    React.useEffect(() => {
      setDisplayValue(value > 0 ? value.toString() : '');
    }, [value]);

    /**
     * Validate number against min/max constraints
     */
    const validateNumber = (num: number): number => {
      let validated = num;
      
      if (min !== undefined && validated < min) {
        validated = min;
      }
      
      if (max !== undefined && validated > max) {
        validated = max;
      }
      
      return validated;
    };

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

      // Remove non-numeric characters except dot and minus
      const cleaned = inputValue.replace(/[^\d.-]/g, '');
      
      // Parse the value
      const numericValue = parseFloat(cleaned);
      
      // Check if valid number
      if (isNaN(numericValue)) {
        return;
      }

      // Update display value (keep user's input format while typing)
      setDisplayValue(cleaned);
      
      // Validate and update parent
      const validated = validateNumber(numericValue);
      onChange(validated);
    };

    /**
     * Handle blur - validate and format the value
     */
    const handleBlur = () => {
      if (value > 0) {
        const validated = validateNumber(value);
        setDisplayValue(validated.toString());
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
          const newValue = validateNumber(value + step);
          onChange(newValue);
        } else if (e.keyCode === 40) { // Down arrow
          e.preventDefault();
          const newValue = validateNumber(value - step);
          onChange(newValue);
        }
        return;
      }
      
      // Ensure that it is a number or decimal point
      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105) &&
        e.keyCode !== 190 && // decimal point
        e.keyCode !== 110 && // numpad decimal
        e.keyCode !== 189 && // minus
        e.keyCode !== 109 // numpad minus
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
        <Input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
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
            error && 'border-destructive focus-visible:ring-destructive'
          )}
        />
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

NumberInput.displayName = 'NumberInput';

// Made with Bob
