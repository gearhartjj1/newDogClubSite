import { Link } from 'react-router-dom';
import styles from './Classes.module.css';
import { useEffect, useState } from 'react';
import { dogClassAPI, type DogClass } from '../services/api';

export default function Classes() {
  const [dogClasses, setDogClasses] = useState<DogClass[]>([]);
    useEffect(() => {
      const fetchDogClasses = async () => {
        const queryDogClasses = await dogClassAPI.getAll();
        setDogClasses(queryDogClasses);
      };
      fetchDogClasses();
    }, []);
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎓 Training Classes</h1>
        <p>Professional dog training programs for all levels</p>
      </header>

      <div className={styles.classesGrid}>
        {dogClasses.map((dogClass) => (
          <div key={dogClass.ID} className={styles.classCard}>
            <div className={styles.classHeader}>
              <h2>{dogClass.Class}</h2>
            </div>

            <div className={styles.classInfo}>
              <p>
                <strong>Instructor:</strong> {dogClass.Instructors}
              </p>
              <p>
                <strong>Schedule:</strong> {dogClass.Start} at {dogClass.Time } in {dogClass.Room}
              </p>
              <p>
                <strong>Price:</strong> ${dogClass.Rate}/month
              </p>
            </div>

            <p className={styles.description}>{"TBD"}</p>

            <div className={styles.enrollment}>
              <div className={styles.progress}>
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${(1 / dogClass.MaxDog) * 100}%`,
                  }}
                ></div>
              </div>
              <span className={styles.enrollmentText}>
                1/{dogClass.MaxDog} enrolled
              </span>
            </div>

            <Link to={`/signup?classId=${dogClass.ID}`} className={styles.signupButton}>
              Sign Up
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
