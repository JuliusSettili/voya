import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/app/login/actions';

export default async function Navbar() {
    // Supabase Client auf dem Server initialisieren
    const supabase = await createClient();

    // Den aktuellen Nutzer aus dem Cookie auslesen
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
            <Link href="/" className="text-2xl font-bold text-blue-600">
                Voya
            </Link>

            <div className="flex items-center space-x-6">
                <Link href="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Entdecken
                </Link>

                {user ? (
                    // Wenn eingeloggt: Anzeigename anzeigen und Logout-Button
                    <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Hallo {user.user_metadata?.display_name || user.email} !
            </span>
                        <form action={logout}>
                            <button
                                type="submit"
                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                            >
                                Abmelden
                            </button>
                        </form>
                    </div>
                ) : (
                    // Wenn nicht eingeloggt: Login und Register
                    <div className="flex items-center space-x-4">
                        <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
                        >
                            Registrieren
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}