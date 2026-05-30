import type { FC } from 'react';
import { Field } from 'formik';
import type { FieldProps } from 'formik';
import clsx from 'clsx';

interface RadioOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value'
> {
  name: string;
  label?: string;
  options: RadioOption[];
  styleWrapper?: string;
  styleLabel?: string;
  direction?: 'row' | 'column';
}

const Radio: FC<RadioProps> = ({
  name,
  label,
  options,
  styleWrapper,
  styleLabel,
  direction = 'column',
  className: _className,
  ...restProps
}) => {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;

        return (
          <div className={clsx('flex flex-col gap-2', styleWrapper)}>
            {label && (
              <label
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

            <div
              className={clsx(
                'flex gap-3',
                direction === 'column' ? 'flex-col' : 'flex-row flex-wrap'
              )}
            >
              {options.map((option) => {
                const isSelected = String(field.value) === String(option.value);

                return (
                  <label
                    key={String(option.value)}
                    className={clsx(
                      'inline-flex items-center gap-2 cursor-pointer group select-none',
                      (option.disabled || restProps.disabled) &&
                        'cursor-not-allowed opacity-60'
                    )}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        {...field}
                        {...restProps}
                        type="radio"
                        value={String(option.value)}
                        className="peer sr-only"
                        disabled={option.disabled || restProps.disabled}
                        checked={isSelected}
                      />
                      <div
                        className={clsx(
                          'w-4 h-4 border rounded-full transition-all duration-200 flex items-center justify-center',
                          isSelected
                            ? 'border-primary'
                            : 'border-gray-300 group-hover:border-primary/50',
                          hasError && !isSelected && 'border-error'
                        )}
                      >
                        <div
                          className={clsx(
                            'w-2 h-2 rounded-full bg-primary transition-transform duration-200',
                            isSelected ? 'scale-100' : 'scale-0'
                          )}
                        />
                      </div>
                      {/* Focus ring */}
                      <div className="absolute -inset-1 rounded-full transition-all duration-200 pointer-events-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20" />
                    </div>
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                );
              })}
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

export default Radio;
