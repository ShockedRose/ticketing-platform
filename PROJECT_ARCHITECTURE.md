# CNCG Panama Ticketing Platform

---

## Related Docs
- [DATA_MODEL.md](DATA_MODEL.md)
- [USE_CASES_DATA_MAP.md](USE_CASES_DATA_MAP.md)

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started (Local Development)](#getting-started-local-development)
4. [Available Scripts](#available-scripts)
5. [Project Structure](#project-structure)
6. [Routes](#routes)
7. [Component Architecture](#component-architecture)
   - [Landing Page Components](#landing-page-components)
   - [Registration Flow Components](#registration-flow-components)
8. [Ticket Tiers](#ticket-tiers)
9. [Registration Flow (3-Step Wizard)](#registration-flow-3-step-wizard)
10. [Payment Integration (PagueloFacil)](#payment-integration-paguelofacil)
11. [Design System](#design-system)
12. [Configuration Files](#configuration-files)
13. [Data Configuration Quick Reference](#data-configuration-quick-reference)
14. [Deployment](#deployment)
15. [Common Maintenance Tasks](#common-maintenance-tasks)
16. [Troubleshooting](#troubleshooting)
17. [Known Limitations](#known-limitations)

---

## Project Overview

This is a single-page event website with a separate multi-step registration flow. The site is structured as:

1. **Landing Page** (`/`) -- Event info, speakers, schedule, sponsors, and a sticky ticket widget.
2. **Registration Page** (`/register`) -- A 3-step wizard: Pick Tickets, Attendee Details, Payment.

There is **no database or backend**. All event data (speakers, schedule, tickets, sponsors) is hardcoded in the component files. Payment is handled externally via PagueloFacil redirect. No environment variables are required.

---

## Tech Stack

| Technology       | Version   | Purpose                                    |
| ---------------- | --------- | ------------------------------------------ |
| Next.js          | 16.1.6    | App Router, SSR, file-based routing        |
| React            | 19.x      | UI rendering                               |
| TypeScript       | 5.7.3     | Type safety                                |
| Tailwind CSS     | 3.4.17    | Utility-first styling                      |
| shadcn/ui        | latest    | Pre-built accessible UI components         |
| Radix UI         | various   | Headless accessible primitives (under shadcn) |
| Lucide React     | 0.544.x   | SVG icon library                           |
| next-themes      | 0.4.x     | Theme provider (dark mode support)         |
| tailwindcss-animate | 1.0.x  | Tailwind animation utilities               |

---

## Getting Started (Local Development)

### Prerequisites

| Requirement  | Minimum  | Recommended       |
| ------------ | -------- | ------------------ |
| Node.js      | 18.x     | 20 LTS or 22 LTS  |
| npm          | 9.x      | 10.x (ships with Node 20+) |
| Git          | any      | latest             |

> You can also use **yarn** (`yarn install` / `yarn dev`) or **pnpm** (`pnpm install` / `pnpm dev`) instead of npm. All commands below use npm.

### Step 1 -- Clone the repository

```bash
git clone <repo-url>
cd kcd-Panama-2026
```

### Step 2 -- Install dependencies

```bash
npm install
```

This installs all production and dev dependencies listed in `package.json`. There are approximately 50 packages (mostly Radix UI primitives for shadcn/ui). The install typically takes 30-60 seconds.

### Step 3 -- Start the development server

```bash
npm run dev
```

Next.js 16 uses **Turbopack** by default, so the dev server starts in under 2 seconds.

Open your browser and go to:

```
http://localhost:3000        -- Landing page
http://localhost:3000/register  -- Registration flow
```

The dev server supports hot module replacement (HMR) -- changes to any `.tsx`, `.ts`, or `.css` file will be reflected instantly in the browser without a full reload.

### Step 4 -- Build for production (optional)

```bash
npm run build    # Creates an optimized production build in .next/
npm run start    # Serves the production build on http://localhost:3000
```

### No environment variables needed

This project has **zero environment variables**. There is no database, no API keys, and no secrets. The PagueloFacil payment URL is a public checkout link hardcoded in the source code.

---

## Available Scripts

| Command         | Description                                       |
| --------------- | ------------------------------------------------- |
| `npm run dev`   | Start the development server with Turbopack HMR   |
| `npm run build` | Create an optimized production build               |
| `npm run start` | Serve the production build locally                 |
| `npm run lint`  | Run ESLint on the entire project                   |

---

## Project Structure

```
/
├── app/
│   ├── globals.css              # Global styles and CSS design tokens
│   ├── layout.tsx               # Root layout (Inter font, metadata, viewport)
│   ├── page.tsx                 # Landing page (assembles all sections)
│   └── register/
│       └── page.tsx             # Registration page (renders RegistrationFlow)
│
├── components/
│   ├── navbar.tsx               # Sticky top navigation with mobile hamburger
│   ├── hero-section.tsx         # Hero banner image, event title, date/venue
│   ├── ticket-widget.tsx        # Sticky sidebar ticket selector with countdown
│   ├── about-section.tsx        # Event description paragraphs
│   ├── speakers-section.tsx     # 6-card speaker grid
│   ├── schedule-section.tsx     # Vertical timeline with 12 schedule slots
│   ├── sponsors-section.tsx     # Tiered sponsor logos (Platinum/Gold/Silver)
│   ├── footer.tsx               # Footer with links and social icons
│   ├── registration-flow.tsx    # Full 3-step registration wizard (878 lines)
│   ├── theme-provider.tsx       # next-themes provider wrapper
│   └── ui/                      # shadcn/ui component library (~50 components)
│
├── hooks/
│   ├── use-mobile.tsx           # Mobile breakpoint detection hook
│   └── use-toast.ts             # Toast notification hook
│
├── lib/
│   └── utils.ts                 # cn() utility for Tailwind class merging
│
├── public/
│   └── images/
│       └── hero-banner.jpg      # Generated conference hero image
│
├── next.config.mjs              # Next.js config (unoptimized images, TS loose)
├── tailwind.config.ts           # Tailwind theme + shadcn integration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

---

## Routes

| Route       | File                      | Description                           |
| ----------- | ------------------------- | ------------------------------------- |
| `/`         | `app/page.tsx`            | Main event landing page               |
| `/register` | `app/register/page.tsx`   | Multi-step ticket registration wizard |

---

## Component Architecture

### Landing Page Components

The landing page (`app/page.tsx`) uses a **two-column layout**:

- **Left column (65%)** scrolls through content sections
- **Right column (35%)** has a sticky ticket widget

```
Navbar (sticky top)
├── Main Content (max-w-7xl, two-column flex)
│   ├── Left Column (65%)
│   │   ├── HeroSection       - Banner image + event title
│   │   ├── AboutSection       - #about anchor
│   │   ├── SpeakersSection    - #speakers anchor
│   │   ├── ScheduleSection    - #schedule anchor
│   │   └── SponsorsSection    - #sponsors anchor
│   └── Right Column (35%, sticky)
│       └── TicketWidget       - Countdown + ticket selector + "Register Now"
└── Footer
```

**Navbar** (`components/navbar.tsx`)
- Sticky top bar with backdrop blur
- Logo ("K" badge + "KCD Panama"), nav links (About, Speakers, Schedule, Sponsors), Login button
- Responsive: hamburger menu on mobile (< md breakpoint)
- Nav links are anchor links (`#about`, `#speakers`, etc.) for smooth scrolling

**HeroSection** (`components/hero-section.tsx`)
- Displays `/images/hero-banner.jpg` with a dark overlay
- "In-Person Event" badge overlaid on the image
- Event title, date (Calendar icon), and venue (MapPin icon)

**TicketWidget** (`components/ticket-widget.tsx`)
- Client component with a custom `useCountdown` hook
- Countdown timer targeting `2026-02-21` (renders Days/Hrs/Mins)
- Two ticket types: Early Bird Pass (500 INR) and Regular Pass (1000 INR)
- Quantity selectors (+/- buttons, max 10 per type)
- Feature list, dynamic total, "Register Now" button linking to `/register`
- Social proof: "350+ Attendees expected"

**Important:** The `useCountdown` hook accepts a `number` (milliseconds) to avoid re-render loops. The target date is stored as a module-level constant `EVENT_DATE_MS`.

**AboutSection** (`components/about-section.tsx`)
- Static descriptive text about KCD Panama and CNCF

**SpeakersSection** (`components/speakers-section.tsx`)
- 6 speakers defined in `SPEAKERS` array
- Displayed as cards in a responsive grid (1/2/3 columns)
- Each card: Avatar with initials, name, title, company

**ScheduleSection** (`components/schedule-section.tsx`)
- 12 schedule items in `SCHEDULE` array
- Rendered as a vertical timeline with colored dots:
  - `keynote` = filled primary dot
  - `break` = muted dot
  - `talk` = outlined primary dot
- Shows time, title, and speaker name

**SponsorsSection** (`components/sponsors-section.tsx`)
- Three tiers: Platinum (2), Gold (3), Silver (4)
- Sized differently per tier: `lg`, `md`, `sm`
- Currently uses abbreviation text; replace with actual logos when available

**Footer** (`components/footer.tsx`)
- Logo, "CNCF community event" tagline
- Links: Code of Conduct, Contact, CNCF
- Social icons: Twitter, LinkedIn, GitHub

---

### Registration Flow Components

The entire registration flow lives in `components/registration-flow.tsx` (exported as `<RegistrationFlow />`). It is a **client component** rendered at `/register`.

#### 3-Step Wizard State

```typescript
currentStep: 0 | 1 | 2          // Pick Tickets, Attendee Details, Payment
selectedTickets: Record<string, number>   // ticket id -> quantity (0 or 1)
attendee: AttendeeData           // form fields for step 2
discountCode: string             // discount code input
```

#### Internal Sub-Components

| Component             | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `StepSidebar`         | Vertical stepper (left sidebar, hidden on mobile)      |
| `TicketCard`          | Individual ticket tier card with Add/Sold Out/Coming Soon |
| `CartSidebar`         | Right sidebar with ticket summary, discount code, proceed button |
| `AttendeeDetailsStep` | Full attendee form (Name, Email, Country, Job Title, Company, Industry, Org Type, CNCF consent, WhatsApp opt-in) |
| `PaymentStep`         | Payment confirmation with PagueloFacil redirect button |
| `useSessionTimer`     | 10-minute countdown hook that starts on step 2         |

#### Layout

```
Header (back arrow + "KCD Panama 2026" + event date + session timer)
├── Left: StepSidebar (vertical stepper icons)
├── Center: Step content (tickets / form / payment)
├── Right: CartSidebar (sticky, summary + discount + proceed)
└── Mobile: Sticky bottom bar with total + proceed button
Footer ("Powered By KONFHUB")
```

---

## Ticket Tiers

Defined in `TICKET_TIERS` inside `components/registration-flow.tsx`:

| Tier    | Price (INR) | Status       | Notes                              |
| ------- | ----------- | ------------ | ---------------------------------- |
| Alpha   | 2,000       | `sold-out`   | Republic Day Special, 26% OFF, coupon REPUBLIC26 |
| Beta    | 2,500       | `available`  | Currently purchasable              |
| GA      | 3,000       | `coming-soon`| Not yet available                  |

**To change ticket availability**, edit the `status` field of the relevant tier object. Valid values: `"sold-out"`, `"available"`, `"coming-soon"`.

Each ticket includes the same features (defined in `TICKET_FEATURES`):
- Access to all talks and tracks
- Sponsor booths (demos, swag, and jobs)
- Event goodies
- Meals and cafe access
- Networking with speakers and attendees
- Access to job openings

---

## Registration Flow (3-Step Wizard)

### Step 1: Pick Tickets
- User sees all three ticket tiers as cards
- Only `available` tickets can be added (toggle on/off)
- Cart sidebar on the right shows selection, or "no tickets" empty state

### Step 2: Attendee Details
- Full form with fields matching KonfHub's registration:
  - Name*, Email*, Country* (dropdown), Job Title*, Company/Org/University*, Industry* (dropdown), Organization type* (dropdown)
  - CNCF Communications consent checkbox (with full legal text)
  - WhatsApp updates opt-in checkbox
  - Buyer Details section
- All fields marked `*` are required for validation
- 10-minute session timer appears in the header (turns red under 2 minutes)
- Cart sidebar now shows ticket summary with subtotal, total, and processing fee notice

### Step 3: Payment
- Shows total amount
- "Pay with PagueloFacil" button redirects to external checkout URL
- Back button returns to Step 2

---

## Payment Integration (PagueloFacil)

Payment is handled via **PagueloFacil** external redirect:

```
URL: https://checkout.paguelofacil.com/xopatech/26011f9b
```

This URL is defined as `PAGUELO_FACIL_URL` at the top of `components/registration-flow.tsx`.

**How it works:**
1. User completes Step 1 (ticket selection) and Step 2 (attendee form)
2. On Step 3, clicking "Pay with PagueloFacil" opens the external checkout in a new tab
3. The same URL is used in the sidebar "Pay Now" button and the mobile sticky footer

**To update the payment URL**, change the `PAGUELO_FACIL_URL` constant on line 30 of `components/registration-flow.tsx`.

> **Note:** There is currently no server-side integration with PagueloFacil. The attendee data filled in Step 2 is only stored in client-side React state and is not sent to a backend. To persist registrations, you would need to add an API route that saves the data to a database before redirecting to payment.

---

## Design System

### Colors (Indigo-based "Cloud Native Blue" theme)

All colors are defined as CSS custom properties in `app/globals.css`:

| Token                | HSL Value         | Usage                     |
| -------------------- | ----------------- | ------------------------- |
| `--background`       | 210 40% 98%       | Page background (light slate) |
| `--foreground`       | 222 47% 11%       | Primary text              |
| `--card`             | 0 0% 100%         | Card/panel backgrounds    |
| `--primary`          | 239 84% 67%       | Indigo-600 brand color    |
| `--primary-foreground` | 0 0% 100%       | White text on primary     |
| `--secondary`        | 215 20% 95%       | Light grey backgrounds    |
| `--muted-foreground` | 215 16% 47%       | Secondary/subtle text     |
| `--destructive`      | 0 84% 60%         | Error/warning states      |
| `--border`           | 214 32% 91%       | Borders and dividers      |

### Typography

- **Font:** Inter (Google Fonts), loaded in `app/layout.tsx`
- Applied globally via `font-sans` class on `<body>`

### Border Radius

- `--radius: 0.625rem` (10px), used by all shadcn/ui components

### Breakpoints

Standard Tailwind breakpoints are used:
- `sm`: 640px
- `md`: 768px (mobile menu breakpoint, stepper visibility)
- `lg`: 1024px (two-column layout, sidebar visibility)

---

## Configuration Files

Understanding these config files is important before making changes:

### `next.config.mjs`

```js
const nextConfig = {
  typescript: { ignoreBuildErrors: true },  // Allows deploy even with TS warnings
  images: { unoptimized: true },            // Skips Next.js image optimization (no external loader)
}
```

- `ignoreBuildErrors: true` -- The project will build and deploy even if there are TypeScript errors. This is useful during rapid development but should be set to `false` for stricter production builds.
- `unoptimized: true` -- All images are served as-is. This avoids needing a Vercel or external image optimization service. If you deploy to Vercel, you can remove this to enable automatic image optimization.

### `tailwind.config.ts`

- Uses the standard **shadcn/ui** Tailwind configuration
- All color tokens are mapped to CSS custom properties defined in `app/globals.css` (e.g., `primary` maps to `hsl(var(--primary))`)
- Border radius is controlled by `--radius` CSS variable
- Includes `tailwindcss-animate` plugin for animation utilities (accordion open/close, etc.)
- Content paths scan `app/`, `components/`, and `pages/` directories for class names

### `tsconfig.json`

- Target: ES6, Module: ESNext with bundler resolution
- Path alias: `@/*` maps to the project root (e.g., `import { cn } from "@/lib/utils"`)
- `strict: true` is enabled
- Includes the `.next/types` directory for auto-generated Next.js types

### `app/globals.css`

- All design tokens (colors, radius) are defined as CSS custom properties in the `:root` selector
- Only a light theme is defined (no `.dark` class). To add dark mode, add a `.dark {}` block with inverted token values
- shadcn/ui components reference these tokens automatically via the Tailwind config

---

## Data Configuration Quick Reference

All event data is hardcoded in the component files. Here is where to find and update each data type:

| Data              | File                               | Variable/Array          |
| ----------------- | ---------------------------------- | ----------------------- |
| Navigation links  | `components/navbar.tsx`            | `NAV_LINKS`             |
| Event date        | `components/ticket-widget.tsx`     | `EVENT_DATE_MS`         |
| Ticket types (widget) | `components/ticket-widget.tsx` | `TICKETS`               |
| Ticket tiers (registration) | `components/registration-flow.tsx` | `TICKET_TIERS` |
| Ticket features   | `components/registration-flow.tsx` | `TICKET_FEATURES`       |
| Speakers          | `components/speakers-section.tsx`  | `SPEAKERS`              |
| Schedule          | `components/schedule-section.tsx`  | `SCHEDULE`              |
| Sponsors          | `components/sponsors-section.tsx`  | `SPONSORS`              |
| Countries list    | `components/registration-flow.tsx` | `COUNTRIES`             |
| Industries list   | `components/registration-flow.tsx` | `INDUSTRIES`            |
| Organization types| `components/registration-flow.tsx` | `ORG_TYPES`             |
| Payment URL       | `components/registration-flow.tsx` | `PAGUELO_FACIL_URL`     |
| Social links      | `components/footer.tsx`            | `SOCIAL_LINKS`          |
| Footer links      | `components/footer.tsx`            | `FOOTER_LINKS`          |
| Session timer     | `components/registration-flow.tsx` | `useSessionTimer` (600s = 10 min) |

---

## Deployment

This project is designed for deployment on **Vercel**:

1. Push the code to a GitHub repository
2. Connect the repository to Vercel
3. Vercel auto-detects Next.js and deploys

No environment variables are required since there is no backend or API integration.

### Alternative: Manual deployment

```bash
npm run build
npm run start
```

Or use the output for static export if needed.

---

## Common Maintenance Tasks

### Add a new speaker

Edit `SPEAKERS` array in `components/speakers-section.tsx`:

```typescript
{ name: "New Speaker", title: "Role", company: "Company", initials: "NS" }
```

### Change ticket availability

Edit the `status` field in `TICKET_TIERS` inside `components/registration-flow.tsx`:

```typescript
// Options: "sold-out" | "available" | "coming-soon"
status: "available" as const,
```

### Update the event date

1. Update `EVENT_DATE_MS` in `components/ticket-widget.tsx`
2. Update the date text in `components/hero-section.tsx`
3. Update the date text in `components/registration-flow.tsx` (header line ~708)
4. Update metadata in `app/layout.tsx`

### Add sponsor logos

Replace the abbreviation-based `SponsorLogo` component in `components/sponsors-section.tsx` with actual `<img>` tags pointing to logo files placed in `public/images/sponsors/`.

### Modify the registration form fields

All form fields are in the `AttendeeDetailsStep` function inside `components/registration-flow.tsx`. To add a field:

1. Add the field to the `AttendeeData` interface
2. Add a default value in the `useState` initializer inside `RegistrationFlow`
3. Add the input element inside `AttendeeDetailsStep`
4. Update `isAttendeeValid` if the field is required

### Change the session timer duration

Inside `components/registration-flow.tsx`, find the `useSessionTimer` hook and change the initial value:

```typescript
const [secondsLeft, setSecondsLeft] = useState(600) // Change 600 to desired seconds
```

---

## Troubleshooting

### `npm install` fails with peer dependency errors (ERESOLVE)

The most common cause is a version conflict between `date-fns` and `react-day-picker`. The `react-day-picker@8.x` package requires `date-fns ^2.28.0 || ^3.0.0`. If `package.json` has `date-fns` v4, npm will refuse to install.

**Fix:** Ensure `package.json` uses `date-fns` v3:

```json
"date-fns": "^3.6.0"
```

If you still see warnings from other Radix UI packages (these are non-breaking), you can force install with:

```bash
npm install --legacy-peer-deps
```

### Port 3000 is already in use

Another process is using port 3000. Either stop it or run on a different port:

```bash
npm run dev -- --port 3001
```

### "Maximum update depth exceeded" error in TicketWidget

This was a known bug that has been fixed. The `useCountdown` hook previously accepted a `Date` object which caused a new reference on every render. It now accepts a stable `number` (milliseconds). If you see this error, ensure `EVENT_DATE_MS` is a module-level constant:

```typescript
// Correct (module-level constant)
const EVENT_DATE_MS = new Date("2026-02-21").getTime()

// Wrong (creates new Date on every render)
const { days } = useCountdown(new Date("2026-02-21"))
```

### Styles not loading or looking broken

1. Make sure `app/globals.css` is imported in `app/layout.tsx`
2. Verify `tailwind.config.ts` exists and has the correct content paths
3. Try deleting `.next/` and restarting: `rm -rf .next && npm run dev`

### Images not displaying

The hero banner image lives at `public/images/hero-banner.jpg`. Static files in `public/` are served from the root URL (`/images/hero-banner.jpg`). If you replace or add images, make sure they are inside the `public/` directory.

### Build warnings about TypeScript

The `next.config.mjs` has `typescript.ignoreBuildErrors: true`, so TS errors will not block the build. To enforce strict type checking during builds, set it to `false`:

```js
typescript: { ignoreBuildErrors: false }
```

---

## Known Limitations

1. **No backend persistence** - Attendee data is stored only in React state and lost on page refresh or navigation away. Consider adding a database (Supabase, Neon, etc.) for production use.
2. **No payment callback** - PagueloFacil is a simple redirect with no webhook or callback integration. Payment confirmation is not tracked in the app.
3. **Static data** - All event data (speakers, schedule, sponsors) is hardcoded. For dynamic content, move data to a CMS or database.
4. **No authentication** - The Login button in the navbar is non-functional. Implement auth if admin features or user accounts are needed.
5. **Speaker avatars** - Currently using initials via AvatarFallback. Replace with actual photos by adding `<AvatarImage>` with proper `src` attributes.
6. **Sponsor logos** - Currently abbreviation text boxes. Replace with actual brand logos.
7. **Social and footer links** - Currently `href="#"` placeholders. Update with real URLs.
