# Product Requirements Document

> Status: approved · Abgeleitet aus: [00-intent.md](00-intent.md)

## 1. Produktüberblick
Eine englischsprachige Portfolio-Website für Dominik Völker, Fullstack-Entwickler im SAP-Umfeld. Die Website ist selbst das Showcase: Sie sieht aus wie eine **SAP-Fiori-Anwendung** und zeigt alle Inhalte auf einer **Overview Page** – animierte Cards in unterschiedlichen Größen in einem Bento-Grid. Ziel ist der Effekt „Das ist UI5?!“ und ein Besuch auf Dominiks GitHub-Profil.

## 2. Personas
| ID | Persona | Bedürfnis |
|---|---|---|
| P-1 | **SAP-Entwickler** aus der Community | Will sehen, wer Dominik ist, was er kann und ob sich ein Blick in seine Repos lohnt. Erkennt Fiori und die Overview Page wieder und ist neugierig, was damit „anders“ gemacht wurde. |
| P-2 | **Entwickler außerhalb von SAP** | Kennt UI5 nicht unbedingt, beurteilt die Seite nach Look & Feel, Performance und Code-Qualität. |
| P-3 | **Bekannte** (Kollegen, Freunde, Familie) | Bekommen die Seite gezeigt, sollen beeindruckt sein – auch ohne technisches Verständnis. |

## 3. Anforderungen

### REQ-01 Overview Page (Startseite)
**Story:** Als Besucher will ich in den ersten Sekunden verstehen, wer Dominik ist, alles Wichtige auf einen Blick sehen und beeindruckt sein.
**Akzeptanzkriterien:**
- AC-01.1 Die Startseite ist eine Overview Page: oben ein Hero-Bereich mit Name, Positionierung (eine Zeile) und GitHub-CTA; darunter Cards in einem Bento-Grid (D-7).
- AC-01.2 Es gibt je eine Card pro Inhaltsbereich: **Projects**, **Skills**, **Career**, **Contact**, plus eine **GitHub**-Card, die direkt auf das Profil verlinkt.
- AC-01.3 Jede Card hat – wie eine Fiori-OVP-Card – einen Header mit Titel, Untertitel, Icon und einer Kennzahl, die aus den Daten berechnet wird (z. B. Anzahl Projekte, Anzahl Skills, Jahre Erfahrung).
- AC-01.4 Beim Laden erscheinen die Cards mit einer gestaffelten Einblend-Animation.
- AC-01.5 Die Startseite ist innerhalb von 2 s nach Aufruf vollständig dargestellt (lokal, Production-Build).
- AC-01.6 Cards haben unterschiedliche Größen (D-7): Projects **groß**, Skills **breit**, Career **hoch**, Contact und GitHub **klein**.
- AC-01.7 Alle Inhalte stehen vollständig in den Cards; es gibt keine Detail-Seiten (D-8).

### REQ-02 Git-Projekte
**Story:** Als Entwickler will ich Dominiks Projekte sehen und direkt ins Repo springen.
**Akzeptanzkriterien:**
- AC-02.1 Die Projects-Card listet die Projekte mit Name, Kurzbeschreibung, Haupt-Technologien und Link zum Repo.
- AC-02.2 Jedes Projekt verlinkt in einem neuen Tab auf das GitHub-Repository.
- AC-02.3 Die Projekte stammen aus einer kuratierten, statischen Datendatei (D-1). Reihenfolge und Texte bestimmt Dominik.
- AC-02.4 Bis echte Inhalte vorliegen, gibt es Platzhalter-Projekte, im Code mit `TODO` markiert.

### REQ-03 Skills
**Story:** Als Besucher will ich auf einen Blick sehen, welche Technologien Dominik beherrscht.
**Akzeptanzkriterien:**
- AC-03.1 Die Skills-Card zeigt die Skills gruppiert in: Backend, Frontend, Frameworks, weitere SAP-Erfahrung.
- AC-03.2 Initialer Inhalt laut Intent: ABAP, Node.js · SAP UI5, JavaScript, HTML5 · SAP UI5, ABAP RAP, ABAP Programming Model for Fiori, SAP OData (SEGW), SAP Adobe Forms · User- & Berechtigungsmanagement.
- AC-03.3 Skills liegen als Daten vor, nicht hartcodiert im Markup.

### REQ-04 Werdegang (Career)
**Story:** Als Besucher will ich Dominiks beruflichen Weg nachvollziehen.
**Akzeptanzkriterien:**
- AC-04.1 Die Career-Card zeigt die Stationen chronologisch (neueste zuerst) als Timeline: Zeitraum, Rolle, Firma, 1–3 Highlights.
- AC-04.2 Inhalte liegen als Daten vor. Vorerst Platzhalter, mit `TODO` markiert (D-3).

### REQ-05 Kontakt
**Story:** Als Besucher will ich Dominik erreichen oder ihm folgen können.
**Akzeptanzkriterien:**
- AC-05.1 Die Contact-Card enthält Links zu GitHub (hervorgehoben) und weiteren Profilen/Kanälen. Vorerst Platzhalter, mit `TODO` markiert (D-4).
- AC-05.2 Kein Kontaktformular mit Backend (Nicht-Ziel). Optional `mailto:`-Link.

### REQ-06 Fiori-Shell
**Story:** Als Besucher will ich mich wie in einer echten Fiori-Anwendung fühlen.
**Akzeptanzkriterien:**
- ~~AC-06.1 Tile-to-App-Transition~~ – gestrichen (D-8): Es gibt keine Detail-Seiten mehr.
- AC-06.2 **Header** im Stil des Fiori-Shell-Headers (D-5), immer sichtbar: Logo/Name, Seitentitel „Overview“, Avatar von Dominik, Theme-Umschalter (REQ-09).
- ~~AC-06.3 Eigene URL je App~~ – gestrichen (D-8).
- ~~AC-06.4 Rückwärts-Animation beim Schließen einer App~~ – gestrichen (D-8).
- AC-06.5 Cards, Links und Header sind per Tastatur bedienbar.
- ~~AC-06.6 Fiori-Muster innerhalb einer App~~ – gestrichen (D-8).
- ~~AC-06.7 Zurück-Button~~ – gestrichen (D-8); ersetzt durch AC-06.11.
- ~~AC-06.8 Footer~~ – gestrichen (D-6): Das Fiori Launchpad hat keinen Footer.
- AC-06.9 Ein Klick auf den Avatar öffnet ein Benutzermenü wie im Launchpad, mit dem Eintrag **About** (enthält den Hinweis aus AC-07.4).
- AC-06.10 Das Benutzermenü enthält statt „Sign Out“ einen Link „Visit GitHub“ zum GitHub-Profil (kein Login, siehe Nicht-Ziele).
- AC-06.11 Ein Klick auf Logo/Name scrollt zum Seitenanfang.

### REQ-07 Wow-Effekt
**Story:** Als Besucher will ich staunen – „das ist UI5?!“
**Akzeptanzkriterien:**
- AC-07.1 Die Anwendung sieht insgesamt aus wie eine Fiori-Anwendung (Shell, Layout, Komponenten). Der Wow-Effekt entsteht durch die Cards mit Infos über Dominik und ihre Animationen, ergänzt um ein eigenes Akzent-Theme (Farben) auf Basis von UI5-Theming.
- AC-07.2 Signature-Element ist die Overview Page im Bento-Grid mit animierten Cards (D-7).
- AC-07.3 Cards reagieren auf Hover/Fokus mit einer Animation (z. B. Anheben, Tilt, Glow).
- AC-07.4 Ein dezenter Hinweis „Built with React & SAP UI5 Web Components“ inkl. Link zum Repo dieser Website (im About-Dialog, AC-06.9).

### REQ-08 Responsiveness & Qualität
**Akzeptanzkriterien:**
- AC-08.1 Die Seite funktioniert ab 360 px Breite ohne horizontales Scrollen; das Bento-Grid wird auf schmalen Bildschirmen einspaltig.
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
| D-2 | Was trägt den Wow-Effekt? | ~~Fiori-Launchpad-Twist mit Tiles, die sich zu Apps öffnen.~~ Abgelöst durch D-7 (CR-1). |
| D-3 | Inhalte für den Werdegang? | Vorerst Platzhalter mit `TODO`-Hinweis. |
| D-4 | Kontaktkanäle? | Vorerst Platzhalter mit `TODO`-Hinweis. |
| D-5 | Wie sieht die Anwendung aus? | Wie eine Fiori-Anwendung mit Shell-Header. ~~Tiles öffnen Vollbild-Apps mit eigener URL und Zurück-Button.~~ Navigation abgelöst durch D-8 (CR-1). |
| D-6 | Braucht die Anwendung einen Footer? | Nein – das Fiori Launchpad hat keinen. Der „Built with …“-Hinweis wandert ins About im Avatar-Menü. |
| D-7 | Tiles oder Cards? | Cards wie auf einer Fiori **Overview Page**, angeordnet als **Bento-Grid** mit unterschiedlichen Größen. Cards lassen sich inhaltlich besser gestalten als Tiles. (CR-1) |
| D-8 | Öffnen Cards eigene Seiten? | Nein – alle Inhalte stehen vollständig in den Cards. Keine Detail-Apps, keine App-Routen, kein Zurück-Button. (CR-1) |

## 6. Offene Fragen
_Keine._

## 7. Änderungshistorie
| ID | Datum | Änderung | Betroffen |
|---|---|---|---|
| CR-1 | 2026-10-30 | Overview Page mit Cards im Bento-Grid statt Launchpad mit Tiles; keine Detail-Apps mehr. | REQ-01, REQ-02–05 (Darstellung), REQ-06, REQ-07, AC-08.1, D-2, D-5, D-7, D-8 |
