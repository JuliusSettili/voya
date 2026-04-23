import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router';
import { logout } from '../../api/login';
import { getSupabaseClient } from '../../api/supabaseClient';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const supabase = getSupabaseClient();

        let isMounted = true;

        async function loadCurrentUser() {
            const { data } = await supabase.auth.getUser();
            if (isMounted) {
                setUser(data.user ?? null);
            }
        }

        loadCurrentUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            isMounted = false;
            authListener.subscription.unsubscribe();
        };
    }, []);

    async function handleLogout() {
        setIsLoggingOut(true);
        const result = await logout();
        setIsLoggingOut(false);

        if (!result.success) {
            return;
        }

        navigate('/');
    }

    return (
        <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
            <Link to="/" className="text-2xl font-bold text-blue-600">
                Voya
            </Link>

            <div className="flex items-center space-x-6">
                <Link to="/explore" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Entdecken
                </Link>

                {user ? (
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700">
                            Hallo {user.user_metadata?.display_name || user.email} !
                        </span>
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-60"
                        >
                            {isLoggingOut ? 'Abmelden...' : 'Abmelden'}
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                            Login
                        </Link>
                        <Link
                            to="/register"
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
