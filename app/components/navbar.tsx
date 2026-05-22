import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router';
import { logout } from '../../api/login';
import { getSupabaseClient } from '../../api/supabaseClient';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [,setIsLoggingOut] = useState(false);

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
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    Voya
                </Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                <li>
                    <Link to="/explore">
                        Entdecken
                    </Link>
                </li>
                <li>
                    {user?.id ? (
                        <details>
                        <summary>{user.user_metadata?.display_name ?? 'Account'}</summary>
                        <ul className="bg-base-100 rounded-t-none p-2">
                            <li><Link to={`/profile/${user.id}`}>Profil</Link></li>
                            <li>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                >
                                    Abmelden
                                </button>
                            </li> 
                        </ul>
                        </details>
                    ) : (
                        <span className="px-3 py-2 text-sm text-gray-500">Account</span>
                    )}
                </li>
                </ul>
            </div>
        </div>
    );
}
