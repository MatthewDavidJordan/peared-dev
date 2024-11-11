# Welcome to peared!

Peared is a platform that allows high school students and college students to schedule virtual coffee chats.

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/MatthewDavidJordan/peared-dev.git
cd peared
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="your_supabase_project_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_supabase_service_role_key"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GOOGLE_REFRESH_TOKEN="your_google_refresh_token"

# Application Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

4. Start the development server

```bash
npm run dev
```

## Project Structure

```
src/
├── app/                    # App Router directory
│   ├── api/               # API routes
│   ├── (auth)/            # Auth-related routes
│   ├── components/        # Shared components
│   ├── lib/               # Utility functions
│   └── providers/         # Context providers
├── middleware.ts          # Next.js middleware
└── types/                 # TypeScript types
```

## Key Features & Implementation Notes

### Server Components

- By default, all components in `app/` are Server Components
- Client Components must be marked with `'use client'`
- Keep large dependencies in Server Components when possible

### Data Fetching

```typescript
// Example of Server Component data fetching
async function Page() {
  const data = await fetchData()
  return <main>{/* ... */}</main>
}
```

### Server Actions

- Located in `app/actions/`
- Used for form submissions and data mutations

```typescript
'use server';
async function submitForm(data: FormData) {
  // ...
}
```

### Route Handlers

- API routes in `app/api/`

```typescript
// app/api/example/route.ts
export async function GET() {
  return Response.json({ data: 'example' });
}
```

## Supabase Integration

### Generating Types

Run this command after Supabase schema changes:

```bash
npx supabase gen types --lang=typescript --project-id "qnnvkccawpctdlmehnbd" --schema public > src/types/supabase.ts
```

## Environment Setup

### Required Environment Variables

#### Supabase Configuration

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

#### Google OAuth Configuration

- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REFRESH_TOKEN`: Google refresh token for continuous authentication

#### Application Configuration

- `NEXT_PUBLIC_BASE_URL`: Base URL for your application (use `http://localhost:3000` for local development)

## Styling

- Tailwind CSS for utility-first styling
- CSS Modules for component-specific styles
- shadcn/ui for component library

## Authentication

- Supabase Auth via OTP

## Development Workflow

### Running the Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm start
```

## Common Issues & Solutions

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Clean install: `rm -rf node_modules && npm install`

### TypeScript Errors

- Run type check: `npm run type-check`
- Update Supabase types after schema changes

## Useful Commands

```bash
# Development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Generate Supabase types
npm run generate-types
```

## Resources

- [Next.js App Router Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
