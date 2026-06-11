import { fetchProfileById } from './profile'
import { getSupabaseClient } from './supabaseClient'

export type AuthResult = {
    success: boolean
    error?: string
}

export async function login(formData: FormData): Promise<AuthResult> {
    const supabase = getSupabaseClient()

    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
        return {
            success: false,
            error: 'Bitte E-Mail und Passwort eingeben.',
        }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        const { data: userExists } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single()

        if (!userExists) {
            return { success: false, error: 'Dieser Benutzer ist noch nicht registriert.' }
        }

        return { success: false, error: 'Falsche E-Mail oder Passwort' }
    }

    const userId = data.user.id;
    const userProfile = await fetchProfileById(userId);
    const profileBlocked = userProfile?.blocked;

    if (profileBlocked) {
        await supabase.auth.signOut().catch((err) => {
            console.error('Fehler beim Sign-Out:', err);
        });
        return {
            success: false,
            error: 'Ihr Konto ist gesperrt.',
        }
    }

    return { success: true }
}

export async function logout(): Promise<AuthResult> {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
        return {
            success: false,
            error: error.message || 'Logout fehlgeschlagen',
        }
    }

    return { success: true }
}