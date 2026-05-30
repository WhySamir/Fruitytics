import type { FC } from 'react';
import { Field } from 'formik';
import type { FieldProps } from 'formik';
import clsx from 'clsx';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  styleWrapper?: string;
  styleLabel?: string;
}

const Checkbox: FC<CheckboxProps> = ({
  name,
  label,
  className: _className,
  styleWrapper,
  styleLabel,
  ...restProps
}) => {
  return (
    <Field name={name} type="checkbox">
      {({ field, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;
        const isChecked = field.checked || field.value === true;

        return (
          <div className={clsx('flex flex-col gap-1.5', styleWrapper)}>
            <label
              className={clsx(
                'inline-flex items-start gap-2 cursor-pointer group select-none',
                restProps.disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              <div className="relative flex items-center pt-0.5">
                <input
                  {...field}
                  {...restProps}
                  type="checkbox"
                  className="peer sr-only" // Hide default checkbox
                />
                <div
                  className={clsx(
                    'w-4 h-4 border rounded shadow-sm transition-all duration-200 flex items-center justify-center',
                    isChecked
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-gray-300 hover:border-primary/50',
                    hasError && !isChecked && 'border-error'
                  )}
                >
                  <Check
                    size={12}
                    className={clsx(
                      'transition-transform duration-200',
                      isChecked ? 'scale-100' : 'scale-0'
                    )}
                    strokeWidth={3}
                  />
                </div>
                {/* Focus ring wrapper */}
                <div className="absolute -inset-1 rounded-md transition-all duration-200 pointer-events-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20" />
              </div>

              {label && (
                <span
                  className={clsx(
                    'text-sm',
                    hasError ? 'text-error' : 'text-gray-700',
                    styleLabel
                  )}
                >
                  {label}
                  {restProps.required && (
                    <span className="text-error ml-0.5">*</span>
                  )}
                </span>
              )}
            </label>

            {hasError && (
              <p className="text-xs text-error animate-in fade-in slide-in-from-top-1 ml-6">
                {typeof meta.error === 'string' ? meta.error : 'Error'}
              </p>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default Checkbox;
