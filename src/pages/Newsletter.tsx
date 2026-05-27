import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function Newsletter() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>📰 Newsletter</h1>
        <p>Stay informed with club news and updates</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>The Keystone Gazette</h2>
          <p>
            Our club newsletter is published monthly and is packed with training tips,
            member achievements, upcoming events, and important club announcements.
            It's your go-to source for everything happening at Keystone Canine.
          </p>
        </div>

        <div className={styles.card}>
          <h2>What's Inside</h2>
          <ul>
            <li>President's message</li>
            <li>Upcoming events and class schedules</li>
            <li>Training tips and articles</li>
            <li>Member brags and accomplishments</li>
            <li>Meeting minutes summary</li>
            <li>New member introductions</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Subscribe</h2>
          <p>
            Members automatically receive the newsletter via email. Non-members interested
            in receiving our newsletter can sign up for our mailing list by contacting us.
            Back issues are available in the Members Only section.
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
