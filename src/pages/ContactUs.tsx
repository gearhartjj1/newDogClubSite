import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function ContactUs() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>📧 Contact Us</h1>
        <p>We'd love to hear from you</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card} style={{ textAlign: 'center', lineHeight: '2.2' }}>
          <h1>Get in Touch</h1>
          <p>
            Keystone Canine Training Club is conveniently located South of Pittsburgh
            in Baldwin Borough, Pennsylvania.
          </p>
          <br/>
          <h2>The Club can be reached by:</h2>
          <h3>Telephone</h3>
          <p>(412) 833-2211 — Voice Mail answers 24 hours a day.</p>

          <h3>E-Mail</h3>
          <p><a href="mailto:info@keystonecanine.com">info@keystonecanine.com</a></p>

          <h3>Mailing Address</h3>
          <p>
            Keystone Canine Training Club<br />
            PO Box 921<br />
            Bethel Park, Pennsylvania 15102-0921
          </p>

          <h3>Building Location</h3>
          <p>5167 Brownsville Rd., Baldwin Borough, 15236</p>
          <br/>
          <p><strong>⚠️ DO NOT SEND SNAIL MAIL TO THIS LOCATION! SEND IT TO OUR PO BOX.</strong></p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
