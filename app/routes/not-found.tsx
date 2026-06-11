export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold">
                404 - Seite nicht gefunden
            </h1>
            <p className="text-gray-500 mt-4">
                Die von dir gesuchte Seite existiert nicht oder wurde verschoben.
            </p>
            <a
                href="/"
                className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg active:transform active:scale-95"
            >
                Zur Startseite
            </a>
        </main>
    );
}
