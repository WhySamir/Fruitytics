import type { FC } from 'react';
import { Field } from 'formik';
import type { FieldProps } from 'formik';
import clsx from 'clsx';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  styleWrapper?: string;
  styleLabel?: string;
}

const Switch: FC<SwitchProps> = ({
  name,
  label,
  styleWrapper,
  styleLabel,
  className: _className,
  ...restProps
}) => {
  return (
    <Field name={name} type="checkbox">
      {({ field, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;
        const isChecked = field.checked || field.value === true;

        return (
          <div className={clsx('flex flex-col gap-1.5', styleWrapper)}>
            {/* If label is meant to be next to the switch, we might want a different layout. 
                 But adhering to the generic pattern: Label on top (if provided), switch below? 
                 Or maybe side-by-side. 
                 Usually toggle switches have side-by-side labels. I'll support that. */}

            <label
              className={clsx(
                'inline-flex items-center justify-between cursor-pointer group select-none w-full',
                restProps.disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              {label && (
                <span
                  className={clsx(
                    'text-sm font-medium mr-3',
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

              <div className="relative">
                <input
                  {...field}
                  {...restProps}
                  type="checkbox"
                  className="peer sr-only"
                />
                <div
                  className={clsx(
                    'w-11 h-6 rounded-full transition-colors duration-200 ease-in-out',
                    isChecked
                      ? 'bg-primary'
                      : 'bg-gray-200 group-hover:bg-gray-300',
                    hasError && !isChecked && 'bg-error/30'
                  )}
                >
                  <div
                    className={clsx(
                      'absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow-sm transition-transform duration-200',
                      isChecked ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </div>
                {/* Focus ring */}
                <div className="absolute -inset-1 rounded-full transition-all duration-200 pointer-events-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20" />
              </div>
            </label>

            {hasError && (
              <p className="text-xs text-error mt-0.5 animate-in fade-in slide-in-from-top-1 text-right">
                {typeof meta.error === 'string' ? meta.error : 'Error'}
              </p>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default Switch;
