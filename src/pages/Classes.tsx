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

  // Helper function to parse date string for sorting
  const parseDate = (dateString: string): Date => {
    // Try to parse the date string - handle various formats
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? new Date(0) : date;
  };

  // Sort classes by date and separate into front and back sections
  const sortedClasses = [...dogClasses].sort((a, b) => {
    return parseDate(a.Start).getTime() - parseDate(b.Start).getTime();
  });

  const frontClasses = sortedClasses.filter(dogClass => 
    dogClass.Room?.toLowerCase().includes('front')
  );

  const backClasses = sortedClasses.filter(dogClass => 
    dogClass.Room?.toLowerCase().includes('back')
  );

  const ClassTable = ({ classes, title }: { classes: DogClass[]; title: string }) => (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.classesTable}>
          <thead>
            <tr>
              <th>Class</th>
              <th>Prerequisite</th>
              <th>Instructor</th>
              <th>Start</th>
              <th>Day</th>
              <th>Time</th>
              <th>Enrollment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((dogClass) => (
              <tr key={dogClass.ID}>
                <td className={styles.className}>
                  <span>{dogClass.Class}</span>
                  {(dogClass.DogsInClass >= dogClass.MaxDog) && <><br/><span className={styles.waitListedBadge}>Waitlisted</span></>}
                </td>
                <td>{dogClass.Prerequisites}</td>
                <td>{dogClass.Instructors}</td>
                <td>
                  {dogClass.Start}
                </td>
                <td>{dogClass.Day}</td>
                <td>{dogClass.Time}</td>
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
                      Enroll
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
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎓 Training Classes</h1>
        <p>Dog training programs for all levels</p>
      </header>

      {frontClasses.length > 0 && <ClassTable classes={frontClasses} title="Front Room Classes" />}
      {backClasses.length > 0 && <ClassTable classes={backClasses} title="Back Room Classes" />}
    </div>
  );
}
