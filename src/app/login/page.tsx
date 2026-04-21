import { login } from './actions';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ error?: string }>;
}) {
    // Warten auf die URL-Parameter
    const { error } = await searchParams;

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
                    <form action={login} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                                E-Mail Adresse
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
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
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:transform active:scale-95"
                            >
                                Einloggen
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}