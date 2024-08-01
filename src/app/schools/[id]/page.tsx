import { loadAdvisorsBySchoolId } from "@/lib/queries";
import AdvisorList from "./AdvisorList";

export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

export default async function Home({ params }: Props) {

  const advisors = await loadAdvisorsBySchoolId(params.id);

  return (
    <div>
      <h1>Advisors</h1>
      <div
      // make the max width of the advisor list 1000px and center it
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
      }}
      >
        <AdvisorList advisors={advisors} />
      </div>
    </div>
  );
}
