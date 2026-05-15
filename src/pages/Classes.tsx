import { Link } from 'react-router-dom';
import styles from './Classes.module.css';
import { useEffect, useState } from 'react';
import { dogClassAPI, type DogClass } from '../services/api';

//TODO: check the data from the database to make sure the number of dogs enrolled is correct
//There are a lot of classes that have more than the max for the class
//But that could just be because the data is test data
//Or maybe there isn't something to enforce the max number of dogs
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

      <div className={styles.tableWrapper}>
        <table className={styles.classesTable}>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Instructor</th>
              <th>Schedule</th>
              <th>Location</th>
              <th>Price</th>
              <th>Enrollment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dogClasses.map((dogClass) => (
              <tr key={dogClass.ID}>
                <td className={styles.className}>{dogClass.Class}</td>
                <td>{dogClass.Instructors}</td>
                <td>
                  {dogClass.Start} at {dogClass.Time}
                </td>
                <td>{dogClass.Room}</td>
                <td>${dogClass.Rate}/mo</td>
                <td>
                  <div className={styles.enrollmentCell}>
                    <span className={styles.enrollmentCount}>
                      {dogClass.DogsInClass > dogClass.MaxDog ? dogClass.MaxDog : dogClass.DogsInClass}/{dogClass.MaxDog}
                    </span>
                    <div className={styles.progressSmall}>
                      <div
                        className={styles.progressBarSmall}
                        style={{
                          width: `${(dogClass.DogsInClass > dogClass.MaxDog ? dogClass.MaxDog : dogClass.DogsInClass) / dogClass.MaxDog * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  {dogClass.DogsInClass < dogClass.MaxDog ? (
                    <Link
                      to={`/signup?classId=${dogClass.ID}`}
                      className={styles.signupButtonSmall}
                    >
                      Sign Up
                    </Link>
                  ) : (
                    <Link
                      to={`/signup?classId=${dogClass.ID}&waitlist=true`}
                      className={styles.waitlistButtonSmall}
                    >
                      Join Waitlist
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
