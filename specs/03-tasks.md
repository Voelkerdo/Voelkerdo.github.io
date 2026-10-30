# Implementation Tasks

> Status: approved · Abgeleitet aus: [02-tech-spec.md](02-tech-spec.md)

## Arbeitsweise
- Tasks werden in Reihenfolge abgearbeitet; jeder Task endet mit grünem `npm run verify` und **einem** Commit `feat(T-XX): … [REQ-YY]`.
- Status: `[ ]` offen · `[~]` in Arbeit · `[x]` erledigt.
- Jeder Task nennt die Akzeptanzkriterien, die er erfüllt. Für jedes automatisierbare AC entsteht im selben Task ein Test.

## Übersicht
| Task | Titel | Erfüllt | Status |
|---|---|---|---|
| T-01 | Projekt-Setup | TD-1, TD-3, TD-5, TD-7, TD-8 | [x] |
| T-02 | Test-Setup & Qualitätstor | TD-2 | [x] |
| T-03 | Datenmodell & Platzhalter-Inhalte | AC-01.3, AC-02.3/02.4, AC-03.1–03.3, AC-04.2, AC-05.1 | [ ] |
| T-04 | Theming & Theme-Modus | AC-07.1, AC-09.1, AC-09.2 | [ ] |
| T-05 | Launchpad-Shell & Routing | AC-06.2, AC-06.3, AC-06.7, AC-06.9, AC-07.4 | [ ] |
| T-06 | Tile-Komponente | AC-01.3, AC-06.5, AC-07.3 | [ ] |
| T-07 | Launchpad-Startseite | AC-01.1, AC-01.2, AC-01.4 | [ ] |
| T-08 | App-Rahmen & Tile-to-App-Transition | AC-06.1, AC-06.4, AC-06.6, AC-08.3 | [ ] |
| T-09 | Projects-App | AC-02.1, AC-02.2 | [ ] |
| T-10 | Skills-App | AC-03.1, AC-03.2 | [ ] |
| T-11 | Career-App | AC-04.1 | [ ] |
| T-12 | Contact-App | AC-05.1, AC-05.2 | [ ] |
| T-13 | Responsive-Feinschliff | AC-08.1 | [ ] |
| T-14 | Manuelle Abnahme | AC-01.5, AC-08.2, Intent-Erfolgskriterien | [ ] |

## Details

### T-01 Projekt-Setup
- Vite-Projekt (React + TypeScript strict) im Ordner `assets/` anlegen (TD-7); alle Configs liegen dort.
- Abhängigkeiten laut Tech Spec §1 installieren (UI5 Web Components for React, Motion, React Router).
- Oxlint + Prettier konfigurieren (TD-8); npm-Scripts `dev`, `build`, `preview`, `typecheck`, `lint`.
- `HashRouter` + `ThemeProvider` in `App.tsx` mit einer leeren Startseite.
- **Fertig, wenn:** `npm run dev` startet die leere App, `npm run build` erzeugt `assets/dist/`, `typecheck` und `lint` sind grün.

### T-02 Test-Setup & Qualitätstor
- Vitest + Testing Library (jsdom) einrichten, inkl. Setup für UI5 Web Components.
- Playwright (Chromium) mit Vite-Dev-Server als `webServer` einrichten.
- Script `verify` = `typecheck && lint && test && e2e`.
- Je ein Smoke-Test (Unit: App rendert; E2E: Startseite lädt ohne Konsolenfehler).
- **Fertig, wenn:** `npm run verify` ist grün.

### T-03 Datenmodell & Platzhalter-Inhalte
- `assets/src/data/types.ts` laut Tech Spec §4.
- `profile.ts`, `projects.ts`, `skills.ts`, `career.ts`, `contact.ts` mit Inhalten bzw. Platzhaltern (`// TODO(content): …`).
- Skills mit den echten Inhalten aus dem Intent (AC-03.2).
- `tiles.ts` mit Tile-Definitionen; KPIs werden aus den Daten berechnet (AC-01.3).
- **Tests:** KPIs entsprechen den Datenmengen; Skill-Gruppen vollständig; jede ID eindeutig.

### T-04 Theming & Theme-Modus
- `setTheme()` mit `sap_horizon` / `sap_horizon_dark`.
- `useThemeMode`: System-Theme als Start, manueller Umschalter, Persistenz in `localStorage` (try/catch).
- `theme.css`: Akzentfarben für beide Modi über UI5-CSS-Variablen. Farbvorschlag wird Dominik zur Abnahme gezeigt.
- **Tests:** System-Theme wird übernommen; Umschalten wechselt das UI5-Theme; gespeicherte Wahl wird wiederhergestellt; kaputter Storage bricht nichts.

### T-05 Launchpad-Shell & Routing
- `LaunchpadShell` mit `ShellBar`: Logo/Name, Titel der aktuellen App bzw. „Home“, Back-Button nur in Apps.
- Avatar mit `UserMenu`: Theme-Umschalter und „About“ → `Dialog` mit „Built with React & SAP UI5 Web Components“ + Repo-Link.
- Routen `/`, `/projects`, `/skills`, `/career`, `/contact` (vorerst Platzhalter-Seiten), `*` → `/`.
- **Tests (E2E):** Direkt-Link `#/skills` öffnet die App; Back-Button und Logo führen zu `/`; Browser-Back funktioniert; About-Dialog zeigt den Hinweis.

### T-06 Tile-Komponente
- Eigene `Tile`-Komponente im Fiori-Tile-Look: Titel, Untertitel, Icon, KPI.
- Rendert als `<button>` (interne Route) bzw. `<a target="_blank">` (externer Link, z. B. GitHub).
- Hover/Fokus-Animation: Anheben, leichter Tilt, Akzent-Glow; sichtbarer Fokus-Ring.
- **Tests:** Rendert Titel/KPI; externer Link hat `target="_blank"` + `rel="noopener noreferrer"`; per Tastatur fokussier- und auslösbar.

### T-07 Launchpad-Startseite
- `Hero`: Name, Positionierung, GitHub-CTA.
- `TileGrid`: Tiles für Projects, Skills, Career, Contact + GitHub-Tile.
- Gestaffeltes Einblenden der Tiles beim Laden.
- **Tests:** Hero-Inhalte und GitHub-CTA sichtbar; alle fünf Tiles vorhanden; GitHub-Tile verlinkt auf das Profil.

### T-08 App-Rahmen & Tile-to-App-Transition
- `AppPage` auf Basis von `DynamicPage` mit Titelbereich.
- Shared-Layout-Animation (`layoutId`) Tile ↔ App, inkl. Rückwärts-Animation beim Schließen.
- `useReducedMotion()`: nur Überblenden, wenn Reduced Motion aktiv ist.
- **Tests (E2E):** Klick auf Tile öffnet die passende App; Schließen führt zurück zum Launchpad; mit emuliertem `reduced-motion` funktioniert die Navigation weiterhin.

### T-09 Projects-App
- Cards mit Name, Beschreibung, Technologie-Tags, Repo-Link (neuer Tab).
- **Tests:** Je Projekt eine Card mit allen Feldern; Link-Attribute korrekt.

### T-10 Skills-App
- Ein `Panel` je Skill-Gruppe, Skills als `Tag`.
- **Tests:** Vier Gruppen in der richtigen Reihenfolge; alle Skills aus dem Intent sichtbar.

### T-11 Career-App
- `Timeline` mit Stationen, neueste zuerst.
- **Tests:** Sortierung absteigend nach Startdatum; Zeitraum, Rolle, Firma, Highlights sichtbar.

### T-12 Contact-App
- Liste der Kanäle mit Icons; GitHub hervorgehoben; optional `mailto:`.
- **Tests:** GitHub-Eintrag ist hervorgehoben; kein `<form>` vorhanden.

### T-13 Responsive-Feinschliff
- Tile-Grid und Apps ab 360 px Breite ohne horizontales Scrollen.
- **Tests (E2E):** Bei 360 px Viewport auf allen Routen `scrollWidth <= clientWidth`.

### T-14 Manuelle Abnahme
- Production-Build lokal per `npm run preview`.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 90 (AC-08.2); Startseite < 2 s (AC-01.5).
- „Wow-Test“: Seite Kollegen/Freunden/Familie zeigen (Intent-Erfolgskriterium).
- Ergebnisse werden hier dokumentiert.
