import { useRef, useState, useEffect } from 'react';
import type { FC, ChangeEvent } from 'react';
import { Field } from 'formik';
import { ChevronDown, Search, Check } from 'lucide-react';
import clsx from 'clsx';
import countries from '../../constants/countries';

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string; // emoji flag
}

interface PhoneInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  className?: string;
  onChange?: (value: string) => void;
  onCountryChange?: (country: Country) => void;
}

const DEFAULT_COUNTRY: Country =
  countries.find((c: Country) => c.code === 'NP') ?? countries[0]!;

const PhoneInput: FC<PhoneInputProps> = ({
  name,
  label,
  placeholder = 'Phone number',
  required = false,
  disabled = false,
  readOnly = false,
  error,
  className = '',
  onChange,
  onCountryChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] =
    useState<Country>(DEFAULT_COUNTRY);
  const [isFocused, setIsFocused] = useState(false);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter countries based on search
  const filteredCountries = countries.filter(
    (country: Country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dialCode.includes(search) ||
      country.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleCountrySelect = (country: Country): void => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearch('');
    onCountryChange?.(country);
  };

  const handlePhoneChange = (
    form: { setFieldValue: (name: string, value: string) => void },
    value: string
  ) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Limit to 15 digits (max phone number length with country code)
    if (numericValue.length <= 15) {
      const fullNumber = selectedCountry.dialCode + numericValue;

      if (onChange) {
        onChange(fullNumber);
      } else {
        form.setFieldValue(name, fullNumber);
      }
    }
  };

  // Extract phone number without country code for display
  const extractPhoneNumber = (fullNumber: string): string => {
    if (!fullNumber?.startsWith(selectedCountry.dialCode)) {
      return fullNumber || '';
    }
    return fullNumber.slice(selectedCountry.dialCode.length);
  };

  return (
    <Field name={name}>
      {({
        field,
        form,
        meta,
      }: {
        field: { value: string; name: string; onBlur?: (name: string) => void };
        form: { setFieldValue: (name: string, value: string) => void };
        meta: { touched: boolean; error?: string };
      }) => {
        const hasError = error || (meta.touched && meta.error);
        const phoneNumber = extractPhoneNumber(field.value || '');

        return (
          <div className={clsx('space-y-2', className)} ref={dropdownRef}>
            {/* Label */}
            {label && (
              <label
                className={clsx(
                  'block text-sm font-medium',
                  hasError ? 'text-red-600' : 'text-gray-700'
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}

            {/* Input Container */}
            <div className="relative">
              <div
                className={clsx(
                  'flex items-center border rounded-lg transition-all duration-200',
                  hasError
                    ? 'border-red-500 ring-1 ring-red-500'
                    : isFocused
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-gray-300 hover:border-gray-400',
                  (disabled || readOnly) &&
                    'bg-gray-50 cursor-not-allowed opacity-70'
                )}
              >
                {/* Country Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
                    disabled={disabled || readOnly}
                    className={clsx(
                      'flex items-center gap-2 px-3 py-2.5 border-r border-gray-300',
                      'bg-gray-50 hover:bg-gray-100 transition-colors rounded-l-lg',
                      (disabled || readOnly) && 'hover:bg-gray-50'
                    )}
                  >
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {selectedCountry.dialCode}
                    </span>
                    <ChevronDown
                      className={clsx(
                        'w-4 h-4 text-gray-500 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {isOpen && !disabled && !readOnly && (
                    <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                      {/* Search */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search country..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Country List */}
                      <div className="max-h-64 overflow-y-auto">
                        {filteredCountries.map((country: Country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={clsx(
                              'w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors',
                              selectedCountry.code === country.code &&
                                'bg-blue-50'
                            )}
                          >
                            <span className="text-xl flex-shrink-0">
                              {country.flag}
                            </span>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-gray-900">
                                {country.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {country.dialCode}
                              </div>
                            </div>
                            {selectedCountry.code === country.code && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Number Input */}
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    handlePhoneChange(form, e.target.value);
                  }}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setIsFocused(false);
                    field.onBlur?.(field.name);
                  }}
                  placeholder={placeholder}
                  disabled={disabled}
                  readOnly={readOnly}
                  className={clsx(
                    'flex-1 px-3 py-2.5 bg-transparent border-0',
                    'focus:outline-none focus:ring-0',
                    'text-gray-900 placeholder-gray-500',
                    'disabled:cursor-not-allowed'
                  )}
                />
              </div>

              {/* Helper Text */}
              {hasError ? (
                <p className="mt-1.5 text-sm text-red-600">
                  {error || meta.error}
                </p>
              ) : (
                <p className="mt-1.5 text-sm text-gray-500">
                  Full number: {selectedCountry.dialCode}{' '}
                  {phoneNumber || 'xxx xxx xxxx'}
                </p>
              )}
            </div>
          </div>
        );
      }}
    </Field>
  );
};

export default PhoneInput;
