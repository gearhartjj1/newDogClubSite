import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function MembersOnly() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>🔒 Members Only</h1>
        <p>Exclusive resources for club members</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Member Resources</h2>
          <p>
            This area contains resources exclusively available to current members of the
            Keystone Canine Training Club. Please log in with your member credentials to
            access the full content.
          </p>
        </div>

        <div className={styles.card}>
          <h2>What's Available</h2>
          <ul>
            <li>Meeting minutes and club documents</li>
            <li>Member directory</li>
            <li>Training resources and handouts</li>
            <li>Building access schedule</li>
            <li>Committee reports</li>
            <li>Archived newsletters</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Need Access?</h2>
          <p>
            If you're a current member and don't have login credentials, please contact
            the club secretary to get set up. If your membership has lapsed, please renew
            to regain access to member resources.
          </p>
          <Link to="/login" className={styles.inlineLink}>
            Log In →
          </Link>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
