import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function ClassPrices() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>💰 Class Prices</h1>
        <p>Affordable training for every dog and handler</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card}>
          <h2>Pricing</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Class</th>
                <th>Member Cost</th>
                <th>Non-Members Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>All Six and Seven-Week Classes</td>
                <td>$30</td>
                <td>$100</td>
              </tr>
              <tr>
                <td>All Five-Week Classes</td>
                <td>$25</td>
                <td>$80</td>
              </tr>
              <tr>
                <td>All Four-Week Classes</td>
                <td>$20</td>
                <td>$60</td>
              </tr>
              <tr>
                <td>Drop-In Utility and Drop-In Open Obedience</td>
                <td>$10 per dog per day</td>
                <td>$10 per dog per day</td>
              </tr>
              <tr>
                <td>Drop-In Fee for Classes Other Than Utility, Open Obedience and Conformation</td>
                <td>$5 per dog</td>
                <td>$15 per dog</td>
              </tr>
              <tr>
                <td>Introduction to Conformation</td>
                <td>$60</td>
                <td>$60</td>
              </tr>
              <tr>
                <td>Conformation (Drop-In Class)</td>
                <td>$8 per dog</td>
                <td>$8 per dog</td>
              </tr>
              <tr>
                <td>Run Thrus (Per Dog)</td>
                <td>$5 for each run (one or two); $12 for three runs</td>
                <td>$5 for each run (one or two); $12 for three runs</td>
              </tr>
              <tr>
                <td>Walk-Ins (Not Registered)</td>
                <td>Add $5 to class quoted price</td>
                <td>Add $10 to class quoted price</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <h2>Notes</h2>
          <ul>
            <li>Please check website CLASS SCHEDULE for the number of weeks for each class.</li>
            <li>Instructors and Assistants are entitled to one free class of any type (with one dog) for each class taught during the current session.</li>
          </ul>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
