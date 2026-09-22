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
  `scratchpad/overlap.js` auf allen fünf Breiten geprüft.
- Die Navigation bricht unter 820 px auf zwei Zeilen um; dort braucht
  `scroll-margin-top` den größeren Wert.

### Inhalt
- Nur **1:1 Online Coaching**. Kein Personal Training vor Ort, kein
  2×30-System, keine feste Programmlaufzeit.
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
| `aaron-gym.jpg` | 4:5 | Abschluss-CTA — als aufgehellter Hintergrund rechts |
| `aaron-call.jpg` | 6:7 | „Worauf wartest du?" — offene Arme |
| `aaron-point.jpg` | 6:7 | liegt bereit; zeigt mit dem Finger, als Alternative zu `aaron-call.jpg` |

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

Die Rechtsseiten sind `impressum.html`, `datenschutz.html` und `agb.html`.
Offene Stellen darin sind mit `<span class="todo">` markiert und gelb
hinterlegt, damit sie nicht übersehen werden.

## Wichtig: Arbeit sichern
Der Container ist flüchtig. Committen reicht nicht — ohne Push ist die
Arbeit beim nächsten Start weg. Der letzte Rettungsanker war das
veröffentlichte Artifact.

## Lokal prüfen

```bash
python3 -m http.server 8000
```
