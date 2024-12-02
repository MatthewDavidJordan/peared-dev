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
  createStudent: (userId: string) => Promise<Student>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

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

  const createStudent = useCallback(async (userId: string): Promise<Student> => {
    const response = await fetch('/api/student', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create student');
    }

    const student = await response.json();
    setStudent(student);
    return student;
  }, []);

  const signOut = useCallback(() => {
    supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setStudent(null);
  }, [supabase.auth]);

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
    <AuthContext.Provider
      value={{ user, profile, student, fetchProfile, fetchStudent, createStudent, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
