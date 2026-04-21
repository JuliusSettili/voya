// app/login/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Daten aus dem Formular auslesen
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Supabase Login
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // Wenn fehlerhaft, zurückleiten mit Fehler-Parameter in der URL
        redirect('/login?error=Falsche E-Mail oder Passwort')
    }

    // Layout neu laden, damit die Navbar den neuen Login-Status erkennt
    revalidatePath('/', 'layout')

    // Nach erfolgreichem Login auf die Startseite (oder /explore) leiten
    redirect('/')
}

export async function logout() {
    const supabase = await createClient()

    // Loggt den Nutzer bei Supabase aus und löscht das Cookie
    await supabase.auth.signOut()

    // Lädt die Seite neu und wirft den Nutzer auf die Startseite
    revalidatePath('/', 'layout')
    redirect('/')
}