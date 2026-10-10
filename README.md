# ⚡ eFootball Mobile Ghana Championship — Tournament Platform

A real, production-ready, reusable multi-tournament management web application built for the online eFootball Mobile esports community in Ghana.

Features a clean, modern, high-contrast visual design inspired by Ghanaian digital services (NexaData), with dark obsidian badges, emerald & gold accents, Twitch live broadcasting, dynamic single-elimination brackets, and a complete administrator portal.

---

## 🌟 Key Features

### 1. Multi-Tournament Engine (Reusable for Unlimited Competitions)
- **Create Tournament Wizard**: 5-step guided wizard for setting up tournaments with customizable capacity (4, 8, 16, 32, 64 players), rules, and non-cash rewards.
- **Tournament Templates**: Save existing configurations as blueprints to spin up new seasons in seconds without copying old participants or results.
- **Independent Tournament Data**: Every tournament has its own isolated bracket, registrations, match schedule, streams, and announcements.
- **Tournament Lifecycle**: `DRAFT` ➔ `REGISTRATION_OPEN` ➔ `REGISTRATION_CLOSED` ➔ `READY` ➔ `LIVE` ➔ `COMPLETED` ➔ `ARCHIVED`.

### 2. Free-First Twitch Streaming
- **Embedded Twitch Player**: Spectators across Ghana watch verified live mobile broadcasts directly on the website with zero paywalls.
- **Strict Hostname Verification**: Automatically includes `parent=localhost` and production domains (e.g. `NEXT_PUBLIC_APP_DOMAIN`, `VERCEL_URL`) to satisfy Twitch embed security requirements.
- **Live Arena Directory**: Live Now, Upcoming, and Completed match filters. Matches are only marked "LIVE" when genuinely verified by referees.

### 3. Knockout Tournament Brackets
- **Single-Elimination Generator**: Automatic bracket construction with seeding and bye handling.
- **Winner Advancement**: Recording verified match scores advances the winner into the next round automatically.
- **Responsive Bracket Canvas**: Scrollable canvas on desktop and mobile.

### 4. Player & Registration Portal
- **Free Registration**: 100% free to enter. No paid entry, wagering, gambling, or deposits.
- **Validation**: Enforces capacity limits, prevents duplicate player entries, and validates eFootball user IDs.
- **Reusable Player Accounts**: Player profiles preserve competition history across seasons.

### 5. Administrative Command Center (`/admin`)
- **Dashboard Overview**: Metrics on total registrations, approved players, live broadcasts.
- **Registration Management**: Approve/reject applicant registrations.
- **Match Manager**: Input verified scores, declare winners, and update fixture states.
- **Twitch Stream Manager**: Associate channels with fixtures, verify status, and mark live.
- **Announcements**: Broadcast urgent notices and pinned alerts.
- **Audit Logs**: Immutable log of administrative actions.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 10+

### Installation & Local Run
```bash
# 1. Install dependencies
npm install

# 2. Run automated tests
npm test

# 3. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🟣 Twitch Streaming Setup Guide

For players on Android and iOS:
1. Open a free Twitch account at [twitch.tv](https://twitch.tv).
2. Download a supported mobile broadcasting application:
   - **Android**: Twitch App (using the "Stream Games" feature), Streamlabs Mobile, or Prism Live Studio.
   - **iOS**: Twitch App or Streamlabs Mobile utilizing iOS Screen Broadcast.
3. Broadcast eFootball gameplay and submit your channel username to tournament administrators.
4. The administrator associates the channel in the **Admin Dashboard > Twitch Streams** and marks it `LIVE`.
5. The live stream will immediately appear in the **Live Arena** and the dedicated **Match Viewer**.

---

## 📁 Project Architecture

```
f:\Zuas/
├── data/
│   └── db.json                    # Persistent database storage on disk F:
├── scripts/
│   └── run-tests.ts               # Verification test suite
├── src/
│   ├── app/
│   │   ├── page.tsx               # Homepage
│   │   ├── tournament/            # Active tournament overview
│   │   ├── tournaments/           # All tournaments directory
│   │   │   └── [slug]/            # Dedicated tournament routes (bracket, live, register)
│   │   ├── register/              # Player registration
│   │   ├── live/                  # Live Arena (Twitch hub)
│   │   ├── bracket/               # Single-elimination bracket
│   │   ├── matches/[matchId]/     # Dedicated match viewing room
│   │   ├── players/               # Player directory
│   │   ├── rules/                 # Official regulations
│   │   ├── contact/               # Organizer contact
│   │   ├── admin/                 # Administration portal
│   │   └── api/                   # REST API routes
│   ├── components/
│   │   ├── Navbar.tsx             # NexaData-style navigation
│   │   ├── Footer.tsx             # Clean esports footer
│   │   ├── TwitchEmbed.tsx        # Twitch player embed with parent host config
│   │   ├── BracketTree.tsx        # Knockout bracket tree
│   │   └── AdminSidebar.tsx       # Administrative sidebar
│   └── lib/
│       ├── types.ts               # TypeScript data models
│       ├── db.ts                  # Persistent data storage & logic
│       ├── twitch.ts              # Twitch parent & channel parser
│       └── bracketGenerator.ts    # Single-elimination & advancement algorithms
└── tailwind.config.ts             # NexaData-inspired clean aesthetic tokens
```

---

## 🧪 Automated Tests
Run tests with:
```bash
npm test
```
The test suite validates:
- Twitch channel parsing & regex security
- Twitch embed URL generation with safe parent hostnames
- Bracket generation for power-of-two and byes
- Winner advancement in single-elimination trees
- Multi-tournament data isolation
- Duplicate registration prevention
- Tournament duplication clean slate

---

## 🌐 Production Deployment (Vercel)

1. Push code to your GitHub repository:
   ```bash
   git add .
   git commit -m "eFootball Mobile Ghana Championship platform"
   git push origin main
   ```
2. Import the repository in [Vercel](https://vercel.com).
3. Set the environment variable:
   - `NEXT_PUBLIC_APP_DOMAIN=your-project.vercel.app`
4. Deploy! The application will build and deploy cleanly.
