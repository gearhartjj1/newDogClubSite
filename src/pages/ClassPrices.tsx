import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function ClassPrices() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>💰 Class Prices</h1>
        <p>Affordable training for every dog and handler</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Member Pricing</h2>
          <p>Members enjoy discounted rates on all classes and programs.</p>
          <ul>
            <li><strong>Puppy Basics (6 weeks):</strong> $85</li>
            <li><strong>Beginner Obedience (8 weeks):</strong> $100</li>
            <li><strong>Intermediate/Advanced (8 weeks):</strong> $100</li>
            <li><strong>Rally (8 weeks):</strong> $100</li>
            <li><strong>Agility (8 weeks):</strong> $110</li>
            <li><strong>Private Lessons (per session):</strong> $50</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Non-Member Pricing</h2>
          <p>Non-members are welcome to enroll in most classes at standard rates.</p>
          <ul>
            <li><strong>Puppy Basics (6 weeks):</strong> $110</li>
            <li><strong>Beginner Obedience (8 weeks):</strong> $130</li>
            <li><strong>Intermediate/Advanced (8 weeks):</strong> $130</li>
            <li><strong>Rally (8 weeks):</strong> $130</li>
            <li><strong>Agility (8 weeks):</strong> $140</li>
            <li><strong>Private Lessons (per session):</strong> $65</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Additional Information</h2>
          <ul>
            <li>Multi-dog discount: 10% off second dog in same session</li>
            <li>Gift certificates available for all class levels</li>
            <li>Payment due at registration</li>
            <li>Refund policy: Full refund if cancelled 7+ days before start</li>
          </ul>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
