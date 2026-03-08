import { useEffect, useState } from 'react';
import { dogClassAPI } from '../services/api';
import styles from './Events.module.css';
import type { DogClass } from '../services/api';

export default function Events() {
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
        <h1>🎉 Upcoming Events</h1>
        <p>Join us for exciting activities and gatherings</p>
      </header>

      <div className={styles.eventsList}>
        {dogClasses.map((dogClass) => (
          <div key={dogClass.ID} className={styles.eventCard}>
            <div className={styles.eventHeader}>
              <h2>{dogClass.Class}</h2>
              <span className={styles.badge}>Upcoming</span>
            </div>

            <div className={styles.eventDetails}>
              <div className={styles.detail}>
                <span className={styles.icon}>📅</span>
                <span>{dogClass.Start}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.icon}>⏰</span>
                <span>{dogClass.Time}</span>
              </div>
              <div className={styles.detail}>
                <span className={styles.icon}>📍</span>
                <span>{dogClass.Room}</span>
              </div>
            </div>

            <p className={styles.description}>{dogClass.Prerequisites}</p>

            <button className={styles.button}>Learn More</button>
          </div>
        ))}
      </div>
    </div>
  );
}
