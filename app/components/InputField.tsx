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
        <div className={containerClassName}>
            <label htmlFor={inputId} className={`block text-sm font-medium text-gray-700 mb-1.5 ${labelClassName ?? ''}`}>
                {label}
                {required ? <span className="text-red-600 ml-1" aria-hidden="true">*</span> : null}
            </label>

            <div className="relative">
                {icon ? (
                    <span className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400" aria-hidden="true">
                        {icon}
                    </span>
                ) : null}

                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    required={required}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={describedBy}
                    className={[
                        'w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 text-gray-700',
                        icon ? 'pl-10' : '',
                        error
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white',
                        inputClassName ?? '',
                    ]
                        .join(' ')
                        .trim()}
                    {...inputProps}
                />
            </div>

            {error ? (
                <p id={errorId} role="alert" className={`text-xs text-red-600 mt-1 ${errorClassName ?? ''}`}>
                    {error}
                </p>
            ) : null}
        </div>
    );
});

export type { InputFieldProps };
export default InputField;
