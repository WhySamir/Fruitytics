import type { ChangeEvent, FC } from 'react';
import { Field } from 'formik';
import type { FieldProps } from 'formik';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  styleWrapper?: string;
  styleLabel?: string;
  styleInput?: string;
}

const Textarea: FC<TextareaProps> = ({
  name,
  label,
  className,
  styleWrapper,
  styleLabel,
  styleInput,
  rows = 4,
  onChange,
  onFocus,
  onBlur,
  ...restProps
}) => {
  return (
    <Field name={name}>
      {({ field, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;

        const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
          if (onChange) {
            onChange(e);
          } else {
            field.onChange(e);
          }
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

            <div className="relative">
              <textarea
                {...field}
                {...restProps}
                id={name}
                rows={rows}
                value={
                  restProps.value !== undefined
                    ? restProps.value
                    : field.value || ''
                }
                onChange={handleChange}
                onFocus={(e) => {
                  if (onFocus) onFocus(e);
                }}
                onBlur={(e) => {
                  field.onBlur(e);
                  if (onBlur) onBlur(e);
                }}
                className={clsx(
                  'w-full px-3 py-2 text-sm border rounded-md outline-none transition-all duration-200 bg-white placeholder-gray-400 resize-y',
                  hasError
                    ? 'border-error focus:border-error text-error focus:ring-1 focus:ring-error/20'
                    : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20',
                  restProps.disabled &&
                    'bg-gray-50 text-gray-400 cursor-not-allowed',
                  className,
                  styleInput
                )}
              />
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

export default Textarea;
