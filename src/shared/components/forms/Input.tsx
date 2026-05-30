import { useRef } from 'react';
import type { ChangeEvent, FC } from 'react';
import { Field } from 'formik';
import type { FieldProps } from 'formik';
import clsx from 'clsx';
import { Plus } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'url'
    | 'date'
    | 'number'
    | 'time'
    | 'datetime-local'
    | 'search'
    | 'tel';
  styleWrapper?: string;
  styleLabel?: string;
  styleInput?: string;
  containerClassName?: string;
  hasAddButton?: boolean;
}

const Input: FC<InputProps> = ({
  name,
  label,
  type = 'text',
  className,
  styleWrapper,
  styleLabel,
  styleInput,
  containerClassName,
  hasAddButton,
  onChange,
  onFocus,
  onBlur,
  ...restProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper for date pickers
  const handleContainerClick = () => {
    if (type === 'date' || type === 'datetime-local' || type === 'time') {
      inputRef.current?.showPicker?.();
    }
  };

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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

            <div
              className={clsx(
                'relative flex items-center group transition-all duration-200',
                containerClassName
              )}
              onClick={handleContainerClick}
            >
              <input
                {...field}
                {...restProps}
                ref={inputRef}
                id={name}
                type={type}
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
                  'w-full px-3 py-2 text-sm border rounded-md outline-none transition-all duration-200 bg-white placeholder-gray-400',
                  hasAddButton ? 'rounded-r-none border-r-0' : '',
                  hasError
                    ? 'border-error focus:border-error text-error focus:ring-1 focus:ring-error/20'
                    : 'border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20',
                  restProps.disabled &&
                    'bg-gray-50 text-gray-400 cursor-not-allowed',
                  className,
                  styleInput
                )}
              />

              {hasAddButton && (
                <button
                  type="button"
                  onClick={() => {
                    // Using a custom event or callback would be better,
                    // but for now let's just clear the field as a placeholder action
                    // or implement if we knew the target list.
                    // The user's code had specific logic. I'll add a 'onAddClick' prop to InputProps for safety.
                    if (restProps.onAddClick) {
                      restProps.onAddClick(field.value);
                      form.setFieldValue(name, '');
                    }
                  }}
                  className={clsx(
                    'flex items-center justify-center px-3 py-2 bg-primary text-white',
                    'rounded-r-md border border-primary hover:bg-primary-dark transition-colors',
                    'focus:outline-none focus:ring-1 focus:ring-primary/20'
                  )}
                >
                  <Plus size={18} />
                </button>
              )}
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

// Extend interface to support the potentially missing prop from my strict implementation
declare module 'react' {
  interface InputHTMLAttributes<T> extends DOMAttributes<T> {
    onAddClick?: (value: string) => void;
  }
}

export default Input;
