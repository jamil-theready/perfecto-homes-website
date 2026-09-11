# Perfecto Homes — Automation Image Library

Curated stock for the daily blog flow (`Perfecto_Daily_Blog.json`). The flow's `Pick Image` node scores keywords against the match terms below and returns the path.

Live URL prefix: `https://www.perfectohomesrealestate.com/images/blog/automation/`

## Peru (4 files) — the only category on this site

| File | Alt text | Match terms |
|---|---|---|
| `peru-buying-process.jpg` | Peruvian property paperwork on a desk | foreigner, buying, us citizen, process, due diligence, notary, sunarp |
| `peru-sacred-valley.jpg` | Sacred Valley landscape with property | sacred valley, urubamba, pisac, ollantaytambo, invest, land |
| `peru-chinchero-airport.jpg` | Chinchero airport construction near Cusco | chinchero, airport, infrastructure, appreciation, values |
| `peru-hospitality.jpg` | Boutique hotel courtyard in Cusco region | hospitality, hotel, rental, airbnb, boutique, lodge, vacation |

## News — REMOVED 2026-09-11

The four news images were all California stock (`news-california-market`,
`news-rates`, `news-inventory`, `news-affordability`). They moved to the
Sacramento repo with the rest of the California content. Peru news posts need
new stock; see the Pexels rules before adding any.

---

## How to add more images

1. Drop a JPG/PNG into this folder (`/website/public/images/blog/automation/`)
2. Add a row to the table above with: filename, alt text, match terms
3. Add the same entry to `Pick Image` node's `imageMap` in `Perfecto_Daily_Blog.json`
4. Commit + push so the image is live before the next 8 AM run

Keep filenames descriptive and lowercase-with-hyphens. Avoid spaces.

## Refresh guidance

The `Pick Image` node uses keyword-match scoring. If a topic class is over-represented (e.g., all Peru posts get `peru-sacred-valley.jpg`), add 2–3 more options to that category and update the match terms to differentiate them.
