# Poke Waitlist

This is a Next.js App Router application with Supabase for waitlist persistence and Vercel as the deployment target.

- Keep Supabase access in server-only modules and Server Actions.
- Use the Supabase anon key with Row Level Security. Never use a service-role key in browser code or a `NEXT_PUBLIC_*` variable.
- Database schema changes belong in `supabase/migrations/`; the waitlist table must remain insert-only for anonymous users.
- Configure local values in `.env.local` and production values in Vercel Project Settings. Do not commit credentials.
- Run `pnpm exec tsc --noEmit` and `pnpm build` to verify changes.
- Keep the existing landing-page design and signup behavior unless the task requires changing them.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js 16 guidance

Before using unfamiliar Next.js APIs, consult the relevant guide under `node_modules/next/dist/docs/`. Next.js may regenerate this section when the development server starts.
<!-- END:nextjs-agent-rules -->
