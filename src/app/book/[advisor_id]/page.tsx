// src/app/book/[advisor_id]/page.tsx
import BookCard from '@/app/book/[advisor_id]/BookCard';
import NavBar from '@/components/NavBar';
import { getAdvisorById, getCollegeById } from '@/lib/queries';
import { redirect } from 'next/navigation';
import { Advisor } from '@/lib/queries';

export default async function CalendarPage({
  params: { advisor_id: advisorIdString },
}: {
  params: { advisor_id: string };
}) {
  const advisorId = Number(advisorIdString);
  if (isNaN(advisorId)) redirect('/404');

  try {
    const advisor = await getAdvisorById(advisorId);
    if (!advisor) redirect('/404');

    const school = await getCollegeById(advisor.school_id);
    if (!school) redirect('/404');

    // Note: availabilities will now be fetched client-side in BookCard
    return (
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <div className="flex w-full flex-1 flex-col items-center justify-center p-5 sm:p-10">
          <BookCard advisor={advisor} school={school} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading advisor page:', error);
    redirect('/404');
  }
}
