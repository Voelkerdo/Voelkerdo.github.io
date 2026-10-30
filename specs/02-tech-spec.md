# Technical Specification

> Status: approved · Abgeleitet aus: [01-prd.md](01-prd.md)

## 1. Tech-Stack
| Bereich | Technologie | Version (Major) |
|---|---|---|
| Sprache | TypeScript (strict) | 7.x |
| Build / Dev-Server | Vite | 8.x |
| UI-Framework | React + React DOM | 19.x |
| UI-Komponenten | `@ui5/webcomponents-react` (inkl. `@ui5/webcomponents`, `-fiori`, `-icons`) | 2.28.x |
| Theme | SAP Horizon (`sap_horizon` / `sap_horizon_dark`) + eigene Akzentfarben | – |
| Animationen | Motion (`motion/react`) | 14.x |
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
│  ├─ ThemeModeProvider.tsx
│  └─ useThemeMode.ts       # System-Theme + manueller Umschalter
├─ overview/
│  ├─ OverviewPage.tsx      # BentoGrid mit allen Cards
│  ├─ BentoGrid.tsx         # CSS-Grid mit Card-Größen
│  ├─ AnimatedCard.tsx      # UI5 Card + Motion (Einblenden, Hover/Fokus)
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
│  └─ cards.ts              # Card-Definitionen inkl. Größe (leitet KPIs aus den Daten ab)
├─ motion/
│  └─ transitions.ts        # Animations-Varianten, reduced-motion-Handling
└─ styles/
   └─ theme.css             # Akzent-Theme über UI5-CSS-Variablen
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
interface ContactChannel { id: string; label: string; url: string; icon: string; primary?: boolean }
type CardSize = 'large' | 'wide' | 'tall'
interface CardDef { id: string; title: string; subtitle?: string; icon: string; kpi?: string; size: CardSize }
```
- Platzhalter-Inhalte (REQ-02/04/05) sind mit `// TODO(content): …` markiert, damit sie per Suche auffindbar sind.
- Die Balkenlänge je Stufe (AC-03.5) ist eine Konstante `LEVEL_PERCENT` in `data/skills.ts` (Expert 100, Advanced 75, Intermediate 50, Familiar 25).
- `skills` ist eine flache Liste `Skill[]` (CR-4) mit den 7 SAP-Skills (CR-5); jeder Skill kommt genau einmal vor. `sortedSkills()` sortiert stabil absteigend nach `LEVEL_PERCENT` (AC-03.8). `VISIBLE_SKILLS = 5` legt fest, wie viele anfangs sichtbar sind (AC-03.9).
- Die KPIs der Cards (AC-01.3) werden aus den Daten berechnet (z. B. `projects.length`), nicht doppelt gepflegt.

## 5. Komponenten-Mapping
| Element | Umsetzung | Anforderung |
|---|---|---|
| Shell-Header | `ShellBar` (Branding mit Logo/Name, Titel „Overview“, `profile`-Slot für Avatar) | AC-06.2, AC-06.11 |
| Benutzermenü | `UserMenu` (fiori) mit Eintrag „About“ und Theme-Umschalter | AC-06.9, AC-09.1 |
| About | `Dialog` | AC-07.4 |
| Card (alle) | UI5 `Card` + `CardHeader` (`titleText`, `subtitleText`, Icon im `avatar`-Slot, KPI als `additionalText`) – umhüllt von Motion (TD-10) | AC-01.2, AC-01.3, AC-07.3 |
| Bento-Grid | CSS Grid mit `grid-template-areas`, siehe §6 | AC-01.6, AC-01.9, AC-08.1 |
| Profil-Card | `Avatar` (Initialen bzw. Bild, Farbe Accent1) + Name + Positionierung + Statuszeile (`Icon` `developer-settings` + Text) | AC-01.8, AC-01.10 |
| Benachrichtigungen | `ShellBar` mit `showNotifications` und `notificationsCount`; `ResponsivePopover` (auf schmalen Bildschirmen Vollbild) mit `NotificationList` + `NotificationListItem` (fiori); Inhalte in `data/notifications.ts`, Lesestatus als React-State | REQ-10 |
| Projects-Card | `List` mit je einem Eintrag pro Projekt: `Link` (target `_blank`), Beschreibung, `Tag`s für Technologien | REQ-02 |
| Skills-Card | eine Liste (anfangs `VISIBLE_SKILLS` Einträge, Umschalter als `Button` design `Transparent` mit `aria-expanded`): je Skill Name + `ProgressIndicator` (`value` aus `LEVEL_PERCENT`, `displayValue` = Stufe), Balkenfarbe = Akzent (TD-12) | REQ-03 |
| Career-Card | `Timeline` + `TimelineItem` (fiori) | REQ-04 |
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
- **Hover/Fokus (AC-07.3):** Anheben + leichter Tilt + Akzent-Glow bei Maus-Hover (`onHoverStart`, Motion ignoriert Touch) und bei Tastatur-Fokus (`:focus-visible` des fokussierten Elements, auch im Shadow DOM). Antippen und Mausklicks lösen keine Animation aus.
- **Reduced Motion (AC-08.3):** `useReducedMotion()`; wenn aktiv, nur Opacity-Übergänge ohne Bewegung.
- **Tastatur (AC-06.5):** Alle Links, Listeneinträge und Buttons in den Cards sind per Tab erreichbar und haben einen sichtbaren Fokus-Ring; die Hover-Animation greift auch bei Tastatur-Fokus innerhalb der Card (AC-07.3).

## 7. Theming
- Basis: `sap_horizon` bzw. `sap_horizon_dark` über `setTheme()` aus `@ui5/webcomponents-base`.
- Modus: folgt initial `prefers-color-scheme`, manueller Umschalter überschreibt; Wahl wird in `localStorage` gemerkt (mit try/catch) (AC-09.1).
- Akzent-Theme (AC-07.1): Überschreiben ausgewählter UI5-CSS-Variablen (z. B. `--sapBrandColor`, `--sapShell_Background`) in `theme.css` für beide Modi (AC-09.2).
- Akzentpalette **„Sunset Coral“** (TD-9) – Verlauf von Koralle zu Amber:

| Token | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--accent-1` | `#E11D48` | `#FB7185` | Primärakzent: Brand-Farbe, Emphasized Buttons, KPI-Zahlen, Fokus |
| `--accent-2` | `#F59E0B` | `#FBBF24` | Verlaufsende: Logo, Hero-Überschrift, Glow |
| `--on-accent` | `#FFFFFF` | `#12171C` | Text auf Akzentflächen |

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
4. `e2e` – Playwright gegen den Vite-Dev-Server

Eine Änderung gilt erst als fertig, wenn `npm run verify` grün ist.

**Isolierter Vite-Cache:** Der E2E-Server von Playwright nutzt einen eigenen Dependency-Cache (`node_modules/.vite-e2e`, über `VITE_CACHE_DIR`). So überschreibt ein Testlauf nie den Cache eines parallel laufenden `npm run dev` (sonst Fehler „504 Outdated Optimize Dep“ und weiße Seite). Erkannt nach T-16.

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

## 12. Offene Fragen
_Keine._
