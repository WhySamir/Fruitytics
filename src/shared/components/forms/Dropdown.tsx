import { useState, useRef, useEffect } from 'react';
import type { FC } from 'react';
import { Field } from 'formik';
import type { FieldProps } from 'formik';
import clsx from 'clsx';
import { ChevronDown, X, Check, Search } from 'lucide-react';

interface Option {
  label: string;
  value: string | number;
}

export type { Option };

interface DropdownProps {
  name: string;
  label?: string;
  options: Option[];
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  disabled?: boolean;
  required?: boolean;
  styleWrapper?: string;
  styleLabel?: string;
  className?: string;
}

const Dropdown: FC<DropdownProps> = ({
  name,
  label,
  options,
  placeholder = 'Select...',
  isSearchable = false,
  isClearable = false,
  isMulti = false,
  disabled,
  required,
  styleWrapper,
  styleLabel,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, isSearchable]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Field name={name}>
      {({ field, form, meta }: FieldProps) => {
        const hasError = meta.touched && meta.error;
        const value = field.value;

        // Helper to get labels
        const getLabel = (val: string | number) =>
          options.find((o) => o.value === val)?.label;

        const handleSelect = (optionValue: string | number) => {
          if (isMulti) {
            const current = Array.isArray(value) ? value : [];
            const newValue = current.includes(optionValue)
              ? current.filter((v: string | number) => v !== optionValue)
              : [...current, optionValue];
            form.setFieldValue(name, newValue);
          } else {
            form.setFieldValue(name, optionValue);
            setIsOpen(false);
            setSearchTerm('');
          }
        };

        const handleClear = (e: React.MouseEvent) => {
          e.stopPropagation();
          form.setFieldValue(name, isMulti ? [] : '');
        };

        const displayValue = isMulti
          ? Array.isArray(value) && value.length > 0
            ? `${value.length} selected`
            : placeholder
          : value
            ? getLabel(value)
            : placeholder;

        return (
          <div
            className={clsx('w-full flex flex-col gap-1.5', styleWrapper)}
            ref={containerRef}
          >
            {label && (
              <label
                className={clsx(
                  'text-sm font-medium transition-colors duration-200',
                  hasError ? 'text-error' : 'text-gray-700',
                  styleLabel
                )}
              >
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
              </label>
            )}

            <div className="relative">
              <div
                onClick={() => {
                  if (!disabled) {
                    const next = !isOpen;
                    setIsOpen(next);
                    if (!next) setSearchTerm('');
                  }
                }}
                className={clsx(
                  'w-full px-3 py-2 text-sm border rounded-md transition-all duration-200 bg-white flex items-center justify-between cursor-pointer',
                  hasError
                    ? 'border-error focus-within:border-error text-error focus-within:ring-1 focus-within:ring-error/20'
                    : 'border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20',
                  disabled &&
                    'bg-gray-50 text-gray-400 cursor-not-allowed pointer-events-none',
                  isOpen && 'border-primary ring-1 ring-primary/20',
                  className
                )}
              >
                <div
                  className={clsx(
                    'truncate select-none',
                    !value && 'text-gray-400'
                  )}
                >
                  {isMulti && Array.isArray(value) && value.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {value.map((v: string | number) => (
                        <span
                          key={v}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-800 rounded text-xs"
                        >
                          {getLabel(v)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    displayValue
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isClearable &&
                    value &&
                    (value.length > 0 || typeof value === 'number') && (
                      <div
                        role="button"
                        onClick={handleClear}
                        className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={14} />
                      </div>
                    )}
                  <ChevronDown
                    size={16}
                    className={clsx(
                      'text-gray-400 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </div>
              </div>

              {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto overflow-x-hidden animate-in fade-in zoom-in-95 duration-100">
                  {isSearchable && (
                    <div className="sticky top-0 p-2 bg-white border-b border-gray-100">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          ref={searchInputRef}
                          type="text"
                          className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                          placeholder="Search..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  )}

                  <div className="py-1">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((opt) => {
                        const isSelected = isMulti
                          ? Array.isArray(value) && value.includes(opt.value)
                          : value === opt.value;

                        return (
                          <div
                            key={opt.value}
                            onClick={() => handleSelect(opt.value)}
                            className={clsx(
                              'px-3 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors',
                              isSelected
                                ? 'bg-primary/5 text-primary font-medium'
                                : 'text-gray-700 hover:bg-gray-50'
                            )}
                          >
                            <span>{opt.label}</span>
                            {isSelected && (
                              <Check size={14} className="text-primary" />
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-3 py-4 text-xs text-gray-500 text-center">
                        No results found
                      </div>
                    )}
                  </div>
                </div>
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

export default Dropdown;
