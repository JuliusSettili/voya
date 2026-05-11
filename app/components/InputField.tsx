import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label: string;
    type?: 'text' | 'password' | 'email';
    error?: string;
    icon?: ReactNode;
    containerClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    errorClassName?: string;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(function InputField(
    {
        label,
        type = 'text',
        error,
        icon,
        id,
        required,
        containerClassName,
        labelClassName,
        inputClassName,
        errorClassName,
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
        <><label className="label" htmlFor={inputId}>
            {label}
        </label><input
                id={inputId}
                name={inputProps.name}
                type={type}
                className="input"
                placeholder={inputProps.placeholder}
                required={required}
                disabled={inputProps.disabled} /></>
    );
});

export type { InputFieldProps };
export default InputField;
