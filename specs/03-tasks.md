# Implementation Tasks

> Status: approved · Abgeleitet aus: [02-tech-spec.md](02-tech-spec.md)

## Arbeitsweise
- Tasks werden in Reihenfolge abgearbeitet; jeder Task endet mit grünem `npm run verify` und **einem** Commit `feat(T-XX): … [REQ-YY]`.
- Status: `[ ]` offen · `[~]` in Arbeit · `[x]` erledigt.
- Jeder Task nennt die Akzeptanzkriterien, die er erfüllt. Für jedes automatisierbare AC entsteht im selben Task ein Test.
- Durch einen Change Request (CR) überholte Tasks werden durchgestrichen, nicht gelöscht; ihre IDs werden nicht neu vergeben.

## Übersicht
| Task | Titel | Erfüllt | Status |
|---|---|---|---|
| T-01 | Projekt-Setup | TD-1, TD-3, TD-5, TD-7, TD-8 | [x] |
| T-02 | Test-Setup & Qualitätstor | TD-2 | [x] |
| T-03 | Datenmodell & Platzhalter-Inhalte | AC-01.3, AC-02.3/02.4, AC-03.1–03.3, AC-04.2, AC-05.1 | [x] |
| T-04 | Theming & Theme-Modus | AC-07.1, AC-09.1, AC-09.2 | [x] |
| T-05 | Launchpad-Shell & Routing | AC-06.2, AC-06.3, AC-06.7, AC-06.9, AC-06.10, AC-07.4 | [x] |
| ~~T-06~~ | ~~Tile-Komponente~~ | entfällt (CR-1) | – |
| ~~T-07~~ | ~~Launchpad-Startseite~~ | entfällt (CR-1) | – |
| ~~T-08~~ | ~~App-Rahmen & Tile-to-App-Transition~~ | entfällt (CR-1) | – |
| ~~T-09~~ | ~~Projects-App~~ | ersetzt durch T-17 (CR-1) | – |
| ~~T-10~~ | ~~Skills-App~~ | ersetzt durch T-18 (CR-1) | – |
| ~~T-11~~ | ~~Career-App~~ | ersetzt durch T-19 (CR-1) | – |
| ~~T-12~~ | ~~Contact-App~~ | ersetzt durch T-20 (CR-1) | – |
| T-15 | CR-1: Shell & Daten umbauen | AC-01.3, AC-01.6, AC-06.2, AC-06.11, TD-10, TD-11 | [x] |
| T-16 | Overview Page mit Bento-Grid | AC-01.1, AC-01.4, AC-06.5, AC-07.2, AC-07.3, AC-08.3 | [x] |
| T-21 | CR-2: Hero entfernen, Profil-Card, Fiori-Abstände | AC-01.3, AC-01.6, AC-01.7, AC-01.8, AC-01.9 | [x] |
| T-17 | Projects-Card | AC-02.1, AC-02.2 | [ ] |
| T-18 | Skills-Card | AC-03.1, AC-03.2 | [ ] |
| T-19 | Career-Card | AC-04.1 | [ ] |
| T-20 | Contact- & GitHub-Card | AC-01.2, AC-05.1, AC-05.2 | [ ] |
| T-13 | Responsive-Feinschliff | AC-01.6, AC-08.1 | [ ] |
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
- Avatar mit `UserMenu`: Theme-Umschalter, „About“ → `Dialog` mit „Built with React & SAP UI5 Web Components“ + Repo-Link, und „Visit GitHub“ statt „Sign Out“ (AC-06.10).
- Routen `/`, `/projects`, `/skills`, `/career`, `/contact` (vorerst Platzhalter-Seiten), `*` → `/`.
- **Tests (E2E):** Direkt-Link `#/skills` öffnet die App; Back-Button und Logo führen zu `/`; Browser-Back funktioniert; About-Dialog zeigt den Hinweis.

### ~~T-06 bis T-12~~ – überholt durch CR-1
Tile-Komponente, Launchpad-Startseite, App-Rahmen mit Tile-to-App-Transition und die vier Detail-Apps entfallen (D-7, D-8). Die Inhalte werden stattdessen in T-15 bis T-20 als Cards umgesetzt.

### T-15 CR-1: Shell & Daten umbauen
- `react-router` entfernen (TD-11); `App.tsx` rendert Shell + Overview Page direkt.
- `LaunchpadShell` → `AppShell`: Zurück-Button und App-Titel-Logik entfernen; Titel fest „Overview“ (AC-06.2).
- Klick auf Logo/Name scrollt zum Seitenanfang (AC-06.11).
- `apps/` (Platzhalter-Apps, Routen) löschen.
- `data/tiles.ts` → `data/cards.ts` mit `CardDef` inkl. `size` (AC-01.6); KPIs weiterhin aus den Daten (AC-01.3).
- **Tests:** Shell-E2E-Tests an CR-1 anpassen (kein Back-Button, Titel „Overview“, Logo scrollt nach oben); Tests für Routen/Back entfernen; Datentests auf Cards und Größen umstellen.

### T-16 Overview Page mit Bento-Grid
- `Hero`: Name, Positionierung, GitHub-CTA (AC-01.1).
- `BentoGrid` mit `grid-template-areas` laut Tech Spec §6.
- `AnimatedCard`: UI5 `Card` + `CardHeader` (Titel, Untertitel, Icon, KPI), umhüllt von Motion: gestaffeltes Einblenden (AC-01.4), Hover/Fokus mit Anheben, Tilt, Koralle-Glow (AC-07.3), Reduced Motion nur Überblenden (AC-08.3).
- Cards zunächst mit Header und leerem Inhalt; Inhalte folgen in T-17 bis T-20.
- **Tests:** Hero-Inhalte und CTA; fünf Cards mit Titel und KPI; Card-Größen im Desktop-Layout (Projects breiter als Career usw.); Hover/Fokus-Klasse bzw. Transform; mit `reduced-motion` keine Bewegung.

### T-21 CR-2: Hero entfernen, Profil-Card, Fiori-Abstände
- `Hero.tsx` löschen; `OverviewPage` rendert nur noch das BentoGrid (AC-01.7).
- `cards.ts`: Profil-Card `about` („About me“, Größe `wide`, ohne KPI) als erste Card; GitHub-Card ohne KPI (AC-01.3, AC-01.6).
- `ProfileCard`: `Avatar` mit Initialen, Name, Positionierung (AC-01.8).
- Bento-Areas und Abstände laut Tech Spec §6: CSS-Variablen für Seitenrand und Card-Abstand, keine Max-Breite (AC-01.9).
- **Tests:** Hero-Test entfernen; kein `<h1>`/Inhalt außerhalb von Cards; Profil-Card zeigt Avatar, Name, Positionierung; Layout-Test auf 6 Cards und neues Raster; Abstände bei 375 px, 800 px, 1280 px und 1600 px (Seitenrand 16/32/32/48 px, Card-Abstand 16 px).

### T-17 Projects-Card
- Liste der Projekte: Name als Link (neuer Tab), Beschreibung, Technologie-Tags.
- **Tests:** Je Projekt ein Eintrag mit allen Feldern; Link-Attribute `target="_blank"`, `rel="noopener noreferrer"`.

### T-18 Skills-Card
- Je Gruppe ein Label + Tags.
- **Tests:** Vier Gruppen in der richtigen Reihenfolge; alle Skills aus dem Intent sichtbar.

### T-19 Career-Card
- `Timeline` mit Stationen, neueste zuerst.
- **Tests:** Sortierung absteigend nach Startdatum; Zeitraum, Rolle, Firma, Highlights sichtbar.

### T-20 Contact- & GitHub-Card
- Contact: Liste der Kanäle mit Icons; GitHub hervorgehoben; optional `mailto:`.
- GitHub: interaktiver Card-Header öffnet das Profil in neuem Tab.
- **Tests:** GitHub-Eintrag hervorgehoben; kein `<form>`; GitHub-Card öffnet `github.com/Voelkerdo`.

### T-13 Responsive-Feinschliff
- Bento-Grid: 4 → 2 → 1 Spalten laut Tech Spec §6; ab 360 px kein horizontales Scrollen.
- **Tests (E2E):** Bei 360 px, 800 px und 1280 px Viewport `scrollWidth <= clientWidth` und erwartete Spaltenanzahl.

### T-14 Manuelle Abnahme
- Production-Build lokal per `npm run preview`.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 90 (AC-08.2); Startseite < 2 s (AC-01.5).
- „Wow-Test“: Seite Kollegen/Freunden/Familie zeigen (Intent-Erfolgskriterium).
- Ergebnisse werden hier dokumentiert.
