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
                    <details>
                    <summary>{user?.user_metadata?.display_name}</summary>
                    <ul className="bg-base-100 rounded-t-none p-2">
                        <li><a>Link 1</a></li>
                        <li><a>Link 2</a></li>
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
                </li>
                </ul>
            </div>
        </div>
    );
}
