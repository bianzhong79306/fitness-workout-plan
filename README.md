# FitPlan Pro

A personalized fitness training plan platform built with Next.js 15, TypeScript, and Cloudflare D1.

## Features

- 🏋️ **100+ Exercises**: Comprehensive exercise library with detailed instructions
- 📋 **10 Workout Plans**: Pre-built plans for different goals (muscle gain, fat loss, strength)
- ⏱️ **Workout Timers**: Stopwatch, countdown, and HIIT timers
- 📊 **Progress Tracking**: Track your workouts and monitor progress
- 🌍 **i18n**: Bilingual support (English/Chinese)
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Authentication**: next-auth v5 (Google OAuth)
- **Database**: Cloudflare D1 (SQLite)
- **Internationalization**: next-intl
- **Deployment**: Cloudflare Pages

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### Environment Variables

Create a `.env` file with:

```env
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
AUTH_SECRET=your-auth-secret-min-32-chars
```

### Database Setup

1. Create a D1 database in Cloudflare dashboard
2. Update `wrangler.toml` with your database ID
3. Run the SQL in `schema.sql` to create tables

### Deployment

```bash
# Build for Cloudflare Pages
pnpm pages:build

# Deploy
pnpm deploy
```

## Project Structure

```
src/
├── app/
│   ├── [locale]/           # Internationalized routes
│   │   ├── exercises/      # Exercise library
│   │   ├── plans/          # Workout plans
│   │   ├── timers/         # Workout timers
│   │   ├── dashboard/      # User dashboard
│   │   └── auth/           # Authentication
│   └── api/                # API routes
├── components/
│   ├── ui/                 # UI components
│   └── layout/             # Layout components
├── data/
│   ├── exercises.ts        # 100+ exercises
│   └── workout-plans.ts    # 10 workout plans
├── lib/                    # Utilities
├── types/                  # TypeScript types
└── i18n/                   # Internationalization config
```

## License

MIT