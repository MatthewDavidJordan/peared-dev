"use client";

import Link from "next/link";
import { AdvisorCard } from "./AdvisorCard";
import { Advisor } from "@/models";

interface Props {
  advisors: Advisor[];
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
      {advisors.map((advisor) => (
        <AdvisorCard
            key={advisor.id}
            advisor={advisor}
        />
      ))}
    </>
  );
}
