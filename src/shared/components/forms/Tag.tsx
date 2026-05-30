import { useState } from 'react';
import type { FC, KeyboardEvent } from 'react';
import { Field } from 'formik';
import type { FieldProps } from 'formik';
import clsx from 'clsx';
import { X } from 'lucide-react';

interface TagProps {
  name: string;
  label?: string;
  placeholder?: string;
  styleWrapper?: string;
  styleLabel?: string;
  disabled?: boolean;
}

const Tag: FC<TagProps> = ({
  name,
  label,
  placeholder = 'Add a tag...',
  styleWrapper,
  styleLabel,
  disabled,
}) => {
  const [inputValue, setInputValue] = useState('');

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;
        const tags: string[] = Array.isArray(field.value) ? field.value : [];

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const val = inputValue.trim();
            if (val && !tags.includes(val)) {
              form.setFieldValue(name, [...tags, val]);
              setInputValue('');
            }
          } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag if input is empty and backspace pressed
            const newTags = [...tags];
            newTags.pop();
            form.setFieldValue(name, newTags);
          }
        };

        const removeTag = (tag: string) => {
          const newTags = tags.filter((t) => t !== tag);
          form.setFieldValue(name, newTags);
        };

        return (
          <div className={clsx('w-full flex flex-col gap-1.5', styleWrapper)}>
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

            <div
              className={clsx(
                'w-full px-3 py-2 text-sm border rounded-md transition-all duration-200 bg-white flex flex-wrap gap-2 items-center min-h-[42px]',
                hasError
                  ? 'border-error focus-within:border-error focus-within:ring-1 focus-within:ring-error/20'
                  : 'border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20',
                disabled && 'bg-gray-50 cursor-not-allowed'
              )}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={disabled}
                    className="ml-1 hover:text-primary-dark focus:outline-none"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ''}
                disabled={disabled}
                className="flex-1 outline-none bg-transparent min-w-[60px] placeholder-gray-400"
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

export default Tag;
