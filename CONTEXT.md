# Space Explorer Workbook — Mission Watch Page
## Project Context

### What we're building
A beautiful, open-access web page at `watch.learnwhatmatters.in` where kids and parents can watch animated mission videos from **The Ultimate Space Explorer Workbook** after scanning QR codes in the book.

### The Problem
- The workbook has QR codes printed for each mission (up to 10 missions)
- A printing error caused only the first 2 QR codes to point correctly
- The QR codes are **dynamic** — destination URLs can be updated
- We need a single URL (`watch.learnwhatmatters.in`) to point all QRs to

### Key Decisions Made
| Decision | Choice | Reason |
|---|---|---|
| Access model | **Open access** (no login) | Kids shouldn't wait; the physical book is the natural gate |
| Video hosting | **Shopify CDN** | Videos already hosted there, just need URLs |
| Auth/gating | **None** | Keeping it simple |
| Framework | **Next.js + Tailwind** | Same stack as other LWM projects |
| Deployment | **Vercel** | Already used for other projects |
| Domain | **watch.learnwhatmatters.in** | Clean, memorable, matches brand |

### Product Details
- **Product page:** https://learnwhatmatters.in/products/the-ultimate-space-explorer-workbook
- **Workbook:** 97 pages, ages 5-12, 10 missions
- **Character:** Captain Nova — astronaut cat who guides kids
- **Mission structure:** QR scan → watch 2-3 min animated video → return to workbook → earn badge → certificate at end
- **Missions:** Up to 10

### Brand / Design Tokens
- **Primary bg:** #050714 (deep space)
- **Purple:** #3b0a45 (deep purple from product page)
- **Accent:** #fc9c00 (burnt orange — CTAs, highlights)
- **Cream:** #fff7ec (body text)
- **Teal glow:** #22d3ee / #06b6d4 (interactive elements)
- **Font:** Space Grotesk (headings), Inter (body)
- **Tone:** Premium kids app — adventurous, not cartoonish. NASA meets Pixar.

### 3 Layout Options Designed for Google Stitch
1. **Mission Control Dashboard** — 2/3-col card grid, NASA-style mission briefing room *(recommended)*
2. **Interactive Galaxy Map** — solar system where each planet = one mission
3. **Mission Scroll** — cinematic full-screen vertical scroll, one mission per section

→ Stitch prompts are in the conversation. Pick a design, then we build.

### Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- No database, no auth
- Mission content in `data/missions.ts` (easy to edit)
- HTML5 `<video>` player for Shopify CDN URLs

### Project Structure (planned)
```
space-missions/
  app/
    layout.tsx
    page.tsx                  ← Mission hub / home
    mission/[id]/page.tsx     ← Individual mission video page
  data/
    missions.ts               ← All mission titles, video URLs, thumbnails
  components/
    MissionCard.tsx
    VideoPlayer.tsx
    StarBackground.tsx
  public/
    og-image.png
```

### Related Projects (for reference/reuse)
- `/Users/aarush/dailysadhana-watch` — watch.thedailysadhana.com (similar concept, has purchase gating, Firebase auth, CloudFront signed URLs)
- `/Users/aarush/learnwhatmatters-whatsapp` — LWM cart recovery dashboard (same brand)

### Next Steps
1. Finalise layout in Google Stitch (connect MCP → build from chosen design)
2. Get all 10 mission video URLs from Shopify CDN
3. Get mission titles + thumbnails (from workbook PDF or design files)
4. Build the Next.js app in this folder
5. Deploy to Vercel → add `watch.learnwhatmatters.in` domain
6. Update all 10 dynamic QR codes to correct URLs
