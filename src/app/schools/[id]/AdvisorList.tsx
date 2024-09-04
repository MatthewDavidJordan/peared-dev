'use client';

import Link from 'next/link';
import { AdvisorCard } from './AdvisorCard';
import { FullAdvisor } from '@/models';

interface Props {
  advisors: FullAdvisor[];
}

export default function AdvisorList({ advisors }: Props) {
  const handleAdvisorClick = (AdvisorName: string) => {
    // Handle the school click here
    // maybe tally up the number of clicks
    console.log(AdvisorName);
  };

  // TODO: Add image logos for each school

  // TODO: Make the animation only happen the first time the page loads

  return (
    <>
      <h2>Advisors</h2>
      {advisors.map((advisor) => (
        <AdvisorCard key={advisor.id} advisor={advisor} />
      ))}
    </>
  );
}
