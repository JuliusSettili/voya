import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { login } from '../../api/login';

export default function LoginPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const queryError = searchParams.get('error');
    const [error, setError] = useState<string | null>(queryError);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const result = await login(new FormData(event.currentTarget));

        setIsSubmitting(false);

        if (!result.success) {
            setError(result.error ?? 'Falsche E-Mail oder Passwort');
            return;
        }

        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">

            {/* Zentrierter Login-Bereich */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Willkommen zurück</h1>
                    <p className="text-gray-500 mb-6 text-sm">Bitte melde dich mit deinen Daten an.</p>

                    {/* Fehleranzeige */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
                            {error}
                        </div>
                    )}

                    {/* Formular */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                                E-Mail Adresse
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-700"
                                placeholder="beispiel@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                                Passwort
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white text-gray-700"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:transform active:scale-95"
                            >
                                {isSubmitting ? 'Einloggen...' : 'Einloggen'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
