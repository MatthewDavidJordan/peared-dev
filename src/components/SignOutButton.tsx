'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function SignOutButton() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Button variant="secondaryLink" className="font-light" onClick={() => supabase.auth.signOut()}>
      Sign Out
    </Button>
  );
}
