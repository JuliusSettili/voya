# Components

## InputField

Reusable input component for text, email, and password fields with label, validation state, and optional icon.

### Import

```tsx
import InputField from './InputField';
```

### Supported props

- `label: string` (required)
- `type?: 'text' | 'email' | 'password'` (default: `text`)
- `error?: string`
- `icon?: ReactNode`
- `required?: boolean`
- All common native input props are forwarded to the `<input>` element, for example:
  - `value`, `defaultValue`, `onChange`
  - `name`, `id`, `placeholder`, `disabled`
  - `autoComplete`, `minLength`, `maxLength`, `aria-*`

Additional styling helpers:

- `containerClassName?: string`
- `labelClassName?: string`
- `inputClassName?: string`
- `errorClassName?: string`

### Accessibility

- Uses a proper `<label htmlFor>` connection.
- Sets `aria-invalid` when `error` exists.
- Connects the error text via `aria-describedby`.
- Renders error text with `role="alert"` for assistive technologies.

### Example: controlled text field

```tsx
import { useState } from 'react';
import InputField from './InputField';

export default function ExampleTextField() {
  const [displayName, setDisplayName] = useState('');

  return (
    <InputField
      type="text"
      label="Anzeigename"
      name="displayName"
      value={displayName}
      onChange={(event) => setDisplayName(event.target.value)}
      placeholder="Max Mustermann"
      required
    />
  );
}
```

### Example: password field with error

```tsx
import InputField from './InputField';

export default function ExamplePasswordField() {
  return (
    <InputField
      type="password"
      label="Passwort"
      name="password"
      minLength={8}
      required
      error="Passwort muss mindestens 8 Zeichen haben"
      placeholder="********"
      autoComplete="new-password"
    />
  );
}
```

### Example: input with icon

```tsx
import InputField from './InputField';

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M2.5 5.75A1.75 1.75 0 0 1 4.25 4h11.5a1.75 1.75 0 0 1 1.75 1.75v8.5A1.75 1.75 0 0 1 15.75 16H4.25A1.75 1.75 0 0 1 2.5 14.25v-8.5Zm1.52.38 5.55 4.08a.75.75 0 0 0 .86 0l5.55-4.08a.25.25 0 0 0-.15-.46H4.17a.25.25 0 0 0-.15.46Z" />
    </svg>
  );
}

export default function ExampleWithIcon() {
  return (
    <InputField
      type="text"
      label="E-Mail"
      name="email"
      placeholder="beispiel@email.com"
      icon={<MailIcon />}
      required
    />
  );
}
```
