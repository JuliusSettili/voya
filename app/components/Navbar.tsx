/* 
Diese Componente ist die Navigationsbar der Webseite.
Sie umfässt mehrer Dropdowns und Links zu den verschiedenen Seiten der Webseite. 
*/
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router';
import { logout } from '../../api/login';
import { getSupabaseClient } from '../../api/supabaseClient';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [,setIsLoggingOut] = useState(false);

    useEffect(() => {
        const supabase = getSupabaseClient();
        let isMounted = true;

        async function loadUserAndRole(currentUser: User | null) {
            if (!isMounted) return;
            setUser(currentUser);

            if (currentUser) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role_id')
                    .eq('id', currentUser.id)
                    .single();

                if (isMounted && data) {
                    setIsAdmin((data as any).role_id === 0);
                }
            } else {
                if (isMounted) setIsAdmin(false);
            }
        }

        async function init() {
            const { data } = await supabase.auth.getUser();
            loadUserAndRole(data.user ?? null);
        }

        init();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            loadUserAndRole(session?.user ?? null);
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
                    {user && (
                        <li>
                            <Link to="/">
                                Entdecken
                            </Link>
                        </li>
                    )}
                    <li>
                        {user?.id ? (
                            <details>
                                <summary>{user.user_metadata?.display_name ?? 'Account'}</summary>
                                <ul className="bg-base-100 rounded-t-none p-2 z-50 absolute right-0">
                                    <li><Link to={`/profile/${user.id}`}>Profil</Link></li>

                                    {isAdmin && (
                                        <li><Link to="/admin-page">Benutzerverwaltung</Link></li>
                                    )}

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
                            <Link to="/login">
                                Login
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}