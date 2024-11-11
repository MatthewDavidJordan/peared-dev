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

3. Set up your .env.local. Copy the .env.example then replace with real env variables

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

## API Documentation

Our API documentation is available at `/api-docs` when running the development server locally. This documentation is built using Swagger UI and provides:

- Detailed endpoint descriptions
- Request/response schemas
- Interactive API testing interface

You can access it at http://localhost:3000/api-docs (only available in development environment)

> **Note**: The API documentation is intentionally restricted to local development for security purposes and is not available in production.

## Project Structure

```
src/
├── app/                    # App Router directory
│   ├── api/               # API routes
│   ├── components/        # Shared components
│   └── lib/               # Utility functions
└── middleware.ts          # Next.js middleware
```

## Key Features & Implementation Notes

### Server Components

- By default, all components in `app/` are Server Components
- Client Components must be marked with `'use client'`
- Keep large dependencies in Server Components when possible

## Supabase Integration

### Generating Types

Run this command after Supabase schema changes:

```bash
npx supabase gen types --lang=typescript --project-id "qnnvkccawpctdlmehnbd" --schema public > src/types/supabase.ts
```

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

Before commiting any working branch, please make sure the following works successfully:

1. Clear any existing .next/ folder

```bash
rm -rf .next/
```

2. Create a production build

```bash
npm run build
```

3. Run the production build

```bash
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
