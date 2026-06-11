import { useState } from 'react';
import { Link, useNavigate, useNavigation } from 'react-router';
import { login } from '../../api/login';
import InputField from '~/components/InputField';

export default function LoginPage() {
    const navigate = useNavigate();
    const navigation = useNavigation();
    const [error, setError] = useState<string | null>(null);

    const isSubmitting = navigation.state === "submitting";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);

        const result = await login(new FormData(event.currentTarget));

        if (!result.success) {
            setError(result.error || 'Login fehlgeschlagen');
            return;
        }

        navigate('/');
    }

    return (
        <div className="min-h-screen grid place-content-center p-4 place-items-center">
            <form onSubmit={handleSubmit}>
                {error && (
                    <div role="alert" className="alert alert-error mb-5">
                        <span>{error}</span>
                    </div>
                )}

                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4" disabled={isSubmitting}>
                    <legend className="fieldset-legend">Willkommen zurück!</legend>
                    <p className='mb-3'>Bitte melde dich mit deinen Zugangsdaten an</p>

                    <InputField
                        type="email"
                        id="email"
                        name="email"
                        label="E-Mail Adresse"
                        required
                        disabled={isSubmitting}
                    />

                    <InputField
                        type="password"
                        id="password"
                        name="password"
                        label="Passwort"
                        required
                        disabled={isSubmitting}
                    />

                    <button className="btn btn-neutral mt-4" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Login...' : 'Login'}
                    </button>

                    <p style={{ marginTop: '0.75rem' }}>
                        Noch kein Konto?{' '}
                        <Link to="/register" style={{ textDecoration: 'underline' }}>
                            Jetzt registrieren
                        </Link>
                    </p>
                </fieldset>
            </form>
        </div>
    );
}