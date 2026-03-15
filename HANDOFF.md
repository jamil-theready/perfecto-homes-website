# Perfecto Homes Website - AI Handoff Prompt

## Quick Start
```bash
git clone https://github.com/jamil-theready/perfecto-homes-website.git
cd perfecto-homes-website
npm install
npm run dev
# Site runs on http://localhost:3000
```

## Project Overview
Real estate brokerage website for Perfecto Homes, based in Sacramento CA with international listings in Peru's Sacred Valley. Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4.

**Live domain**: perfectohomesrealestate.com (not yet pointed to new site)

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

### Pages
| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage: hero, social icons, Sacramento/Peru cards, scroll reveal mission, team section, communities grid, Peru listings, testimonials, contact form |
| `/blog` | `app/blog/page.tsx` | Blog index |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Individual posts from `/content/blog/*.md` |
| `/peru/[slug]` | `app/peru/[slug]/page.tsx` | Peru listing pages from `/content/peru/*.md` |
| `/communities/[slug]` | `app/communities/[slug]/page.tsx` | Sacramento community pages |
| `/About-Us/[slug]` | `app/About-Us/[slug]/page.tsx` | Team member profiles |
| `/Contact-Us` | `app/Contact-Us/page.tsx` | Contact form page |
| `/events` | `app/events/page.tsx` | Events page |
| `/privacy-policy` | `app/privacy-policy/page.tsx` | Privacy policy |
| `/terms` | `app/terms/page.tsx` | Terms of service |
| `/thank-you` | `app/thank-you/page.tsx` | Post-form submission |

### Components
| Component | File | Description |
|-----------|------|-------------|
| Header | `components/Header.tsx` | Fixed sticky header, transparent-to-white on scroll, mobile hamburger, communities dropdown |
| Footer | `components/Footer.tsx` | Dark footer, About Us / Communities links, LPT Realty white logo, social icons |
| ContactForm | `components/ContactForm.tsx` | Netlify form with honeypot, success state |
| TestimonialCarousel | `components/TestimonialCarousel.tsx` | Rotating quotes + photo marquee |
| ScrollReveal | `components/ScrollReveal.tsx` | Intersection Observer fade-up animation |
| ScrollRevealText | `components/ScrollRevealText.tsx` | Sticky scroll reveal for 3 mission sentences, reveals on scroll, reverses on scroll-up |
| JsonLd | `components/JsonLd.tsx` | Organization schema markup |

### Key Data
All constants in `src/lib/constants.ts`:
- `TEAM` array (4 members: Elisban, Gina, Alfredo, Jamil)
- `COMMUNITIES` array (9 Sacramento neighborhoods)
- `PERU_LISTINGS` array (3 properties)
- `SOCIAL_LINKS` (Facebook, Instagram, TikTok, YouTube)
- `PHONE`: (916) 878-7260 | `EMAIL`: perfectohomes@gmail.com

---

## Content System
Markdown files in `/content/` with YAML frontmatter, processed by `src/lib/content.ts`.

### Peru Listing Frontmatter
```yaml
title, price, city, metaTitle, metaDescription, landArea, builtArea,
floors, propertyType, district, location
```

### Blog Post Frontmatter
```yaml
title, date, excerpt, metaDescription, image
```

---

## Known Issues to Fix

### Critical (before launch)
1. **URL typo**: `/content/peru/predido-victoria.md` should be `predio-victoria.md`. Also fix slug in `constants.ts` line 73.
2. **Missing netlify.toml**: Contact form needs Netlify config for form routing to `/thank-you`.

### Design Issues to Address
3. **Team section**: People photos are too large. Need to be responsive across breakpoints. Background should be light gold gradient, not blue.
4. **Agent CTA buttons**: Phone and email should be the primary CTAs (bigger, button style: white bg, black text, gold icon). "Learn More" should become a simple text link. Buttons should be evenly distributed on mobile, left-aligned on desktop.
5. **Communities grid on homepage**: Sacramento card currently shows the old illustration style (white card with skyline graphic). Needs a real photo like the other community cards.
6. **Peru card on homepage**: Needs the `peru.png` graphic from the `/graphics/` folder.

### SEO Tasks
7. **Homepage metadata**: Optimize title tag and meta description with target keywords.
8. **Community pages**: Add metadata targeting green keywords:
   - "el dorado hills homes for sale" (6,600/mo, low competition)
   - "houses for sale in citrus heights" (3,600/mo, low comp)
   - "houses for sale rancho cordova" (3,600/mo, low comp)
   - "elk grove new construction" (2,900/mo, low comp)
   - "arden arcade homes" (480/mo, comp score 5)
9. **Blog content plan** (write these posts):
   - "How to Buy Property in Peru as a Foreigner"
   - "How the Chinchero Airport Will Change Sacred Valley Property Values"
   - "New Construction Homes in Sacramento Area 2026 Guide"
   - "First Time Home Buyer Guide: Sacramento CA"
   - "Best Neighborhoods in Sacramento for Families"
   - "Why Invest in Sacred Valley Real Estate"
   - "Hospitality Investment Opportunities in Cusco, Peru"
10. **Schema markup**: Wire CMS meta fields to Peru listing pages.
11. **OpenGraph images**: Generate or add OG images for key pages.

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
These files exist on the local machine but are NOT in the repo. Reference them for content:
- `/Users/admin/Desktop/Perfecto Homes/documents/Peru_SEO_Keyword_Plan.md`
- `/Users/admin/Desktop/Perfecto Homes/documents/Sacramento_SEO_Keyword_Plan.md`
- `/Users/admin/Desktop/Perfecto Homes/documents/business-info.txt`
- `/Users/admin/Desktop/Perfecto Homes/graphics/` - Logo files, graphics for cards
- `/Users/admin/Desktop/Perfecto Homes/graphics/other logos/` - LPT Realty, Diamond Club logos

---

## Deployment
- **Target host**: Netlify (forms integration built in)
- **Build**: `npm run build` then `npm run postbuild` (sitemap)
- **Output**: Static HTML (can deploy anywhere)
