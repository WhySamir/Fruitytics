import { useRef } from 'react';
import type { FC } from 'react';
import { Field } from 'formik';
import type { FieldProps } from 'formik';
import clsx from 'clsx';

interface OtpProps {
  name: string;
  length?: number;
  label?: string;
  styleWrapper?: string;
  styleLabel?: string;
}

const Otp: FC<OtpProps> = ({
  name,
  length = 6,
  label,
  styleWrapper,
  styleLabel,
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;
        // Ensure value is a string of correct length
        const value = (field.value || '').toString();

        const handleChange = (
          e: React.ChangeEvent<HTMLInputElement>,
          index: number
        ) => {
          const val = e.target.value;
          if (isNaN(Number(val))) return; // Only allow numbers

          const newValue = value.split('');
          // Take only the last character if multiple typed
          newValue[index] = val.slice(-1);
          const finalValue = newValue.join('').substring(0, length);

          form.setFieldValue(name, finalValue);

          // Focus next
          if (val && index < length - 1) {
            inputsRef.current[index + 1]?.focus();
          }
        };

        const handleKeyDown = (
          e: React.KeyboardEvent<HTMLInputElement>,
          index: number
        ) => {
          if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
              // If empty and backspace, go to prev and clear
              inputsRef.current[index - 1]?.focus();
              const newValue = value.split('');
              newValue[index - 1] = ''; // Clear prev
              form.setFieldValue(name, newValue.join(''));
            } else {
              // Just clear current
              const newValue = value.split('');
              newValue[index] = '';
              form.setFieldValue(name, newValue.join(''));
            }
          }
        };

        const handlePaste = (e: React.ClipboardEvent) => {
          e.preventDefault();
          const pasteData = e.clipboardData.getData('text').slice(0, length);
          if (/^\d+$/.test(pasteData)) {
            form.setFieldValue(name, pasteData);
            // Focus last filled
            const nextIndex = Math.min(pasteData.length, length - 1);
            inputsRef.current[nextIndex]?.focus();
          }
        };

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
              </label>
            )}

            <div className="flex gap-2">
              {Array.from({ length }).map((_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={value[index] || ''}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={clsx(
                    'w-10 h-12 text-center text-lg border rounded-md outline-none transition-all duration-200',
                    'focus:border-primary focus:ring-1 focus:ring-primary/20',
                    hasError
                      ? 'border-error text-error'
                      : 'border-gray-300 bg-white'
                  )}
                />
              ))}
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

export default Otp;
