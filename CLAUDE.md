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
Alle unter `img/`, aus den Originalen zugeschnitten:

| Datei | Format | Ort |
|---|---|---|
| `aaron-hero.png` | 4:5, transparent | Hero, ohne Rahmen |
| `aaron-gym.jpg` | 3:4 | Ziele-Abschnitt |
| `coaching-wide.jpg` | 16:10 | Ablauf-Abschnitt |
| `aaron-portrait.jpg` | 4:5 | Coach-Abschnitt |

Logo-Dateien (`logo.png`, `logo-mark.png`, `favicon.png`) werden aus
`pca logo .png` freigestellt.

## Wichtig: Arbeit sichern
Der Container ist flüchtig. Committen reicht nicht — ohne Push ist die
Arbeit beim nächsten Start weg. Der letzte Rettungsanker war das
veröffentlichte Artifact.

## Lokal prüfen

```bash
python3 -m http.server 8000
```
