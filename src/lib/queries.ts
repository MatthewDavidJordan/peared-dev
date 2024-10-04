import { createClient, AuthResponse, User as SupabaseUser } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

// Define types for your data models
export type College = {
  id: string;
  name: string;
};

export type Advisor = {
  advisor_id: string;
  user_id: string;
  school_id: string;
  bio: string;
};

export type User = {
  id: string;
  email: string;
};

export type Meeting = {
  meeting_id: string;
  advisor_id: string;
  student_id: string;
  start_time: string;
  end_time: string;
};

// Query to get all colleges
export const getAllColleges = async (): Promise<College[]> => {
  const { data, error } = await supabase.from('schools').select('*');
  if (error) throw error;
  return data as College[];
};

// Query to get all advisors for a specific college
export const getAdvisorsForCollege = async (collegeId: string): Promise<Advisor[]> => {
  const { data, error } = await supabase.from('advisors').select('*').eq('school_id', collegeId);
  if (error) throw error;
  return data as Advisor[];
};

// Query to get advisor by ID
export const getAdvisorById = async (advisorId: string): Promise<Advisor | null> => {
  const { data, error } = await supabase.from('advisors').select('*').eq('advisor_id', advisorId).single();
  if (error) throw error;
  return data as Advisor | null;  // Handle potential null
};

// Query to get schedule info for advisor
export const getScheduleByAdvisorId = async (advisorId: string): Promise<any> => {
  const { data, error } = await supabase.from('availability').select('*').eq('advisor_id', advisorId).single();
  if (error) throw error;
  return data;  // This can be typed further if needed
};

// Query to create a user (sign-up)
export const createUser = async (email: string, password: string): Promise<SupabaseUser | null> => {
  const { data, error }: AuthResponse = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;  // Access the user from the data object
};

// Query to get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
  if (error) throw error;
  return data as User | null;  // Handle potential null
};

// Query to create a meeting
export const createMeeting = async (
  advisorId: string,
  studentId: string,
  startTime: string,
  endTime: string
): Promise<Meeting | null> => {
  const { data, error } = await supabase
    .from('meetings')
    .insert({ advisor_id: advisorId, student_id: studentId, start_time: startTime, end_time: endTime })
    .single();  // Expect a single row
  if (error) throw error;
  return data as Meeting | null;  // Handle potential null
};

// Query to get meeting by ID
export const getMeetingById = async (meetingId: string): Promise<Meeting | null> => {
  const { data, error } = await supabase.from('meetings').select('*').eq('meeting_id', meetingId).single();
  if (error) throw error;
  return data as Meeting | null;  // Handle potential null
};
