# Perfecto Homes — Automation Image Library

Curated stock for the daily blog flow (`Perfecto_Daily_Blog.json`). The flow's `Pick Image` node scores keywords against the match terms below and returns the path.

Live URL prefix: `https://www.perfectohomesrealestate.com/images/blog/automation/`

## Peru (4 files) — primary category, 60% of posts

| File | Alt text | Match terms |
|---|---|---|
| `peru-buying-process.jpg` | Peruvian property paperwork on a desk | foreigner, buying, us citizen, process, due diligence, notary, sunarp |
| `peru-sacred-valley.jpg` | Sacred Valley landscape with property | sacred valley, urubamba, pisac, ollantaytambo, invest, land |
| `peru-chinchero-airport.jpg` | Chinchero airport construction near Cusco | chinchero, airport, infrastructure, appreciation, values |
| `peru-hospitality.jpg` | Boutique hotel courtyard in Cusco region | hospitality, hotel, rental, airbnb, boutique, lodge, vacation |

## Sacramento (8 files) — 15% of posts

| File | Alt text | Match terms |
|---|---|---|
| `sacramento-market.jpg` | Sacramento real estate market data | market, report, update, forecast, trends |
| `sacramento-neighborhoods.jpg` | Sacramento family neighborhood streetscape | neighborhood, family, community, school |
| `sacramento-first-time-buyer.png` | First time home buyer in Sacramento | first time, buyer, mortgage, down payment, calhfa |
| `sacramento-new-construction.jpeg` | New construction homes Sacramento area | new construction, builder, lennar, tri pointe |
| `sacramento-inspection.jpg` | Home inspector examining property | inspection, appraisal, closing, contingency |
| `sacramento-selling.jpg` | For sale sign in front of Sacramento home | selling, seller, staging, fsbo |
| `sacramento-roseville.jpg` | Roseville neighborhood aerial | roseville, olympus, placer, lincoln |
| `sacramento-el-dorado-hills.jpg` | El Dorado Hills landscape and homes | el dorado, folsom, cameron park, foothill |

## News (4 files) — 25% of posts

| File | Alt text | Match terms |
|---|---|---|
| `news-california-market.jpeg` | California housing market trend chart | california, market, update, statewide |
| `news-rates.jpg` | California real estate sign with rate chart | rate, mortgage, fed, federal reserve |
| `news-inventory.jpg` | California suburban neighborhood aerial | inventory, supply, listings, dynamics |
| `news-affordability.jpg` | Savings calculator with home keys | inflation, affordability, savings, calhfa |

---

## How to add more images

1. Drop a JPG/PNG into this folder (`/website/public/images/blog/automation/`)
2. Add a row to the table above with: filename, alt text, match terms
3. Add the same entry to `Pick Image` node's `imageMap` in `Perfecto_Daily_Blog.json`
4. Commit + push so the image is live before the next 8 AM run

Keep filenames descriptive and lowercase-with-hyphens. Avoid spaces.

## Refresh guidance

The `Pick Image` node uses keyword-match scoring. If a topic class is over-represented (e.g., all Peru posts get `peru-sacred-valley.jpg`), add 2–3 more options to that category and update the match terms to differentiate them.
