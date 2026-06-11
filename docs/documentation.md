# Voya – Dokumentation

## 1. Überblick

Voya ist eine Webanwendung für Reiseblogs, die auf React Router und Supabase basiert. Benutzer können Beiträge über ihre Reisen erstellen, Bilder hochladen, mit anderen Profilen interagieren und sich durch die Beiträge anderer Nutzer für zukünftige Reisen inspirieren lassen.

### Verwendete Technologien

#### Frontend
- React Router
- TypeScript
- DaisyUI / Tailwind CSS

#### Backend
- Supabase Authentication
- Supabase Database
- Supabase Storage

#### Deployment
- GitHub Pages

#### Schnellstart
- Siehe: [README.md](../README.md)

---

## 2. Projektstruktur

### api/

Enthält die Kommunikation mit Supabase, einschließlich:

- Authentifizierung
- Beiträge (Posts)
- Profile
- Länder
- Rollenverwaltung

Siehe: [api/](../api)

### app/

Enthält die Anwendungslogik und Benutzeroberfläche, darunter Routen, Layouts, Middleware und wiederverwendbare Komponenten.

Siehe: [app/](../app)

#### app/routes

Definiert die verschiedenen Seiten (Routen) der Anwendung.

Siehe: [app/routes.ts](../app/routes)

#### app/layouts

Enthält die verfügbaren Layouts der Anwendung.

Siehe: [app/layouts/default.tsx](../app/layouts/default.tsx)

#### app/middleware

Beinhaltet Middleware-Funktionen, insbesondere für Authentifizierung und Autorisierung.

Siehe: [app/middleware/auth.ts](../app/middleware/auth.ts)

#### app/components

Enthält wiederverwendbare UI-Komponenten.

Siehe: [app/components/README.md](../app/components/README.md)

Beispiele:
- [`InputField`](../app/components/InputField.tsx)
- [`PostCard`](../app/components/PostCard.tsx)
- [`PostList`](../app/components/PostList.tsx)
- [`SubPost`](../app/components/SubPost.tsx)
- [`CountriesInput`](../app/components/CountriesInput.tsx)

---

## 3. Routing und Client-Aktionen

### Routendefinitionen

Die Routen der Anwendung werden in folgender Datei definiert:

Siehe: [app/routes.ts](../app/routes.ts)

| Route | Beschreibung |
|---------|-------------|
| `/` | Startseite |
| `/post/:id` | Anzeige eines einzelnen Beitrags |
| `/nutzerverwaltung` | Benutzerverwaltung für Administratoren |
| `/profile/:id` | Benutzerprofil |
| `/new-post` | Erstellen eines neuen Beitrags |
| `/login` | Benutzeranmeldung |
| `/register` | Benutzerregistrierung |
| `/blocked` | Seite für gesperrte Inhalte oder Benutzer |
| `/404` | Fehlerseite (Nicht gefunden) |

### Beispiele für Loader und Actions

- [app/routes/explore.tsx](../app/routes/explore.tsx)
- [app/routes/profile.tsx](../app/routes/profile.tsx)
- [app/routes/new-post.tsx](../app/routes/new-post.tsx)

---

## 4. Authentifizierung und Autorisierung

### Authentifizierung mit Supabase

Die Benutzerauthentifizierung wird über Supabase Auth umgesetzt.

- Client-Konfiguration: [`getSupabaseClient`](../api/supabaseClient.ts)
- Sitzungsprüfung: [app/middleware/auth.ts](../app/middleware/auth.ts)

### Rollenbasierte Zugriffskontrolle

Benutzerrollen (z. B. Administrator) werden in der Datenbank gespeichert und innerhalb von Loadern und Actions geprüft, um den Zugriff auf bestimmte Funktionen einzuschränken.

Siehe: [api/auth.ts](../api/auth.ts)

### Hilfsfunktionen

- `getUser()` – Liefert Informationen über den aktuell angemeldeten Benutzer.
- `checkIsAdmin()` – Prüft, ob der Benutzer über Administratorrechte verfügt.

Siehe: [api/auth.ts](../api/auth.ts)

### Routenschutz

Geschützte Bereiche der Anwendung verwenden eine Authentifizierungs-Middleware, welche die aktuelle Sitzung überprüft, bevor Zugriff gewährt wird.

Siehe: [app/middleware/auth.ts](../app/middleware/auth.ts)

---

## 5. Datenmodell (Übersicht)

Für detaillierte Informationen wird auf das Datenbankschema in Supabase verwiesen.

### Tabelle: profiles

Speichert Benutzerprofile und Authentifizierungsinformationen.

| Feld | Beschreibung |
|--------|-------------|
| id | Eindeutige Benutzer-ID (foreign key auf `auth.users.id`) |
| created_at | Zeitpunkt der Profilerstellung |
| display_name | Anzeigename des Benutzers |
| blocked | Kennzeichnet, ob das Profil gesperrt wurde |
| role_id | Rolle des Benutzers (foreign key auf roles.id) |
| email | E-Mail-Adresse des Benutzers |

### Tabelle: posts

Speichert die Reisebeiträge.

| Feld | Beschreibung |
|--------|-------------|
| id | Eindeutige Beitrags-ID |
| created_at | Erstellungsdatum |
| title | Titel des Beitrags |
| description | Kurzbeschreibung |
| title_image_url | URL des Titelbildes |
| is_blocked | Kennzeichnet, ob der Beitrag gesperrt wurde |
| is_private | Kennzeichnet, ob der Beitrag privat ist |
| user_id | Autor des Beitrags |
| reason_blocked | Begründung für die Sperrung |

#### Tabelle: sub_posts

Speichert zusätzliche Inhaltsabschnitte eines Beitrags.

| Feld | Beschreibung |
|--------|-------------|
| id | Eindeutige ID |
| created_at | Erstellungsdatum |
| title | Titel des Abschnitts |
| content | Inhalt des Abschnitts |
| post_id | Zugehöriger Beitrag (foreign key auf posts.id) |

### Tabelle: countries

Speichert Länder zur Kategorisierung von Beiträgen.

| Feld | Beschreibung |
|--------|-------------|
| id | Eindeutige ID |
| created_at | Erstellungsdatum |
| name | Ländername |
| code | ISO-3166-1-Alpha-2-Ländercode |

### Tabelle: countries_post_relation

Verknüpfungstabelle zwischen Beiträgen und Ländern.

| Feld | Beschreibung |
|--------|-------------|
| post_id | Zugehöriger Beitrag |
| country_id | Zugehöriges Land |

Die Kombination aus `post_id` und `country_id` bildet den Primärschlüssel.

### Tabelle: roles

Definiert die verfügbaren Benutzerrollen.

| Feld | Beschreibung |
|--------|-------------|
| id | Eindeutige Rollen-ID |
| created_at | Erstellungsdatum |
| name | Rollenname (z. B. „admin“, „user“) |

### TypeScript-Typen

Die zugehörigen Typdefinitionen befinden sich in:

[`api/supabaseClient.ts`](../api/supabaseClient.ts)

---

## 6. Datei-Uploads und Speicherung

Bilder werden in einem Supabase Storage Bucket gespeichert.

### Relevante Funktionen

- Upload-Funktion: [`uploadPostImage`](../api/posts.ts)
- Bucket-Konstante: `POST_IMAGES_BUCKET`

Siehe: [api/posts.ts](../api/posts.ts)

---

## 7. Administrationsfunktionen

Administratoren können Benutzerprofile und Beiträge verwalten.

### Verwaltungsfunktionen

- Beitragsverwaltung: [api/posts.ts](../api/posts.ts)
- Profilverwaltung: [api/profile.ts](../api/profile.ts)

### Dialogfenster

- [app/components/BlockPostModal.tsx](../app/components/BlockPostModal.tsx)
- [app/components/UnblockPostModal.tsx](../app/components/UnblockPostModal.tsx)

### Administrationsseite

- [app/routes/nutzerverwaltung.tsx](../app/routes/nutzerverwaltung.tsx)