import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFetcher } from 'react-router';
import RegisterPage from './register';

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useFetcher: vi.fn(),
        Link: ({ children, to }: any) => <a href={to}>{children}</a>,
    };
});

vi.mock('../components/InputField', () => ({
    default: (props: any) => <input data-testid={props.id} {...props} />
}));

describe('RegisterPage', () => {
    it('renders the registration form', () => {
        vi.mocked(useFetcher).mockReturnValue({
            Form: ({ children }: any) => <form>{children}</form>,
            data: {},
            state: 'idle'
        } as any);

        render(<RegisterPage />);

        expect(screen.getByText('Konto erstellen')).toBeInTheDocument();
        expect(screen.getByTestId('email')).toBeInTheDocument();
        expect(screen.getByTestId('password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrieren/i })).toBeInTheDocument();
    });

    it('renders success view on successful registration', () => {
        vi.mocked(useFetcher).mockReturnValue({
            Form: ({ children }: any) => <form>{children}</form>,
            data: { success: true, email: 'test@example.com' },
            state: 'idle'
        } as any);

        render(<RegisterPage />);

        expect(screen.getByText(/Erfolgreich registriert/i)).toBeInTheDocument();
        expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /zur anmeldung/i })).toBeInTheDocument();
    });

    it('shows general error message', () => {
        vi.mocked(useFetcher).mockReturnValue({
            Form: ({ children }: any) => <form>{children}</form>,
            data: { errors: { general: 'Registrierung fehlgeschlagen' } },
            state: 'idle'
        } as any);

        render(<RegisterPage />);

        expect(screen.getByText('Registrierung fehlgeschlagen')).toBeInTheDocument();
    });
});