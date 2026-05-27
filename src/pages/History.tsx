import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function History() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>📜 History</h1>
        <p>Our story through the years</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Our Beginnings</h2>
          <p>
            The Keystone Canine Training Club was founded by a small group of dedicated dog
            enthusiasts who shared a vision of creating a supportive community for dog training
            and competition. What started as informal gatherings in backyards has grown into
            one of the region's most respected training clubs.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Growth & Milestones</h2>
          <ul>
            <li>Founded with 12 charter members</li>
            <li>First AKC-sanctioned obedience trial hosted</li>
            <li>Acquired permanent training facility</li>
            <li>Expanded to include agility, rally, and youth programs</li>
            <li>Celebrated numerous members earning AKC titles</li>
            <li>Building renovation and expansion completed</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Today</h2>
          <p>
            Today, Keystone Canine Training Club continues to thrive with a vibrant membership,
            a full schedule of classes, and a commitment to promoting responsible dog ownership
            and the human-canine bond. We're proud of our heritage and excited for the future.
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
