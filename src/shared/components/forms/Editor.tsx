/**
 * Rich Text Editor Component
 * Wraps React Quill with XSS protection
 *
 * SECURITY: All editor content is sanitized before being stored or displayed
 */

import type { FC } from 'react';
import { Field } from 'formik';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import clsx from 'clsx';
import { sanitizeHtml } from '../../utils/sanitize';

interface EditorProps {
  name: string;
  onChange?: (value: string) => void;
  label?: string;
  styleWrapper?: string;
  styleLabel?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  height?: number;
  toolbar?: unknown[];
}

const Editor: FC<EditorProps> = ({
  name,
  label,
  onChange,
  styleLabel,
  styleWrapper,
  placeholder = 'Write something...',
  required = false,
  disabled = false,
  height = 200,
  toolbar = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
}) => {
  /**
   * Sanitizes editor content before storing
   * CRITICAL: Prevents XSS attacks from malicious HTML
   */
  const handleChange = (
    value: string,
    form: { setFieldValue: (name: string, value: string) => void }
  ) => {
    // Sanitize the HTML content
    const sanitized = sanitizeHtml(value);

    if (onChange) {
      onChange(sanitized);
    } else {
      form.setFieldValue(name, sanitized);
    }
  };

  // Custom Quill styles
  const editorStyles = {
    minHeight: `${height}px`,
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  };

  return (
    <Field name={name}>
      {({
        field,
        meta,
        form,
      }: {
        field: { value: string };
        meta: { touched: boolean; error?: string };
        form: { setFieldValue: (name: string, value: string) => void };
      }) => {
        const hasError = meta.touched && meta.error;

        // Sanitize existing value on render
        const safeValue = field?.value ? sanitizeHtml(field.value) : '';

        return (
          <div className={clsx('mb-6 w-full', styleWrapper)}>
            {label && (
              <label
                htmlFor={name}
                className={clsx(
                  'block text-sm font-medium mb-2',
                  hasError ? 'text-error' : 'text-gray-700',
                  styleLabel
                )}
              >
                {label}
                {required && <span className="text-error ml-0.5">*</span>}
              </label>
            )}

            <div
              className={clsx(
                'rounded-md transition-colors duration-200',
                hasError && 'border-error',
                disabled && 'opacity-60 pointer-events-none'
              )}
            >
              <ReactQuill
                theme="snow"
                value={safeValue}
                onChange={(value: string) => {
                  handleChange(value, form);
                }}
                placeholder={placeholder}
                readOnly={disabled}
                modules={{
                  toolbar: toolbar,
                  clipboard: {
                    matchVisual: false,
                    // SECURITY: Strip dangerous content from pasted HTML
                    matchers: [
                      // Remove script tags and event handlers
                      [
                        Node.ELEMENT_NODE,
                        (node: Node) => {
                          if (node.nodeType === Node.ELEMENT_NODE) {
                            const el = node as Element;
                            // Remove script tags
                            if (el.tagName === 'SCRIPT') {
                              return document.createTextNode('');
                            }
                            // Remove event handlers
                            Array.from(el.attributes).forEach((attr) => {
                              if (attr.name.startsWith('on')) {
                                el.removeAttribute(attr.name);
                              }
                            });
                          }
                          return node;
                        },
                      ],
                    ],
                  },
                }}
                style={editorStyles}
                className={clsx(
                  'quill-editor',
                  hasError && 'border-error',
                  'focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary'
                )}
              />
            </div>

            {hasError && (
              <p className="text-xs text-error mt-1">
                {typeof meta.error === 'string' ? meta.error : 'Error'}
              </p>
            )}
          </div>
        );
      }}
    </Field>
  );
};

export default Editor;
