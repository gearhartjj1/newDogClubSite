import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function Membership() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>🤝 Membership</h1>
        <p>Join our community of dog enthusiasts</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Why Join?</h2>
          <p>
            Membership in the Keystone Canine Training Club gives you access to our training
            facility, discounted class rates, voting privileges, and a wonderful community
            of fellow dog lovers. Members also receive our newsletter and priority
            registration for popular classes and events.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Membership Types & Dues</h2>
          <ul>
            <li><strong>Individual:</strong> $60/year</li>
            <li><strong>Family (same household):</strong> $85/year</li>
            <li><strong>Junior (under 18):</strong> $30/year</li>
            <li><strong>Senior (65+):</strong> $45/year</li>
          </ul>
          <p>Dues are payable annually on your membership anniversary date.</p>
        </div>

        <div className={styles.card}>
          <h2>How to Join</h2>
          <p>
            To become a member, complete a membership application form and submit it with
            your dues payment. New members must attend two general meetings and have a
            sponsor who is a current member in good standing. Contact us if you need help
            finding a sponsor — we're happy to connect you!
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
