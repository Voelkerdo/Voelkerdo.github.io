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
- **Kontakt:** GitHub und LinkedIn; keine E-Mail (AC-05.2 „optional“). Die LinkedIn-URL reicht Dominik nach und bleibt bis dahin `TODO(content)`.
- **Tests:** Die E2E-Tests für Projects, Career, Contact und Profil sowie der About-Link prüfen die echten Inhalte; KPIs: 5 Projekte, 2 Kanäle.

### T-32 CR-9: Career-Card mit „Show all“ auf dem Desktop
- `career.ts`: `VISIBLE_STATIONS = 1`.
- `CareerCard`: Container um die Timeline mit gemessener Höhe (Tech Spec §6), verborgene Stationen `inert`, Umschalter „Show all (3)“ / „Show less“ mit `aria-expanded`, nur ab 1024 px.
- **Tests:** E2E bei 1280 px: anfangs nur die aktuelle Station sichtbar, die älteren `inert` und abgeschnitten; „Show all (3)“ zeigt alle drei, „Show less“ klappt wieder zu; Bedienung per Tastatur und `aria-expanded`; mit `reduced-motion` ohne Transition. Bei 800 px und 390 px alle drei Stationen sichtbar und kein Umschalter. AC-04.1-Test unverändert grün.

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
