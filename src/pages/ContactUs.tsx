import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function ContactUs() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>📧 Contact Us</h1>
        <p>We'd love to hear from you</p>
      </section>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Get in Touch</h2>
          <p>
            Have questions about classes, membership, or events? We're here to help!
            Reach out using any of the methods below and a club representative will
            get back to you as soon as possible.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Contact Information</h2>
          <ul>
            <li><strong>Email:</strong> info@keystonecanine.org</li>
            <li><strong>Phone:</strong> (555) 123-4567</li>
            <li><strong>Mailing Address:</strong><br />
              Keystone Canine Training Club<br />
              123 Training Lane<br />
              Harrisburg, PA 17101
            </li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Response Times</h2>
          <p>
            We strive to respond to all inquiries within 48 hours. For urgent matters,
            please call during business hours. For class enrollment questions, please
            check our Classes page first as many common questions are answered there.
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
