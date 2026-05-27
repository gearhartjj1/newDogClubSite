import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function Forms() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>📋 Forms</h1>
        <p>Downloadable forms for members and applicants</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Membership Forms</h2>
          <ul>
            <li>New Member Application</li>
            <li>Membership Renewal Form</li>
            <li>Member Information Update</li>
            <li>Volunteer Sign-Up Sheet</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Class & Training Forms</h2>
          <ul>
            <li>Class Registration Form</li>
            <li>Liability Waiver</li>
            <li>Vaccination Record Form</li>
            <li>Private Lesson Request</li>
            <li>Building Usage Request</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Event Forms</h2>
          <ul>
            <li>Trial Entry Form</li>
            <li>Fun Match Entry</li>
            <li>Event Volunteer Form</li>
            <li>Facility Rental Agreement</li>
          </ul>
          <p>
            Please contact the club secretary if you need assistance with any forms
            or have questions about which form to use.
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
