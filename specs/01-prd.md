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
- AC-01.3 Jede Card hat – wie eine Fiori-OVP-Card – einen Header mit Titel, Untertitel und Icon. Die Inhalts-Cards (Projects, Skills, Career, Contact) zeigen zusätzlich eine Kennzahl, die aus den Daten berechnet wird (z. B. Anzahl Projekte, Anzahl Skills, Jahre Erfahrung). Die Profil-Card hat keine Kennzahl. _(präzisiert in CR-2, CR-6)_ Hat eine Card mehrere Ansichten, gehören Untertitel und Kennzahl zur gewählten Ansicht (AC-02.10). _(präzisiert in CR-13, CR-14)_
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
- AC-02.5 ~~Auf breiten Bildschirmen (≥ 1024 px)~~ Auf allen Bildschirmbreiten zeigt die Projects-Card anfangs die **ersten 3 Projekte**. Ein Link **„Show all (5)“** klappt die übrigen animiert auf, **„Show less“** klappt sie wieder zu. Der Umschalter ist per Tastatur bedienbar und meldet `aria-expanded`. ~~Unter 1024 px sind alle Projekte sichtbar, ohne Umschalter.~~ Bei Reduced Motion ohne Animation (AC-08.3) (D-17, D-23). Das gilt für die Ansicht „Repositories“. _(präzisiert in CR-13, CR-16)_
- ~~AC-02.6 Die Projects-Card hat zwei Ansichten, umschaltbar über einen **Segmented Button** oben im Card-Inhalt: **„Repositories“** (Default, Inhalt wie bisher) und **„Transport Log“**. Untertitel und Kennzahl im Header passen zur Ansicht: „Selected repositories“ mit der Anzahl Projekte bzw. „Built spec-driven“ mit der Anzahl Transporte. Der Umschalter ist per Tastatur bedienbar. Der Wechsel blendet über, bei Reduced Motion ohne Animation (AC-08.3). Die gewählte Ansicht gilt nur bis zum Neuladen.~~ – gestrichen (D-21, CR-14); ersetzt durch AC-02.10 und AC-02.11.
- AC-02.7 Das **Transport Log** zeigt die Entstehung dieser Website als SAP-Transporte, neuester zuerst. Je Eintrag: Transportnummer, Status, Datum (`YYYY-MM-DD`) und Text.
  - **DVK900001** ist die erste Version („Initial release“, Datum des ersten Commits), passend zur Benachrichtigung „Transport DVK900001 … imported“ (AC-10.2).
  - Jeder Change Request CR-N ist Transport **DVK9000(N+1)**, sechsstellig aufgefüllt, mit dem Text „CR-N“ + Beschreibung.
  - Status **„Imported“** (✓), sobald es zum CR einen Umsetzungs-Commit gibt; sonst **„Released“**. Als Umsetzung zählt ein späterer `feat`/`fix`-Commit, der den CR oder eine seiner Entscheidungen (D-/TD-IDs aus dem Spec-Commit) nennt. _(präzisiert in T-37: Frühe Umsetzungs-Commits nennen nur die Entscheidung, z. B. CR-2 → D-9.)_
  - Die Einträge entstehen beim Build automatisch aus den Git-Commits; neue CRs erscheinen ohne Pflege (D-20).
- AC-02.8 Über dem Transport Log stehen vier Kennzahlen, beim Build gezählt: **Change Requests**, erledigte **Tasks**, **Tests** (definierte Testfälle in `tests/`) und **Commits**.
- AC-02.9 ~~Am Desktop~~ Auf allen Bildschirmbreiten zeigt das Transport Log anfangs die 3 neuesten Transporte mit „Show all (N)“ / „Show less“ wie bei den Repositories (AC-02.5). ~~Unter 1024 px sind alle sichtbar.~~ _(präzisiert in CR-16)_ AC-01.11 (kein Scrollen bei 780 px) gilt für beide Ansichten im Ausgangszustand.
- AC-02.10 Die Projects-Card hat zwei Seiten: **Repositories** (Default) und **Transport Log**. Gewählt wird über zwei kleine **Seitenpunkte** mittig unten in der Card; der Punkt der aktiven Seite ist gefüllt (Akzentfarbe), der andere ist ein Ring. Die Punkte sind per Tastatur bedienbar und haben Namen für Screenreader („Repositories“, „Transport Log“); die aktive Seite ist als aktuell markiert. Untertitel und Kennzahl im Header passen zur Seite: „Selected repositories“ mit der Anzahl Projekte bzw. „Built spec-driven“ mit der Anzahl Transporte. Der Wechsel blendet über, bei Reduced Motion ohne Animation (AC-08.3). Die gewählte Seite gilt nur bis zum Neuladen. Links und rechts der Punkte steht je ein Pfeil **‹** bzw. **›** („Previous page“, „Next page“), der eine Seite zurück bzw. weiter blättert. Am Rand ist der jeweilige Pfeil deaktiviert: auf der ersten Seite ‹, auf der letzten ›. Wird der fokussierte Pfeil dadurch deaktiviert, springt der Tastaturfokus auf den anderen (D-22). _(präzisiert in CR-15)_
- AC-02.12 Beide Seiten der Projects-Card sind **gleich hoch**: Die Card ändert beim Seitenwechsel ihre Höhe nicht, solange keine Liste per „Show all“ aufgeklappt ist – auf allen Bildschirmbreiten. Der Wechsel ist eine **Überblendung**: Die alte Seite blendet aus, während die neue einblendet (≈ 0,4 s), gleich ob per Punkt, Pfeil oder automatisch. Bei Reduced Motion wechselt die Seite ohne Animation (AC-08.3) (D-23). _(neu in CR-16; löst den Satz „Der Wechsel blendet über“ in AC-02.10 genauer)_
- AC-02.11 Die Card wechselt alle **8 Sekunden** automatisch zur nächsten Seite; nach der letzten folgt wieder die erste.
  - **Pause:** Solange Maus oder Tastaturfokus in der Card sind, wird nicht gewechselt. Danach beginnen die 8 Sekunden neu.
  - **Stopp bis zum Neuladen:** sobald ein Seitenpunkt oder Pfeil angeklickt oder eine Liste per „Show all“ aufgeklappt wird. _(präzisiert in CR-15)_
  - **Kein automatischer Wechsel** bei `prefers-reduced-motion` und solange der Browser-Tab nicht sichtbar ist.
  - So erfüllt die Card WCAG 2.2.2 „Pause, Stop, Hide“ (D-21).

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
- AC-04.4 Auf breiten Bildschirmen (≥ 1024 px) hat die Career-Card eine feste Höhe, etwa so hoch wie die eingeklappte Card aus CR-10. Die Timeline mit allen Stationen und Highlights liegt in einem Bereich, der sich **nur über Pfeil-Buttons** bewegen lässt: ▼ am unteren Rand, solange es nach unten weitergeht, ▲ am oberen Rand, solange es nach oben weitergeht. Ein Klick scrollt sanft zum Anfang der nächsten bzw. vorherigen Station. Ist eine Station höher als der sichtbare Bereich, blättert ein Klick innerhalb der Station um knapp eine sichtbare Höhe weiter, ohne Zeilen zu überspringen. _(präzisiert in T-35)_ Wird die Card durch das Raster höher, z. B. wenn die Projects-Card aufgeklappt ist, wächst der sichtbare Bereich mit; es bleibt kein Leerraum unter der Timeline. _(präzisiert nach T-35)_ Mausrad und Trackpad scrollen weiterhin die Seite. Die Pfeile sind per Tastatur bedienbar und haben einen Namen für Screenreader („Next station“, „Previous station“). Inhalte bleiben für Screenreader vollständig lesbar. Bei Reduced Motion springt der Bereich ohne Animation (AC-08.3). Unter 1024 px sind alle Stationen sichtbar, ohne Pfeile (D-18).
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

### REQ-12 Systeminformationen (Einstellungen)
**Story:** Als Entwickler will ich sehen, womit diese Seite gebaut ist und wo sie läuft, so wie in den Systeminformationen eines Fiori Launchpads.
**Akzeptanzkriterien:**
- AC-12.1 Der Einstellungsdialog (AC-11.1) hat nach **Appearance** eine zweite Kategorie **System**, wie im Fiori Launchpad.
- AC-12.2 System zeigt schreibgeschützte Angaben in vier Gruppen:
  - **Tech Stack:** React, TypeScript, Vite, SAP UI5 Web Components und Motion, jeweils mit Versionsnummer. Die Versionen werden beim Build automatisch ermittelt und nicht von Hand gepflegt.
  - **Hosting:** GitHub Pages – „Static site, no backend“.
  - **Build:** Build-Datum (`YYYY-MM-DD`) und Git-Commit (Kurz-Hash).
  - **Theme:** das aktive Theme mit Namen und technischem UI5-Theme (z. B. „Sunset Coral Light · sap_horizon“). Die Angabe wechselt mit der Theme-Wahl (REQ-11).
- AC-12.3 Die Angaben sind per Tastatur erreichbar. Auf schmalen Bildschirmen verhält sich System wie Appearance (Vollbild, erst die Kategorienliste).
- AC-12.4 Der About-Dialog im Avatar-Menü bleibt unverändert (AC-06.9, AC-07.4): About ist der kurze Hinweis für alle, System sind die technischen Details (D-19).

### REQ-13 Sicherheit & Datenschutz
**Story:** Als Besucher will ich die Seite ansehen, ohne dass meine Daten an Dritte gehen oder ich durch Schwachstellen gefährdet bin. Als Dominik will ich, dass das bei jedem Change automatisch geprüft wird.
**Akzeptanzkriterien:**
- AC-13.1 Beim Besuch der Seite gehen **keine Requests an Drittanbieter**; alle Ressourcen inklusive der SAP-Schrift „72“ kommen von der eigenen Domain. Externe Ziele werden nur über Links erreicht, die der Besucher selbst anklickt.
- AC-13.2 Der Production-Build enthält eine **Content Security Policy** als Meta-Tag: `default-src 'self'; script-src 'self'; style-src 'self'; font-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'`. Unter dieser CSP funktioniert die Seite vollständig, ohne CSP-Verstöße.
- AC-13.3 Der Production-Build enthält die **Referrer-Policy** `strict-origin-when-cross-origin` als Meta-Tag.
- AC-13.4 Werte von außen (Browser-Speicher, URL-Parameter, URL-Hash) werden nie als HTML oder Code ausgeführt. Ungültige Werte führen zum Default, z. B. das Theme zu „Sunset Coral (Auto)“.
- AC-13.5 Alle Links und Buttons, die einen neuen Tab öffnen, verhindern den Zugriff auf die Seite (`noopener`, `noreferrer`).
- AC-13.6 Die Abhängigkeiten haben **keine bekannten Schwachstellen** (`npm audit`) und gültige Registry-Signaturen (`npm audit signatures`). Geprüft wird bei jedem Change Request und vor jedem Deployment.
- AC-13.7 Der Production-Build enthält **keine Sourcemaps** und keine Geheimnisse.

### REQ-14 Deployment
**Story:** Als Dominik will ich, dass jede geprüfte Änderung automatisch und sicher live geht, ohne dass ich etwas von Hand hochlade.
**Akzeptanzkriterien:**
- AC-14.1 Die Website ist öffentlich unter **`https://voelkerdo.github.io/`** erreichbar. Sie wird aus dem öffentlichen Repo `Voelkerdo/Voelkerdo.github.io` per GitHub Actions auf GitHub Pages veröffentlicht.
- AC-14.2 Veröffentlicht wird bei jedem Push auf `main` und manuell per Knopf in GitHub Actions – aber **nur, wenn `npm run verify` (inklusive Security-Tests) und `npm run security` grün sind**. Schlägt eine Prüfung fehl, bleibt die bisherige Version online. **Pull Requests** (z. B. von Dependabot) durchlaufen dieselben Prüfungen, werden aber nicht veröffentlicht. _(präzisiert nach T-46)_
- AC-14.3 Die Pipeline ist gehärtet:
  - minimale Rechte: Standard nur `contents: read`; `pages: write` und `id-token: write` nur im Deploy-Job;
  - alle Actions auf einen festen Commit (SHA) gepinnt;
  - keine Secrets nötig;
  - höchstens ein Deployment gleichzeitig.
- AC-14.4 Der Build nutzt die vollständige Git-History, damit Transport Log und Settings › System vollständig sind (TD-16).
- AC-14.5 Dependabot prüft wöchentlich die npm-Abhängigkeiten in `assets/` und die GitHub Actions und schlägt Updates als Pull Request vor. `@sap-theming/theming-base-content` ist davon ausgenommen: Seine Version folgt UI5 (Fonts, AC-13.1) und wird mit UI5-Updates mitgezogen; ein Test prüft die Übereinstimmung. _(präzisiert nach T-46)_
- AC-14.6 Nach der Erstveröffentlichung wird die Live-Seite geprüft: lädt vollständig, keine Requests an Dritte, CSP aktiv, Lighthouse Performance und Accessibility ≥ 90 (AC-08.2).

## 4. Außerhalb des Scopes (v1)
CMS, Backend, Login, Mehrsprachigkeit (siehe Intent). Außerdem: Blog, Analytics, ~~Hosting/Deployment~~. _(Hoster festgelegt in CR-12, Deployment umgesetzt in CR-18, REQ-14.)_

## 5. Entscheidungen
| ID | Frage | Entscheidung |
|---|---|---|
| D-1 | Woher kommen die Git-Projekte? | Kuratierte, statische Liste – keine Live-Abfrage der GitHub-API. |
| D-2 | Was trägt den Wow-Effekt? | ~~Fiori-Launchpad-Twist mit Tiles, die sich zu Apps öffnen.~~ Abgelöst durch D-7 (CR-1). |
| D-3 | Inhalte für den Werdegang? | Vorerst Platzhalter mit `TODO`-Hinweis. _(Echte Inhalte eingepflegt in T-31.)_ |
| D-4 | Kontaktkanäle? | Vorerst Platzhalter mit `TODO`-Hinweis. _(In T-31: GitHub und LinkedIn, keine E-Mail; LinkedIn-URL nachgereicht.)_ |
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
| D-17 | Wie passt die Overview Page ohne Scrollen auf den Desktop? | Die Seitenhöhe ergibt sich aus About + Career + Skills und aus der Projects-Card. Eingeklappt zeigt Career deshalb nur Rolle, Firma und Zeitraum der aktuellen Station, und Projects zeigt anfangs 3 Projekte, beide mit „Show all“, nur auf dem Desktop. Zielhöhe 780 px Fenster (kleines MacBook mit Lesezeichenleiste). (CR-10) | _„nur auf dem Desktop“ gilt für Projects seit CR-16 nicht mehr (D-23)._
| D-18 | Wie zeigt die Career-Card ältere Stationen? | Statt „Show all“, das die Card vergrößert, bleibt die Card so klein wie eingeklappt, und Pfeil-Buttons scrollen Station für Station durch die Timeline. Nur Klicks auf die Pfeile scrollen, damit das Mausrad nicht in der Card hängen bleibt. So bleibt die Seitenhöhe konstant (AC-01.11), und die gezielte Bewegung ersetzt den in D-16 abgelehnten freien Scrollbalken. Auf schmalen Bildschirmen bleibt alles sichtbar. (CR-11) |
| D-19 | Wo stehen technische Details zur Seite, und wo wird sie gehostet? | In einer Kategorie **System** im Einstellungsdialog, wie die Systeminformationen im Fiori Launchpad: Tech-Stack mit automatisch ermittelten Versionen, Hosting, Build-Infos und aktives UI5-Theme. Der About-Dialog bleibt als kurzer Hinweis. Hoster ist **GitHub Pages**, passend zum Repo `Voelkerdo.github.io`. (CR-12) |
| D-20 | Was zeigt die zweite Seite der Projects-Card? | Ein **Transport Log**: Die Change Requests dieser Website erscheinen als SAP-Transporte, darüber Kennzahlen zum Spec-Driven Development. Es setzt den Transport-Gag der Benachrichtigungen fort und macht das Nebenziel aus dem Intent sichtbar. Die Daten kommen beim Build aus Git und den Specs und bleiben ohne Pflege aktuell. ~~Umschalten per Segmented Button, weil so beide Ansichten auf einen Blick erkennbar sind.~~ (CR-13) _Umschalten abgelöst durch D-21 (CR-14)._ |
| D-21 | Wie wechselt die Projects-Card ihre Seiten? | Automatisch alle 8 Sekunden, angezeigt durch zwei Seitenpunkte unten statt Buttons mit Text – die Card wirkt lebendig, und Besucher sehen beide Seiten, ohne etwas zu suchen. Damit sich niemand gehetzt fühlt, pausiert der Wechsel bei Hover/Fokus und endet, sobald jemand selbst wählt oder eine Liste aufklappt; bei Reduced Motion gibt es ihn nicht (WCAG 2.2.2). (CR-14) |
| D-22 | Wie wird klarer, dass die Projects-Card eine zweite Seite hat? | Pfeile ‹ › links und rechts der Seitenpunkte, wie beim UI5-`Carousel` mit `arrowsPlacement="Navigation"`: eindeutig klickbar, größeres Ziel als die Punkte, Fiori-konform. Am Rand deaktiviert statt endlos, damit die Pfeile zusätzlich zeigen, auf welcher Seite man ist. (CR-15) |
| D-23 | Wie bleibt die Projects-Card beim Seitenwechsel ruhig? | Beide Seiten liegen übereinander im selben Bereich, die Card ist so hoch wie die höhere – ohne Messen. Damit die Repositories-Seite dabei nicht leer wirkt, zeigen beide Listen auch auf schmalen Bildschirmen anfangs 3 Einträge mit „Show all“. Die alte Seite blendet aus, die neue ein, statt hart zu wechseln. (CR-16) |
| D-24 | Wie wird die Seite geschützt, und welche Restrisiken akzeptieren wir? | Fonts selbst hosten, weil die Weitergabe der IP-Adresse an ein CDN datenschutzrechtlich heikel ist (vgl. LG München, Google Fonts, 2022). Eine strenge CSP per Meta-Tag entschärft künftige XSS-Fehler, weil GitHub Pages keine eigenen HTTP-Header erlaubt. Security-Tests laufen in `npm run verify` gegen einen echten Production-Build, `npm audit` bei jedem CR. **Akzeptiertes Restrisiko:** Die Seite lässt sich in fremde iframes einbetten (Clickjacking), denn `frame-ancestors` geht nicht per Meta-Tag. Ohne Login und ohne Formulare gibt es aber nichts, was sich so missbrauchen ließe. (CR-17) |
| D-25 | Wie kommt die Seite online? | GitHub Actions baut und veröffentlicht auf GitHub Pages, aber nur nach denselben Prüfungen wie lokal (`verify` + `security`). Lieber ein paar Minuten länger als ein kaputtes oder unsicheres Deployment. Push auf `main` löst aus, damit nichts vergessen wird; der manuelle Knopf bleibt für Wiederholungen. Persönliche Arbeitsnotizen wandern aus CLAUDE.md ins lokale Memory, weil das Repo öffentlich wird. (CR-18) |

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
| CR-12 | 2026-10-31 | Settings › System mit Tech-Stack, Hosting, Build-Infos und aktivem Theme; Hoster GitHub Pages festgelegt. | Intent (Hosting), §4, REQ-12, D-19 |
| CR-13 | 2026-10-31 | Projects-Card mit zweiter Ansicht „Transport Log“ (CRs als SAP-Transporte) und Kennzahlen zum Spec-Driven Development. | AC-01.3, AC-02.5–AC-02.9, D-20 |
| CR-14 | 2026-10-31 | Projects-Card wechselt ihre Seiten automatisch alle 8 s; Seitenpunkte unten statt Segmented Button. | AC-01.3, AC-02.6, AC-02.10, AC-02.11, D-20, D-21 |
| CR-15 | 2026-10-31 | Pfeile ‹ › neben den Seitenpunkten der Projects-Card, am Rand deaktiviert. | AC-02.10, AC-02.11, D-22 |
| CR-16 | 2026-10-31 | Projects-Card: gleiche Höhe beider Seiten und echte Überblendung, auch auf dem Smartphone; Listen dort ebenfalls 3 + „Show all“. | AC-02.5, AC-02.9, AC-02.12, D-17, D-23 |
| CR-17 | 2026-10-31 | Sicherheit & Datenschutz nach Security-Check: Fonts selbst gehostet, CSP und Referrer-Policy, Security-Tests in verify, `npm run security` bei jedem CR. | Intent (Leitplanken), REQ-13, D-24 |
| CR-18 | 2026-10-31 | Deployment auf GitHub Pages per GitHub Actions mit Prüfungen vor jedem Release, gehärteter Pipeline und Dependabot. | Intent (Hosting), §4, REQ-14, D-25 |
