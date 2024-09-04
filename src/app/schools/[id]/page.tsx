import styles from './page.module.css';
import { loadAdvisorsBySchoolId } from '@/lib/queries';
import AdvisorList from './AdvisorList';

export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

export default async function Home({ params }: Props) {
  const advisors = await loadAdvisorsBySchoolId(params.id);

  // TODO: Also load the school data here like: class size, athletics division, city

  return (
    <main className={styles.page}>
      <div className={styles.advisors}>
        <AdvisorList advisors={advisors} />
      </div>
    </main>
  );
}
