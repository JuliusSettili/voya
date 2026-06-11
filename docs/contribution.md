## Contributing
### Schnellstart: 
Bevor mit der Entwicklung begonnen wird, sollte zunächst die Projektdokumentation gelesen werden. Diese bietet einen umfassenden Überblick über die Projektstruktur, das Routing, die Authentifizierung, das Datenmodell sowie weitere wichtige Aspekte der Anwendung. Ein Verständnis dieser Grundlagen erleichtert die Mitarbeit am Projekt erheblich. 
Siehe: [Documentation.md](../docs/documentation.md)

#### Datenbankerweiterungen:
Neue Datenbankfunktionen werden direkt in Supabase implementiert. Dazu gehören unter anderem:
- Neue Tabellen
- Neue Spalten
- Neue Beziehungen zwischen Tabellen

Da Supabase Row Level Security (RLS) für die Zugriffssteuerung und Datensicherheit verwendet, müssen bei neuen API-Funktionen auch die entsprechenden RLS-Richtlinien angepasst oder ergänzt werden.

#### Entwicklung von Api-Funktionen:
Neue API-Funktionen sind im Verzeichnis [api/](../api) zu implementieren. Dabei gelten folgende Richtlinien:
- Neue Funktionen sollen durch geeignete Tests abgesichert werden.
- Für jede Tabelle des Supabase-Schemas existiert genau eine zugehörige API-Datei.
- Sämtliche Interaktionen mit einer Tabelle werden in der entsprechenden Datei umgesetzt.

Beispiel:
- Alle Zugriffe auf die Tabelle posts werden in api/posts.ts implementiert.

Ausnahmen sind Funktionen, die mehrere Tabellen miteinander verknüpfen. Ein Beispiel hierfür ist [fetchCountriesForProfile](../api/countries.ts). Obwohl die Funktion auf die Tabelle posts zugreift(die Funktion macht joins über 2 tabellen aber nutzt die user_id in posts als filter), liegt ihr fachlicher Fokus auf Länderinformationen und wird daher in der entsprechenden Datei umgesetzt. 

#### Entwicklung vom Frontend:
Neue Frontend-Funktionalitäten werden im Verzeichnis [app/](../app) implementiert. Dieses ist in mehrere Bereiche unterteilt:
- Routes: Hier werden die Seiten der Anwendung implementiert. Siehe: [app/routes/](../app/routes)
- Layouts: Enthält die verschiedenen Layouts. Siehe: [app/layouts/](../app/layouts)
- Middleware: Enthält Middleware-Funktionen, die innerhalb des Routings eingesetzt werden. Siehe: [app/middleware/](../app/middleware)
- Components: Enthält wiederverwendbare UI-Komponenten, die in mehreren Bereichen der Anwendung genutzt werden können. Siehe: [app/components/](../app/components)

### Checkliste fürs Mitarbeiten:
- Lese und befolge [README.md](../README.md) für das aufsetzen einer Entwicklungsumgebung
- Der bestehende Code-Stil sowie die Projektkonventionen wurden eingehalten.
- Neue Funktionen wurden getestet und bestehende Tests laufen weiterhin erfolgreich.
- Für neue Funktionen oder Änderungen wurde die Dokumentation aktualisiert.

### Projektreferenzen: 
Folgende Dokumente dienen als Einstiegspunkt für die Entwicklung:
- Entwicklungsumgebung: [README.md](../README.md)
- Komponenten Guide: [components.md](../docs/components.md)
- Projektstruktur: [documentation.md](../docs/documentation.md)
- Deployment: [deployment.md](../docs/deployment.md)