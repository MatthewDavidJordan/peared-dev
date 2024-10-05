import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database-types';

// Create the typed Supabase client
const supabase: SupabaseClient<Database> = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Type definitions for custom tables
export type Advisor = Database['public']['Tables']['advisors']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type College = Database['public']['Tables']['schools']['Row'];
export type Availability = Database['public']['Tables']['availability']['Row'];

// Supabase Auth User type
export type AuthUser = {
  id: string;
  email: string;
};

// Query to create a user (sign-up) using Supabase Auth
export const createUser = async (email: AuthUser['email'], password: string): Promise<AuthUser | null> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  if (!data?.user || !data.user.email) {
    throw new Error('User creation failed or email is missing');
  }

  return { id: data.user.id, email: data.user.email };
};

// Query to get user by ID (from Supabase Auth)
export const getUserById = async (userId: AuthUser['id']): Promise<AuthUser | null> => {
  const { data, error } = await supabase.auth.getUser(userId);
  if (error) throw error;

  if (!data?.user || !data.user.email) {
    throw new Error('User not found or email is missing');
  }

  return { id: data.user.id, email: data.user.email };
};

// Query to get all colleges (schools)
export const getAllColleges = async (): Promise<College[]> => {
  const { data, error } = await supabase.from('schools').select('*');
  if (error) throw error;
  return data || [];
};

// Query to get all advisors for a specific college
export const getAdvisorsForCollege = async (collegeId: College['school_id']): Promise<Advisor[]> => {
  const { data, error } = await supabase.from('advisors').select('*').eq('school_id', collegeId);
  if (error) throw error;
  return data || [];
};

// Query to get advisor by ID using Advisor type
export const getAdvisorById = async (advisorId: Advisor['advisor_id']): Promise<Advisor | null> => {
  const { data, error } = await supabase
    .from('advisors')
    .select('*')
    .eq('advisor_id', advisorId)
    .single();
  if (error) throw error;
  return data;
};

// Query to get the schedule of an advisor by advisor ID using Availability type
export const getScheduleByAdvisorId = async (advisorId: Advisor['advisor_id']): Promise<Availability | null> => {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .eq('advisor_id', advisorId)
    .single();
  if (error) throw error;
  return data;
};

// Query to create a meeting using Meeting type
export const createMeeting = async (
  advisorId: Meeting['advisor_id'],
  studentId: Meeting['student_id'],
  startTime: Meeting['start_time'],
  endTime: Meeting['end_time']
): Promise<Meeting | null> => {
  const { data, error } = await supabase
    .from('meetings')
    .insert({ advisor_id: advisorId, student_id: studentId, start_time: startTime, end_time: endTime })
    .single();
  if (error) throw error;
  return data;
};

// Query to get meeting by ID using Meeting type
export const getMeetingById = async (meetingId: Meeting['meeting_id']): Promise<Meeting | null> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('meeting_id', meetingId)
    .single();
  if (error) throw error;
  return data;
};
