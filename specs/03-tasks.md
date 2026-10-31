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
| T-17 | Projects-Card | AC-02.1, AC-02.2 | [x] |
| T-18 | Skills-Card | AC-03.1, AC-03.2 | [x] |
| T-22 | CR-3: Skills als animierte Fortschrittsbalken | AC-03.4, AC-03.5, AC-03.6, AC-03.7, AC-08.3 | [x] |
| T-23 | CR-4: Skills als sortierte Liste ohne Kategorien | AC-03.2, AC-03.7, AC-03.8 | [x] |
| T-19 | Career-Card | AC-04.1 | [x] |
| T-20 | Contact- & GitHub-Card | AC-01.2, AC-05.1, AC-05.2 | [x] |
| T-24 | CR-5: Nur SAP-Skills, Top 5 mit „Show all“ | AC-03.2, AC-03.7, AC-03.9 | [x] |
| T-25 | CR-6: GitHub-Card entfernen, Contact hoch | AC-01.2, AC-01.3, AC-01.6 | [x] |
| T-13 | Responsive-Feinschliff | AC-01.6, AC-08.1 | [x] |
| T-26 | CR-7: Benachrichtigungsglocke | AC-10.1–AC-10.5 | [x] |
| T-27 | CR-7: „Currently building“-Status | AC-01.10 | [x] |
| T-28 | CR-8: Settings-Dialog & Theme-Wahl | AC-06.2, AC-06.9, AC-09.1, AC-09.2, AC-11.1–AC-11.4, AC-11.8 | [x] |
| T-29 | CR-8: Nachempfundene SAP-Themes | AC-11.2, AC-11.5 | [x] |
| T-30 | CR-8: Zeitreise-Overlay | AC-11.6–AC-11.8 | [x] |
| T-31 | Echte Inhalte einpflegen | AC-01.8, AC-02.3, AC-02.4, AC-04.2, AC-05.1, AC-05.2 | [x] |
| T-32 | CR-9: Career-Card mit „Show all“ auf dem Desktop | AC-04.1, AC-04.3, AC-08.3 | [x] |
| T-33 | CR-10: Career eingeklappt ohne Highlights | AC-04.3, AC-08.3 | [x] |
| T-35 | CR-11: Career-Card mit Scroll-Pfeilen | AC-04.1, AC-04.4, AC-08.3 | [x] |
| T-34 | CR-10: Projects mit „Show all“ und Zielhöhe | AC-01.11, AC-02.5, AC-08.3 | [x] |
| T-36 | CR-12: Settings › System | AC-12.1–AC-12.4 | [x] |
| T-37 | CR-13: Transport-Log-Daten zur Build-Zeit | AC-02.7, AC-02.8 | [x] |
| T-38 | CR-13: Projects-Card mit Ansicht „Transport Log“ | AC-01.3, AC-01.11, AC-02.5, AC-02.6, AC-02.9, AC-08.3 | [x] |
| T-39 | CR-14: Seitenpunkte und automatischer Seitenwechsel | AC-01.11, AC-02.10, AC-02.11, AC-08.3 | [x] |
| T-40 | CR-15: Pfeile neben den Seitenpunkten | AC-02.10, AC-02.11 | [x] |
| T-41 | CR-16: Gleich hohe Seiten und Überblendung in der Projects-Card | AC-02.5, AC-02.9, AC-02.12, AC-08.3 | [x] |
| T-42 | CR-17: Schrift „72“ selbst hosten | AC-13.1 | [x] |
| T-43 | CR-17: CSP, Referrer-Policy und Security-Tests gegen den Build | AC-13.1–AC-13.5, AC-13.7 | [x] |
| T-44 | CR-17: `npm run security` und Regel in CLAUDE.md | AC-13.6 | [x] |
| T-45 | CR-18: Deploy-Workflow, Dependabot, CLAUDE.md | AC-14.2–AC-14.5 | [x] |
| T-46 | CR-18: Erstveröffentlichung und Abnahme der Live-Seite | AC-14.1, AC-14.6 | [x] |
| T-47 | CR-19: README-Bilder per Script (Screenshot, Zeitreise-GIF) | AC-15.5 | [x] |
| T-48 | CR-19: README, Lizenz und Repo-Metadaten | AC-15.1–AC-15.4, AC-15.6, AC-15.7 | [ ] |
| T-14 | Manuelle Abnahme | AC-01.5, AC-08.2, Intent-Erfolgskriterien | [~] |

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

### T-22 CR-3: Skills als animierte Fortschrittsbalken
- Datenmodell: `Skill { name, level }`, `SkillLevel`, `LEVEL_PERCENT` (Tech Spec §4); `skills.ts` mit den Stufen aus AC-03.7.
- `countSkills` zählt weiterhin eindeutige Skill-Namen (AC-01.3).
- `SkillsCard`: je Skill Name + `ProgressIndicator` mit Stufenname; Balkenfarbe Akzent; gestaffeltes Füllen beim Laden, Reduced Motion ohne Animation (Tech Spec §6).
- **Tests:** Unit – Stufen laut AC-03.7, SAP UI5 in beiden Gruppen gleich, `LEVEL_PERCENT`-Mapping, KPI unverändert 10. E2E – Balken zeigen Stufennamen und Endwert; Balken starten leer und füllen sich; mit `reduced-motion` sofort am Endwert; AC-03.1/03.2 bleiben grün.

### T-23 CR-4: Skills als sortierte Liste ohne Kategorien
- Datenmodell: `SkillGroup` entfernen, `skills: Skill[]` mit den 10 Skills (SAP UI5 nur einmal); `sortedSkills()` (Tech Spec §4).
- `countSkills` auf die flache Liste umstellen; KPI bleibt 10 (AC-01.3).
- `SkillsCard`: eine Liste, Name links, Balken rechts, keine Gruppen-Überschriften; Animation und Reduced Motion unverändert (AC-03.6).
- **Tests:** Unit – 10 Skills, jeder einmal, Stufen laut AC-03.7, Sortierung stabil absteigend. E2E – Reihenfolge in der Card, keine Gruppen, Balkenlängen und Animation weiterhin grün.

### T-19 Career-Card
- `Timeline` mit Stationen, neueste zuerst.
- **Tests:** Sortierung absteigend nach Startdatum; Zeitraum, Rolle, Firma, Highlights sichtbar.

### T-20 Contact- & GitHub-Card
- Contact: Liste der Kanäle mit Icons; GitHub hervorgehoben; optional `mailto:`.
- GitHub: interaktiver Card-Header öffnet das Profil in neuem Tab.
- **Tests:** GitHub-Eintrag hervorgehoben; kein `<form>`; GitHub-Card öffnet `github.com/Voelkerdo`.

### T-24 CR-5: Nur SAP-Skills, Top 5 mit „Show all“
- `skills.ts`: HTML5, Node.js, JavaScript entfernen (7 Skills); `VISIBLE_SKILLS = 5`.
- `SkillsCard`: anfangs Top 5; Umschalter „Show all (7)“ / „Show less“ mit `aria-expanded`; Auf-/Zuklappen animiert, neue Balken füllen sich; Reduced Motion ohne Animation.
- KPI der Skills-Card zählt alle gezeigten Skills (7) (AC-01.3).
- **Tests:** Unit – 7 Skills, Stufen laut AC-03.7, Sortierung, KPI 7. E2E – anfangs 5 Zeilen, „Show all (7)“ zeigt 7 und die neuen Balken füllen sich, „Show less“ zeigt wieder 5, Tastaturbedienung und `aria-expanded`.

### T-25 CR-6: GitHub-Card entfernen, Contact hoch
- `GitHubCard.tsx` löschen; `cards.ts` ohne `github`, Contact mit Größe `tall`; `CardSize` ohne `small`.
- Bento-Areas laut Tech Spec §6 (4 und 2 Spalten).
- **Tests:** 5 Cards; Layout-Test auf neues Raster (Contact reicht von About bis Skills); GitHub-CTA weiterhin über Contact-Card und Avatar-Menü erreichbar; Tastatur-Test ohne GitHub-Card.

### T-13 Responsive-Feinschliff
- Bento-Grid: 4 → 2 → 1 Spalten laut Tech Spec §6; ab 360 px kein horizontales Scrollen.
- **Tests (E2E):** Bei 360 px, 800 px und 1280 px Viewport `scrollWidth <= clientWidth` und erwartete Spaltenanzahl.

### T-26 CR-7: Benachrichtigungsglocke
- `data/notifications.ts` mit den drei Einträgen aus AC-10.2.
- ShellBar: `showNotifications`, Badge = Anzahl ungelesener; Klick öffnet `ResponsivePopover` mit `NotificationList`; beim Öffnen alle als gelesen markieren.
- Klick auf „New follower request“ öffnet das GitHub-Profil.
- **Tests:** Unit – Inhalte laut AC-10.2. E2E – Badge 3; Liste mit drei Einträgen; nach dem Öffnen kein Badge mehr; Klick auf Follower-Eintrag öffnet GitHub; Bedienung per Tastatur; bei 390 px Vollbild.

### T-27 CR-7: „Currently building“-Status
- `profile.currentlyBuilding` mit dem Text aus AC-01.10.
- `ProfileCard`: Statuszeile mit Icon unter der Positionierung.
- **Tests:** Unit – Text laut AC-01.10. E2E – Statuszeile sichtbar in der Profil-Card.

### T-28 CR-8: Settings-Dialog & Theme-Wahl
- `data/themes.ts` laut Tech Spec §4, vorerst ohne die nachempfundenen Themes: Today (3) und Horizon/Quartz (4).
- `useThemeMode` und `ThemeModeProvider` auf eine Theme-ID umstellen: `theme` statt `mode`, `selectTheme(id)` statt `toggleMode()`. Dazu Auflösung von „Auto“ über den System-Modus, Persistenz unter `theme` und Übernahme des alten Werts `theme-mode` (Tech Spec §7).
- `theme.css`: Sunset-Coral-Selektoren auf `[data-theme^='sunset-coral']` umstellen.
- `AppShell`: Menüeintrag „Dark/Light mode“ entfernen, „Settings“ (Icon `action-settings`) vor „About“ einfügen.
- `SettingsDialog`: `UserSettingsDialog` mit Appearance, gruppierter Liste „Name · Jahr“; das aktive Theme ist ausgewählt, ein Klick wendet es sofort an.
- **Tests:** Unit – Katalog: Reihenfolge, Jahre und Gruppen laut AC-11.2, IDs eindeutig; Default „Auto“ folgt dem System; Auswahl setzt UI5-Theme und `data-theme`, wird gemerkt und wiederhergestellt; Migration von `theme-mode`; kaputter Storage. E2E – Avatar-Menü zeigt Settings und About, aber keinen Theme-Umschalter; Settings öffnet Appearance; Auswahl von „SAP Quartz Dark“ wechselt das Theme und bleibt nach dem Neuladen erhalten; Tastaturbedienung; bei 390 px Vollbild. Bestehende AC-09.1/AC-07.1-Tests anpassen.

### T-29 CR-8: Nachempfundene SAP-Themes
- `themes.ts` um Belize, Blue Crystal, Corbu, Signature, Enjoy und Classic ergänzen (`emulated: true`, Basis `sap_fiori_3`).
- `eras.css` mit den Variablen-Sets laut Tech Spec §7, inklusive `--accent-*`.
- Je Theme einen Screenshot der Overview Page zur Abnahme zeigen und die Farben mit Dominik feinjustieren.
- **Tests:** Unit – vollständiger Katalog laut AC-11.2 (13 Themes, neueste zuerst je Gruppe). E2E – je nachempfundenem Theme `data-theme` gesetzt, Leitfarbe (`--sapBrandColor`) und Hintergrund wie spezifiziert; Kontrast Text/Hintergrund ≥ 4,5 : 1 für `--sapTextColor` auf `--sapBackgroundColor` und auf dem Card-Hintergrund; kein horizontales Scrollen bei 360 px.

### T-30 CR-8: Zeitreise-Overlay
- `TimeTravelOverlay`: Jahreszahl und Ziel-Theme-Name, `popover="manual"`, `role="status"`; Ablauf laut Tech Spec §6.
- `selectTheme` mit dem Overlay verbinden: Bei anderem Jahr Overlay → Zählen → Theme-Wechsel → Ausblenden; bei gleichem Jahr direkter Wechsel.
- **Tests:** E2E – Wechsel von Sunset Coral zu SAP Classic zeigt das Overlay, die Zahl durchläuft Zwischenjahre und endet bei 1992, danach ist das Theme aktiv und das Overlay weg; Light ↔ Dark ohne Overlay; mit `reduced-motion` direkt 1992 ohne Zwischenwerte; Statusmeldung „Travelling to 1992 – SAP Classic“; das Overlay liegt sichtbar über dem Settings-Dialog.

### T-31 Echte Inhalte einpflegen
Inhalte von Dominik (Abfrage am 2026-10-31), ersetzen die Platzhalter aus D-3 und D-4:
- **Profil:** Tagline „Fullstack Developer – ABAP, RAP, Linux & UI5“; Avatar bleibt bei den Initialen „DV“; Repo dieser Website: `github.com/Voelkerdo/Voelkerdo.github.io`.
- **Projekte** (SAP zuerst): Portfolio Website · ABAP Programming Model for SAP Fiori · Simple OData Service · Quote API · Message Mixer, jeweils mit Beschreibung und Tags wie abgestimmt.
- **Werdegang:** Application Expert SAP Development and SAP Authorizations (MEYER WERFT GmbH, seit 07/2025) · Application Professional (MEYER WERFT GmbH, 08/2019–06/2025) · IT Specialist for Application Development (apprenticeship) (MEYER WERFT GmbH, 08/2016–07/2019), mit den abgestimmten Highlights. „Years of experience“ zählt ab der Ausbildung.
- **Kontakt:** GitHub und LinkedIn (`linkedin.com/in/dominik-völker-01714422b`, ohne Tracking-Parameter); keine E-Mail (AC-05.2 „optional“). _(LinkedIn-URL nachgereicht nach T-31.)_
- **Tests:** Die E2E-Tests für Projects, Career, Contact und Profil sowie der About-Link prüfen die echten Inhalte; KPIs: 5 Projekte, 2 Kanäle.

### T-32 CR-9: Career-Card mit „Show all“ auf dem Desktop
- `career.ts`: `VISIBLE_STATIONS = 1`.
- `CareerCard`: Container um die Timeline mit gemessener Höhe (Tech Spec §6), verborgene Stationen `inert`, Umschalter „Show all (3)“ / „Show less“ mit `aria-expanded`, nur ab 1024 px.
- **Tests:** E2E bei 1280 px: anfangs nur die aktuelle Station sichtbar, die älteren `inert` und abgeschnitten; „Show all (3)“ zeigt alle drei, „Show less“ klappt wieder zu; Bedienung per Tastatur und `aria-expanded`; mit `reduced-motion` ohne Transition. Bei 800 px und 390 px alle drei Stationen sichtbar und kein Umschalter. AC-04.1-Test unverändert grün.

### T-33 CR-10: Career eingeklappt ohne Highlights
- `CareerCard`: Highlights jeder Station in einem Wrapper; eingeklappt ist auch der der aktuellen Station zu. Container-Höhen laut Tech Spec §6.
- **Tests:** E2E bei 1280 px – eingeklappt sind Rolle, Firma und Zeitraum der aktuellen Station sichtbar, ihre Highlights nicht; „Show all (3)“ zeigt alle Highlights und Stationen; „Show less“ klappt wieder zu; Reduced Motion ohne Transition. Bei 800 px und 390 px weiterhin alles sichtbar.

### T-35 CR-11: Career-Card mit Scroll-Pfeilen
- `CareerCard`: Show-all-Umschalter, Höhenmessung und Highlight-Wrapper aus T-32/T-33 entfernen; `VISIBLE_STATIONS` entfällt.
- Scroll-Bereich mit ▲/▼ laut Tech Spec §6, nur ab 1024 px.
- **Tests:** E2E bei 1280 px – Card-Höhe wie eingeklappt in CR-10 (± 1 rem); anfangs nur ▼; ▼ scrollt zum Anfang der zweiten Station, danach sind ▲ und ▼ sichtbar; am Ende nur ▲; ▲ scrollt zurück; Mausrad über der Card scrollt die Seite, nicht die Card; Bedienung per Tastatur, Namen der Pfeile; mit Reduced Motion ohne Animation. Bei 800 px und 390 px alle Stationen ohne Pfeile. AC-04.1 weiterhin grün.

### T-34 CR-10: Projects mit „Show all“ und Zielhöhe
- `projects.ts`: `VISIBLE_PROJECTS = 3`.
- `ProjectsCard`: zwei Listen, die zweite im aufklappbaren Wrapper; Umschalter „Show all (5)“ / „Show less“ mit `aria-expanded`, nur ab 1024 px.
- **Tests:** E2E bei 1280 px – anfangs 3 Projekte sichtbar, die übrigen `inert`; Auf-/Zuklappen per Maus und Tastatur, `aria-expanded`; Reduced Motion ohne Transition; bei 800 px und 390 px alle 5 Projekte ohne Umschalter. AC-01.11: bei 1280 × 780 und 1440 × 780 kein vertikales Scrollen. AC-02.1/02.2 weiterhin grün.

### T-36 CR-12: Settings › System
- `vite.config.ts`: `__SYSTEM_INFO__` per `define` (Versionen, Build-Datum, Commit) laut Tech Spec §4; Typdeklaration.
- `data/system.ts`: Tech-Stack, Hosting „GitHub Pages – Static site, no backend“, Build-Infos.
- `SettingsDialog`: zweite Kategorie „System“ mit gruppierter Liste; die Theme-Zeile kommt aus `useThemeMode` (aufgelöstes Theme).
- **Tests:** Unit – Stack enthält die fünf Pakete mit Versionsnummer im Format `x.y.z`, Hosting-Text, Datum im Format `YYYY-MM-DD`. E2E – Settings zeigt Appearance und System; System zeigt die vier Gruppen; die Theme-Zeile wechselt nach einer Theme-Wahl (z. B. „SAP Quartz Dark · sap_fiori_3_dark“); Bedienung per Tastatur; bei 390 px erst die Kategorienliste. About-Dialog-Test bleibt grün.

### T-37 CR-13: Transport-Log-Daten zur Build-Zeit
- `vite.config.ts`: `__TRANSPORT_LOG__` laut TD-16; die Parse-Logik als reine Funktionen in einem eigenen Modul, damit sie testbar ist.
- `data/transports.ts`: typisierte `transports` (neuester zuerst) und `buildStats`.
- **Tests:** Unit – Parsen eines Beispiel-`git log` (Nummernschema, Text „CR-N …“ mit großem Anfangsbuchstaben und ohne `[…]`-Referenzen, Status Imported/Released, Initial release); Zählen der Tasks und Tests aus Beispieltexten; die echten Daten enthalten DVK900001 und mindestens 13 CRs.

### T-38 CR-13: Projects-Card mit Ansicht „Transport Log“
- Context für die Ansicht; `AnimatedCard` übernimmt Untertitel/KPI der Ansicht.
- `ProjectsCard`: `SegmentedButton`, Überblenden, Ansicht „Transport Log“ mit Kennzahlen und Liste, Show all für Transporte.
- **Tests:** E2E – Default „Repositories“ (Inhalt und KPI wie bisher); Wechsel zu „Transport Log“ zeigt vier Kennzahlen, neuesten Transport oben, DVK900001 „Initial release“ (nach Show all), Untertitel „Built spec-driven“ und KPI = Anzahl Transporte; Tastaturbedienung; Reduced Motion; Desktop 3 Transporte + Show all, bei 390 px alle; AC-01.11 bei 1280 × 780 in beiden Ansichten.

### T-39 CR-14: Seitenpunkte und automatischer Seitenwechsel
- `ProjectsCard`: `SegmentedButton` durch Seitenpunkte unten ersetzen; Timer mit Pause-/Stopp-Regeln laut Tech Spec §6; „Show all“ meldet das Aufklappen.
- **Tests:** E2E (Timer per `page.clock`) – Default Repositories, aktiver Punkt `aria-current`; nach 8 s Transport Log, nach weiteren 8 s wieder Repositories; Hover pausiert, nach dem Verlassen wieder 8 s; Fokus pausiert; Klick auf einen Punkt wechselt und stoppt den Auto-Wechsel; „Show all“ stoppt; Reduced Motion ohne Auto-Wechsel; Punkte per Tastatur bedienbar. Bestehende Transport-Log-Tests auf Punkte umstellen; AC-01.11 bei 1280 × 780 in beiden Seiten.

### T-40 CR-15: Pfeile neben den Seitenpunkten
- `ProjectsCard`: Pfeil-Buttons vor und hinter den Punkten laut Tech Spec §5; Fokus wandert zum anderen Pfeil, wenn der fokussierte deaktiviert wird; ein Pfeil-Klick stoppt den automatischen Wechsel.
- **Tests:** E2E – auf Seite 1 ist ‹ deaktiviert und › aktiv; › blättert zum Transport Log, dann ist › deaktiviert und ‹ aktiv; ‹ blättert zurück; Namen für Screenreader; per Tastatur: Fokus auf ›, Enter → Fokus liegt danach auf ‹; ein Pfeil-Klick stoppt den Auto-Wechsel (`page.clock`). AC-01.11 weiterhin grün.

### T-41 CR-16: Gleich hohe Seiten und Überblendung in der Projects-Card
- `ProjectsCard`: beide Seiten übereinander rendern laut Tech Spec §6, inaktive Seite `inert`/verborgen, Überblendung per CSS; Header aus der aktiven Seite; „Show all“ auf allen Breiten (`useDesktop` entfällt für Projects).
- **Tests:** E2E bei 390 px und 1280 px – Card-Höhe vor und nach dem Seitenwechsel gleich (manuell und automatisch); während des Wechsels sind beide Seiten teilweise sichtbar (Opacity zwischen 0 und 1); inaktive Seite `inert`; Reduced Motion ohne Transition; bei 390 px 3 Projekte bzw. 3 Transporte mit „Show all“. Bestehende Tests „alle sichtbar unter 1024 px“ anpassen; AC-01.11 weiterhin grün.

### T-42 CR-17: Schrift „72“ selbst hosten
- `@sap-theming/theming-base-content` als feste Abhängigkeit (Version wie von UI5 verwendet); Vite-Alias `@sap-fonts`.
- `styles/fonts.css` aus UI5s `FontFace.css` ableiten; `setDefaultFontLoading(false)` in `main.tsx`.
- **Tests:** E2E (Dev-Server) – keine Requests an `cdn.jsdelivr.net`, die Schrift „72“ ist geladen (`document.fonts.check('16px "72"')`); Optik unverändert (Screenshot-Check).

### T-43 CR-17: CSP, Referrer-Policy und Security-Tests gegen den Build
- Vite-Plugin für die Meta-Tags (nur Build, TD-17).
- Playwright-Projekt `security` laut TD-18 mit den Tests aus Tech Spec §9; `verify` führt beide Projekte aus.
- **Tests:** wie in Tech Spec §9 beschrieben; jeder Test nennt sein AC-13.x.

### T-44 CR-17: `npm run security` und Regel in CLAUDE.md
- Script `security` = `npm audit --audit-level=low && npm audit signatures`.
- CLAUDE.md: Change-Request-Ablauf und Regeln um „`npm run security` bei jedem CR und vor jedem Deployment“ ergänzen; Befunde führen zu einem eigenen CR bzw. Fix.

### T-45 CR-18: Deploy-Workflow, Dependabot, CLAUDE.md
- `.github/workflows/deploy.yml` und `.github/dependabot.yml` laut Tech Spec §9a; SHAs der Actions ermitteln und mit Versionskommentar eintragen.
- `playwright.config.ts`: auf CI ggf. weniger Worker und ein Retry für zeitkritische Tests.
- CLAUDE.md: Ausnahme `.github/` (TD-19), Hinweis auf das automatische Deployment; persönliche Hinweise (Reduced Motion am Mac, WLAN-Test) ins lokale Memory verschieben.
- **Prüfung:** Workflow lokal auf Syntax prüfen (`actionlint`, falls verfügbar, sonst YAML-Parse) und gegen AC-14.3 durchsehen: Rechte, Pinning, keine Secrets.

### T-46 CR-18: Erstveröffentlichung und Abnahme der Live-Seite
- Nach Dominiks ausdrücklichem OK: Repo `Voelkerdo/Voelkerdo.github.io` (öffentlich) anlegen, Pages-Source „GitHub Actions“ setzen, `main` pushen.
- Workflow-Lauf beobachten bis grün.
- Live-Seite prüfen (AC-14.6): vollständig geladen, keine Requests an Dritte, CSP-Meta aktiv, Lighthouse ≥ 90; Ergebnis in T-14 dokumentieren.
- **Ergebnis:** live seit 2026-10-31; alles erfüllt außer Lighthouse mobil (85–89 nach `fix(T-46)`, vorher 77–81) – als offene Frage OQ-1 zurückgestellt.

### T-47 CR-19: README-Bilder per Script
- `assets/scripts/readme-media.mjs` und npm-Script `readme:media` laut Tech Spec §9c; Ausgabe nach `.github/readme/`.
- Bilder erzeugen und Dominik zur Abnahme zeigen (Bildausschnitt, Länge und Tempo des GIFs).

### T-48 CR-19: README, Lizenz und Repo-Metadaten
- `README.md` (Englisch) laut AC-15.1–AC-15.4; Entwurf zuerst Dominik zeigen (Texte sind seine Entscheidung).
- `LICENSE` (MIT, Copyright Dominik Völker, Ausnahme für persönliche Inhalte).
- Unit-Test: lokale Bildlinks der README existieren, GIF ≤ 3 MB.
- Nach Dominiks OK: pushen; Repo-Beschreibung, Website `https://voelkerdo.github.io/` und Topics per `gh` setzen.

### T-14 Manuelle Abnahme
- Production-Build lokal per `npm run preview`.
- Lighthouse: Performance ≥ 90, Accessibility ≥ 90 (AC-08.2); Startseite < 2 s (AC-01.5).
- „Wow-Test“: Seite Kollegen/Freunden/Familie zeigen (Intent-Erfolgskriterium).
- Ergebnisse werden hier dokumentiert.

#### Ergebnisse (2026-10-30, Production-Build lokal per `vite preview`, Lighthouse 13.6, Chrome for Testing)
| Prüfung | Ziel | Mobile | Desktop | Ergebnis |
|---|---|---|---|---|
| Performance (AC-08.2) | ≥ 90 | 99 | 99 | ✅ |
| Accessibility (AC-08.2) | ≥ 90 | 95 | 95 | ✅ |
| Best Practices | – | 100 | 100 | (informativ) |
| SEO | – | 91 | 91 | (informativ) |
| Vollständig dargestellt (AC-01.5): alle Cards eingeblendet | < 2 s | – | 0,97–1,02 s (5 Läufe) | ✅ |

Kennzahlen Desktop: FCP 0,2 s · LCP 0,9 s · TBT 0 ms · CLS 0,039. Mobile (gedrosselt): FCP 0,8 s · LCP 0,8 s · TBT 120 ms · CLS 0.

Offene Hinweise aus Lighthouse (kein AC verletzt):
- `aria-prohibited-attr`: UI5 `CardHeader` rendert im Icon-Bereich ein `aria-label` ohne Rolle – UI5-intern, nicht in unserem Code.
- `heading-order`: Die Card-Titel (UI5, `aria-level` 3) stehen vor der `<h1>` in der Profil-Card.
- `robots-txt`: Es gibt keine `robots.txt`; der Preview-Server liefert stattdessen die Startseite aus.

- **Wow-Test (Intent-Erfolgskriterium):** offen – Dominik zeigt die Seite Kollegen, Freunden und Familie.

#### Ergebnisse Live-Seite (2026-10-31, `https://voelkerdo.github.io/`, Lighthouse 13.6, nach `fix(T-46)`)
| Prüfung | Ziel | Mobile | Desktop | Ergebnis |
|---|---|---|---|---|
| Performance (AC-08.2) | ≥ 90 | 85–89 (3 Läufe) | 100 | ⚠️ mobil offen, OQ-1 |
| Accessibility (AC-08.2) | ≥ 90 | 95 | 95 | ✅ |
| Best Practices / SEO | – | 100 / 100 | 100 / 100 | (informativ) |
| Requests an Dritte, CSP-Verstöße (AC-13.1, AC-13.2) | 0 | 0 | 0 | ✅ |

Verbliebene Lighthouse-Hinweise: `aria-prohibited-attr` (UI5-intern im `CardHeader`), `heading-order` (Card-Titel vor der `<h1>` der Profil-Card).
