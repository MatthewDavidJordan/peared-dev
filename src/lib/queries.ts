//src/lib/queries.ts
import { AuthOtpResponse, createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './supabase-types';

// Create the typed Supabase client
const supabase: SupabaseClient<Database> = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

// OTP sign in
export const signInWithOtp = async (email: string): Promise<AuthOtpResponse> =>
  supabase.auth.signInWithOtp({ email });

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

export const getCollegeById = async (collegeId: College['school_id']): Promise<College | null> => {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .eq('school_id', collegeId)
    .single();
  if (error) throw error;
  return data;
};

export const getAdvisorsForCollege = async (
  collegeId: College['school_id'],
): Promise<Advisor[]> => {
  const { data, error } = await supabase
    .from('advisors')
    .select(
      'advisor_id, user_id, school_id, availability_id, payment_info_id, bio, advisor_name, advisor_image',
    )
    .eq('school_id', collegeId);
  if (error) throw error;
  return data || [];
};

export const getAdvisorById = async (advisorId: Advisor['advisor_id']): Promise<Advisor | null> => {
  const { data, error } = await supabase
    .from('advisors')
    .select(
      'advisor_id, user_id, school_id, availability_id, payment_info_id, bio, advisor_name, advisor_image',
    )
    .eq('advisor_id', advisorId)
    .single();
  if (error) throw error;
  return data;
};

// Query to get the schedule of an advisor by advisor ID using Availability type
export const getScheduleByAdvisorId = async (
  advisorId: Advisor['advisor_id'],
): Promise<Availability | null> => {
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
  endTime: Meeting['end_time'],
): Promise<Meeting | null> => {
  const { data, error } = await supabase
    .from('meetings')
    .insert({
      advisor_id: advisorId,
      student_id: studentId,
      start_time: startTime,
      end_time: endTime,
    })
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
