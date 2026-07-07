import { Link } from 'react-router-dom';
import styles from './Classes.module.css';
import { useEffect, useState } from 'react';
import { dogClassAPI, type DogClass } from '../services/api';

export default function Classes() {
  const [dogClasses, setDogClasses] = useState<DogClass[]>([]);
  const [sessionStatus, setSessionStatus] = useState<number | undefined>(undefined); // 0 = not started, 1 = open, 2 = closed
  const [sessionStartDate, setSessionStartDate] = useState<string>('');
  const [sessionName, setSessionName] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDogClasses = async () => {
    setIsRefreshing(true);
    try {
      const queryDogClasses = await dogClassAPI.getAll();
      setDogClasses(queryDogClasses);
      const sessionStatusResponse = await dogClassAPI.getSessionStatus();
      setSessionStatus(sessionStatusResponse.sessionStatus);
      setSessionStartDate(sessionStatusResponse.sessionStartDate);
      setSessionName(sessionStatusResponse.sessionName);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
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

  const ClassTable = ({ classes, title }: { classes: DogClass[]; title?: string }) => (
    <div>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <div className={styles.tableWrapper}>
        <table className={styles.classesTable}>
          <thead>
            <tr>
              <th style={{width: '8%'}}>Code</th>
              <th style={{width: '25%'}}>Class</th>
              <th style={{width: '20%'}}>Prerequisite</th>
              <th style={{width: '15%'}}>Instructor</th>
              <th style={{width: '8%'}}>Start</th>
              <th style={{width: '5%'}}>Day</th>
              <th style={{width: '10%'}}>Time</th>
              <th style={{width: '9%'}}>Enrollment</th>
              {sessionStatus === 1 && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {classes.map((dogClass) => (
              <tr key={dogClass.ID}>
                <td title={dogClass.Code}>{dogClass.Code}</td>
                <td className={styles.className} title={dogClass.Class}>
                  <span>{dogClass.Class}</span>
                  {(dogClass.DogsInClass >= dogClass.MaxDog) && <><br/><span className={styles.waitListedBadge}>Waitlisted</span></>}
                </td>
                <td title={dogClass.Prerequisites}>{dogClass.Prerequisites}</td>
                <td title={dogClass.Instructors}>{dogClass.Instructors}</td>
                <td title={dogClass.Start}>
                  {dogClass.Start}
                </td>
                <td title={dogClass.Day}>{dogClass.Day}</td>
                <td title={dogClass.Time}>{dogClass.Time}</td>
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
                {sessionStatus === 1 && (
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
                )}
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
        <div className={styles.headerTitle}>
          <h1>🎓 Training Classes - {sessionName}</h1>
          <button
            className={styles.refreshButton}
            onClick={fetchDogClasses}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : '↻ Refresh'}
          </button>
        </div>
        <p>
          {sessionStatus === 0 && <span className={styles.statusPending}>Enrollment opens on {new Date(sessionStartDate).toLocaleDateString()} at 9:00 PM</span>}
          {sessionStatus === 1 && <span className={styles.statusOpen}>Registration is currently open</span>}
          {sessionStatus === 2 && <span className={styles.statusClosed}>Registration is closed</span>}
        </p>
      </header>

      {frontClasses.length > 0 && <ClassTable classes={frontClasses} title="Front Room Classes" />}
      {backClasses.length > 0 && <ClassTable classes={backClasses} title="Back Room Classes" />}
    </div>
  );
}
