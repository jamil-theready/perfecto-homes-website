# Claude Code Context — Perfecto Homes Website

## Read First
- **MASTER.md** has the full project reference (architecture, what's done, what's left)
- This is a Next.js 16 App Router site with Tailwind CSS 4 and TypeScript
- Content lives in `/content/` as markdown files with YAML frontmatter
- Constants (team, communities, listings) are in `src/lib/constants.ts`

## Commands
```bash
npm run dev -- --port 3000   # Dev server
npm run build                # Build (runs postbuild for sitemap automatically)
```

## Key Rules
- Build must stay clean — run `npm run build` after major changes
- No hyphens or em dashes in any copy
- No AI filler language — short punchy sentences
- Max 1-2 exclamation marks per piece of content
- SEO keywords woven naturally, never stuffed
- Phone: (916) 878-7260 | Email: perfectohomes@gmail.com

## External Files (not in repo)
- SEO keyword plans: `~/Desktop/Perfecto Homes/documents/`
- Graphics/logos: `~/Desktop/Perfecto Homes/graphics/`
- Feedback screenshots: `~/Desktop/Perfecto SS/`

## Deploy
- GitHub repo → Netlify (main branch)
- netlify.toml is in repo root
- Forms use Netlify Forms with honeypot spam protection
