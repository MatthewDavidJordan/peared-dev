//src/lib/queries.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import ical from 'node-ical';
import { Database } from './supabase-types';

// Create the typed Supabase client
export const supabase: SupabaseClient<Database> = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABSE_SERVICE_ROLE_KEY!,
);

// Type definitions for custom tables
export type Advisor = Database['public']['Tables']['advisors']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type College = Database['public']['Tables']['schools']['Row'];
export type Availability = Database['public']['Tables']['availability']['Row'];
export type Student = Database['public']['Tables']['students']['Row'];

// Supabase Auth User type
export type AuthUser = {
  id: string;
  email: string;
};

// Define Label type
export type Label = {
  label_id: number;
  label_name: string;
  category_name: string;
};

// Define AdvisorLabel type
export type AdvisorLabel = {
  labels: Label | null;
};

// Define AdvisorWithLabels type
export type AdvisorWithLabels = Advisor & {
  advisor_labels: AdvisorLabel[];
};

export type AvailabilityEvent = {
  start_time: string;
  end_time: string;
};

export const signUp = async (email: string, name: string | undefined) => {
  const existingUser = await adminSupabase.from('profiles').select('*').eq('email', email).single();

  if (existingUser.data) return existingUser.data;
  const { data } = await adminSupabase.auth.admin.createUser({
    email,
    user_metadata: { name },
  });

  return data.user;
};

export const createStudent = async (user_id: string) => {
  const { data, error } = await supabase.from('students').insert({ user_id }).select().single();
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('schools')
    .select('school_id, school_name, school_image');
  if (error) throw error;
  return data || [];
};

export const getCollegeById = async (collegeId: number): Promise<College | null> => {
  const { data, error } = await supabase
    .from('schools')
    .select('school_id, school_name, school_image')
    .eq('school_id', collegeId)
    .single();
  if (error) throw error;
  return data;
};

export const getAdvisorsForCollege = async (collegeId: College['school_id']) => {
  const { data, error } = await supabase
    .from('advisors')
    .select(
      `advisor_id,
      user_id,
      school_id,
      availability_id,
      payment_info_id,
      bio,
      advisor_name,
      advisor_image,
      ical_link,
      advisor_labels (
        labels (
          label_id,
          label_name,
          category_name
        )
      )`,
    )
    .eq('school_id', collegeId);
  if (error) throw error;
  return data || [];
};

export const getAdvisorById = async (advisorId: Advisor['advisor_id']) => {
  const { data: advisorData, error: advisorError } = await supabase
    .from('advisors')
    .select(
      `
      advisor_id,
      user_id,
      school_id,
      availability_id,
      payment_info_id,
      bio,
      advisor_name,
      advisor_image,
      ical_link,
      advisor_labels (
        labels (
          label_id,
          label_name,
          category_name
        )
      )
      `,
    )
    .eq('advisor_id', advisorId)
    .single();
  if (advisorError) throw advisorError;

  const { data: schoolData, error: schoolError } = await supabase
    .from('schools')
    .select('*')
    .eq('school_id', advisorData.school_id)
    .single();
  if (schoolError) throw schoolError;

  return { ...advisorData, ...schoolData };
};

export async function getAdvisorAvailability(advisorId: number) {
  // Fetch the advisor's iCal link
  const { data: advisor, error: advisorError } = await supabase
    .from('advisors')
    .select('advisor_id, ical_link')
    .eq('advisor_id', advisorId)
    .single();

  if (advisorError || !advisor) return null;

  if (!advisor.ical_link) return null;

  // Parse the iCal link
  const events = await ical.async.fromURL(advisor.ical_link);

  // Set the date range
  const now = new Date();
  const twoWeeksAhead = new Date();
  twoWeeksAhead.setDate(now.getDate() + 14);

  const availabilityEvents: AvailabilityEvent[] = [];

  Object.values(events).forEach((event: any) => {
    if (event.type === 'VEVENT') {
      if (event.rrule) {
        // Handle recurring events
        const dates = event.rrule.between(now, twoWeeksAhead, true);
        dates.forEach((date: Date) => {
          const startDate = new Date(date);
          const duration = event.end.getTime() - event.start.getTime();
          const endDate = new Date(startDate.getTime() + duration);
          availabilityEvents.push({
            start_time: startDate.toISOString(),
            end_time: endDate.toISOString(),
          });
        });
      } else {
        // Handle single events
        if (event.start >= now && event.start <= twoWeeksAhead) {
          availabilityEvents.push({
            start_time: event.start.toISOString(),
            end_time: event.end.toISOString(),
          });
        }
      }
    }
  });

  return availabilityEvents;
}

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
): Promise<Meeting> => {
  const { data, error } = await supabase
    .from('meetings')
    .insert({
      advisor_id: advisorId,
      student_id: studentId,
      start_time: startTime,
      end_time: endTime,
    })
    .select()
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

export const getAdvisorIcalLinkById = async (
  advisorId: Advisor['advisor_id'],
): Promise<string | null> => {
  const { data, error } = await supabase
    .from('advisors')
    .select('ical_link')
    .eq('advisor_id', advisorId)
    .single();
  if (error) throw error;
  return data?.ical_link || null;
};
