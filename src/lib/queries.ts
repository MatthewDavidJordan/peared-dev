//src/lib/queries.ts
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { getTimezoneOffset } from 'date-fns-tz';
import ical from 'node-ical';
import { Database } from '../../supabase-types';

// Create the typed Supabase client
export const supabase: SupabaseClient<Database> = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type Advisor = Database['public']['Tables']['advisors']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type College = Database['public']['Tables']['schools']['Row'];
export type Student = Database['public']['Tables']['students']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

export type AuthUser = {
  user_id: string;
  email: string;
};

export type AvailabilityEvent = {
  start_time: string;
  end_time: string;
};

// -------------------- USER RELATED ----------------------------

// should only be called when we know a session exists
export const getAuthUserFromActiveSession = async (): Promise<AuthUser> => {
  // Check if there's an active session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;

  if (sessionData?.session) {
    // Return session details if a session is active
    return {
      user_id: sessionData.session.user.id,
      email: sessionData.session.user.email!,
    };
  }

  // Throw an error if no session is found
  throw new Error('No active session found');
};

export const signUpAndSignIn = async (email: string): Promise<boolean | 'new'> => {
  try {
    // Step 1: Check if there's an active session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (sessionData?.session) {
      // If a session is active, the user is signed in
      return true;
    }

    // Step 2: Check if the user exists
    const { data: userData, error: userError } = await supabase
      .from('profiles') // Adjust this if your user data is elsewhere
      .select('id')
      .eq('email', email)
      .single();

    if (userError) {
      // If no user exists, create a new account
      const { error: otpError } = await supabase.auth.signInWithOtp({ email });
      if (otpError) throw otpError;

      // Return 'new' indicating a new account was created
      return 'new';
    }

    // Step 3: If user exists but no active session, send OTP
    const { error: otpError } = await supabase.auth.signInWithOtp({ email });
    if (otpError) throw otpError;

    // Return false indicating OTP verification is required
    return false;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Sign-up/in failed: Unknown error');
    }
  }
};

// verify the OTP
export const verifyUserOtp = async (
  email: string,
  otp: string,
): Promise<{ user: AuthUser } | null> => {
  // Verify the OTP
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (error) {
    console.error('OTP verification failed:', error.message);
    return null;
  }

  const user: User = data.user!;

  console.log('OTP verified successfully:', user.email, user.id);

  // Return the user data
  return { user: { user_id: user.id, email: user.email! } };
};

export const studentExists = async (profile_id: number): Promise<boolean> => {
  const { data, error } = await supabase
    .from('students')
    .select('student_id')
    .eq('profile_id', profile_id)
    .single();
  if (error) throw error;

  // Return true if a student exists with the specified profile_id
  return !!data;
};

export const createStudent = async (
  email: string,
  first_name: string,
  last_name: string,
): Promise<Student> => {
  // Step 1: Update the profiles table with first and last name based on email
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .update({ first_name, last_name })
    .eq('email', email)
    .select('id')
    .single();

  if (profileError) throw profileError;
  if (!profileData) throw new Error('Profile not found with the specified email.');

  const profile_id = profileData.id;

  // Step 2: Insert into students table with the retrieved profile_id
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .insert({ profile_id })
    .select()
    .single();

  if (studentError) throw studentError;
  return studentData;
};

export const createAdvisor = async (
  email: string,
  first_name: string,
  last_name: string,
  school_id: number,
  bio: string,
  advisor_image: string,
  ical_link: string,
): Promise<Advisor> => {
  // Update the profiles table with the first and last name based on the email
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .update({ first_name, last_name })
    .eq('email', email)
    .select()
    .single();

  // Check if the profile update had an error or returned no data
  if (profileError) throw profileError;
  if (!profileData) throw new Error('Profile not found with the specified email.');

  // Retrieve profile_id from the updated profile
  const profile_id = profileData.id;

  // Insert a new row into the advisors table with the provided inputs
  const { data, error } = await supabase
    .from('advisors')
    .insert([{ profile_id, school_id, bio, advisor_image, ical_link }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getProfileIdByUserId = async (user_id: string): Promise<number> => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user_id)
    .single();

  if (error) throw error;
  if (!profile?.id) throw new Error('Profile not found');

  return profile.id;
};

export const getProfileByProfileId = async (profile_id: number) => {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', profile_id).single();
  if (error) throw error;
  return data;
};

export const getProfileByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();
  if (error) throw error;
  return data;
};

// change this up when we change the columns
export const getAdvisorById = async (advisorId: Advisor['advisor_id']) => {
  const { data, error } = await supabase
    .from('advisors')
    .select(
      `advisor_id,
      profile_id,
      school_id,
      bio,
      advisor_image,
      ical_link,
      advisor_labels (
        labels (
          label_id,
          label_name,
          category_name
        )
      ),
      profiles (
        first_name,
        last_name,
        email
      )`,
    )
    .eq('advisor_id', advisorId)
    .single();

  if (error) throw error;
  return data;
};

export const getStudentById = async (studentId: Student['student_id']) => {
  const { data, error } = await supabase
    .from('students')
    .select(
      `student_id,
      profile_id,
      profiles (
        first_name,
        last_name,
        email
      )`,
    )
    .eq('student_id', studentId)
    .single();

  if (error) throw error;
  return data;
};

export const getStudentByProfileId = async (profile_id: number): Promise<Student> => {
  const { data: student, error } = await supabase
    .from('students')
    .select(
      `student_id,
      profile_id,
      profiles (
        first_name,
        last_name,
        email
      )`,
    )
    .eq('profile_id', profile_id)
    .single();

  if (error) throw error;
  if (!student) throw new Error('Student not found for the specified profile_id');

  return student;
};

export const getStudentIdByUserId = async (
  user_id: string,
): Promise<Student & { email: string; first_name: string; last_name: string }> => {
  // Step 1: Retrieve the profile_id and additional fields based on user_id
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, first_name, last_name')
    .eq('user_id', user_id)
    .single();

  if (profileError) throw profileError;
  if (!profile) throw new Error('Profile not found for the specified user_id');

  const { id: profile_id, email, first_name, last_name } = profile;

  // Step 2: Retrieve the student based on profile_id
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*')
    .eq('profile_id', profile_id)
    .single();

  if (studentError) throw studentError;
  if (!student?.student_id) throw new Error('Student not found for the specified profile_id');

  // Combine student data with profile information
  return { ...student, email, first_name, last_name };
};

// ------------------------------------------------

export const getAllColleges = async (): Promise<College[]> => {
  const { data, error } = await supabase
    .from('schools')
    .select('school_id, school_name, school_image');
  if (error) throw error;
  return data || [];
};

export const getCollegeById = async (collegeId: College['school_id']): Promise<College> => {
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
      profile_id,
      school_id,
      bio,
      advisor_image,
      ical_link,
      advisor_labels (
        labels (
          label_id,
          label_name,
          category_name
        )
      ),
      profiles (
        first_name,
        last_name,
        email
      )`,
    )
    .eq('school_id', collegeId);

  if (error) throw error;
  return data || [];
};

const resolveRecurrenceTimes = (event: ical.VEvent, dates: Date[]) => {
  return dates.map((date) => {
    console.log(date.getTime());

    if (!event.rrule) throw new Error("Event doesn't have a recurrence rule");

    const tzId = event.rrule.origOptions.tzid;
    if (tzId) {
      const offset = getTimezoneOffset(tzId, date);
      return new Date(date.getTime() - offset);
    } else {
      throw new Error('Timezone not provided');
    }
  });
};

export async function getAdvisorAvailability(
  advisorId: Advisor['advisor_id'],
): Promise<AvailabilityEvent[]> {
  const response = await fetch(`/api/availability/${advisorId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch availability');
  }

  return data.availabilityEvents;
}

export const createMeeting = async (
  advisorId: Meeting['advisor_id'],
  studentId: Meeting['student_id'],
  startTime: Meeting['start_time'],
  endTime: Meeting['end_time'],
  meetingUrl: Meeting['meeting_url'],
): Promise<Meeting> => {
  const { data, error } = await supabase
    .from('meetings')
    .insert({
      advisor_id: advisorId,
      student_id: studentId,
      start_time: startTime,
      end_time: endTime,
      meeting_url: meetingUrl,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getMeetingById = async (meetingId: Meeting['meeting_id']): Promise<Meeting> => {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('meeting_id', meetingId)
    .single();
  if (error) throw error;
  return data;
};

export const getAdvisorIcalLinkById = async (advisorId: Advisor['advisor_id']): Promise<string> => {
  const { data, error } = await supabase
    .from('advisors')
    .select('ical_link')
    .eq('advisor_id', advisorId)
    .single();
  if (error) throw error;
  if (!data?.ical_link) {
    throw new Error('iCal link not found');
  }
  return data.ical_link;
};

export const updateAdvisorIcalLinkById = async (
  advisorId: Advisor['advisor_id'],
  ical_link: string,
): Promise<void> => {
  const { error } = await supabase
    .from('advisors')
    .update({ ical_link })
    .eq('advisor_id', advisorId)
    .select('*');
  if (error) throw error;
  return;
};
