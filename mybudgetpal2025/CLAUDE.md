# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Run the app (recommended — starts both DB and web app):**
```
docker compose up
```

**Run locally without Docker (requires a running Postgres instance):**
```
npm run dev
```

**After editing `prisma/schema.prisma`:**
```
npx prisma generate
npx prisma migrate dev
```

**Lint:**
```
npm run lint
```

## Architecture

### Data Flow
All data mutations go through **Server Actions** in `lib/actions.js` — never through API routes or client-side fetch. The actions call Prisma directly and call `revalidatePath('/dashboard')` at the end to bust the Next.js cache and refresh the UI.

### Authentication
NextAuth v5 is configured in `app/auth.js`. It exports `{ handlers, auth, signIn, signOut }`. The `auth()` function is used in Server Components and Server Actions to get the current session. JWT strategy is used — session tokens are not stored in the DB. Google OAuth is fully wired in the config but commented out pending real credentials.

### Database Access
Prisma client is a singleton in `lib/prisma.js`, using the `@prisma/adapter-pg` connection pool adapter (required for Prisma 7). The generated client lives in `src/generated/` (not the default location). Always import from `@/lib/prisma`, never instantiate PrismaClient directly.

### Dashboard & Filtering
`app/dashboard/page.js` is a Server Component. Category filtering is done server-side via URL search params (`?category=FOOD`). Passing `undefined` to Prisma's `categoryType` filter returns all records — this is intentional and how the "ALL" filter works.

### Route Structure
Pages under `app/dashboard/` (expenseForm, deleteExpense, editExpense) are UI components rendered inside the dashboard, not standalone routes — they're named `page.js` but imported directly as components.

## Key Constraints

- **CategoryType enum** values must be uppercase: `FOOD`, `RENT`, `ENTERTAINMENT`, `OTHER`. `actions.js` calls `.toUpperCase()` on form input to enforce this.
- **Prisma client output path** is `src/generated/` (set in `schema.prisma`). Run `npx prisma generate` after any schema change.
- **`password` field on User is optional** (`String?`) to support future Google OAuth users who won't have a password.
- All expense mutations validate `session.user.id` and scope the Prisma query to that `userId` for security.
