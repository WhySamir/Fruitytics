# Form Components

Shared form components built on Formik with consistent patterns.

## BaseFormField

All form components use the `BaseFormField` pattern for consistency:

- Consistent error handling
- Consistent label rendering
- Consistent styling
- Type-safe Formik integration

## Components

- **Input** - Text input field
- **Textarea** - Multi-line text input
- **Password** - Password input with strength indicator
- **Phone** - Phone number input with country selector
- **Email** - Email input with validation
- **Dropdown** - Select dropdown (single/multi)
- **Checkbox** - Checkbox input
- **Radio** - Radio button group
- **Switch** - Toggle switch
- **Editor** - Rich text editor (React Quill)
- **Upload** - File upload component
- **Otp** - OTP input field
- **Tag** - Tag input component

## Usage

```typescript
import { Input } from '@shared/components/forms';

<Input
  name="email"
  label="Email Address"
  required
  type="email"
/>
```

## Common Props

All form components support:
- `name` - Field name (required)
- `label` - Field label
- `required` - Show required indicator
- `disabled` - Disable field
- `error` - Custom error message
- `wrapperClassName` - Custom wrapper styles
- `labelClassName` - Custom label styles
- `helpText` - Help text below field

