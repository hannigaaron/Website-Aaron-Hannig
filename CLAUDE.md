# Personal Coach Aaron — Website

Statische One-Page für das **1:1 Online Coaching**. Kein Build-Schritt.

## Verbindliche Regeln

### Mobil zuerst
Der Großteil der Besucher kommt über das Handy (Instagram-Traffic). Jede
Designänderung wird auf **allen drei Größen** geprüft, bevor sie fertig ist:
Handy 390/430 px, iPad 768 px hoch und 1024 px quer, Desktop 1440 px.

- Kein horizontales Scrollen auf keiner Breite.
- Antippziele auf Touch mindestens **44 × 44 px**, gekoppelt an
  `@media (pointer:coarse)` — nicht an die Breite, sonst fällt das iPad
  im Querformat durchs Raster.
- Keine Schrift unter **12 px**.
- **Kein Text darf sich mit anderem Text überlagern** — auch nicht kurz
  während einer Animation. Der Zoom auf den Überschriften reserviert seinen
  Platz vorher im Layout (`.head-box` mit Innenabstand unten), statt sich
  über den Text darunter zu schieben. Vor dem Fertigmelden wird das mit
  `tools/pruefen.js` auf allen fünf Breiten geprüft.
- Die Navigation bricht unter 820 px auf zwei Zeilen um; dort braucht
  `scroll-margin-top` den größeren Wert.

### Inhalt
- Die Startseite zeigt nur **1:1 Online Coaching**. Kein Personal Training vor Ort,
  keine feste Programmlaufzeit.
- Das **2X30 SYSTEM** (digitales PDF-Produkt, 49 €) hat eine eigene Seite
  `2x30.html` unter `/2x30` mit eigenen AGB `agb-2x30.html`. Auf der Startseite
  erscheint es nur als Reiter und Footer-Link. Die Seite nutzt eigene Schriften
  (`fonts/2x30/`) und three.js (`vendor/three.min.js`) – alles lokal.
- Das Wort **„Training" wird vermieden** — außer in Aarons Biografie.
  Es geht um Coaching, Fortschritt, Routinen, Gewohnheitsaufbau, Analyse,
  Lösungen, Mindeststandards und Langfristigkeit.
- Keine Wirkungsversprechen mit Zahlen ohne Beleg.
- Keine erfundenen Kundenstimmen oder Namen.

### Farben
Ausschließlich aus dem Logo, als Variablen oben in `styles.css`:
`--blue` `#93ddf4`, `--blue-deep` `#10708d` (kontraststark für Text),
`--ink` `#2e2e2e`, `--ink-mid` `#585858`.

### Bilder
Alle unter `img/`, aus den Originalen zugeschnitten. Bei den Studiofotos
wird zusätzlich das kräftige Orange der Laufbahn zurückgenommen — nur dort,
wo die Sättigung über 120 liegt, damit Hauttöne unberührt bleiben —, danach
nachgeschärft:

| Datei | Format | Ort |
|---|---|---|
| `aaron-hero.jpg` | 4:5 | Hero — randlos bis zum rechten Bildschirmrand, linke Kante diagonal |
| `aaron-portrait.jpg` | 4:5 | Coach — versetzt, mit blauer Fläche dahinter |
| `aaron-gym.jpg` | 4:5 | Abschluss-CTA — als aufgehellter Hintergrund rechts, ganze Figur |
| `aaron-call.jpg` | 6:7 | „Worauf wartest du?" — offene Arme |
| `aaron-point.jpg` | 6:7 | liegt bereit; zeigt mit dem Finger, als Alternative zu `aaron-call.jpg` |

`aaron-hero.jpg` und `aaron-gym.jpg` stammen aus dem Studio-Shooting im
blauen Shirt — dort gibt es keine orange Laufbahn, die Farbkorrektur entfaellt,
nur nachgeschaerft wird. Im Abschluss-CTA steht das Foto auf `height:100%`,
damit der Kopf nicht oben abgeschnitten wird.

Jedes Foto bekommt eine andere Behandlung. Dreimal derselbe abgerundete
Kasten neben Text sieht nach Vorlage aus. Ablauf und Ziele haben bewusst
kein Bild.

Logo-Dateien (`logo.png`, `logo-mark.png`, `favicon.png`) werden aus
`pca logo .png` freigestellt.

### Animationen
Beide Bibliotheken liegen **lokal** unter `vendor/` — kein CDN. Das ist keine
Geschmacksfrage: Ein CDN-Aufruf überträgt die IP-Adresse des Besuchers an
einen Dritten und wäre ohne Einwilligung ein Datenschutzverstoß.

| Bibliothek | Wofür | Geladen |
|---|---|---|
| GSAP + ScrollTrigger | scroll-gesteuerte Animationen, Parallaxe, Laufband | immer, lokal |
| Lenis | weiches Scrollen mit Nachlauf | immer, lokal |

Dasselbe gilt für die Schriften unter `fonts/`.

Regeln dazu:
- Alles muss ohne diese Bibliotheken funktionieren. Fällt ein CDN aus, greift
  der IntersectionObserver-Fallback und die Seite bleibt vollständig lesbar.
- `prefers-reduced-motion` schaltet Lenis, GSAP **und** Vanta komplett ab.
- `scroll-behavior:smooth` gehört nicht ins CSS — das arbeitet gegen Lenis.
  Sprungmarken laufen über `lenis.scrollTo()` mit Versatz für die Navigation.

### Datenschutz
Beim bloßen Aufruf der Seite darf **keine einzige Anfrage an einen
Drittanbieter** hinausgehen. Der Calendly-Kalender ist die einzige Ausnahme
und lädt erst nach einem ausdrücklichen Klick (Zwei-Klick-Lösung). Wer eine
externe Ressource ergänzt, legt sie lokal ab oder hängt sie hinter einen
Klick — und passt `datenschutz.html` an.

Die Rechtsseiten sind `impressum.html`, `datenschutz.html`, `agb.html` (Coaching)
und `agb-2x30.html` (2X30 SYSTEM, Kauf über Stripe, Download über Google Drive).
Sie sind vollständig ausgefüllt — keine Platzhalter mehr. Wer neue einfügt,
markiert sie mit `<span class="todo">`; die stehen gelb hinterlegt **im
ausgelieferten HTML** und sind für Besucher sichtbar, müssen vor dem
Livegang also restlos verschwinden.

Eingetragen sind: Anschrift Wundensteinstraße 11, 71679 Asperg,
Kleinunternehmer nach § 19 UStG, Hoster Netlify, Inc. (USA, EU-U.S. DPF),
Calendly (USA, EU-U.S. DPF), WhatsApp Ireland Ltd. und Zoom für die Calls,
Mindestlaufzeit vier Monate, danach unbefristet mit vier Wochen Kündigungsfrist zum Monatsende, Zahlung als
Gesamtbetrag oder monatliche Raten.

### Auftakt
Beim ersten Aufruf pro Browser-Tab teilen sich zwei dunkle Flächen entlang der
Logo-Neigung und geben die Seite frei (`.curtain`, per Skript eingesetzt).
Regeln dafür:

- Der Schleier wird **nur von JavaScript erzeugt**. Ohne Skript gibt es ihn
  nicht, und die Seite ist sofort lesbar.
- Tippen, Scrollen oder eine Taste überspringt ihn; eine Notbremse entfernt
  ihn nach spätestens 4 Sekunden auf jeden Fall.
- `sessionStorage` sorgt dafür, dass er pro Tab nur einmal läuft.
- `prefers-reduced-motion` blendet ihn komplett aus.

Ruhende Zustände gehören ins CSS, animierte ins Skript: `.title-rule` steht
im CSS sichtbar und wird von GSAP auf 0 gesetzt, `.hero-wipe` steht im CSS
unsichtbar und wird von GSAP eingeblendet. So bleibt ohne Skript nichts
unsichtbar hängen.

### Vor dem Livegang
Im Repo liegen die Dateien, die eine echte Domain braucht:

| Datei | Wofür |
|---|---|
| `robots.txt` | erlaubt das Indexieren, verweist auf die Sitemap |
| `sitemap.xml` | eine einzige URL, die Startseite |
| `_redirects` | leitet die alten Wix-Adressen dauerhaft (301) auf die neuen |
| `og-image.jpg` | 1200 × 630, das Vorschaubild beim Teilen |

Die Adresse `https://personalcoachaaron.de` steht in `og:image`, `og:url`,
den `canonical`-Angaben, im JSON-LD, in `sitemap.xml`, `robots.txt` und
`llms.txt`. Wird die Domain eine andere, müssen alle mitgeändert werden.

## Gefunden werden: Suchmaschinen und KI-Assistenten
Viele KI-Crawler (GPTBot, ClaudeBot, PerplexityBot) führen **kein JavaScript**
aus. Deshalb gilt: **Jeder Inhalt steht im HTML.** Das Skript darf verschönern
und bewegen, aber keinen Text erzeugen, den es ohne Skript nicht gäbe. Die
Phasen und die Kundenstimmen standen früher nur im Skript — das ist behoben
und soll so bleiben.

| Datei / Stelle | Wofür |
|---|---|
| JSON-LD im `<head>` von `index.html` | Unternehmen, Person, Leistung, FAQ als strukturierte Daten |
| `llms.txt` | Kurzfassung des Angebots für KI-Assistenten |
| `robots.txt` | erlaubt ausdrücklich auch die KI-Crawler |
| `_headers` | Zwischenspeichern (Schriften, Bibliotheken, Bilder) und Sicherheitskopfzeilen |

Regeln dazu:
- Die FAQ im JSON-LD muss **wortgleich** mit der sichtbaren FAQ sein. Wer eine
  Frage ändert, ändert beide Stellen — und `llms.txt`.
- Keine Sternebewertung (`aggregateRating`) ins JSON-LD: Die Bewertungen
  stammen von Google, nicht von dieser Seite; Google wertet das als
  Eigenlob-Markup.
- Hauptadresse ist `https://personalcoachaaron.de` **ohne www** (www leitet
  um). Canonical, `og:url`, Sitemap und JSON-LD nennen genau diese Form.
- Fotos liegen zusätzlich als WebP vor und werden über `<picture>` ausgeliefert;
  wer ein Foto tauscht, erzeugt das WebP neu (`convert x.jpg -quality 80 x.webp`).

## Prüfwerkzeuge im Repo
`tools/pruefen.js` ist die Pflichtprüfung (seitliches Scrollen, Text über Text,
Fremdanfragen, Skriptfehler auf allen fünf Breiten). Einmalig `npm install` in
`tools/`, dann bei laufendem `python3 -m http.server 8000`: `node tools/pruefen.js`.
`tools/shot.js <name> <breite> 0 "#abschnitt"` macht ein Bildschirmfoto.

Unter `.claude/skills/` liegen zwei fremde Regelsätze (beide MIT-Lizenz, aus
`vercel-labs/agent-skills` und `Leonxlnx/taste-skill`). Sie sind Werkzeuge,
keine Vorgaben — die verbindlichen Regeln stehen oben in dieser Datei.

| Skill | Wofür | Aufruf |
|---|---|---|
| `web-design-guidelines` | Prüfliste für Barrierefreiheit, Fokus, Touch, Bilder, Performance | holt die Regeln von `raw.githubusercontent.com/vercel-labs/web-interface-guidelines` |
| `taste-skill` | Gestaltungsregeln gegen Baukasten-Optik; enthält einen Linter | `node .claude/skills/taste-skill/scripts/lint.mjs index.html styles.css script.js` |

Der `taste-skill`-Linter meldet bewusst getroffene Entscheidungen dieser Seite
als Fehler (Kicker über den Überschriften, die Nummern 01–06, Haarlinien,
Verläufe aus den Logofarben). Das sind keine Mängel. Wer ihn laufen lässt,
prüft die Treffer einzeln, statt sie abzuarbeiten.

## Wichtig: Arbeit sichern
Der Container ist flüchtig. Committen reicht nicht — ohne Push ist die
Arbeit beim nächsten Start weg. Der letzte Rettungsanker war das
veröffentlichte Artifact.

## Lokal prüfen

```bash
python3 -m http.server 8000
```
