# Technical Specification

> Status: approved · Abgeleitet aus: [01-prd.md](01-prd.md)

## 1. Tech-Stack
| Bereich | Technologie | Version (Major) |
|---|---|---|
| Sprache | TypeScript (strict) | 7.x |
| Build / Dev-Server | Vite | 8.x |
| UI-Framework | React + React DOM | 19.x |
| UI-Komponenten | `@ui5/webcomponents-react` (inkl. `@ui5/webcomponents`, `-fiori`, `-icons`) | 2.28.x |
| Theme | SAP Horizon (`sap_horizon` / `sap_horizon_dark`) + eigene Akzentfarben (Default); SAP Quartz (`sap_fiori_3` / `sap_fiori_3_dark`); nachempfundene Themes auf Basis `sap_fiori_3` (TD-13, CR-8) | – |
| Animationen | Motion (`motion/react`) | 14.x |
| Schrift „72“ | `@sap-theming/theming-base-content` (selbst gehostet, CR-17) | 11.x |
| ~~Routing~~ | ~~React Router~~ – entfällt (TD-11, CR-1) | – |
| Unit-/Komponententests | Vitest + Testing Library (jsdom) | 5.x / 16.x |
| E2E-Tests | Playwright (Chromium) | 1.x |
| Linting / Formatierung | Oxlint + Prettier | 1.x / 3.x |
| Package Manager | npm | – |

## 2. Architektur
Reine Single-Page-Application ohne Backend. Alle Inhalte sind statische TypeScript-Daten, die zur Build-Zeit eingebunden werden (D-1). Der Production-Build in `assets/dist/` ist ein rein statischer Ordner und damit bei jedem Hoster deploybar.

Es gibt genau eine Seite, die Overview Page – kein Routing (TD-11).

```
App
├─ ThemeProvider (UI5)
└─ ThemeModeProvider
   └─ AppShell                       ← Header (ShellBar) + Avatar-Menü, immer sichtbar
      ├─ SettingsDialog              ← Settings › Appearance mit Theme-Zeitreise (REQ-11)
      ├─ TimeTravelOverlay           ← Jahreszähler beim Theme-Wechsel (AC-11.6)
      └─ OverviewPage
         └─ BentoGrid
            ├─ ProfileCard    (breit)
            ├─ ProjectsCard   (groß)
            ├─ CareerCard     (hoch)
            ├─ ContactCard    (hoch)
            └─ SkillsCard     (breit)
```

## 3. Projektstruktur
Specs und Code sind getrennt (TD-7): `specs/` enthält ausschließlich die Spezifikation, `assets/` alles Ausführbare – Code, Tests, Configs, `package.json`.

```
specs/                      # Intent, PRD, Tech Spec, Tasks
assets/
├─ package.json, vite.config.ts, tsconfig*.json, oxlint/prettier/playwright/vitest-Config
├─ index.html
src/
├─ main.tsx                 # Einstieg, UI5-Theme-Setup
├─ App.tsx                  # Provider + Shell + Overview Page
├─ shell/
│  ├─ AppShell.tsx          # ShellBar, Avatar, UserMenu
│  ├─ AboutDialog.tsx
│  ├─ SettingsDialog.tsx    # UserSettingsDialog mit Appearance (REQ-11)
│  ├─ TimeTravelOverlay.tsx # Jahreszähler-Overlay (AC-11.6, AC-11.7)
│  ├─ ThemeModeProvider.tsx
│  └─ useThemeMode.ts       # Theme-Wahl (Theme-ID) + System-Modus für „Auto“
├─ overview/
│  ├─ OverviewPage.tsx      # BentoGrid mit allen Cards
│  ├─ BentoGrid.tsx         # CSS-Grid mit Card-Größen
│  ├─ AnimatedCard.tsx      # UI5 Card + Motion (Einblenden, Hover/Fokus)
│  ├─ useDesktop.ts         # ≥ 1024 px per matchMedia (AC-04.4; Projects seit CR-16 nicht mehr)
│  └─ cards/
│     ├─ ProfileCard.tsx
│     ├─ ProjectsCard.tsx
│     ├─ SkillsCard.tsx
│     ├─ CareerCard.tsx
│     ├─ ContactCard.tsx
│     └─ GitHubCard.tsx
├─ data/
│  ├─ types.ts              # Datenmodelle
│  ├─ profile.ts            # Name, Positionierung, GitHub-URL, Avatar
│  ├─ projects.ts
│  ├─ skills.ts
│  ├─ career.ts
│  ├─ contact.ts
│  ├─ themes.ts             # Theme-Katalog mit Jahr, Gruppe, UI5-Basis-Theme (REQ-11)
│  ├─ system.ts             # Tech-Stack, Hosting, Build-Infos für Settings › System (REQ-12)
│  ├─ transports.ts         # Transporte und Kennzahlen für das Transport Log (AC-02.7, AC-02.8)
│  └─ cards.ts              # Card-Definitionen inkl. Größe (leitet KPIs aus den Daten ab)
├─ motion/
│  └─ transitions.ts        # Animations-Varianten, reduced-motion-Handling
└─ styles/
   ├─ theme.css             # Akzent-Theme über UI5-CSS-Variablen
   └─ eras.css              # nachempfundene SAP-Themes (TD-13)
tests/
├─ unit/                    # *.test.tsx (Vitest)
└─ e2e/                     # *.spec.ts (Playwright)
```
(`src/` und `tests/` liegen innerhalb von `assets/`.)

## 4. Datenmodell (`assets/src/data/types.ts`)
```ts
interface Profile  { name: string; tagline: string; currentlyBuilding: string; githubUsername: string; githubUrl: string; avatarUrl?: string; siteRepoUrl: string }
interface NotificationDef { id: string; title: string; text: string; time: string; importance?: 'High'; href?: string }
interface Project  { id: string; name: string; description: string; technologies: string[]; repoUrl: string }
type SkillLevel = 'Expert' | 'Advanced' | 'Intermediate' | 'Familiar'
interface Skill { name: string; level: SkillLevel }
interface CareerStation { id: string; from: string; to?: string; role: string; company: string; highlights: string[] }
interface ContactChannel { id: string; label: string; url: string; icon: string; primary?: boolean; description?: string }
type CardSize = 'large' | 'wide' | 'tall'
interface CardDef { id: string; title: string; subtitle?: string; icon: string; kpi?: string; size: CardSize }
interface Transport { number: string; cr?: number; text: string; date: string; status: 'Imported' | 'Released' }
interface BuildStats { changeRequests: number; tasks: number; tests: number; commits: number }
type ThemeGroup = 'Today' | 'SAP Fiori' | 'SAP GUI'
type ThemeId = 'sunset-coral-auto' | 'sunset-coral-light' | 'sunset-coral-dark' | 'horizon-morning' | 'horizon-evening'
  | 'quartz-light' | 'quartz-dark' | 'belize' | 'blue-crystal' | 'corbu' | 'signature' | 'enjoy' | 'classic'
interface ThemeDef { id: ThemeId; name: string; year: number; group: ThemeGroup; ui5Theme?: string; emulated?: boolean }
```
- `themes.ts` enthält die 13 Themes aus AC-11.2 in Anzeigereihenfolge. `ui5Theme` ist das UI5-Basis-Theme; bei `sunset-coral-auto` entfällt es, weil es aus dem System-Modus folgt. `DEFAULT_THEME = 'sunset-coral-auto'` (AC-11.3).
- `ContactChannel.description` ersetzt in der Contact-Card die angezeigte URL, z. B. „Dominik Völker“ statt der langen LinkedIn-Adresse. Ohne `description` wird die URL ohne Protokoll gezeigt. _(ergänzt nach T-31)_
- Platzhalter-Inhalte (REQ-02/04/05) sind mit `// TODO(content): …` markiert, damit sie per Suche auffindbar sind.
- Die Balkenlänge je Stufe (AC-03.5) ist eine Konstante `LEVEL_PERCENT` in `data/skills.ts` (Expert 100, Advanced 75, Intermediate 50, Familiar 25).
- `VISIBLE_PROJECTS = 3` in `data/projects.ts` legt fest, wie viele Projekte auf dem Desktop anfangs sichtbar sind (AC-02.5).
- ~~`VISIBLE_STATIONS = 1` in `data/career.ts` legt fest, wie viele Stationen auf dem Desktop anfangs sichtbar sind (AC-04.3).~~ – entfällt (CR-11).
- `skills` ist eine flache Liste `Skill[]` (CR-4) mit den 7 SAP-Skills (CR-5); jeder Skill kommt genau einmal vor. `sortedSkills()` sortiert stabil absteigend nach `LEVEL_PERCENT` (AC-03.8). `VISIBLE_SKILLS = 5` legt fest, wie viele anfangs sichtbar sind (AC-03.9).
- **Systeminformationen (REQ-12):** `vite.config.ts` ermittelt beim Start bzw. Build die Versionen aus den `package.json`-Dateien der Pakete in `node_modules`, das Datum und den Commit (`git rev-parse --short HEAD`, ohne Git: `unknown`). Es reicht sie per `define` als Konstante `__SYSTEM_INFO__` weiter. `data/system.ts` liest sie typisiert aus und ergänzt das Hosting. Vitest nutzt dieselbe Vite-Konfiguration.
- Die KPIs der Cards (AC-01.3) werden aus den Daten berechnet (z. B. `projects.length`), nicht doppelt gepflegt.

## 5. Komponenten-Mapping
| Element | Umsetzung | Anforderung |
|---|---|---|
| Shell-Header | `ShellBar` (Branding mit Logo/Name, Titel „Overview“, `profile`-Slot für Avatar) | AC-06.2, AC-06.11 |
| Benutzermenü | `UserMenu` (fiori) mit den Einträgen „Settings“ und „About“; ~~Theme-Umschalter~~ entfällt (D-15, CR-8) | AC-06.9 |
| Einstellungen | `UserSettingsDialog` (fiori) mit einem `UserSettingsItem` „Appearance“ (Icon `palette`), darin `UserSettingsAppearanceView` mit je einer `UserSettingsAppearanceViewGroup` pro Gruppe und je einem `UserSettingsAppearanceViewItem` pro Theme (`itemKey` = Theme-ID, `text` = „Name · Jahr“, aktives Theme `selected`). Ohne `saveMode`: Ein Klick wendet das Theme sofort an (`selection-change`). | AC-11.1–AC-11.4 |
| System | zweites `UserSettingsItem` „System“ (Icon `it-system`) mit einer `UserSettingsView`, darin eine `List` mit `ListItemGroup`s (Tech Stack, Hosting, Build, Theme) und `ListItemStandard` (`text` = Bezeichnung, `additionalText` = Wert, `type` `Inactive`); Daten aus `data/system.ts` | REQ-12 |
| Zeitreise-Overlay | eigene Komponente im Top Layer (siehe §6), `role="status"` mit `aria-live="polite"` | AC-11.6–AC-11.8 |
| About | `Dialog` | AC-07.4 |
| Card (alle) | UI5 `Card` + `CardHeader` (`titleText`, `subtitleText`, Icon im `avatar`-Slot, KPI als `additionalText`) – umhüllt von Motion (TD-10) | AC-01.2, AC-01.3, AC-07.3 |
| Bento-Grid | CSS Grid mit `grid-template-areas`, siehe §6 | AC-01.6, AC-01.9, AC-08.1 |
| Profil-Card | `Avatar` (Initialen bzw. Bild, Farbe Accent1) + Name + Positionierung + Statuszeile (`Icon` `developer-settings` + Text) | AC-01.8, AC-01.10 |
| Benachrichtigungen | `ShellBar` mit `showNotifications` und `notificationsCount`; `ResponsivePopover` (auf schmalen Bildschirmen Vollbild) mit `NotificationList` + `NotificationListItem` (fiori); Inhalte in `data/notifications.ts`, Lesestatus als React-State | REQ-10 |
| Projects-Card | auf dem Desktop anfangs `VISIBLE_PROJECTS` Einträge, Umschalter wie in der Skills-Card (AC-02.5); `List` mit je einem Eintrag pro Projekt: `Link` (target `_blank`), Beschreibung, `Tag`s für Technologien | REQ-02 |
| ~~Projects-Ansichten~~ | `SegmentedButton` mit zwei `SegmentedButtonItem`s („Repositories“, „Transport Log“) oben im Card-Inhalt; Untertitel und KPI des `CardHeader` kommen aus der gewählten Ansicht. Transport Log: Kennzahlen als Zeile aus vier Werten (Zahl groß in Akzentfarbe, Label klein), darunter eine `List` mit `ListItemStandard` (`text` = „DVK900014 · CR-13 …“, `description` = Datum, `additionalText` = Status mit `additionalTextState` `Positive` bzw. `Information`, Icon `shipping-status`) | AC-02.6–AC-02.9 | _abgelöst durch „Projects-Seiten“ (CR-14)_
| Projects-Seiten | Zwei native `<button>`-Punkte in einer Gruppe (`role="group"`, `aria-label` „Project pages“), je `aria-label` mit dem Seitennamen und `aria-current` auf der aktiven Seite; aktiver Punkt gefüllt mit `--accent-1`, inaktiver als Ring; mittig unten in der Card. Davor und dahinter je ein UI5-`Button` (design `Transparent`, Icons `slim-arrow-left` / `slim-arrow-right`, `accessibleName` „Previous page“ / „Next page“, `disabled` auf der ersten bzw. letzten Seite) (CR-15). Inhalte des Transport Log wie in CR-13 | AC-02.7–AC-02.11 |
| Skills-Card | eine Liste (anfangs `VISIBLE_SKILLS` Einträge, Umschalter als `Button` design `Transparent` mit `aria-expanded`): je Skill Name + `ProgressIndicator` (`value` aus `LEVEL_PERCENT`, `displayValue` = Stufe), Balkenfarbe = Akzent (TD-12) | REQ-03 |
| Career-Card | `Timeline` + `TimelineItem` (fiori); auf dem Desktop in einem Scroll-Bereich mit zwei `Button`s (design `Transparent`, Icons `navigation-up-arrow` / `navigation-down-arrow`, `accessibleName` „Previous station“ / „Next station“) (AC-04.4) | REQ-04 |
| Contact-Card | `List` / `ListItemStandard` mit Icons, GitHub hervorgehoben | REQ-05 |
| ~~GitHub-Card~~ | entfällt (D-13, CR-6) | – |

## 6. Layout & Animationen
- **Bento-Grid (AC-01.6, AC-08.1):** CSS Grid, Card-Größe über `grid-area`:

| Breite | Spalten | `grid-template-areas` |
|---|---|---|
| ≥ 1024 px | 4 | `"about about career contact"` `"projects projects career contact"` `"projects projects skills skills"` |
| 600–1023 px | 2 | `"about about"` `"projects projects"` `"career contact"` `"skills skills"` |
| < 600 px | 1 | alle Cards untereinander in der Reihenfolge About, Projects, Career, Contact, Skills |

- **Abstände nach Fiori (AC-01.9, D-9):** Breakpoints und Werte folgen dem SAPUI5 Responsive Padding:

| Größe | Breite | Seitenrand links/rechts | Abstand zwischen Cards | Abstand oben |
|---|---|---|---|---|
| S | < 600 px | 1rem | 1rem | 1rem |
| M | 600–1023 px | 2rem | 1rem | 1rem |
| L | 1024–1439 px | 2rem | 1rem | 1rem |
| XL | ≥ 1440 px | 3rem | 1rem | 1rem |

  Keine maximale Seitenbreite – die Overview Page nutzt die volle Fensterbreite. Werte als CSS-Variablen (`--page-padding-inline`, `--card-gap`) in `theme.css`.

- **Kein Routing (TD-11):** Ein Klick auf Logo/Name scrollt per `window.scrollTo({ top: 0 })` nach oben (AC-06.11).
- **Gestaffeltes Einblenden (AC-01.4):** Motion-Variants mit `staggerChildren` auf dem BentoGrid.
- **Skill-Balken (AC-03.6):** Die Balken starten mit `value=0` und springen auf ihren Zielwert, sobald (a) die Einblend-Animation der Card abgeschlossen ist (`onAnimationComplete` in `AnimatedCard`, weitergegeben per React-Context) und (b) die Card zu mindestens 30 % im Viewport liegt (`useInView` aus Motion, einmalig); die eingebaute Breiten-Transition des `ProgressIndicator` (`::part(bar)`) übernimmt die Animation, Dauer ca. 0,8 s, gestaffelt per `transition-delay`. Bei Reduced Motion wird direkt der Zielwert gerendert und die Transition per CSS abgeschaltet.
- **Show all / Show less (AC-03.9):** Die zusätzlichen Zeilen sind von Anfang an gerendert, aber eingeklappt (`inert`, unsichtbar). Das Aufklappen ist eine CSS-Transition von `grid-template-rows: 0fr` auf `1fr` – kein Neuaufbau von UI5-Komponenten beim Antippen. Nach dem `transitionend` füllen sich die neuen Balken; beim Zuklappen leeren sie sich, damit sie beim nächsten Aufklappen erneut animieren. Bei Reduced Motion ohne Transition. _(geändert nach T-24: vorher Mount per `AnimatePresence`, auf dem iPhone ruckelig)_
- ~~**Career „Show all“ (AC-04.3, D-16):** Die Timeline bleibt eine einzige UI5-`Timeline`, damit die Verbindungslinie durchgehend bleibt; `TimelineItem`s dürfen nicht in Wrapper verpackt werden. Eingeklappt wird deshalb der Container um die Timeline: Er bekommt per CSS-Transition (≈ 0,3 s, ease-out) eine `height`. Eingeklappt entspricht sie dem Abstand bis zum Anfang der ersten verborgenen Station, ausgeklappt der vollen Höhe der Timeline. `overflow: hidden`; gemessen wird per `ResizeObserver`. Verborgene Stationen sind `inert`. Ob Desktop-Breite vorliegt, liefert `matchMedia('(min-width: 1024px)')` und reagiert auf Größenänderungen; darunter hat der Container keine feste Höhe und es gibt keinen Umschalter. Bei Reduced Motion ohne Transition.~~ – abgelöst durch „Career-Scroll-Pfeile“ (CR-11).
- ~~**Career eingeklappt ohne Highlights (AC-04.3, CR-10):** Die Highlights jeder Station stecken in einem Wrapper innerhalb des `TimelineItem` (dort ist ein Wrapper erlaubt). Eingeklappt ist auch der Wrapper der aktuellen Station geschlossen (`grid-template-rows: 0fr`). Beide Container-Höhen werden unabhängig vom aktuellen Zustand berechnet und per `ResizeObserver` aktuell gehalten. **Eingeklappt** ist der Abstand bis zur zweiten Station minus die aktuelle Höhe des Highlight-Wrappers der ersten Station. **Voll** ist die Timeline-Höhe minus diese Wrapper-Höhe plus die Höhe der Highlights (inneres Element). Beim Aufklappen öffnen sich Highlights und Container gleichzeitig. Ausgeklappt bleibt die Höhe ein px-Wert statt `auto`, denn nur so lässt sich das Zuklappen per CSS animieren. Beim Zuklappen schrumpft zuerst der Container (`transitionend`), danach schließen sich die Highlights; bei Reduced Motion sofort. _(präzisiert in T-33)_~~ – abgelöst durch „Career-Scroll-Pfeile“ (CR-11).
- **Career-Scroll-Pfeile (AC-04.4, D-18):** Der Scroll-Bereich um die Timeline hat eine feste Höhe von 14rem; damit ist die Card so hoch wie eingeklappt in CR-10 (≈ 300 px). Er hat `overflow: hidden`. **Mitwachsen:** Die 14rem gelten als Platzhalter, der die Zeilenhöhe bestimmt. Der sichtbare Bereich mit den Pfeilen liegt absolut positioniert darüber und zählt deshalb bei der Zeilenhöhe nicht mit. Seine Höhe ist 14rem plus der zusätzliche Platz bis zum Card-Ende (`ResizeObserver` auf die Card, gemessen ohne Hover-Skalierung, Basis = kleinster gemessener Abstand). So wächst er mit, wenn das Raster die Card streckt, und schrumpft wieder, ohne die Zeile selbst zu vergrößern. _(präzisiert nach T-35)_ _(präzisiert in T-35: Ursprünglich sollte er die Card-Höhe per Flex ausfüllen; das geht nicht, weil der innere Container der UI5-Card keinen CSS-Part hat. Die Career-Card bestimmt ihre Zeilenhöhe am Desktop ohnehin selbst.)_ Weil `overflow: hidden` ist, scrollt das Mausrad die Seite; bewegt wird der Bereich nur per `scrollTo({ top, behavior })`, mit `smooth` bzw. `instant` bei Reduced Motion. Ziel nach unten ist der Anfang der ersten Station unterhalb der aktuellen Position, abzüglich des Platzes für ▲, damit der Pfeil den Stationstitel nicht verdeckt. Die Position wird aus `getBoundingClientRect` relativ zum Bereich plus `scrollTop` berechnet, mit herausgerechneter Hover-Skalierung; liegt er weiter als eine sichtbare Höhe entfernt, scrollt der Klick nur um die sichtbare Höhe abzüglich der beiden Pfeil-Bereiche (je 2rem) weiter, damit keine Zeile unter einem Verlauf übersprungen wird. Nach oben entsprechend. Die Pfeile liegen über dem oberen bzw. unteren Rand mit einem Verlauf in der Card-Hintergrundfarbe. Sichtbar sind sie nur, wenn es in ihre Richtung weitergeht (`scroll`-Event und `ResizeObserver`). Unter 1024 px (`matchMedia`) gibt es keinen Scroll-Bereich und keine Pfeile.
- **Projects „Show all“ (AC-02.5):** Muster wie bei den Skills (§6): Die ersten `VISIBLE_PROJECTS` stehen in einer `List`, die übrigen in einer zweiten `List` in einem Wrapper mit `grid-template-rows: 0fr` → `1fr` (`inert`, solange zu). ~~Nur ab 1024 px (`matchMedia`); darunter ist der Wrapper offen und es gibt keinen Umschalter.~~ Seit CR-16 auf allen Breiten.
- **Projects-Ansichten (AC-02.6):** Die Ansicht ist React-State in einem kleinen Context zwischen `AnimatedCard` und `ProjectsCard`, damit der Header Untertitel und KPI der Ansicht zeigen kann. Der Wechsel blendet den Inhalt per Motion über (Opacity, ≈ 0,2 s). Das Show all der Transporte nutzt dasselbe Muster wie bei den Repositories.
- **Gleich hohe Seiten und Überblendung (AC-02.12, D-23):** Beide Seiten sind immer gerendert und liegen in einem CSS-Grid im selben Bereich (`grid-area: 1 / 1`); der Bereich ist so hoch wie die höhere Seite. Die inaktive Seite ist `inert`, für Screenreader verborgen und hat Opacity 0; der Wechsel ist eine CSS-Transition der Opacity beider Seiten (≈ 0,4 s), bei Reduced Motion ohne Transition. Untertitel und KPI im Header setzt `ProjectsCard` aus der aktiven Seite (statt jede Ansicht einzeln, da beide gerendert sind). Der Show-all-Zustand jeder Liste bleibt beim Seitenwechsel erhalten.
- **Automatischer Seitenwechsel (AC-02.11, D-21):** Ein `setTimeout` über 8 s, der bei jedem Seitenwechsel und jeder Pause neu startet. Er läuft nur, wenn nichts davon zutrifft: Maus über der Card (`pointerenter`/`pointerleave`), Fokus in der Card (`focusin`/`focusout`), `document.visibilityState !== 'visible'`, Reduced Motion, gestoppt. „Gestoppt“ ist ein State, den ein Klick auf einen Punkt und das Aufklappen per „Show all“ (Callback aus der Liste) setzen. Ein Klick auf einen Pfeil setzt ebenfalls „gestoppt“. Wird der fokussierte Pfeil deaktiviert, erhält der andere Pfeil den Fokus (wie bei den Career-Pfeilen, AC-04.4). _(ergänzt in CR-15)_
- **Zielhöhe (AC-01.11):** Ab 1024 px haben die Rasterzeilen keine Mindesthöhe (`grid-auto-rows: auto`). Die frühere Mindesthöhe von 10rem stammt aus T-16, als die Cards noch leer waren, und würde die mittlere Zeile künstlich strecken. _(präzisiert in T-34)_ Ein E2E-Test prüft bei 1280 × 780 und 1440 × 780, dass `scrollHeight <= innerHeight`.
- **Hover/Fokus (AC-07.3):** Anheben + leichter Tilt + Akzent-Glow bei Maus-Hover (`onHoverStart`, Motion ignoriert Touch) und bei Tastatur-Fokus (`:focus-visible` des fokussierten Elements, auch im Shadow DOM). Antippen und Mausklicks lösen keine Animation aus.
- **Zeitreise (AC-11.6, AC-11.7):** Ein Theme-Wechsel läuft über `useThemeMode().selectTheme(id)`. Ist das Jahr des neuen Themes ein anderes, wird zuerst das Overlay eingeblendet (≈ 0,2 s). Dann zählt die Jahreszahl per Motion `animate()` mit Ease-out über ≈ 1,5 s vom alten zum neuen Jahr; darunter steht der Name des Ziel-Themes. Am Ende des Zählens wird das Theme gewechselt (`setTheme()` + `data-theme`), danach blendet das Overlay aus (≈ 0,3 s). Bei gleichem Jahr wechselt das Theme sofort. Der `UserSettingsDialog` von UI5 liegt im Browser-Top-Layer, daher sitzt auch das Overlay im Top Layer (`popover="manual"`, nach dem Dialog geöffnet). Nur so liegt es darüber (TD-14). Bei Reduced Motion steht sofort das Zieljahr da, und es gibt nur Opacity-Übergänge.
- **Reduced Motion (AC-08.3):** `useReducedMotion()`; wenn aktiv, nur Opacity-Übergänge ohne Bewegung.
- **Tastatur (AC-06.5):** Alle Links, Listeneinträge und Buttons in den Cards sind per Tab erreichbar und haben einen sichtbaren Fokus-Ring; die Hover-Animation greift auch bei Tastatur-Fokus innerhalb der Card (AC-07.3).

## 7. Theming
- Basis: `sap_horizon` bzw. `sap_horizon_dark` über `setTheme()` aus `@ui5/webcomponents-base`.
- ~~Modus: folgt initial `prefers-color-scheme`, manueller Umschalter überschreibt~~ – abgelöst durch die Theme-Wahl (CR-8).
- **Theme-Wahl (REQ-11):** Gespeichert wird die Theme-ID in `localStorage` unter `theme` (mit try/catch). Ein alter Wert `theme-mode` = `light`/`dark` wird einmalig auf `sunset-coral-light`/`-dark` übernommen. Ohne gespeicherte Wahl gilt `sunset-coral-auto`: Hell oder Dunkel folgt `prefers-color-scheme` und reagiert auf Änderungen (AC-09.1, AC-11.3).
- Angewendet wird ein Theme in zwei Schritten: `setTheme(ui5Theme)` und `document.documentElement.dataset.theme = <aufgelöste Theme-ID>`. Bei „Auto“ wird die ID zu `sunset-coral-light` bzw. `-dark` aufgelöst. Die CSS-Overrides hängen am Attribut: Sunset Coral an `[data-theme^='sunset-coral']`, nachempfundene Themes an `[data-theme='<id>']` in `eras.css`. Horizon und Quartz bleiben unverändert UI5.
- Jedes Theme setzt die Tokens `--accent-1`, `--accent-2` und `--on-accent`. So passen Logo, KPI-Zahlen, Glow und Skill-Balken zur jeweiligen Ära (bei Horizon/Quartz: `--sapBrandColor`).
- Akzent-Theme (AC-07.1): Überschreiben ausgewählter UI5-CSS-Variablen (z. B. `--sapBrandColor`, `--sapShell_Background`) in `theme.css` für beide Modi (AC-09.2).
- Akzentpalette **„Sunset Coral“** (TD-9) – Verlauf von Koralle zu Amber:

| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--accent-1` | `#E11D48` | `#FB7185` | Primärakzent: Brand-Farbe, Emphasized Buttons, KPI-Zahlen, Fokus |
| `--accent-2` | `#F59E0B` | `#FBBF24` | Verlaufsende: Logo, Hero-Überschrift, Glow |
| `--on-accent` | `#FFFFFF` | `#12171C` | Text auf Akzentflächen |

- **Nachempfundene Themes (TD-13, AC-11.5):** Basis ist `sap_fiori_3` (Quartz Light). Überschrieben werden u. a. `--sapBrandColor`, `--sapShellColor`/`--sapShell_Background`, `--sapBackgroundColor`, `--sapGroup_ContentBackground`/`--sapTile_Background`, `--sapTextColor`, `--sapFontFamily`, `--sapButton_BorderCornerRadius`, `--sapElement_BorderCornerRadius` und `--sapTile_BorderCornerRadius`. Es werden nur Systemschriften genutzt und keine Webfonts geladen (AC-01.5). Die Farben unten sind Richtwerte. Feinjustiert wird im Task per Screenshot, die Abnahme macht Dominik:

| Theme | Jahr | Leitfarbe | Shell | Seitenhintergrund | Schrift | Ecken |
|---|---|---|---|---|---|---|
| SAP Classic | 1992 | `#000080` | `#D4D0C8` | `#D4D0C8` | Tahoma, Arial | 0 (kantig, Bevel-Rahmen) |
| SAP Enjoy | 1999 | `#3A6EA5` | `#6B8CB5` (Shell-Schrift schwarz wegen Kontrast, _ergänzt in T-29_) | `#E8E4D8` | Tahoma, Arial | 2px |
| SAP Signature | 2004 | `#F0AB00` | `#1F4E79` | `#DCE8F4` | Arial | 3px |
| SAP Corbu | 2012 | `#346187` | `#3F3F3F` | `#F2F2F2` | Arial | 2px |
| SAP Blue Crystal | 2013 | `#009DE0` | `#2B323A` | `#F7F7F7` | Arial | 2px |
| SAP Belize | 2016 | `#427CAC` | `#354A5F` | `#EFF4F9`, dazu Verlauf `#DFE9F4` → `#F7F7F7` wie im Original-Launchpad _(ergänzt in T-29)_ | „72“ (aus UI5), Arial | 4px |

## 8. Teststrategie
- **Nachvollziehbarkeit:** Jeder Test nennt im Namen die AC-ID, z. B. `it('AC-02.2 opens repo link in new tab', …)`. So ist jedes Akzeptanzkriterium einem Test zugeordnet.
- **Unit/Komponente (Vitest + Testing Library):** Daten-Integrität (z. B. KPIs aus Daten), Rendering der Cards, Links/Attribute, Theme-Logik.
- **E2E (Playwright):** Shell und Avatar-Menü, Bento-Layout (Card-Größen), Tastaturbedienung, Viewport 360 px ohne horizontales Scrollen, Reduced Motion, Theme-Umschalter.
- **Nicht automatisiert in v1:** Lighthouse-Scores (AC-08.2) und Ladezeit (AC-01.5) werden manuell gegen den Production-Build geprüft; der „Wow“-Effekt per Augenschein.

## 9. Qualitätstor (`npm run verify`)
Nach **jeder** Quellcode-Änderung wird in `assets/` ausgeführt:
1. `typecheck` – `tsc --noEmit`
2. `lint` – Oxlint + Prettier-Check
3. `test` – Vitest (einmaliger Lauf)
4. `e2e` – Playwright gegen den Vite-Dev-Server, dazu das Projekt **`security`** gegen einen Production-Build per `vite preview` (TD-18)

Zusätzlich bei **jedem Change Request und vor jedem Deployment**: `npm run security` (`npm audit` + `npm audit signatures`, braucht Netzwerk und ist deshalb nicht Teil von `verify`) (AC-13.6).

**Sicherheit & Datenschutz (REQ-13):**
- **Fonts:** UI5 lädt die Schrift „72“ standardmäßig von `cdn.jsdelivr.net`. `main.tsx` schaltet das mit `setDefaultFontLoading(false)` ab. `styles/fonts.css` enthält dieselben `@font-face`-Regeln wie UI5 (`FontFace.css` aus `@ui5/webcomponents-base`), zeigt aber auf die Dateien aus `@sap-theming/theming-base-content` in der von UI5 verwendeten Version (Vite-Alias `@sap-fonts`). Vite bündelt die Fonts in den Build. Bei UI5-Updates muss `fonts.css` mitgezogen werden; der Test „keine Requests an Dritte“ fällt sonst auf (AC-13.1). Alle Regeln haben `font-display: swap`; die Regular-Schrift wird per `<link rel="preload">` vorgeladen (Vite-Plugin, nur Build). _(ergänzt in T-46)_
- **CSP und Referrer-Policy:** Ein kleines Vite-Plugin fügt beide Meta-Tags per `transformIndexHtml` **nur im Build** ein. Der Dev-Server braucht für React Fast Refresh ein Inline-Skript (TD-17).
- **Security-Tests (`tests/security/*.spec.ts`)** gegen den Production-Build: keine Requests an fremde Hosts bei einem Rundgang durch Seite, Settings und Theme-Wechsel; Meta-Tags vorhanden und keine `securitypolicyviolation`-Events; XSS-Payload in `localStorage`, Query und Hash wird nicht ausgeführt; alle `_blank`-Ziele ohne `window.opener`; keine `.map`-Dateien im Build (AC-13.1–13.5, AC-13.7).

Eine Änderung gilt erst als fertig, wenn `npm run verify` grün ist.

**Isolierter Vite-Cache:** Der E2E-Server von Playwright nutzt einen eigenen Dependency-Cache (`node_modules/.vite-e2e`, über `VITE_CACHE_DIR`). So überschreibt ein Testlauf nie den Cache eines parallel laufenden `npm run dev` (sonst Fehler „504 Outdated Optimize Dep“ und weiße Seite). Erkannt nach T-16.

## 9b. Ladezeit auf Mobilgeräten (AC-08.2) _(ergänzt in T-46)_
Nach der Erstveröffentlichung lag Lighthouse mobil bei 77–81. Umgesetzt:
- **Nachladen bei Bedarf** (`React.lazy`, erst beim ersten Öffnen gemountet): Benutzermenü (`shell/AvatarMenu.tsx`), Settings mit Zeitreise-Overlay, Benachrichtigungen, About.
- **Motion schlank:** `LazyMotion` mit `domAnimation` und `m.div` statt `motion.div`.
- **Fonts:** `font-display: swap`, Preload der Regular-Schrift; das „✓“ im Transport Log ist ein UI5-Icon (`accept`), weil das Zeichen sonst die 57 KB große „72full“ nachlädt.
- **Theme-Parameter vorladen:** Die nachgeladenen Parameter-Chunks des Default-Themes `sap_horizon` bekommen `<link rel="modulepreload">` (Vite-Plugin, nur Build), statt in einer Kette nacheinander zu laden.
- **Sprache:** UI5 fest auf Englisch (TD-21); spart zugleich die Sprachpakete des Browsers.
- Ergebnis lokal: Start-JavaScript 352 → 285 KB (gzip), mobil 83–86. Experimente zeigen: Der verbleibende LCP (≈ 4 s simuliert) kommt vom Grundgewicht aus React und UI5 vor dem ersten Inhalt, nicht von Animation oder versteckter Projects-Seite.

## 9a. Deployment (REQ-14)
- **Workflow** `.github/workflows/deploy.yml`, ausgelöst durch `push` auf `main`, `workflow_dispatch` und `pull_request` auf `main` (dann nur Job `check`, der Upload und `deploy` laufen nicht – `if: github.event_name != 'pull_request'`) _(präzisiert nach T-46)_; `concurrency: pages`, laufende Deployments werden nicht abgebrochen.
- **Job `check`** (`permissions: contents: read`): Checkout mit `fetch-depth: 0` (AC-14.4) → Node 26 (wie lokal) mit npm-Cache → `npm ci` in `assets/` → `npm run security` → `npx playwright install --with-deps chromium` → `npm run verify`. Danach `vite build` nach `assets/dist` und Upload als Pages-Artefakt.
- **Job `deploy`** (`needs: check`, `permissions: pages: write, id-token: write`, Environment `github-pages`): veröffentlicht das Artefakt.
- **Actions:** nur offizielle `actions/*` (checkout, setup-node, configure-pages, upload-pages-artifact, deploy-pages), jeweils auf einen Commit-SHA gepinnt mit Versionskommentar (TD-20). `persist-credentials: false` beim Checkout.
- **Dependabot** `.github/dependabot.yml`: `npm` (Verzeichnis `/assets`) und `github-actions`, wöchentlich (AC-14.5). `@sap-theming/theming-base-content` wird ignoriert (folgt UI5); ein Unit-Test vergleicht unsere Version mit der Abhängigkeit von `@ui5/webcomponents-theming`. _(präzisiert nach T-46)_
- **Pages-Einstellung:** Source „GitHub Actions“. Die Seite liegt im Root der Domain; `base: './'` funktioniert unverändert.

## 10. Nachvollziehbarkeit (Traceability)
| Anforderung | Umsetzung (Abschnitt) | Testart |
|---|---|---|
| REQ-01 Overview Page | 3, 5, 6 | Unit + E2E |
| REQ-02 Projekte | 4, 5 | Unit |
| REQ-03 Skills | 4, 5 | Unit |
| REQ-04 Werdegang | 4, 5 | Unit |
| REQ-05 Kontakt | 4, 5 | Unit |
| REQ-06 Fiori-Shell | 2, 5, 6 | E2E |
| REQ-07 Wow-Effekt | 5, 6, 7 | Unit (About) + manuell |
| REQ-08 Responsiveness & Qualität | 6, 8 | E2E + manuell |
| REQ-09 Dark/Light Mode | 7 | Unit + E2E |
| REQ-10 Benachrichtigungen | 5 | Unit + E2E |
| REQ-11 Theme-Zeitreise | 4, 5, 6, 7 | Unit + E2E + manuell (Optik der Nachbauten) |
| REQ-12 Systeminformationen | 4, 5 | Unit + E2E |
| REQ-13 Sicherheit & Datenschutz | 9 | E2E gegen Production-Build + `npm run security` |
| REQ-14 Deployment | 11 | Pipeline selbst + manuelle Abnahme der Live-Seite (T-46) |

## 11. Technische Entscheidungen
| ID | Thema | Entscheidung | Begründung |
|---|---|---|---|
| TD-1 | Sprache | TypeScript (strict) | Wunsch Dominik; typsichere Datenmodelle |
| TD-2 | Tests | Vitest + Playwright, `npm run verify` nach jeder Code-Änderung | Wunsch Dominik; jedes AC prüfbar |
| TD-3 | Package Manager | npm | Wunsch Dominik |
| TD-4 | ~~Tiles~~ | ~~Eigene Komponente statt UI5-Komponente~~ | Abgelöst durch TD-10 (CR-1) |
| TD-5 | ~~Routing~~ | ~~Hash-Routing~~ | Abgelöst durch TD-11 (CR-1) |
| TD-6 | Animationen | Motion | Gestaffeltes Einblenden, Hover/Fokus und Reduced Motion mit wenig Code. (Ursprünglich für die Tile-to-App-Transition, die mit CR-1 entfällt.) |
| TD-7 | Repo-Struktur | Code, Tests und Configs in `assets/`, Specs in `specs/` | Wunsch Dominik; klare Trennung von Spezifikation und Umsetzung |
| TD-8 | Linter | Oxlint statt ESLint | `typescript-eslint` unterstützt TypeScript 7 noch nicht (Peer-Dependency `<6.1`); Oxlint ist der aktuelle Vite-Standard. Erkannt in T-01. |
| TD-9 | Akzentfarben | Palette „Sunset Coral“ (Koralle → Amber) | Wahl Dominik aus drei Vorschlägen in T-04; auffälligster Kontrast zum Fiori-Standard |
| TD-10 | Cards | UI5 `Card` + `CardHeader`, umhüllt von Motion | UI5 bringt die Card fertig mit – mehr echtes UI5, weniger Eigenbau (CR-1) |
| TD-11 | Routing | Kein Router; React Router wird entfernt | Nur noch eine Seite (D-8); weniger Abhängigkeiten (CR-1) |
| TD-12 | Skill-Balken | UI5 `ProgressIndicator` statt eigener Balken oder Chart-Bibliothek | Fiori-Standardkomponente mit eingebauter Breiten-Animation und `displayValue` für den Stufennamen; keine neue Abhängigkeit (CR-3) |
| TD-13 | Alte SAP-Themes | Nachbau über UI5-CSS-Variablen auf Basis `sap_fiori_3` statt alter UI5-Versionen oder Screenshots | UI5 Web Components 2.x liefern nur Quartz und Horizon. So bleibt es echtes UI5 mit „anderem Anstrich“, ohne neue Abhängigkeit (CR-8) |
| TD-14 | Overlay über UI5-Dialogen | Overlay als `popover="manual"` im Browser-Top-Layer | UI5-Dialoge liegen im Top Layer; mit `z-index` kommt man nicht darüber (CR-8) |
| TD-15 | Versionen in Settings › System | Zur Build-Zeit aus `node_modules` per Vite-`define` statt von Hand gepflegt | Stimmen nach jedem Update automatisch; keine zusätzliche Abhängigkeit (CR-12) |
| TD-16 | Daten für das Transport Log | Zur Build-Zeit per Vite-`define` (`__TRANSPORT_LOG__`): `git log` der Commits `docs(cr-N): …` (Text, Datum); ein späterer `feat`/`fix`-Commit, der `CR-N` oder eine D-/TD-ID aus dem Spec-Commit nennt, setzt den Status auf „Imported“ (REQ-IDs zählen nicht, sie kommen in zu vielen Commits vor) _(präzisiert in T-37)_; erster Commit = DVK900001. Kennzahlen: CRs = Anzahl `docs(cr-N)`-Commits, Tasks = Zeilen mit `[x]` in der Übersicht von `specs/03-tasks.md`, Tests = Vorkommen von `it(`/`test(` in `tests/`, Commits = `git rev-list --count HEAD`. Ohne Git: leere Liste, Kennzahlen 0. | Keine Pflege, keine Abhängigkeit; gleiche Technik wie TD-15. Der Build braucht die volle Git-History (beim Deployment `fetch-depth: 0`). (CR-13) |
| TD-17 | CSP-Auslieferung | `<meta http-equiv="Content-Security-Policy">` per Vite-Plugin nur im Build | GitHub Pages erlaubt keine HTTP-Header; der Dev-Server braucht ein Inline-Skript für Fast Refresh (CR-17) |
| TD-18 | Security-Tests | Zweites Playwright-Projekt `security` mit eigenem `webServer` (`vite build` in einen Temp-Ordner, dann `vite preview` auf eigenem Port) | Nur der echte Build zeigt CSP, gebündelte Fonts und fehlende Sourcemaps (CR-17) |
| TD-19 | Ort der Workflows | `.github/` im Repo-Root | GitHub erwartet Workflows und Dependabot-Konfiguration dort; bewusste Ausnahme von „nichts Ausführbares im Root“ (CR-18) |
| TD-20 | Pinning der Actions | Commit-SHA statt Tag, Updates per Dependabot | Ein verschobenes oder kompromittiertes Tag kann so keinen fremden Code in die Pipeline bringen (CR-18) |
| TD-21 | Sprache der UI5-Texte | `setLanguage('en')` in `main.tsx` | Die Website ist englisch (Intent); ohne Festlegung folgt UI5 der Browsersprache und zeigt z. B. deutsche Button-Texte und Screenreader-Hinweise (gefunden in T-46) |

## 12. Offene Fragen
_Keine._
