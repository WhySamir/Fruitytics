import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

// Password is essentially an Input with extra logic,
// so we can wrap Input or rebuild. Rebuilding gives more control if Input slotting is rigid.
// But Input accepts ...props.
// However, Input has internal state.
// A wrapper is cleaner if Input allows a right-side element/icon.
// My Input implementation implies basic HTML props.
// Let's modify Input to accept a right element or valid suffix?
// Or just replicate the logic since it's small.
// Replicating logic is often safer for independent styling needs in "boilerplate" contexts.

import { Field } from 'formik';
import type { FieldProps } from 'formik';

interface PasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  styleWrapper?: string;
  styleLabel?: string;
  styleInput?: string;
}

const Password: FC<PasswordProps> = ({
  name,
  label,
  className,
  styleWrapper,
  styleLabel,
  styleInput,
  onChange,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => setShowPassword(!showPassword);

  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;

        // Shared handleChange logic
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          if (onChange) onChange(e);
          else field.onChange(e);
        };

        return (
          <div className={clsx('w-full flex flex-col gap-1.5', styleWrapper)}>
            {label && (
              <label
                htmlFor={name}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200',
                  hasError ? 'text-error' : 'text-gray-700',
                  styleLabel
                )}
              >
                {label}
                {restProps.required && (
                  <span className="text-error ml-0.5">*</span>
                )}
              </label>
            )}

            <div className="relative flex items-center group">
              <input
                {...field}
                {...restProps}
                id={name}
                type={showPassword ? 'text' : 'password'}
                onChange={handleChange}
                onFocus={(e) => {
                  if (onFocus) onFocus(e);
                }}
                onBlur={(e) => {
                  field.onBlur(e);
                  if (onBlur) onBlur(e);
                }}
                className={clsx(
                  'w-full px-3 py-2 text-sm border rounded-md outline-none transition-all duration-200 bg-white placeholder-gray-400 pr-10',
                  hasError
                    ? 'border-error focus:border-error text-error focus:ring-1 focus:ring-error/20'
                    : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20',
                  restProps.disabled &&
                    'bg-gray-50 text-gray-400 cursor-not-allowed',
                  className,
                  styleInput
                )}
              />

              <button
                type="button"
                onClick={toggleVisibility}
                disabled={restProps.disabled}
                className={clsx(
                  'absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none',
                  restProps.disabled &&
                    'cursor-not-allowed opacity-50 hover:text-gray-400'
                )}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {hasError && (
              <p className="text-xs text-error mt-0.5 animate-in fade-in slide-in-from-top-1">
                {typeof meta.error === 'string' ? meta.error : 'Error'}
              </p>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default Password;
