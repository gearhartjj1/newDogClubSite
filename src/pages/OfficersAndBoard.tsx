import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function OfficersAndBoard() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>👥 Officers & Board</h1>
        <p>Meet the team leading our club</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Executive Officers</h2>
          <ul>
            <li><strong>President:</strong> To be announced</li>
            <li><strong>Vice President:</strong> To be announced</li>
            <li><strong>Secretary:</strong> To be announced</li>
            <li><strong>Treasurer:</strong> To be announced</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Board of Directors</h2>
          <ul>
            <li>Training Director</li>
            <li>Membership Chair</li>
            <li>Events Coordinator</li>
            <li>Building Manager</li>
            <li>Newsletter Editor</li>
            <li>Members at Large</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Get Involved</h2>
          <p>
            Our club is run entirely by volunteers. Board elections are held annually at
            the December general meeting. If you're interested in serving on the board or
            joining a committee, please speak with any current officer. We welcome members
            who want to contribute to our club's success!
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
