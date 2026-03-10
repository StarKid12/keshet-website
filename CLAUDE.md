# Keshet School Website - קשת

## What Is This

Website for **בית הספר הדמוקרטי יהודי-פלורליסטי קשת** (Keshet Democratic Pluralistic School) in Zichron Yaakov, Israel. Replaces the old Wix site. Has public pages for prospective families and a private authenticated area for the school community.

**School structure:** בית צעירים (K-2nd), חממה (3rd-5th), שכב"ג (6th-8th), תיכון (9th-12th)

## Tech Stack

- **Next.js 15** (App Router, TypeScript, `src/` directory)
- **Tailwind CSS v4** with `@theme` directive in `globals.css` (not tailwind.config)
- **Supabase** for auth, Postgres DB, storage, realtime
- **GSAP + ScrollTrigger** for homepage spiral animation
- **Embla Carousel** for testimonials
- **Heebo** font (Hebrew sans-serif from Google Fonts)

## Hosting & Deployment

- **GitHub:** https://github.com/StarKid12/keshet-website
- **Netlify:** Connected to GitHub repo, auto-deploys on push to `main`. Config in `netlify.toml` with `@netlify/plugin-nextjs`.
- **Supabase project:** `geblppjywwzqgenrbxlb` (Supabase dashboard for DB/auth/storage management)

## Environment Variables

Copy `.env.example` to `.env` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Same env vars must be set in Netlify dashboard (Site settings > Environment variables).

## Running Locally

```bash
npm install
npm run dev    # http://localhost:3000
```

## Project Structure

```
src/app/
├── page.tsx                    # Homepage (spiral hero + sections)
├── (public)/                   # Public pages (navbar + footer layout)
│   ├── about/, academics/, staff/, admissions/
│   ├── community/, contact/, blog/
├── (auth)/                     # Login, signup, pending-approval
├── (private)/                  # Authenticated area (sidebar layout)
│   ├── dashboard/, photos/, schedule/
│   ├── messages/, chat/
├── admin/                      # Admin panel
│   ├── users/, approved-emails/, messages/
```

Key component directories:
- `src/components/home/` - Homepage sections (HeroSpiral, PhilosophySection, etc.)
- `src/components/layout/` - Navbar, Footer, MobileMenu, Sidebar
- `src/components/ui/` - Button, Card, Input, Container, Skeleton

## RTL / Hebrew

Everything is RTL. Root layout has `dir="rtl" lang="he"`. Use Tailwind logical properties (`ps-*`, `pe-*`, `ms-*`, `me-*`, `text-start`, `text-end`). For absolute positioning that must be physical (not flipped by RTL), use inline `style={{ left: "50%" }}` instead of Tailwind `left-*` classes.

## Database

Schema in `supabase/migrations/001_initial_schema.sql`. Must be run in Supabase SQL editor.

**Tables:** profiles, approved_emails, classes, blog_posts, photo_albums, photos, schedules, messages, message_recipients, chat_messages

**Auth flow:**
1. User signs up with email/password
2. DB trigger `handle_new_user()` checks `approved_emails` table
3. If email found: auto-approved with pre-assigned role/class
4. If not found: created with `is_approved=false` → pending approval page
5. Admin approves via `/admin/users`

**Roles:** admin, teacher, parent, student. RLS policies enforce access per role.

## Key Files

- `src/components/home/HeroSpiral.tsx` - GSAP scroll-triggered rainbow spiral animation (Kehillah.org inspired). Uses inline `style` for positioning to avoid RTL issues with Tailwind.
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client (cookies-based)
- `src/hooks/useUser.ts` - Current user + profile hook
- `src/hooks/useChat.ts` - Realtime class chat hook
- `middleware.ts` - Auth session refresh + route protection
- `src/lib/constants.ts` - Nav items, rainbow colors, grade levels, day names

## Color Palette

Rainbow-themed (קשת = Rainbow). Defined in `globals.css` `@theme` block:
- **Primary:** warm amber/gold (`primary-50` to `primary-900`)
- **Rainbow accents:** `rainbow-red`, `rainbow-orange`, `rainbow-yellow`, `rainbow-green`, `rainbow-blue`, `rainbow-indigo`, `rainbow-violet`
- **Neutrals:** warm sand tones (`sand-50` to `sand-900`)

## Logos

- `public/images/logo.png` - Transparent background (for navbar, footer, sidebar)
- `public/images/logo-circle.png` - With circle background (for hero, navbar)

Source files in `manual/Keshet logo/` (not committed to git).

## Known Considerations

- Tailwind v4 converts `left-*` to logical properties in RTL, which flips positioning. Use inline `style` for physical positioning (e.g., centering SVGs).
- GSAP ScrollTrigger `pin: true` adds ~1500px of scroll space for the spiral animation on the homepage.
- The `rainbow-gradient bg-clip-text text-transparent` pattern renders as a visible gradient box (not clipped text) in some contexts. Prefer the actual logo image.
- Mobile menu uses `max-height` transition (not `translateY`) to avoid jump on open.
