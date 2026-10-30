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
| Routing | React Router, Hash-Routing | 8.x |
| Unit-/Komponententests | Vitest + Testing Library (jsdom) | 5.x / 16.x |
| E2E-Tests | Playwright (Chromium) | 1.x |
| Linting / Formatierung | Oxlint + Prettier | 1.x / 3.x |
| Package Manager | npm | – |

## 2. Architektur
Reine Single-Page-Application ohne Backend. Alle Inhalte sind statische TypeScript-Daten, die zur Build-Zeit eingebunden werden (D-1). Der Production-Build in `assets/dist/` ist ein rein statischer Ordner und damit bei jedem Hoster deploybar.

```
App
├─ ThemeProvider (UI5)
└─ HashRouter
   └─ LaunchpadShell               ← Header (ShellBar) + Avatar-Menü, immer sichtbar
      ├─ "/"          LaunchpadPage  ← Hero + TileGrid
      ├─ "/projects"  ProjectsApp
      ├─ "/skills"    SkillsApp
      ├─ "/career"    CareerApp
      ├─ "/contact"   ContactApp
      └─ "*"          → Redirect auf "/"
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
├─ App.tsx                  # Provider + Routen
├─ shell/
│  ├─ LaunchpadShell.tsx    # ShellBar, Back-Button, Avatar, UserMenu, About-Dialog
│  └─ useThemeMode.ts       # System-Theme + manueller Umschalter
├─ launchpad/
│  ├─ LaunchpadPage.tsx     # Hero + TileGrid
│  ├─ Hero.tsx
│  ├─ TileGrid.tsx
│  └─ Tile.tsx              # eigene Fiori-Tile-Komponente
├─ apps/
│  ├─ AppPage.tsx           # gemeinsamer Rahmen (DynamicPage + Transition)
│  ├─ ProjectsApp.tsx
│  ├─ SkillsApp.tsx
│  ├─ CareerApp.tsx
│  └─ ContactApp.tsx
├─ data/
│  ├─ types.ts              # Datenmodelle
│  ├─ profile.ts            # Name, Positionierung, GitHub-URL, Avatar
│  ├─ projects.ts
│  ├─ skills.ts
│  ├─ career.ts
│  ├─ contact.ts
│  └─ tiles.ts              # Tile-Definitionen (leitet KPIs aus den Daten ab)
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
interface Profile  { name: string; tagline: string; githubUsername: string; githubUrl: string; avatarUrl?: string; siteRepoUrl: string }
interface Project  { id: string; name: string; description: string; technologies: string[]; repoUrl: string }
interface SkillGroup { id: 'backend' | 'frontend' | 'frameworks' | 'sap'; title: string; skills: string[] }
interface CareerStation { id: string; from: string; to?: string; role: string; company: string; highlights: string[] }
interface ContactChannel { id: string; label: string; url: string; icon: string; primary?: boolean }
interface TileDef { id: string; title: string; subtitle?: string; icon: string; kpi?: string; route?: string; href?: string }
```
- Platzhalter-Inhalte (REQ-02/04/05) sind mit `// TODO(content): …` markiert, damit sie per Suche auffindbar sind.
- Die KPIs der Tiles (AC-01.3) werden aus den Daten berechnet (z. B. `projects.length`), nicht doppelt gepflegt.

## 5. Komponenten-Mapping
| Element | Umsetzung | Anforderung |
|---|---|---|
| Shell-Header | `ShellBar` (Titel, Logo, `startButton`-Slot für Back, `profile`-Slot für Avatar) | AC-06.2, AC-06.7 |
| Benutzermenü | `UserMenu` (fiori) mit Eintrag „About“ und Theme-Umschalter | AC-06.9, AC-09.1 |
| About | `Dialog` | AC-07.4 |
| Tile | **eigene Komponente** im Fiori-Tile-Look (Header, Subheader, Icon, KPI) – UI5 Web Components bieten kein Launchpad-Tile | AC-01.2, AC-01.3, AC-07.3 |
| App-Rahmen | `DynamicPage` mit `DynamicPageTitle` | AC-06.6 |
| Projekte | `Card` + `CardHeader`, `Tag` für Technologien, `Link` (target `_blank`) | REQ-02 |
| Skills | `Panel` je Gruppe + `Tag` | REQ-03 |
| Werdegang | `Timeline` + `TimelineItem` (fiori) | REQ-04 |
| Kontakt | `List` / `ListItemStandard` mit Icons, GitHub hervorgehoben | REQ-05 |

## 6. Navigation & Animationen
- **Routing:** `HashRouter`; jede App hat eine Route (AC-06.3). Der Back-Button navigiert zu `/` (nicht `history.back()`), damit er auch bei Direkt-Links korrekt funktioniert (AC-06.7).
- **Tile-to-App-Transition (AC-06.1, AC-06.4):** Shared-Layout-Animation mit Motion – Tile und App-Container teilen sich eine `layoutId` (`tile-<id>`). `AnimatePresence` steuert Öffnen und Schließen.
- **Gestaffeltes Einblenden (AC-01.4):** Motion-Variants mit `staggerChildren` auf dem TileGrid.
- **Hover/Fokus (AC-07.3):** Anheben + leichter Tilt + Akzent-Glow über `whileHover` / `whileFocus`.
- **Reduced Motion (AC-08.3):** `useReducedMotion()`; wenn aktiv, nur Opacity-Übergänge ohne Bewegung.
- **Tastatur (AC-06.5):** Tiles sind `<button>`- bzw. `<a>`-Elemente mit sichtbarem Fokus-Ring; Enter/Space öffnen die App.

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
- **Unit/Komponente (Vitest + Testing Library):** Daten-Integrität (z. B. KPIs aus Daten), Rendering der Apps, Links/Attribute, Theme-Logik.
- **E2E (Playwright):** Navigation Tile → App → Back, Direkt-Links, Browser-Back, Tastaturbedienung, Viewport 360 px ohne horizontales Scrollen, Reduced Motion, Theme-Umschalter.
- **Nicht automatisiert in v1:** Lighthouse-Scores (AC-08.2) und Ladezeit (AC-01.5) werden manuell gegen den Production-Build geprüft; der „Wow“-Effekt per Augenschein.

## 9. Qualitätstor (`npm run verify`)
Nach **jeder** Quellcode-Änderung wird in `assets/` ausgeführt:
1. `typecheck` – `tsc --noEmit`
2. `lint` – Oxlint + Prettier-Check
3. `test` – Vitest (einmaliger Lauf)
4. `e2e` – Playwright gegen den Vite-Dev-Server

Eine Änderung gilt erst als fertig, wenn `npm run verify` grün ist.

## 10. Nachvollziehbarkeit (Traceability)
| Anforderung | Umsetzung (Abschnitt) | Testart |
|---|---|---|
| REQ-01 Launchpad-Startseite | 3, 5, 6 | Unit + E2E |
| REQ-02 Projekte | 4, 5 | Unit |
| REQ-03 Skills | 4, 5 | Unit |
| REQ-04 Werdegang | 4, 5 | Unit |
| REQ-05 Kontakt | 4, 5 | Unit |
| REQ-06 Shell & Navigation | 2, 5, 6 | E2E |
| REQ-07 Wow-Effekt | 5, 6, 7 | Unit (About) + manuell |
| REQ-08 Responsiveness & Qualität | 6, 8 | E2E + manuell |
| REQ-09 Dark/Light Mode | 7 | Unit + E2E |

## 11. Technische Entscheidungen
| ID | Thema | Entscheidung | Begründung |
|---|---|---|---|
| TD-1 | Sprache | TypeScript (strict) | Wunsch Dominik; typsichere Datenmodelle |
| TD-2 | Tests | Vitest + Playwright, `npm run verify` nach jeder Code-Änderung | Wunsch Dominik; jedes AC prüfbar |
| TD-3 | Package Manager | npm | Wunsch Dominik |
| TD-4 | Tiles | Eigene Komponente statt UI5-Komponente | UI5 Web Components enthalten kein Launchpad-Tile; volle Kontrolle über Animationen |
| TD-5 | Routing | Hash-Routing | Hosting noch offen – funktioniert überall ohne Server-Konfiguration |
| TD-6 | Animationen | Motion (Shared Layout) | Tile-to-App-Transition ohne eigene FLIP-Logik |
| TD-7 | Repo-Struktur | Code, Tests und Configs in `assets/`, Specs in `specs/` | Wunsch Dominik; klare Trennung von Spezifikation und Umsetzung |
| TD-8 | Linter | Oxlint statt ESLint | `typescript-eslint` unterstützt TypeScript 7 noch nicht (Peer-Dependency `<6.1`); Oxlint ist der aktuelle Vite-Standard. Erkannt in T-01. |
| TD-9 | Akzentfarben | Palette „Sunset Coral“ (Koralle → Amber) | Wahl Dominik aus drei Vorschlägen in T-04; auffälligster Kontrast zum Fiori-Standard |

## 12. Offene Fragen
_Keine._
