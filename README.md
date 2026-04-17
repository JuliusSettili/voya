# Voya

Kurz-Anleitung für lokale Entwicklung und GitHub-Pages-Deployment.

## Lokal entwickeln

Voraussetzung: Node.js 20.9 oder neuer.

```bash
npm install
npm run dev
```

App im Browser öffnen:
http://localhost:3000

## GitHub Pages Deployment (manuell)

Das Deployment wird nicht automatisch bei Push ausgeführt.

So startest du ein Deployment per Button:

1. GitHub Repository öffnen.
2. Tab Actions öffnen.
3. Workflow Deploy Next.js to GitHub Pages auswählen.
4. Run workflow klicken.

Der Workflow liegt in .github/workflows/deploy.yml und nutzt workflow_dispatch.

GitHub Pages URL:
https://juliussettili.github.io/voya/
