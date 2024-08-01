import CalendlyEmbed from "@/components/Calendly/CalendlyEmbed";
import { getCalendlyUrlFromAdvisorId } from "@/lib/queries";

export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

export default async function DisplayCalendly({ params }: Props) {

  const calendly_url = await getCalendlyUrlFromAdvisorId(params.id);

  return (
    <div
      style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100vh', // Full viewport height
      boxSizing: 'border-box',
      padding: '20px',
      }}
    >
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Schedule an Appointment</h1>
      <CalendlyEmbed
        url={calendly_url}
        style={{ width: '100%', height: '80%', border: 'none' }}
      />
    </div>
  );
}