import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function GiftCertificates() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>🎁 Gift Certificates</h1>
        <p>Give the gift of training</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card} style={{ textAlign: 'center' }}>
          <h2>Gift Certificates</h2>
          <p>
            KCTC Gift Certificates make great gifts! You can order one in any denomination.
            To place your order, send your check to our mailing address (PO Box 921, Bethel Park
            PA 15102-0921) along with your name and address. On the check in the comments section,
            please indicate "Gift Certificate". We will then mail you a Gift Certificate in the
            amount you send. They are good for any KCTC class.
          </p>
          <p>
            <a href="/GIFT CERTIFICATE.pdf" download>Sample Gift Certificates</a>
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
