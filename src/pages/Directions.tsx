import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function Directions() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>🗺️ Directions</h1>
        <p>How to find our training facility</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Our Location</h2>
          <p>
            Keystone Canine Training Club<br />
            123 Training Lane<br />
            Harrisburg, PA 17101
          </p>
          <p>
            Our facility is conveniently located just off Route 22 with easy access
            from major highways. Look for our sign at the entrance.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Driving Directions</h2>
          <ul>
            <li><strong>From I-83 North:</strong> Take Exit 44B, turn right onto Route 22 East. Continue 2 miles, turn left onto Training Lane.</li>
            <li><strong>From I-83 South:</strong> Take Exit 44B, turn left onto Route 22 East. Continue 2 miles, turn left onto Training Lane.</li>
            <li><strong>From Route 22 West:</strong> Continue past the mall, turn right onto Training Lane approximately 1 mile past the traffic light.</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Parking</h2>
          <p>
            Free parking is available in our lot adjacent to the building. Additional
            overflow parking is available on the street. Please be courteous to our
            neighbors and do not block driveways.
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
