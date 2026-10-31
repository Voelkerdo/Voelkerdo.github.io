# Portfolio Website – Spec Driven Development

Dieses Projekt wird spec-driven entwickelt. Die Specs in `specs/` sind die Quelle der Wahrheit; Code ist daraus abgeleitet.

## Artefakte
1. `specs/00-intent.md` – Warum & für wen
2. `specs/01-prd.md` – Was (Features, User Stories, Akzeptanzkriterien mit IDs)
3. `specs/02-tech-spec.md` – Wie (Architektur, Stack: React + SAP UI5 Web Components)
4. `specs/03-tasks.md` – Umsetzungsschritte, jeweils mit Verweis auf Requirement-IDs
5. `assets/` – Code, Tests, Configs (`package.json` liegt hier; npm-Befehle in `assets/` ausführen)

## Regeln
- Spec first: Jede Änderung beginnt in der obersten betroffenen Spec und wird nach unten durchgereicht.
- Kein Code ohne zugehörigen Task, kein Task ohne Requirement-ID.
- Specs und Code werden im selben Commit geändert, wenn sie zusammengehören.
- Commit-Messages referenzieren Requirement-/Task-IDs (z. B. `feat(T-04): ... [REQ-02]`).
- Nichts Ausführbares in `specs/` oder im Repo-Root ablegen – alles gehört nach `assets/`. Einzige Ausnahme: `.github/` (Deploy-Workflow, Dependabot), weil GitHub es dort erwartet (TD-19).
- Nach jeder Quellcode-Änderung `npm run verify` (in `assets/`) ausführen (typecheck, lint, Vitest, Playwright inkl. Security-Tests gegen den Production-Build). Erst wenn alles grün ist, gilt die Änderung als fertig.
- Sicherheit (REQ-13): Bei jedem Change Request und vor jedem Deployment `npm run security` (in `assets/`) ausführen (`npm audit` + Registry-Signaturen, braucht Netzwerk). Befunde nie ignorieren: als `fix` oder eigener CR behandeln. Keine Requests an Drittanbieter einbauen (auch keine CDNs, Fonts, Analytics).
- Eigene Hilfs-Server (Screenshots, Diagnose) nur mit eigenem Cache starten: `VITE_CACHE_DIR=node_modules/.vite-tmp npx vite --port 5175`. Den Dev-Server des Users (Port 5173) nie stoppen oder dessen Cache (`node_modules/.vite`) verändern.
- Testnamen beginnen mit der AC-ID (z. B. `AC-02.2 …`).
- Platzhalter-Inhalte mit `// TODO(content): …` markieren.
- Specs auf Deutsch, Website-Inhalte auf Englisch.
- Antworten an den User auf Deutsch.

## Change-Request-Ablauf (CR-N)
1. **Impact-Analyse:** betroffene Ebenen (Intent → PRD → Tech Spec → Tasks → Code) als Tabelle zeigen; per `grep` in `specs/` und `assets/` prüfen.
2. **Klären:** offene Punkte als Fragen (gern mit Optionen/Skizze); Inhalte (Texte, Stufen …) liefert Dominik.
3. **Specs anpassen**, Status `review (CR-N)`:
   - Gestrichene ACs/Decisions/Tasks werden ~~durchgestrichen~~ mit Verweis, nie gelöscht; IDs werden nie neu vergeben.
   - Präzisierte ACs bekommen `_(präzisiert in …)_`.
   - Neue Entscheidung `D-N` im PRD, Eintrag `CR-N` in der Änderungshistorie (PRD §7), neue Tasks `T-N` vor T-14 einreihen.
4. **Freigabe** durch Dominik → Status `approved`, Commit `docs(cr-N): … [D-N]`.
5. **Umsetzung** Task für Task: Status `[~]` → Code + Tests → `npm run verify` → Screenshot-Check → `[x]` → Commit `feat(T-N): … [REQ-…, CR-N]`.
6. **Security-Check** nach dem letzten Task des CR: `npm run security`; neue Abhängigkeiten, externe URLs, `innerHTML`/`eval` oder neue Eingaben (Storage, URL) gezielt prüfen und Ergebnis kurz berichten.
- Fehler nach Abschluss eines Tasks: Commit `fix(T-N): …`; falls ein AC unscharf war, AC präzisieren (Spec im selben Commit).
- Abweichungen, die sich bei der Umsetzung zeigen (z. B. UI5-Verhalten), erst in der Spec festhalten, dann umsetzen.

## Arbeitsweise mit Dominik
- Einen Task nach dem anderen umsetzen, Ergebnis (inkl. Screenshot-Pfad) zeigen und auf Freigabe warten.
- Geschmacksfragen (Farben, Texte, Layout) als Optionen vorlegen, nicht selbst entscheiden.
- Deployment (REQ-14): Jeder Push auf `main` geht nach grünen Prüfungen automatisch live auf `https://voelkerdo.github.io/`. Pushen nur mit Dominiks ausdrücklichem OK.
- Den Dev-Server nie dauerhaft im Netz öffnen (`server.host` nicht in die Vite-Config).
