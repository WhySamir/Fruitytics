/**
 * Input Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import Input from '../Input';

describe('Input Component', () => {
  it('should render input field', () => {
    render(
      <Formik initialValues={{ test: '' }} onSubmit={() => {}}>
        <Form>
          <Input name="test" label="Test Input" />
        </Form>
      </Formik>
    );

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('should show error message', () => {
    render(
      <Formik
        initialValues={{ test: '' }}
        initialErrors={{ test: 'Required' }}
        initialTouched={{ test: true }}
        onSubmit={() => {}}
      >
        <Form>
          <Input name="test" label="Test Input" />
        </Form>
      </Formik>
    );

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(
      <Formik initialValues={{ test: '' }} onSubmit={() => {}}>
        <Form>
          <Input name="test" label="Test Input" required />
        </Form>
      </Formik>
    );

    const label = screen.getByText('Test Input');
    expect(label).toBeInTheDocument();
    // Check for asterisk (required indicator)
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
