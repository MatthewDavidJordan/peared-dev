import Image from "next/image";
import styles from "./page.module.css";
import SchoolList from "@/app/SchoolList";
import { loadSchools } from "@/lib/queries";

export const revalidate = 0;

export default async function Home() {

  const schools = await loadSchools();

  return (
    <main className={styles.homePage}>
      <div className={styles.homeContent}>
        <h1>Find your perfect college (student) advisor</h1>
        <SchoolList schools={schools} />
      </div>
    </main>
  );
}
