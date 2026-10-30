# Portfolio Website – Spec Driven Development

Dieses Projekt wird spec-driven entwickelt. Die Specs in `specs/` sind die Quelle der Wahrheit; Code ist daraus abgeleitet.

## Artefakte
1. `specs/00-intent.md` – Warum & für wen
2. `specs/01-prd.md` – Was (Features, User Stories, Akzeptanzkriterien mit IDs)
3. `specs/02-tech-spec.md` – Wie (Architektur, Stack: React + SAP UI5 Web Components)
4. `specs/03-tasks.md` – Umsetzungsschritte, jeweils mit Verweis auf Requirement-IDs
5. `src/` – Code

## Regeln
- Spec first: Jede Änderung beginnt in der obersten betroffenen Spec und wird nach unten durchgereicht.
- Kein Code ohne zugehörigen Task, kein Task ohne Requirement-ID.
- Specs und Code werden im selben Commit geändert, wenn sie zusammengehören.
- Commit-Messages referenzieren Requirement-/Task-IDs (z. B. `feat(T-04): ... [REQ-02]`).
- Antworten an den User auf Deutsch.
