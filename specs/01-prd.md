# Product Requirements Document

> Status: approved · Abgeleitet aus: [00-intent.md](00-intent.md)

## 1. Produktüberblick
Eine englischsprachige Portfolio-Website für Dominik Völker, Fullstack-Entwickler im SAP-Umfeld. Die Website ist selbst das Showcase: Sie greift das bekannte **SAP Fiori Launchpad** auf und inszeniert es neu – die Inhalte sind „Apps“ hinter animierten Tiles. Ziel ist der Effekt „Das ist UI5?!“ und ein Besuch auf Dominiks GitHub-Profil.

## 2. Personas
| ID | Persona | Bedürfnis |
|---|---|---|
| P-1 | **SAP-Entwickler** aus der Community | Will sehen, wer Dominik ist, was er kann und ob sich ein Blick in seine Repos lohnt. Erkennt das Launchpad wieder und ist neugierig, was damit „anders“ gemacht wurde. |
| P-2 | **Entwickler außerhalb von SAP** | Kennt UI5 nicht unbedingt, beurteilt die Seite nach Look & Feel, Performance und Code-Qualität. |
| P-3 | **Bekannte** (Kollegen, Freunde, Familie) | Bekommen die Seite gezeigt, sollen beeindruckt sein – auch ohne technisches Verständnis. |

## 3. Anforderungen

### REQ-01 Launchpad-Startseite (Hero)
**Story:** Als Besucher will ich in den ersten Sekunden verstehen, wer Dominik ist, und beeindruckt sein.
**Akzeptanzkriterien:**
- AC-01.1 Die Startseite ist ein Launchpad: oben ein Hero-Bereich mit Name, Positionierung (eine Zeile) und GitHub-CTA; darunter ein Tile-Grid.
- AC-01.2 Es gibt je ein Tile pro Inhaltsbereich: **Projects**, **Skills**, **Career**, **Contact**, plus ein **GitHub**-Tile, das direkt auf das Profil verlinkt.
- AC-01.3 Tiles zeigen – wie Fiori-KPI-Tiles – eine Kennzahl oder Vorschau (z. B. Anzahl Projekte, Anzahl Skills, Jahre Erfahrung).
- AC-01.4 Beim Laden erscheinen die Tiles mit einer gestaffelten Einblend-Animation.
- AC-01.5 Die Startseite ist innerhalb von 2 s nach Aufruf vollständig dargestellt (lokal, Production-Build).

### REQ-02 Git-Projekte
**Story:** Als Entwickler will ich Dominiks Projekte sehen und direkt ins Repo springen.
**Akzeptanzkriterien:**
- AC-02.1 Projekte werden als Cards angezeigt: Name, Kurzbeschreibung, Haupt-Technologien, Link zum Repo.
- AC-02.2 Jede Card verlinkt in einem neuen Tab auf das GitHub-Repository.
- AC-02.3 Die Projekte stammen aus einer kuratierten, statischen Datendatei (D-1). Reihenfolge und Texte bestimmt Dominik.
- AC-02.4 Bis echte Inhalte vorliegen, gibt es Platzhalter-Projekte, im Code mit `TODO` markiert.

### REQ-03 Skills
**Story:** Als Besucher will ich auf einen Blick sehen, welche Technologien Dominik beherrscht.
**Akzeptanzkriterien:**
- AC-03.1 Skills sind gruppiert in: Backend, Frontend, Frameworks, weitere SAP-Erfahrung.
- AC-03.2 Initialer Inhalt laut Intent: ABAP, Node.js · SAP UI5, JavaScript, HTML5 · SAP UI5, ABAP RAP, ABAP Programming Model for Fiori, SAP OData (SEGW), SAP Adobe Forms · User- & Berechtigungsmanagement.
- AC-03.3 Skills liegen als Daten vor, nicht hartcodiert im Markup.

### REQ-04 Werdegang (Career)
**Story:** Als Besucher will ich Dominiks beruflichen Weg nachvollziehen.
**Akzeptanzkriterien:**
- AC-04.1 Stationen werden chronologisch (neueste zuerst) als Timeline dargestellt: Zeitraum, Rolle, Firma, 1–3 Highlights.
- AC-04.2 Inhalte liegen als Daten vor. Vorerst Platzhalter, mit `TODO` markiert (D-3).

### REQ-05 Kontakt
**Story:** Als Besucher will ich Dominik erreichen oder ihm folgen können.
**Akzeptanzkriterien:**
- AC-05.1 Links zu GitHub (hervorgehoben) und weiteren Profilen/Kanälen. Vorerst Platzhalter, mit `TODO` markiert (D-4).
- AC-05.2 Kein Kontaktformular mit Backend (Nicht-Ziel). Optional `mailto:`-Link.

### REQ-06 Launchpad-Shell & Navigation
**Story:** Als Besucher will ich mich wie in einer echten Fiori-Anwendung bewegen: Tile öffnen, App ansehen, zurück zur Startseite.
**Akzeptanzkriterien:**
- AC-06.1 Ein Klick auf ein Tile öffnet den Inhaltsbereich als Vollbild-„App“. Das Tile wächst dabei animiert zur App auf (Tile-to-App-Transition).
- AC-06.2 **Header** im Stil des Fiori-Launchpad-Shell-Headers (D-5), immer sichtbar: Zurück-Button (nur innerhalb einer App), Logo/Name, Titel der aktuellen App bzw. „Home“, Avatar von Dominik, Theme-Umschalter (REQ-09).
- AC-06.3 Jede App hat eine eigene URL (z. B. `#/projects`). Browser-Back und Direkt-Links funktionieren.
- AC-06.4 Beim Schließen einer App läuft die Animation umgekehrt zurück ins Tile.
- AC-06.5 Tiles und Navigation sind per Tastatur bedienbar.
- AC-06.6 Innerhalb einer App folgen die Inhalte Fiori-Mustern (z. B. Object Page / Dynamic Page mit Titelbereich).
- AC-06.7 Der Zurück-Button führt aus einer App zurück zum Launchpad; ein Klick auf Logo/Name ebenfalls.
- AC-06.8 **Footer** im Fiori-Stil, immer sichtbar: enthält den Hinweis aus AC-07.4 und den GitHub-Link.

### REQ-07 Wow-Effekt
**Story:** Als Besucher will ich staunen – „das ist UI5?!“
**Akzeptanzkriterien:**
- AC-07.1 Die Anwendung sieht insgesamt aus wie eine Fiori-Anwendung (Shell, Layout, Komponenten). Der Wow-Effekt entsteht durch die Tiles mit Infos über Dominik und ihre Animationen, ergänzt um ein eigenes Akzent-Theme (Farben) auf Basis von UI5-Theming.
- AC-07.2 Signature-Element ist der Fiori-Launchpad-Twist mit Tiles und Animationen (D-2), umgesetzt durch REQ-01 und REQ-06.
- AC-07.3 Tiles reagieren auf Hover/Fokus mit einer Animation (z. B. Anheben, Tilt, Glow).
- AC-07.4 Ein dezenter Hinweis „Built with React & SAP UI5 Web Components“ inkl. Link zum Repo dieser Website (im Footer, AC-06.8).

### REQ-08 Responsiveness & Qualität
**Akzeptanzkriterien:**
- AC-08.1 Die Seite funktioniert ab 360 px Breite ohne horizontales Scrollen; das Tile-Grid bricht passend um.
- AC-08.2 Lighthouse (Production-Build): Performance ≥ 90, Accessibility ≥ 90.
- AC-08.3 Animationen respektieren `prefers-reduced-motion` (dann nur Überblenden statt Bewegung).

### REQ-09 Dark / Light Mode
**Akzeptanzkriterien:**
- AC-09.1 Die Seite folgt dem System-Theme und bietet einen manuellen Umschalter in der ShellBar.
- AC-09.2 Beide Modi nutzen das eigene Theme aus AC-07.1.

## 4. Außerhalb des Scopes (v1)
CMS, Backend, Login, Mehrsprachigkeit (siehe Intent). Außerdem: Blog, Analytics, Hosting/Deployment.

## 5. Entscheidungen
| ID | Frage | Entscheidung |
|---|---|---|
| D-1 | Woher kommen die Git-Projekte? | Kuratierte, statische Liste – keine Live-Abfrage der GitHub-API. |
| D-2 | Was trägt den Wow-Effekt? | Fiori-Launchpad-Twist: Inhalte als Tiles, die sich animiert zu Apps öffnen. |
| D-3 | Inhalte für den Werdegang? | Vorerst Platzhalter mit `TODO`-Hinweis. |
| D-4 | Kontaktkanäle? | Vorerst Platzhalter mit `TODO`-Hinweis. |
| D-5 | One-Page oder Launchpad-Navigation? | Launchpad: Tiles öffnen Vollbild-Apps mit eigener URL. Die gesamte Anwendung sieht aus wie Fiori – mit Shell-Header, Footer und Zurück-Button. |

## 6. Offene Fragen
_Keine._
