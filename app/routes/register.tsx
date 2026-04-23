export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative font-sans">

            {/* Zentrierter Registrierungs-Bereich */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Konto erstellen</h1>
                    <p className="text-gray-500 mb-8 text-sm">Tritt uns bei und starte noch heute.</p>

                    <form className="space-y-5">

                        {/* Anzeigename Feld */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="displayName">
                                Anzeigename
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="Max Mustermann"
                                required
                            />
                        </div>

                        {/* E-Mail Feld (Unique) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="email">
                                E-Mail Adresse
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="beispiel@email.com"
                                required
                            />
                        </div>

                        {/* Passwort Feld */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="password">
                                Passwort
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                        </div>

                        {/* Passwort bestätigen Feld */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="confirmPassword">
                                Passwort bestätigen
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                        </div>

                        {/* Unten Rechts: Registrieren Button */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:transform active:scale-95"
                            >
                                Registrieren
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
