import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function GiftCertificates() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>🎁 Gift Certificates</h1>
        <p>Give the gift of training</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>The Perfect Gift</h2>
          <p>
            Know someone who just got a new puppy? Have a friend who's been wanting to try
            agility or rally? A Keystone Canine Training Club gift certificate is the perfect
            way to help them get started on their training journey.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Available Options</h2>
          <ul>
            <li><strong>Class Gift Certificate:</strong> Good toward any group class</li>
            <li><strong>Custom Amount:</strong> Choose any dollar value</li>
            <li><strong>Private Lesson Package:</strong> One or more private sessions</li>
            <li><strong>Membership Gift:</strong> Sponsor a new member's annual dues</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>How to Purchase</h2>
          <p>
            Gift certificates can be purchased by contacting the club treasurer or any
            board member. Certificates are available in physical or digital format and
            never expire. Contact us at info@keystonecanine.org to arrange your purchase.
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
