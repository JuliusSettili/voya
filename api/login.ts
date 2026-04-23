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

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return {
            success: false,
            error: error.message || 'Falsche E-Mail oder Passwort',
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
