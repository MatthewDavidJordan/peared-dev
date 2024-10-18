import BookCard from '@/app/book/[advisor_id]/BookCard';
import NavBar from '@/components/NavBar';
import { getAdvisorAvailability, getAdvisorById } from '@/lib/queries';
import { redirect } from 'next/navigation';

export default async function CalendarPage({
  params: { advisor_id: advisorIdString },
}: {
  params: { advisor_id: string };
}) {
  const advisorId = Number(advisorIdString);
  if (isNaN(advisorId)) redirect('/404');

  const advisor = await getAdvisorById(advisorId);
  const availabilities = await getAdvisorAvailability(advisorId);
  if (!availabilities) redirect('/404');
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex w-full flex-1 flex-col items-center justify-center p-5 sm:p-10">
        <BookCard advisor={advisor} availabilities={availabilities} />
      </div>
    </div>
  );
}
