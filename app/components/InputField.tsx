/*
Diese Komponente ist ein Eingabefeld mit Label, optionalem Icon und Fehleranzeige.
Das Textfeld kann über eine übergebene Ref direkt angesprochen werden.
Wenn ein Fehler übergeben wird, wird das Feld als ungültig markiert und die Fehlermeldung mit dem Input verknüpft angezeigt.
*/
import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string;
    type?: 'text' | 'password' | 'email';
    error?: string;
    icon?: ReactNode;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
    {
        label,
        type = 'text',
        error,
        icon,
        id,
        required,
        ...inputProps
    },
    ref,
) {
    const generatedId = useId();
    const safeGeneratedId = generatedId.replace(/:/g, '');
    const inputId = id ?? `input-${safeGeneratedId}`;
    const errorId = `${inputId}-error`;

    const existingDescribedBy = inputProps['aria-describedby'];
    const describedBy = [existingDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined;

    return (
            <><label htmlFor={inputId} className="label">
                {label}
            </label>
            <input
                ref={ref}
                id={inputId}
                type={type}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className="input"
                {...inputProps}
            />
            {
            error ? (
                <div id={errorId} role="alert" className="validator-hint">
                    {error}
                </div>
            ) : null
        }</>
    );
});

export type { InputFieldProps };
export default InputField;
