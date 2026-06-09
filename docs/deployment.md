# Deployment über GitHub Pages

Das Deployment der Anwendung erfolgt automatisiert über GitHub Pages mithilfe eines definierten GitHub Actions Workflows. Der Workflow wird manuell über `workflow_dispatch` ausgelöst und ist somit nicht an Events wie Pushes gebunden. Globale Umgebungsvariablen stellen sicher, dass die Actions mit einer festgelegten Node.js-Umgebung ausgeführt werden. Zusätzlich sind spezifische Berechtigungen gesetzt, die den Zugriff auf Repository-Inhalte sowie das Schreiben auf GitHub Pages ermöglichen.

Zur Vermeidung paralleler Deployments ist eine Concurrency-Konfiguration definiert, die laufende Prozesse bei neuen Ausführungen abbricht. Der Build-Prozess läuft auf einer aktuellen Ubuntu-Umgebung und beginnt mit dem Auschecken des Repository-Codes. Anschließend wird die GitHub Pages Umgebung vorbereitet und Node.js in Version 20 inklusive npm-Caching eingerichtet. Die Abhängigkeiten werden sauber installiert und die Anwendung mittels Build-Skript kompiliert.

Im Anschluss werden zusätzliche Anpassungen vorgenommen, darunter das Kopieren der `index.html` als `404.html`, um Routing-Probleme bei Single-Page-Anwendungen zu vermeiden. Zudem wird eine `.nojekyll`-Datei erzeugt, damit GitHub Pages keine Jekyll-Verarbeitung durchführt. Das fertige Build-Artefakt wird anschließend hochgeladen und für das Deployment bereitgestellt. Im finalen Schritt wird dieses Artefakt automatisch auf GitHub Pages veröffentlicht und die Ziel-URL als Output bereitgestellt.

Genaueres zum Ausführen des Deployments findet sich in der readme.md des Projekts.
