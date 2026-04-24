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

    // Validierung
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

    // Signup-Aufruf
    const result = await signup(formData)

    if (!result.success) {
        return { errors: { general: result.error || 'Registrierung fehlgeschlagen' } }
    }

    // Erfolg - auf Seite bleiben und Nachricht anzeigen
    return { success: true, email }
}

export default function RegisterPage() {
    const fetcher = useFetcher()
    const data = fetcher.data as { success?: boolean; email?: string; errors?: RegisterErrors } | undefined
    const errors = data?.errors || {}
    const isSuccessful = data?.success
    const isSubmitting = fetcher.state === 'submitting'

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative font-sans">

            {/* Zentrierter Registrierungs-Bereich */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">

                    {isSuccessful ? (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">✓ Erfolgreich registriert!</h1>
                            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                Dein Konto wurde erfolgreich erstellt. Bitte überprüfe deine E-Mail-Adresse <strong>{data.email}</strong> und bestätige die E-Mail, um dein Konto zu aktivieren.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Hinweis:</strong> Wenn du die E-Mail nicht erhalten hast, überprüfe auch deinen Spam-Ordner oder fordere eine neue Bestätigungsmail an.
                                </p>
                            </div>
                            <Link
                                to="/login"
                                className="w-full inline-flex justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                Zur Anmeldung
                            </Link>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Konto erstellen</h1>
                            <p className="text-gray-500 mb-8 text-sm">Tritt uns bei und starte noch heute.</p>

                            {errors.general && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-700">{errors.general}</p>
                                </div>
                            )}

                            <fetcher.Form method="post" className="space-y-5">
                                <InputField
                                    type="text"
                                    id="displayName"
                                    name="displayName"
                                    label="Anzeigename"
                                    placeholder="Max Mustermann"
                                    required
                                    disabled={isSubmitting}
                                    error={errors.displayName}
                                />

                                <InputField
                                    type="email"
                                    id="email"
                                    name="email"
                                    label="E-Mail Adresse"
                                    placeholder="beispiel@email.com"
                                    required
                                    disabled={isSubmitting}
                                    error={errors.email}
                                />

                                <InputField
                                    type="password"
                                    id="password"
                                    name="password"
                                    label="Passwort"
                                    placeholder="••••••••"
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
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    disabled={isSubmitting}
                                    error={errors.confirmPassword}
                                />

                                {/* Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2.5 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:transform w-100 active:scale-95"
                                    >
                                        {isSubmitting ? 'Wird registriert...' : 'Registrieren'}
                                    </button>
                                </div>

                                <p className="text-sm text-gray-600 text-center">
                                    Bereits ein Konto?{' '}
                                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                        Hier einloggen
                                    </Link>
                                </p>
                            </fetcher.Form>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}
