import styles from './page.module.css';

export const revalidate = 0;

export default async function Home() {

  return (
    <main className={styles.homePage}>
      <div className={styles.homeContent}>
        <h1>Find your perfect college (student) advisor</h1>
      </div>
    </main>
  );
}
