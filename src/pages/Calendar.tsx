import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function Calendar() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>📅 Calendar</h1>
        <p>Upcoming events, classes, and activities</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Club Calendar</h2>
          <p>
            Stay up to date with all Keystone Canine Training Club events, classes, meetings,
            and special activities. Our calendar is updated regularly with new events and
            schedule changes.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Regular Schedule</h2>
          <ul>
            <li><strong>Board Meetings:</strong> First Tuesday of each month, 7:00 PM</li>
            <li><strong>General Meetings:</strong> Third Tuesday of each month, 7:30 PM</li>
            <li><strong>Fun Matches:</strong> Last Saturday of each month</li>
            <li><strong>Training Sessions:</strong> See class schedule for details</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Upcoming Highlights</h2>
          <p>
            Check back regularly for information about upcoming trials, seminars,
            demonstrations, and social gatherings. Members receive email notifications
            about new events and schedule changes.
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
