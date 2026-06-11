'use client'

import { Link, useFetcher } from 'react-router'
import { signup } from '../../api/signup'
import InputField from '../components/InputField'

type RegisterErrors = {
    displayName?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
}

export async function clientAction({ request }: { request: Request }) {
    const formData = await request.formData()

    const displayName = String(formData.get('displayName') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const confirmPassword = String(formData.get('confirmPassword') ?? '')

    const errors: RegisterErrors = {}

    if (!displayName) errors.displayName = 'Anzeigename erforderlich'
    if (!email) errors.email = 'E-Mail erforderlich'
    if (!password) errors.password = 'Passwort erforderlich'
    if (!confirmPassword) errors.confirmPassword = 'Passwortbestätigung erforderlich'
    if (password && confirmPassword && password !== confirmPassword) {
        errors.confirmPassword = 'Passwörter stimmen nicht überein'
    }

    if (Object.keys(errors).length > 0) {
        return { errors }
    }

    const result = await signup(formData)

    if (!result.success) {
        return { errors: { general: result.error || 'Registrierung fehlgeschlagen' } }
    }

    return { success: true, email }
}

export default function RegisterPage() {
    const fetcher = useFetcher()
    const data = fetcher.data as { success?: boolean; email?: string; errors?: RegisterErrors } | undefined
    const errors = data?.errors || {}
    const isSuccessful = data?.success
    const isSubmitting = fetcher.state === 'submitting'

    return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '1rem' }}>
            <Link to="/" className="btn btn-ghost btn-lg absolute top-4 left-4">
                Voya
            </Link>
            {isSuccessful ? (
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>✓ Erfolgreich registriert!</h1>
                    <p style={{ color: '#4b5563', marginBottom: '1rem', fontSize: 14 }}>
                        Dein Konto wurde erfolgreich erstellt. Bitte überprüfe deine E-Mail-Adresse <strong>{data?.email}</strong> und bestätige die E-Mail, um dein Konto zu aktivieren.
                    </p>
                    <div style={{ background: '#ebf8ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
                        <p style={{ fontSize: 14, color: '#1e3a8a' }}>
                            💡 <strong>Hinweis:</strong> Wenn du die E-Mail nicht erhalten hast, überprüfe auch deinen Spam-Ordner oder fordere eine neue Bestätigungsmail an.
                        </p>
                    </div>
                    <Link to="/login" style={{ display: 'inline-flex', justifyContent: 'center', background: '#2563eb', color: 'white', fontWeight: 600, padding: '10px 24px', borderRadius: 8, textDecoration: 'none' }}>
                        Zur Anmeldung
                    </Link>
                </div>
            ) : (
                <fetcher.Form method="post">
                    {errors.general && <p role="alert" style={{ marginBottom: '0.75rem', color: '#b91c1c' }}>{errors.general}</p>}

                    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                        <legend className="fieldset-legend">Konto erstellen</legend>
                        <p className='mb-3'>Tritt uns bei und starte noch heute!</p>
                        <InputField
                            type="text"
                            id="displayName"
                            name="displayName"
                            label="Anzeigename"
                            required
                            disabled={isSubmitting}
                            error={errors.displayName}
                        />

                        <InputField
                            type="email"
                            id="email"
                            name="email"
                            label="E-Mail Adresse"
                            required
                            disabled={isSubmitting}
                            error={errors.email}
                        />

                        <InputField
                            type="password"
                            id="password"
                            name="password"
                            label="Passwort"
                            required
                            minLength={8}
                            disabled={isSubmitting}
                            error={errors.password}
                        />

                        <InputField
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Passwort bestätigen"
                            required
                            minLength={8}
                            disabled={isSubmitting}
                            error={errors.confirmPassword}
                        />

                        <button type="submit" className="btn btn-neutral mt-4" disabled={isSubmitting} style={{ width: '100%' }}>
                            {isSubmitting ? 'Wird registriert...' : 'Registrieren'}
                        </button>

                        <p style={{ marginTop: '0.75rem', fontSize: 14 }}>
                            Bereits ein Konto?{' '}
                            <Link to="/login" style={{ textDecoration: 'underline' }}>
                                Hier einloggen
                            </Link>
                        </p>
                    </fieldset>
                </fetcher.Form>
            )}
        </div>
    );
}
