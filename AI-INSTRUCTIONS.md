# AI BUILD INSTRUCTIONS: Perfecto Homes Real Estate Website

> **SCOPE — read first (2026-09-11).** This repo is the **Peru** site, deployed to
> **perfectohomesrealestate.com**. It contains ONLY Cusco and Sacred Valley content.
>
> **Sacramento lives in a separate repo** (`perfecto-homes-sacramento` → perfectohomes.com):
> the two DRE-licensed agents, Sacramento community guides, Sacramento listings and
> Sacramento blog posts. Do not add California content, DRE numbers, LPT Realty branding
> or Sacramento service-area claims here. `public/_redirects` 301s every old Sacramento
> URL to its counterpart on that site; keep it in sync if you rename anything there.
>
> Sections below written before the split may still describe Sacramento routes and data
> that no longer exist in this repo. The code is authoritative, not this document.


## SETUP
```bash
cd "/Users/admin/Desktop/Perfecto Homes/website"
npm install
npm run dev
# Runs on http://localhost:3000
```

## TECH STACK
- Next.js 16.1.6 (App Router, TypeScript 5)
- Tailwind CSS 4 (`@tailwindcss/postcss`, `@theme inline`)
- Fonts: Inter (body), Manrope (headings/nav), Libre Baskerville (hero/titles)
- Content: Markdown in `/content/` with gray-matter, processed by `src/lib/content.ts`
- Forms: Netlify Forms with honeypot
- Analytics: Google Analytics (G-Q0X209GPL3)
- SEO: JSON-LD via `src/components/JsonLd.tsx`, next-sitemap
- GitHub repo: https://github.com/jamil-theready/perfecto-homes-website.git

---

## BUSINESS INFO
- **Company**: Perfecto Homes Real Estate
- **Domain**: perfectohomesrealestate.com
- **Phone**: (916) 878-7260
- **Email**: perfectohomes@gmail.com
- **Social**: @perfectohomes on Facebook, Instagram, TikTok, YouTube
- **Location**: Cusco, Peru
- **Languages**: Bilingual English/Spanish

### Team (3 members, data in `src/lib/constants.ts`)
1. Elisban Gonzales - Real Estate Specialist | (916) 878-7703 | elisban@perfectohomesrealestate.com
2. Alfredo Gonzalez - Loan Officer | (415) 508-6864 | alfredogonzalez@nexera.mortgage
3. Jamil Gonzales - Web Designer | (916) 218-0751 | jamil@perfectohomesrealestate.com

### Market
- **Cusco and the Sacred Valley, Peru**: 14 community pages, Sacred Valley investment properties (3 active listings)

### Active Peru Listings
1. **Hatuchay Valle Restaurant** - $1,260,000 | 1,764 m2 land (SUNARP exact, currently shows 1,800 in markdown, NEEDS UPDATE) | 560 m2 built | Urubamba | Commercial
2. **Hostal Qhispicay** - $960,000 | 125 m2 land, 474 m2 built | Ollantaytambo | 12 rooms + 2 apts
3. **Predio Victoria** - $820,000 | 10,000 m2 land | Urubamba | Undeveloped

## COLOR SYSTEM
```
--gold: #C4A94D       --gold-dark: #A8903D
--black: #1A1A1A      --dark-gray: #222222
--white: #FFFFFF      --light-gray: #F5F5F5
--medium-gray: #888888
```

---

## WHAT IS ALREADY BUILT

### Pages
- `/` - Homepage (hero cards, scroll reveal, communities, Peru, team, testimonials, contact)
- `/blog` - Blog index
- `/blog/[slug]` - Individual blog posts (9 generic posts exist)
- `/peru/[slug]` - Peru listing pages (3 listings)
- `/communities/[slug]` - Cusco and Sacred Valley community pages (14 areas)
- `/about/[slug]` - Team member profiles (4 members)
- `/contact` - Contact form (Web3Forms)
- `/events` - Events page
- `/privacy-policy` - Privacy policy
- `/terms` - Terms of service
- `/thank-you` - Post-form submission

### Components
- Header.tsx - Sticky header, transparent-to-white, mobile hamburger, communities dropdown
- Footer.tsx - Dark footer, social icons with gold hover
- ContactForm.tsx - Netlify form with honeypot + success state
- TestimonialCarousel.tsx - Dual marquee animation
- ScrollReveal.tsx - Intersection Observer fade-up
- ScrollRevealText.tsx - Sticky scroll reveal for mission text
- JsonLd.tsx - Organization, Property, BlogPost schemas

### Content (Markdown)
- 3 Peru listings in `/content/peru/`
- 9 blog posts in `/content/blog/` (generic, not SEO-targeted)
- Community data in `src/lib/constants.ts`

### Images (50+ files in `/public/images/`)
- Communities: 9 neighborhood photos
- Peru: 3 listing images
- Team: 4 member photos
- Testimonials: 12+ customer photos
- Logos: Perfecto
- Hero: video, aerial shots, skyline, bridge, peru-illustration

---

## CRITICAL BUGS TO FIX FIRST

### 1. URL Typo (HIGH PRIORITY)
- File: `/content/peru/predido-victoria.md` needs to be renamed to `predio-victoria.md`
- Also in `src/lib/constants.ts` line 73: change slug from `"predido-victoria"` to `"predio-victoria"`
- This breaks SEO and branding

### 2. Restaurant Land Area
- Current: markdown says 1,800 m2
- Correct: 1,764 m2 (SUNARP exact measurement)
- Update in `/content/peru/hatuchay-valle-restaurant-urubamba.md` (landArea field AND meta description)

### 3. Missing netlify.toml
Create `netlify.toml` in project root:
```toml
[[redirects]]
  from = "/thank-you"
  to = "/thank-you"
  status = 200

[build]
  command = "npm run build"
  publish = "out"
```

---

## WHAT NEEDS TO BE DONE

### 1. HOMEPAGE DESIGN FIXES

#### Team Section
- Photos are WAY too large. Resize appropriately for mobile/desktop
- Background should be light gold gradient: `bg-gradient-to-b from-gold/5 via-gold/10 to-gold/5`
- Make responsive across all breakpoints

#### Agent CTA Buttons
- Phone and email should be PRIMARY CTAs: white background, black text, gold icon left
- "Learn More" becomes simple text link with arrow
- Mobile: buttons evenly distributed
- Desktop: buttons left-aligned, same size

#### Peru Card (hero area)
- Use `peru-illustration.png` from `/public/images/hero/`

### 2. SEO BLOG POSTS
Create as .md files in `/content/blog/` with proper frontmatter. These are HIGH PRIORITY for SEO:

1. **"How to Buy Property in Peru as a Foreigner"** - Target: peru real estate investment
2. **"How the Chinchero Airport Will Change Sacred Valley Property Values"** - FIRST MOVER ADVANTAGE, zero competitors
6. **"Why Invest in Sacred Valley Real Estate"** - Target: sacred valley real estate
7. **"Hospitality Investment Opportunities in Cusco, Peru"** - Target: hostel for sale peru

Frontmatter format:
```yaml
---
title: "Post Title Here"
date: "2026-03-16"
excerpt: "2-3 sentence summary"
metaDescription: "SEO meta description with target keyword"
image: "/images/peru/hatuchay-restaurant.jpg"
---
```

### 3. COMMUNITY PAGES SEO
Each community page needs optimized metadata. Targets are Cusco and Sacred Valley
district queries; pull current demand from Search Console rather than a stale table.

For each:
- Optimized meta title: "[Community] Homes for Sale | Perfecto Homes Real Estate"
- Meta description using target keyword naturally
- 2-3 paragraphs of unique content (schools, lifestyle, price range, why people love it)
- PropertyJsonLd schema

### 4. PERU LISTING SEO
- Hatuchay: title "Restaurant for Sale in Urubamba, Peru | $1.26M | Perfecto Homes"
- Hostal: title "Hostel for Sale in Ollantaytambo, Peru | $960K | Perfecto Homes"
- Victoria: title "Land for Sale in Urubamba, Sacred Valley | $820K | Perfecto Homes"
- Each needs PropertyJsonLd schema with price, location, images
- Image alt texts: property name + what's shown + location + property type

### 5. HOMEPAGE SEO
- Title: "Perfecto Homes | Property in Cusco and the Sacred Valley"
- Meta: "Homes, land and hospitality property for sale in Cusco and the Sacred Valley. Bilingual representation for foreign buyers."

---

## SEO REFERENCE FILES (read these for full keyword strategy)
- `/Users/admin/Desktop/Perfecto Homes/documents/Peru_SEO_Keyword_Plan.md`

---

## CONTENT RULES
- No hyphens or em dashes
- No AI filler language ("In today's fast-paced world...")
- Short punchy sentences
- Max 1-2 exclamation marks per piece
- SEO keywords woven naturally, never stuffed
- CTA everywhere: (916) 878-7260 or perfectohomesrealestate.com
- Bilingual angle is a selling point, mention naturally

---

## WHAT "DONE" LOOKS LIKE
1. Every page renders without errors, `npm run build` passes
2. "predido" typo fixed everywhere
3. Restaurant land area updated to 1,764 m2
4. All community pages have unique content and SEO metadata
5. All 3 Peru listings have proper schema and SEO titles
6. 7 new SEO blog posts written and rendering
7. Team section redesigned (proper sizing, gold background)
8. Agent CTAs redesigned (phone/email primary)
10. Site looks polished on mobile and desktop
