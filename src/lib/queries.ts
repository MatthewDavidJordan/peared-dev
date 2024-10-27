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

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export type Advisor = Database['public']['Tables']['advisors']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type College = Database['public']['Tables']['schools']['Row'];
export type Student = Database['public']['Tables']['students']['Row'];

export type AuthUser = {
  user_id: string;
  email: string;
};

export type AvailabilityEvent = {
  start_time: string;
  end_time: string;
};

// -------------------- USER RELATED ----------------------------

export const signUp = async (email: string, name: string, url: string): Promise<AuthUser> => {
  try {
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

    // If no session, send OTP to sign in
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: url,
      },
    });
    if (otpError) throw otpError;

    throw new Error('OTP sent to email');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Sign-up/in failed: Unknown error');
    }
  }
};

export const createStudent = async (user_id: string): Promise<Student> => {
  const { data, error } = await supabase.from('students').insert({ user_id }).select().single();
  if (error) throw error;
  return data;
};

export const createAdvisor = async (
  user_id: string,
  school_id: number,
  advisor_name: string,
): Promise<Advisor> => {
  const { data, error } = await supabase
    .from('advisors')
    .insert({ user_id, school_id, advisor_name: advisor_name })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getUserById = async (userId: AuthUser['user_id']): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.getUser(userId);
  if (error) throw error;

  if (!data?.user || !data.user.email) {
    throw new Error('User not found or email is missing');
  }

  return { user_id: data.user.id, email: data.user.email };
};

export const getAdvisorById = async (advisorId: Advisor['advisor_id']) => {
  const { data, error } = await supabase
    .from('advisors')
    .select(
      `advisor_id,
      user_id,
      school_id,
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
    .eq('advisor_id', advisorId)
    .single();
  if (error) throw error;
  return data;
};

export const getStudentById = async (studentId: Student['student_id']): Promise<Student> => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('student_id', studentId)
    .single();
  if (error) throw error;
  return data;
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
      user_id,
      school_id,
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
  const { data: advisor } = await supabase
    .from('advisors')
    .select('advisor_id, ical_link')
    .eq('advisor_id', advisorId)
    .single();

  if (!advisor!.ical_link) return [];

  const events: ical.CalendarResponse = await ical.async.fromURL(advisor!.ical_link);

  const now: Date = new Date();
  const twoWeeksAhead: Date = new Date();
  twoWeeksAhead.setDate(now.getDate() + 14);

  const availabilityEvents: AvailabilityEvent[] = [];

  Object.values(events).forEach((event) => {
    if (event.type !== 'VEVENT') return;

    if (event.rrule) {
      const dates = event.rrule.between(now, twoWeeksAhead, true);

      resolveRecurrenceTimes(event, dates).forEach((date) => {
        const startDate = new Date(date);
        const duration = event.end.getTime() - event.start.getTime();
        const endDate = new Date(startDate.getTime() + duration);
        availabilityEvents.push({
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
        });
      });
    } else {
      if (
        event.start.getTime() >= now.getTime() &&
        event.end.getTime() <= twoWeeksAhead.getTime()
      ) {
        availabilityEvents.push({
          start_time: event.start.toISOString(),
          end_time: event.end.toISOString(),
        });
      }
    }
  });

  return availabilityEvents;
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
