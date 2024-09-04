'use client';

import styles from './SchoolList.module.css';
import { School } from '@/models';
import Link from 'next/link';
import { useState } from 'react';
import { Fade } from 'react-awesome-reveal';

interface Props {
  schools: School[];
}

export default function SchoolList({ schools }: Props) {
  const [term, setTerm] = useState('');

  const filteredSchools = schools.filter((school) => {
    return school.name.toLowerCase().includes(term.toLowerCase());
  });

  const handleSchoolClick = (school: School) => {
    // Handle the school click here
    console.log(school.id);
  };

  // TODO: Add image logos for each school

  // TODO: Make the animation only happen the first time the page loads

  return (
    <>
      <input
        type="text"
        placeholder="School name"
        className={styles.searchBar}
        onChange={(evt) => setTerm(evt.target.value)}
      />
      <div className={styles.schoolGrid}>
        {filteredSchools.map((school, index) => (
          <Fade
            key={school.id}
            direction="up"
            duration={1000}
            delay={index * 100}
          >
            <div
              className={styles.schoolRectangle}
              style={{ backgroundColor: '#' + school.color_hex_code }}
              onClick={
                school.disabled ? undefined : () => handleSchoolClick(school)
              }
            >
              <Link
                href={'/schools/' + school.id}
                style={{ textDecoration: 'none' }}
              >
                <span className={styles.schoolName}>{school.name}</span>
              </Link>
            </div>
          </Fade>
        ))}
      </div>
    </>
  );
}
