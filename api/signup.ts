import { getSupabaseClient } from './supabaseClient'

export type AuthResult = {
    success: boolean
    error?: string
}

export async function signup(formData: FormData): Promise<AuthResult> {
    const supabase = getSupabaseClient()

    const email = String(formData.get('email') ?? '').trim()
    const displayName = String(formData.get('displayName') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
        return {
            success: false,
            error: 'Bitte E-Mail und Passwort eingeben.',
        }
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
        data: {
          display_name: displayName,
          blocked: false,
        },
      },
    })

    if (error) {
        return {
            success: false,
            error: error.message || 'Falsche E-Mail oder Passwort',
        }
    }

    return { success: true }
}
