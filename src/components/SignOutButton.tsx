'use client';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function SignOutButton() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUser(user);
    })();
  }, []);
  if (!user) return null;
  return (
    <Button variant="secondaryLink" className="font-light" onClick={() => supabase.auth.signOut()}>
      Sign Out
    </Button>
  );
}
