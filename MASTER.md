# Perfecto Homes Website — Master Reference

## Quick Start
```bash
cd ~/Desktop/Perfecto\ Homes/website
npm install
npm run dev -- --port 3000
# Site runs on http://localhost:3000
```

## Project Overview
Real estate brokerage website for Perfecto Homes, based in Sacramento CA with international listings in Peru's Sacred Valley. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4.

**Live domain**: perfectohomesrealestate.com (not yet pointed to new site)
**Repo**: github.com/jamil-theready/perfecto-homes-website

---

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router, TypeScript 5)
- **Styling**: Tailwind CSS 4 via `@tailwindcss/postcss`
- **Fonts**: Inter (body), Manrope (headings/nav), Libre Baskerville (hero titles)
- **Content**: Markdown files in `/content/` with gray-matter frontmatter
- **Forms**: Netlify Forms with honeypot spam protection
- **Analytics**: Google Analytics (G-Q0X209GPL3)
- **SEO**: JSON-LD schema via `JsonLd.tsx`, next-sitemap for sitemap.xml
- **Path alias**: `@/*` maps to `./src/*`
- **Deployment**: Netlify (netlify.toml in repo root)

---

## Color System (CSS variables in globals.css)
```
--gold: #C4A94D       --gold-dark: #A8903D
--black: #1A1A1A      --dark-gray: #222222
--white: #FFFFFF      --light-gray: #F5F5F5
--medium-gray: #888888
```

---

## Site Architecture

### Pages (42 total)
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage: hero video, social icons, Sacramento/Peru cards, scroll reveal mission, team section (white bg, narrow), communities grid, Peru listings, testimonials, newsletter card, news/events asymmetric layout, sellers/buyers info, contact form |
| `/blog` | `app/blog/page.tsx` | Blog index (20 posts) |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Individual posts from `/content/blog/*.md` with BlogPostJsonLd |
| `/peru/[slug]` | `app/peru/[slug]/page.tsx` | Peru listing pages from `/content/peru/*.md` with PropertyJsonLd |
| `/communities/[slug]` | `app/communities/[slug]/page.tsx` | Sacramento community pages (9 communities + index) with SEO metadata |
| `/about/[slug]` | `app/about/[slug]/page.tsx` | Team member profiles |
| `/contact` | `app/contact/page.tsx` | Contact form page |
| `/events` | `app/events/page.tsx` | Events page |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/thank-you` | `app/thank-you/page.tsx` | Post-form submission |

### Components
| Component | File | Description |
|-----------|------|-------------|
| Header | `components/Header.tsx` | Fixed sticky header, transparent-to-white on scroll, mobile hamburger, communities/resources/about dropdowns |
| Footer | `components/Footer.tsx` | Dark footer, About Us / Communities links, LPT Realty white logo, social icons |
| ContactForm | `components/ContactForm.tsx` | Netlify form with honeypot, success state |
| TestimonialCarousel | `components/TestimonialCarousel.tsx` | Rotating quotes + photo marquee |
| ScrollReveal | `components/ScrollReveal.tsx` | Intersection Observer fade-up animation |
| ScrollRevealText | `components/ScrollRevealText.tsx` | Sticky scroll reveal for 3 mission sentences |
| JsonLd | `components/JsonLd.tsx` | OrganizationJsonLd, PropertyJsonLd (Peru pages), BlogPostJsonLd (blog pages) |
| ReadingProgress | `components/ReadingProgress.tsx` | Gold progress bar at top of blog posts |
| ShareButtons | `components/ShareButtons.tsx` | Sticky social share buttons (Facebook, X, LinkedIn, Email) |

### Key Data
All constants in `src/lib/constants.ts`:
- `TEAM` array (4 members: Elisban, Gina, Alfredo, Jamil)
- `COMMUNITIES` array (9 Sacramento neighborhoods)
- `PERU_LISTINGS` array (3 properties — slug: predio-victoria, hostal-qhispicay-ollantaytambo, hatuchay-valle-restaurant-urubamba)
- `SOCIAL_LINKS` (Facebook, Instagram, TikTok, YouTube)
- `PHONE`: (916) 878-7260 | `EMAIL`: perfectohomes@gmail.com

---

## Content System
Markdown files in `/content/` with YAML frontmatter, processed by `src/lib/content.ts`.

### Collections
- `/content/blog/` — 20 blog posts (9 original + 11 SEO-driven)
- `/content/peru/` — 3 Peru property listings
- `/content/communities/` — 9 Sacramento community pages
- `/content/events/` — Events (currently empty)
- `/content/team/` — Team data

### Blog Post Frontmatter
```yaml
title, slug, metaDescription, category, author, image, tags[], thumbnail, youtubeLink
```
Valid authors: elisban, gina, alfredo, jamil
CSV importer: `node scripts/import-blogs.mjs path/to/file.csv`

### Peru Listing Frontmatter
```yaml
title, price, city, metaTitle, metaDescription, landArea, builtArea,
floors, propertyType, listingStatus, district, location
```

### Community Page Frontmatter
```yaml
title, metaDescription
```

---

## SEO Implementation

### Metadata
- Homepage: keyword-optimized title targeting Sacramento + bilingual + community keywords
- Community pages: per-community SEO titles/descriptions via `COMMUNITY_SEO` map in `communities/[slug]/page.tsx`
- Peru pages: per-listing SEO titles/descriptions via `PERU_SEO` map in `peru/[slug]/page.tsx`
- Blog pages: titles from frontmatter

### Schema Markup (JSON-LD)
- `OrganizationJsonLd` — on every page (in layout)
- `PropertyJsonLd` — on Peru listing pages
- `BlogPostJsonLd` — on blog post pages

### OpenGraph
- Default OG image set in layout: `/images/logo/perfecto-logo-full.png`

### Sitemap
- Auto-generated via `next-sitemap` on `npm run postbuild`

---

## SEO Content Strategy

### Blog Posts Written (SEO-driven)
**Peru:**
1. "How to Buy Property in Peru as a Foreigner" — targets foreign buyer keywords
2. "How the Chinchero Airport Will Change Sacred Valley Property Values" — first mover advantage
3. "Why Invest in Sacred Valley Real Estate" — investment keywords
4. "Hospitality Investment Opportunities in Cusco, Peru" — hotel/hospitality keywords

**Sacramento:**
5. "New Construction Homes in Sacramento Area 2026 Guide" — elk grove new construction (2,900/mo)
6. "First Time Home Buyer Guide: Sacramento CA" — buyer intent keywords
7. "Best Neighborhoods in Sacramento for Families" — neighborhood/living keywords
8. "Sacramento Real Estate Market Report 2026" — market trends keywords
9. "Living in El Dorado Hills: What You Need to Know" — el dorado hills keywords
10. "Olympus Pointe Roseville: Neighborhood Guide" — olympus pointe keywords
11. "Selling Your Home in Sacramento: What to Expect" — seller keywords

### Keyword Plans (external reference files)
- `/Users/admin/Desktop/Perfecto Homes/documents/Peru_SEO_Keyword_Plan.md`
- `/Users/admin/Desktop/Perfecto Homes/documents/Sacramento_SEO_Keyword_Plan.md`

---

## Style Rules
- No hyphens or em dashes in copy
- No AI filler language
- Short punchy sentences
- Max 1-2 exclamation marks per piece of content
- `text-wrap: balance` is already applied globally to all h1-h4 elements
- SEO keywords should be woven in naturally

---

## File Locations (outside repo)
These files exist on the local machine but are NOT in the repo:
- `/Users/admin/Desktop/Perfecto Homes/documents/` — SEO keyword plans, business info
- `/Users/admin/Desktop/Perfecto Homes/graphics/` — Logo files, graphics for cards
- `/Users/admin/Desktop/Perfecto Homes/graphics/other logos/` — LPT Realty, Diamond Club logos
- `/Users/admin/Desktop/Perfecto SS/` — Screenshot folder for feedback

---

## Deployment
- **Host**: Netlify (forms integration built in)
- **Config**: `netlify.toml` in repo root
- **Build**: `npm run build` then `npm run postbuild` (sitemap)
- **Deploy from**: GitHub repo main branch

---

## What's Done
- [x] Critical: Peru URL typo fixed (predido → predio)
- [x] Critical: netlify.toml created
- [x] Design: Team section — white bg, narrower, headshots not cut off, Learn More flush right
- [x] Design: Sacramento card — real aerial photo
- [x] Design: Peru card — peru.png graphic
- [x] Design: Nav dropdown — full-width mega menu with images, dark overlay
- [x] Design: Nav Contact Us button — gold on scroll, glass on hero
- [x] Design: Nav logo micro animation on hover
- [x] Design: Nav button fonts unified (14px Manrope medium)
- [x] Design: Footer — LPT logo smaller, Perfecto logo matches nav size/alignment
- [x] Design: Newsletter — background image card, not full width
- [x] Design: News/Events section — asymmetric layout (blog 2/3, events 1/3)
- [x] Blog: Author field added to all posts (elisban, gina, alfredo, jamil)
- [x] Blog: Images added to all posts (Unsplash, light/bright, fast loading)
- [x] Blog: Cards show author photo, name, reading time, category badge, shadow on hover
- [x] Blog: Post page — sticky ContactForm sidebar, author in hero, reading time
- [x] Blog: Reading progress bar (gold, top of page)
- [x] Blog: Share buttons (Facebook, X, LinkedIn, Email) sticky on left, horizontal on mobile
- [x] Blog: H1 and Back to Blog aligned to 1200px nav container
- [x] Blog: CSV importer script (scripts/import-blogs.mjs)
- [x] SEO: Homepage metadata optimized
- [x] SEO: Community page metadata (all 9)
- [x] SEO: Peru listing metadata optimized
- [x] SEO: 11 SEO blog posts (7 original + 4 more)
- [x] SEO: PropertyJsonLd wired to Peru pages
- [x] SEO: BlogPostJsonLd wired to blog pages
- [x] SEO: Default OG image added
- [x] Content: 9 community content pages written
- [x] Fix: Dead /webinar nav link removed
- [x] Fix: Footer terms link corrected
- [x] Fix: Contact Us wrong phone number
- [x] Fix: Newsletter copy typo
- [x] Fix: Missing #team anchor on homepage
- [x] Fix: Broken Sacramento card anchor link

## What's Left
- [ ] Blog content: Spanish versions of Peru posts
- [ ] Images: Better OG images per page (not just logo fallback)
- [ ] Community pages: Add real photos and richer content as available
- [ ] Peru pages: Add property photo galleries when images are provided
- [ ] Events: Add events when scheduled
- [ ] Domain: Point perfectohomesrealestate.com to Netlify
- [ ] Analytics: Verify GA tracking post-deploy
- [ ] Forms: Test Netlify form submissions post-deploy
