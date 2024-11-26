'use client';

import type { Profile, Student } from '@/lib/queries';
import { createSupabaseClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  student: Student | null;
  fetchProfile: () => Promise<Profile | null>;
  fetchStudent: () => Promise<Student | null>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// async function getStudent() {
//   'use server';
//   const supabase = createSupabaseClient();
//   await supabase.from('students').select('*').eq('profile_id', supabase.auth.user()?.id).single();
// }

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const supabase = createSupabaseClient();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  const fetchProfile = useCallback(
    async (overrideUser?: User) => {
      const id = overrideUser?.id ?? user?.id;
      if (!id) return null;

      const profile = await supabase.from('profiles').select('*').eq('user_id', id).single();
      setProfile(profile.data ?? null);
      return profile.data ?? null;
    },
    [supabase, user?.id],
  );

  const fetchStudent = useCallback(
    async (overrideProfileId?: number) => {
      const profileId = overrideProfileId ?? profile?.id;
      if (!profileId) return null;

      const student = await supabase
        .from('students')
        .select('*')
        .eq('profile_id', profileId)
        .single();
      setStudent(student.data ?? null);
      return student.data ?? null;
    },
    [profile?.id, supabase],
  );

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);

        const profile = await fetchProfile(session.user);
        if (!profile) return;

        fetchStudent(profile.id);
      } else {
        setUser(null);
        setProfile(null);
        setStudent(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [fetchProfile, fetchStudent, supabase]);

  return (
    <AuthContext.Provider value={{ user, profile, student, fetchProfile, fetchStudent }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
