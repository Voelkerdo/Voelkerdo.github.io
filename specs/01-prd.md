# Product Requirements Document

> Status: approved · Abgeleitet aus: [00-intent.md](00-intent.md)

## 1. Produktüberblick
Eine englischsprachige Portfolio-Website für Dominik Völker, Fullstack-Entwickler im SAP-Umfeld. Die Website ist selbst das Showcase: Sie sieht aus wie eine **SAP-Fiori-Anwendung** und zeigt alle Inhalte ausschließlich in Cards auf einer **Overview Page** nach Fiori Design Guidelines – animierte Cards in unterschiedlichen Größen in einem Bento-Grid. Ziel ist der Effekt „Das ist UI5?!“ und ein Besuch auf Dominiks GitHub-Profil.

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
- ~~AC-01.1 Hero-Bereich mit Name, Positionierung und GitHub-CTA über den Cards~~ – gestrichen (D-9, CR-2); ersetzt durch AC-01.8.
- AC-01.2 Es gibt je eine Card pro Inhaltsbereich: **Projects**, **Skills**, **Career**, **Contact**. Eine eigene GitHub-Card gibt es nicht; GitHub ist in der Contact-Card hervorgehoben (AC-05.1) und im Avatar-Menü verlinkt (AC-06.10) (D-13). _(angepasst in CR-6)_
- AC-01.3 Jede Card hat – wie eine Fiori-OVP-Card – einen Header mit Titel, Untertitel und Icon. Die Inhalts-Cards (Projects, Skills, Career, Contact) zeigen zusätzlich eine Kennzahl, die aus den Daten berechnet wird (z. B. Anzahl Projekte, Anzahl Skills, Jahre Erfahrung). Die Profil-Card hat keine Kennzahl. _(präzisiert in CR-2, CR-6)_
- AC-01.4 Beim Laden erscheinen die Cards mit einer gestaffelten Einblend-Animation.
- AC-01.5 Die Startseite ist innerhalb von 2 s nach Aufruf vollständig dargestellt (lokal, Production-Build).
- AC-01.6 Cards haben unterschiedliche Größen (D-7): Projects **groß**, About me und Skills **breit**, Career und Contact **hoch**. _(ergänzt in CR-2, angepasst in CR-6)_
- AC-01.7 Alle Inhalte stehen vollständig in den Cards; es gibt keine Detail-Seiten (D-8) und keine Inhalte außerhalb von Cards (D-9).
- AC-01.8 Die erste Card ist eine Profil-Card **„About me“** mit Avatar, Name und Positionierung (eine Zeile) (D-9).
- AC-01.9 Abstände folgen den Fiori Design Guidelines für die Overview Page (D-9): 1rem zwischen den Cards, 1rem unter der ShellBar, seitlicher Rand responsiv 1rem (S) / 2rem (M, L) / 3rem (XL); die Cards nutzen die volle Fensterbreite.
- AC-01.10 Die Profil-Card zeigt unter der Positionierung eine Statuszeile **„Currently building: …“** mit Werkzeug-Icon. Der Text wird in den Profildaten gepflegt; initial: „this portfolio – spec-driven with React & SAP UI5“ (D-14).
- AC-01.11 Am Desktop (≥ 1024 px Breite) passt die Overview Page im Ausgangszustand ohne vertikales Scrollen in ein Browserfenster mit 780 px Höhe. Aufgeklappte Listen dürfen die Seite verlängern (D-17).

### REQ-02 Git-Projekte
**Story:** Als Entwickler will ich Dominiks Projekte sehen und direkt ins Repo springen.
**Akzeptanzkriterien:**
- AC-02.1 Die Projects-Card listet die Projekte mit Name, Kurzbeschreibung, Haupt-Technologien und Link zum Repo.
- AC-02.2 Jedes Projekt verlinkt in einem neuen Tab auf das GitHub-Repository.
- AC-02.3 Die Projekte stammen aus einer kuratierten, statischen Datendatei (D-1). Reihenfolge und Texte bestimmt Dominik.
- AC-02.4 Bis echte Inhalte vorliegen, gibt es Platzhalter-Projekte, im Code mit `TODO` markiert.
- AC-02.5 Auf breiten Bildschirmen (≥ 1024 px) zeigt die Projects-Card anfangs die **ersten 3 Projekte**. Ein Link **„Show all (5)“** klappt die übrigen animiert auf, **„Show less“** klappt sie wieder zu. Der Umschalter ist per Tastatur bedienbar und meldet `aria-expanded`. Unter 1024 px sind alle Projekte sichtbar, ohne Umschalter. Bei Reduced Motion ohne Animation (AC-08.3) (D-17).

### REQ-03 Skills
**Story:** Als Besucher will ich auf einen Blick sehen, welche Technologien Dominik beherrscht.
**Akzeptanzkriterien:**
- ~~AC-03.1 Gruppierung in Backend, Frontend, Frameworks, weitere SAP-Erfahrung~~ – gestrichen (D-11, CR-4); ersetzt durch AC-03.8.
- AC-03.2 Gezeigt werden die SAP-Skills aus dem Intent, jeder genau einmal: ABAP, SAP UI5, ABAP RAP, ABAP Programming Model for Fiori, SAP OData (SEGW), SAP Adobe Forms, User- & Berechtigungsmanagement. Allgemeine Webtechnologien (HTML5, Node.js, JavaScript) werden nicht gezeigt (D-12). _(angepasst in CR-4, CR-5)_
- AC-03.3 Skills liegen als Daten vor, nicht hartcodiert im Markup.
- AC-03.4 Jeder Skill hat eine Stufe: **Expert**, **Advanced**, **Intermediate** oder **Familiar** (D-10).
- AC-03.5 Jeder Skill wird als Fortschrittsbalken dargestellt. Die Länge ergibt sich aus der Stufe (Expert 100 %, Advanced 75 %, Intermediate 50 %, Familiar 25 %); am Balken steht der Stufenname statt einer Prozentzahl (Fiori-Standarddarstellung: Text über dem Balken). _(präzisiert in T-22)_
- AC-03.6 Die Balken füllen sich gestaffelt von leer auf ihren Wert, und zwar erst, wenn die Skills-Card fertig eingeblendet ist und im sichtbaren Bereich liegt – die Animation muss für Besucher sichtbar sein. Bei `prefers-reduced-motion` stehen sie sofort auf ihrem Wert (AC-08.3). _(präzisiert nach T-23: vorher lief die Animation unsichtbar während des Einblendens ab)_
- AC-03.7 Initiale Stufen (Vorgabe Dominik): SAP OData (SEGW) Expert · SAP Adobe Forms Expert · ABAP Advanced · ABAP Programming Model for Fiori Advanced · User- & Berechtigungsmanagement Advanced · ABAP RAP Intermediate · SAP UI5 Familiar. _(angepasst in CR-5)_
- AC-03.8 Die Skills stehen als **eine Liste** untereinander – Name links, Fortschrittsbalken daneben, ohne Kategorien. Sortiert absteigend nach Stufe; bei gleicher Stufe in der Reihenfolge der Datendatei (D-11).
- AC-03.9 Anfangs sind nur die **5 stärksten** Skills (Reihenfolge laut AC-03.8) sichtbar. Ein Link **„Show all (7)“** klappt die Liste animiert auf; die neu sichtbaren Balken füllen sich dabei. **„Show less“** klappt sie wieder zu. Der Umschalter ist per Tastatur bedienbar und meldet seinen Zustand (`aria-expanded`). Bei Reduced Motion klappt die Liste ohne Animation (AC-08.3).

### REQ-04 Werdegang (Career)
**Story:** Als Besucher will ich Dominiks beruflichen Weg nachvollziehen.
**Akzeptanzkriterien:**
- AC-04.1 Die Career-Card zeigt die Stationen chronologisch (neueste zuerst) als Timeline: Zeitraum, Rolle, Firma, 1–3 Highlights. Auf breiten Bildschirmen sind nicht alle Stationen auf einmal sichtbar, man scrollt per Pfeil (AC-04.4). _(präzisiert in CR-9, CR-11)_
- ~~AC-04.3 Auf breiten Bildschirmen (≥ 1024 px, 4-spaltiges Raster) zeigt die Career-Card anfangs nur die **aktuelle Station** mit Rolle, Firma und Zeitraum, ohne Highlights. Ein Link **„Show all (3)“** klappt die Highlights und die älteren Stationen animiert auf, **„Show less“** klappt sie wieder zu. Der Umschalter ist per Tastatur bedienbar und meldet seinen Zustand (`aria-expanded`). Unter 1024 px sind alle Stationen sichtbar, und es gibt keinen Umschalter. Bei Reduced Motion klappt die Liste ohne Animation (AC-08.3) (D-16).~~ – gestrichen (D-18, CR-11); ersetzt durch AC-04.4.
- AC-04.4 Auf breiten Bildschirmen (≥ 1024 px) hat die Career-Card eine feste Höhe, etwa so hoch wie die eingeklappte Card aus CR-10. Die Timeline mit allen Stationen und Highlights liegt in einem Bereich, der sich **nur über Pfeil-Buttons** bewegen lässt: ▼ am unteren Rand, solange es nach unten weitergeht, ▲ am oberen Rand, solange es nach oben weitergeht. Ein Klick scrollt sanft zum Anfang der nächsten bzw. vorherigen Station. Ist eine Station höher als der sichtbare Bereich, scrollt ein Klick um die sichtbare Höhe weiter. Mausrad und Trackpad scrollen weiterhin die Seite. Die Pfeile sind per Tastatur bedienbar und haben einen Namen für Screenreader („Next station“, „Previous station“). Inhalte bleiben für Screenreader vollständig lesbar. Bei Reduced Motion springt der Bereich ohne Animation (AC-08.3). Unter 1024 px sind alle Stationen sichtbar, ohne Pfeile (D-18).
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
- AC-06.2 **Header** im Stil des Fiori-Shell-Headers (D-5), immer sichtbar: Logo/Name, Seitentitel „Overview“, Avatar von Dominik, ~~Theme-Umschalter (REQ-09)~~ – die Theme-Wahl liegt in den Einstellungen unter dem Avatar (REQ-11). _(präzisiert in CR-8)_
- ~~AC-06.3 Eigene URL je App~~ – gestrichen (D-8).
- ~~AC-06.4 Rückwärts-Animation beim Schließen einer App~~ – gestrichen (D-8).
- AC-06.5 Cards, Links und Header sind per Tastatur bedienbar.
- ~~AC-06.6 Fiori-Muster innerhalb einer App~~ – gestrichen (D-8).
- ~~AC-06.7 Zurück-Button~~ – gestrichen (D-8); ersetzt durch AC-06.11.
- ~~AC-06.8 Footer~~ – gestrichen (D-6): Das Fiori Launchpad hat keinen Footer.
- AC-06.9 Ein Klick auf den Avatar öffnet ein Benutzermenü wie im Launchpad, mit den Einträgen **Settings** (öffnet die Einstellungen, AC-11.1) und **About** (enthält den Hinweis aus AC-07.4). _(ergänzt in CR-8)_
- AC-06.10 Das Benutzermenü enthält statt „Sign Out“ einen Link „Visit GitHub“ zum GitHub-Profil (kein Login, siehe Nicht-Ziele).
- AC-06.11 Ein Klick auf Logo/Name scrollt zum Seitenanfang.

### REQ-07 Wow-Effekt
**Story:** Als Besucher will ich staunen – „das ist UI5?!“
**Akzeptanzkriterien:**
- AC-07.1 Die Anwendung sieht insgesamt aus wie eine Fiori-Anwendung (Shell, Layout, Komponenten). Der Wow-Effekt entsteht durch die Cards mit Infos über Dominik und ihre Animationen, ergänzt um ein eigenes Akzent-Theme (Farben) auf Basis von UI5-Theming.
- AC-07.2 Signature-Element ist die Overview Page im Bento-Grid mit animierten Cards (D-7).
- AC-07.3 Cards reagieren auf Maus-Hover und Tastatur-Fokus mit einer Animation (z. B. Anheben, Tilt, Glow). Antippen auf Touch-Geräten und Mausklicks lösen sie nicht aus. _(präzisiert nach T-24: Antippen von „Show all“ hob die Card an und kippte sie während des Aufklappens – ruckelig auf dem iPhone)_
- AC-07.4 Ein dezenter Hinweis „Built with React & SAP UI5 Web Components“ inkl. Link zum Repo dieser Website (im About-Dialog, AC-06.9).

### REQ-08 Responsiveness & Qualität
**Akzeptanzkriterien:**
- AC-08.1 Die Seite funktioniert ab 360 px Breite ohne horizontales Scrollen; das Bento-Grid wird auf schmalen Bildschirmen einspaltig.
- AC-08.2 Lighthouse (Production-Build): Performance ≥ 90, Accessibility ≥ 90.
- AC-08.3 Animationen respektieren `prefers-reduced-motion` (dann nur Überblenden statt Bewegung).

### REQ-09 Dark / Light Mode
**Akzeptanzkriterien:**
- AC-09.1 Die Seite folgt dem System-Theme (hell/dunkel), solange das Default-Theme „Sunset Coral (Auto)“ aktiv ist. Manuell gewählt wird Hell oder Dunkel über die Theme-Varianten in **Settings › Appearance** (AC-11.2); einen eigenen Umschalter im Avatar-Menü gibt es nicht mehr (D-15). _(präzisiert in CR-8)_
- AC-09.2 Beide Modi des Default-Themes nutzen das eigene Akzent-Theme aus AC-07.1. _(präzisiert in CR-8)_

### REQ-10 Benachrichtigungen (Fiori-Gag)
**Story:** Als Besucher aus der SAP-Community will ich schmunzeln, weil ich das Fiori-Benachrichtigungsmuster wiedererkenne.
**Akzeptanzkriterien:**
- AC-10.1 Die ShellBar zeigt eine Glocke mit Badge; das Badge zeigt die Anzahl ungelesener Benachrichtigungen (initial 3).
- AC-10.2 Ein Klick auf die Glocke öffnet eine Fiori-Benachrichtigungsliste mit drei Einträgen (Titel, Text, Zeitangabe):
  1. **Transport imported** – „Transport DVK900001 "Portfolio Website" was imported successfully into production.“ – „Just now“
  2. **Quality gate passed** – „npm run verify: all tests green – built spec-driven.“ – „2 min ago“
  3. **New follower request** – „You're not following Voelkerdo on GitHub yet. Fix that?“ – „Today“ (hohe Wichtigkeit)
- AC-10.3 Beim Öffnen der Liste gelten alle Benachrichtigungen als gelesen; das Badge verschwindet. Der Zustand gilt nur bis zum Neuladen.
- AC-10.4 Ein Klick auf „New follower request“ öffnet das GitHub-Profil in einem neuen Tab.
- AC-10.5 Glocke und Liste sind per Tastatur bedienbar; auf schmalen Bildschirmen öffnet sich die Liste als Vollbild-Dialog.

### REQ-11 Theme-Zeitreise (Einstellungen)
**Story:** Als Besucher aus der SAP-Community will ich durch die SAP-Themes der letzten Jahrzehnte reisen und die Seite im SAP-Look „meiner“ Zeit sehen.
**Akzeptanzkriterien:**
- AC-11.1 Der Eintrag **Settings** im Avatar-Menü öffnet den Einstellungsdialog nach Fiori Design Guidelines (UI5 `UserSettingsDialog`) mit dem Bereich **Appearance**. Auf schmalen Bildschirmen öffnet er sich im Vollbild.
- AC-11.2 Appearance listet die Themes gruppiert und mit dem neuesten zuerst. Neben jedem Theme-Namen steht das Jahr, in dem es bei SAP erstmals erschien (D-15):
  - **Today:** Sunset Coral (Auto) 2026 · Sunset Coral Light 2026 · Sunset Coral Dark 2026
  - **SAP Fiori:** SAP Morning Horizon 2022 · SAP Evening Horizon 2022 · SAP Quartz Light 2019 · SAP Quartz Dark 2019 · SAP Belize 2016 · SAP Blue Crystal 2013
  - **SAP GUI:** SAP Corbu 2012 · SAP Signature 2004 · SAP Enjoy 1999 · SAP Classic 1992
- AC-11.3 Default ist **Sunset Coral (Auto)**. Es folgt dem System (AC-09.1). Das aktive Theme ist in der Liste ausgewählt.
- AC-11.4 Ein Klick auf ein Theme wendet es sofort an, ohne Speichern-Button. Die Wahl gilt auch beim nächsten Besuch; ist der Browser-Speicher nicht verfügbar, funktioniert die Auswahl trotzdem.
- AC-11.5 Horizon und Quartz sind echte UI5-Themes. Belize, Blue Crystal, Corbu, Signature, Enjoy und Classic liefert UI5 nicht mehr mit; sie werden über UI5-CSS-Variablen nachempfunden (Farben, Schrift, Eckenradius). Sie sollen wiedererkennbar sein, müssen aber nicht pixelgenau sein (D-15). In jedem Theme ist Text mit Kontrast nach WCAG AA lesbar.
- AC-11.6 **Zeitreise:** Wechselt man zu einem Theme mit anderem Jahr, erscheint ein Overlay mit großer Jahreszahl. Sie zählt in rund 1,5 s vom Jahr des bisherigen Themes bis zum Jahr des neuen (z. B. 2026 → 1992) und nennt das Ziel-Theme. Unter dem Overlay wechselt das Theme, dann blendet das Overlay aus. Haben beide Themes dasselbe Jahr (z. B. Light ↔ Dark), wird nur übergeblendet.
- AC-11.7 Bei `prefers-reduced-motion` wird nicht gezählt: Das Overlay zeigt direkt das Zieljahr und wird nur ein- und ausgeblendet (AC-08.3).
- AC-11.8 Dialog und Theme-Liste sind per Tastatur bedienbar. Screenreader sagen die Zeitreise als Statusmeldung an (z. B. „Travelling to 1992 – SAP Classic“).

## 4. Außerhalb des Scopes (v1)
CMS, Backend, Login, Mehrsprachigkeit (siehe Intent). Außerdem: Blog, Analytics, Hosting/Deployment.

## 5. Entscheidungen
| ID | Frage | Entscheidung |
|---|---|---|
| D-1 | Woher kommen die Git-Projekte? | Kuratierte, statische Liste – keine Live-Abfrage der GitHub-API. |
| D-2 | Was trägt den Wow-Effekt? | ~~Fiori-Launchpad-Twist mit Tiles, die sich zu Apps öffnen.~~ Abgelöst durch D-7 (CR-1). |
| D-3 | Inhalte für den Werdegang? | Vorerst Platzhalter mit `TODO`-Hinweis. _(Echte Inhalte eingepflegt in T-31.)_ |
| D-4 | Kontaktkanäle? | Vorerst Platzhalter mit `TODO`-Hinweis. _(In T-31: GitHub und LinkedIn, keine E-Mail; LinkedIn-URL folgt.)_ |
| D-5 | Wie sieht die Anwendung aus? | Wie eine Fiori-Anwendung mit Shell-Header. ~~Tiles öffnen Vollbild-Apps mit eigener URL und Zurück-Button.~~ Navigation abgelöst durch D-8 (CR-1). |
| D-6 | Braucht die Anwendung einen Footer? | Nein – das Fiori Launchpad hat keinen. Der „Built with …“-Hinweis wandert ins About im Avatar-Menü. |
| D-7 | Tiles oder Cards? | Cards wie auf einer Fiori **Overview Page**, angeordnet als **Bento-Grid** mit unterschiedlichen Größen. Cards lassen sich inhaltlich besser gestalten als Tiles. (CR-1) |
| D-8 | Öffnen Cards eigene Seiten? | Nein – alle Inhalte stehen vollständig in den Cards. Keine Detail-Apps, keine App-Routen, kein Zurück-Button. (CR-1) |
| D-9 | Hero-Bereich oder nur Cards? | Nur Cards, möglichst nah an der Fiori-Overview-Page (Abstände laut Guideline). Name und Positionierung wandern in eine eigene Profil-Card „About me“; der GitHub-CTA ist durch ~~GitHub-Card~~ Contact-Card (seit CR-6) und Avatar-Menü abgedeckt. (CR-2) |
| D-10 | Wie werden Skills dargestellt? | Als animierte Fortschrittsbalken mit benannten Stufen statt Prozentwerten – visuell stark, aber ohne Schein-Präzision. (CR-3) |
| D-11 | Skills gruppiert oder als Liste? | Eine Liste aller 10 Skills ohne Kategorien, absteigend nach Stufe sortiert – weniger überladen, die stärksten Skills stehen oben. (CR-4) |
| D-12 | Welche Skills zeigt die Website? | Nur die SAP-Skills – allgemeine Webtechnologien entfallen; davon anfangs die Top 5 mit „Show all“, damit die Card kompakt bleibt und das Raster ausgewogen ist. (CR-5) |
| D-13 | Braucht es eine eigene GitHub-Card? | Nein – sie war doppelt zur Contact-Card, in der GitHub als primärer Kanal hervorgehoben ist. Contact wird dafür eine hohe Card. (CR-6) |
| D-14 | Welche Eye Catcher kommen zuerst? | Zwei kleine: eine augenzwinkernde Fiori-Benachrichtigungsglocke (Insider-Gag für die SAP-Community) und eine „Currently building“-Zeile in der Profil-Card (wirkt aktuell und persönlich). Größere Ideen (Heatmap, Standort-Card) bleiben für später. (CR-7) |
| D-15 | Wo und wie wählt man das Theme? | Wie im Fiori Launchpad unter **Avatar › Settings › Appearance** statt per Umschalter im Avatar-Menü. Als Eye Catcher reist die Liste mit Jahreszahlen und Zähl-Overlay durch die SAP-Themes von SAP Classic (1992) bis Horizon (2022). Themes, die UI5 nicht mehr mitliefert, werden über CSS-Variablen nachempfunden. Sunset Coral bleibt Default; Hell und Dunkel sind Theme-Varianten. Jahreszahl = erstes Erscheinen bei SAP (UI5/Fiori oder SAP GUI). (CR-8) |
| D-16 | Wie bleibt die Career-Card kompakt? | Auf dem Desktop anfangs nur die aktuelle Station, dazu „Show all“ wie bei den Skills (D-12). Keinen Scrollbalken, weil scrollende Inhalte in Cards nicht Fiori-konform sind und auf Touch-Geräten hakeln. Auf schmalen Bildschirmen ist die Höhe unkritisch, dort bleibt alles sichtbar. (CR-9)  _Teilweise abgelöst durch D-18 (CR-11)._ |
| D-17 | Wie passt die Overview Page ohne Scrollen auf den Desktop? | Die Seitenhöhe ergibt sich aus About + Career + Skills und aus der Projects-Card. Eingeklappt zeigt Career deshalb nur Rolle, Firma und Zeitraum der aktuellen Station, und Projects zeigt anfangs 3 Projekte, beide mit „Show all“, nur auf dem Desktop. Zielhöhe 780 px Fenster (kleines MacBook mit Lesezeichenleiste). (CR-10) |
| D-18 | Wie zeigt die Career-Card ältere Stationen? | Statt „Show all“, das die Card vergrößert, bleibt die Card so klein wie eingeklappt, und Pfeil-Buttons scrollen Station für Station durch die Timeline. Nur Klicks auf die Pfeile scrollen, damit das Mausrad nicht in der Card hängen bleibt. So bleibt die Seitenhöhe konstant (AC-01.11), und die gezielte Bewegung ersetzt den in D-16 abgelehnten freien Scrollbalken. Auf schmalen Bildschirmen bleibt alles sichtbar. (CR-11) |

## 6. Offene Fragen
_Keine._

## 7. Änderungshistorie
| ID | Datum | Änderung | Betroffen |
|---|---|---|---|
| CR-1 | 2026-10-30 | Overview Page mit Cards im Bento-Grid statt Launchpad mit Tiles; keine Detail-Apps mehr. | REQ-01, REQ-02–05 (Darstellung), REQ-06, REQ-07, AC-08.1, D-2, D-5, D-7, D-8 |
| CR-2 | 2026-10-30 | Hero-Bereich entfernt, Inhalte nur in Cards, neue Profil-Card „About me“, Abstände nach Fiori Design Guidelines. | AC-01.1, AC-01.3, AC-01.6, AC-01.7, AC-01.8, AC-01.9, D-9 |
| CR-3 | 2026-10-30 | Skills als animierte Fortschrittsbalken mit Stufen statt als Tags. | AC-03.4, AC-03.5, AC-03.6, AC-03.7, D-10 |
| CR-4 | 2026-10-30 | Skills als eine nach Stufe sortierte Liste ohne Kategorien. | AC-03.1, AC-03.2, AC-03.7, AC-03.8, D-11 |
| CR-5 | 2026-10-30 | Nur SAP-Skills (ohne HTML5, Node.js, JavaScript), anfangs Top 5 mit „Show all“. | AC-03.2, AC-03.7, AC-03.9, D-12 |
| CR-6 | 2026-10-30 | GitHub-Card entfernt (doppelt zur Contact-Card); Contact wird hoch. | AC-01.2, AC-01.3, AC-01.6, D-9, D-13 |
| CR-7 | 2026-10-30 | Eye Catcher: Benachrichtigungsglocke in der ShellBar, „Currently building“-Status in der Profil-Card. | AC-01.10, REQ-10, D-14 |
| CR-8 | 2026-10-31 | Theme-Zeitreise durch die SAP-Themes in Settings › Appearance (Fiori-Einstellungsdialog); Hell/Dunkel-Umschalter wandert dorthin. | AC-06.2, AC-06.9, AC-09.1, AC-09.2, REQ-11, D-15 |
| CR-9 | 2026-10-31 | Career-Card zeigt auf dem Desktop anfangs nur die aktuelle Station, „Show all“ klappt die übrigen auf. | AC-04.1, AC-04.3, D-16 |
| CR-10 | 2026-10-31 | Overview Page passt am Desktop ohne Scrollen: Career eingeklappt ohne Highlights, Projects anfangs 3 mit „Show all“. | AC-01.11, AC-02.5, AC-04.3, D-17 |
| CR-11 | 2026-10-31 | Career-Card scrollt auf dem Desktop per Pfeil-Buttons Station für Station statt „Show all“. | AC-04.1, AC-04.3, AC-04.4, D-16, D-18 |
