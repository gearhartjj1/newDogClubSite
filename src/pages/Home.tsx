import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Welcome to Keystone Canine Training Club</h1>
        <p>Your community for dog lovers and enthusiasts</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>🐕 About Us</h2>
          <p>
            The Keystone Canine Training Club is dedicated to bringing together dog owners and enthusiasts
            for training, socializing, and celebrating our furry friends.
          </p>
        </div>

        <div className={styles.card}>
          <h2>📅 Upcoming Events</h2>
          <p>
            Check out our exciting events and activities happening throughout the month.
            From training sessions to fun meetups, there's always something tail-wagging!
          </p>
          <Link to="/events" className={styles.link}>
            View Events →
          </Link>
        </div>

        <div className={styles.card}>
          <h2>🎓 Classes</h2>
          <p>
            Enroll in our professional dog training classes designed for all skill levels.
            From puppies to adult dogs, we have programs for everyone.
          </p>
          <Link to="/classes" className={styles.link}>
            Browse Classes →
          </Link>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to Join?</h2>
        <p>Sign up for a class and become part of our community!</p>
        <Link to="/classes" className={styles.button}>
          Sign Up Now
        </Link>
      </section>
    </div>
  );
}
