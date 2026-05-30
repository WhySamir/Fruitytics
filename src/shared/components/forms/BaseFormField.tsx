/**
 * Base Form Field Component
 * Shared pattern for all form components to reduce duplication
 *
 * This component provides:
 * - Consistent error handling
 * - Consistent label rendering
 * - Consistent styling
 * - Type-safe Formik integration
 */

import { Field } from 'formik';
import type { FieldProps } from 'formik';
import type { ReactNode } from 'react';
import clsx from 'clsx';

export interface BaseFormFieldProps {
  /**
   * Field name (Formik field name)
   */
  name: string;
  /**
   * Field label
   */
  label?: string;
  /**
   * Whether field is required
   */
  required?: boolean;
  /**
   * Whether field is disabled
   */
  disabled?: boolean;
  /**
   * Custom error message (overrides Formik error)
   */
  error?: string;
  /**
   * Custom wrapper className
   */
  wrapperClassName?: string;
  /**
   * Custom label className
   */
  labelClassName?: string;
  /**
   * Help text to display below field
   */
  helpText?: string;
  /**
   * Field content (the actual input/select/etc)
   */
  children: (fieldProps: FieldProps) => ReactNode;
}

/**
 * Base Form Field
 * Provides consistent structure for all form fields
 */
export function BaseFormField({
  name,
  label,
  required = false,
  disabled = false,
  error: externalError,
  wrapperClassName,
  labelClassName,
  helpText,
  children,
}: BaseFormFieldProps) {
  return (
    <Field name={name}>
      {({ field, meta, form }: FieldProps) => {
        const hasError = externalError || (meta.touched && meta.error);
        const errorMessage =
          externalError ||
          (meta.touched && meta.error ? String(meta.error) : null);

        return (
          <div className={clsx('mb-6 w-full', wrapperClassName)}>
            {label && (
              <label
                htmlFor={name}
                className={clsx(
                  'block text-sm font-medium mb-2',
                  hasError ? 'text-error' : 'text-gray-700',
                  labelClassName
                )}
              >
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
              </label>
            )}

            <div
              className={clsx(
                'transition-colors duration-200',
                hasError && 'border-error',
                disabled && 'opacity-60 pointer-events-none'
              )}
            >
              {children({ field, meta, form })}
            </div>

            {helpText && !hasError && (
              <p className="text-xs text-gray-500 mt-1">{helpText}</p>
            )}

            {hasError && errorMessage && (
              <p className="text-xs text-error mt-1 animate-in fade-in slide-in-from-top-1">
                {errorMessage}
              </p>
            )}
          </div>
        );
      }}
    </Field>
  );
}
