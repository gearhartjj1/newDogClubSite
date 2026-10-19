import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function OfficersAndBoard() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>👥 Officers & Board</h1>
        <p>Meet the team leading our club</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card}>
          <h2>Officers and Board Members</h2>

          <p><strong>President:</strong> Dan Goldberg</p>
          <p><strong>Vice President:</strong> Katie Hinzman</p>
          <p><strong>Treasurer:</strong> Amy Sandhagen</p>
          <p><strong>Corresponding Secretary/Membership Chair:</strong> ClaraMarie Schmalz</p>
          <p><strong>Recording Secretary:</strong> Michelle Rengers</p>
          <p><strong>Ex-Officio:</strong> Dan Mullaney</p>
          <p><strong>Director at Large:</strong> Bill Tullock</p>
          <p><strong>Director at Large:</strong> Chris Palamone</p>
          <p><strong>Enrollment Coordinator:</strong> Sharon Hareza</p>
          <p><strong>Training Director:</strong> Pam Lewis</p>

          <h3>Other</h3>

          <p><strong>Webmaster:</strong> Jacob Gearhart</p>
          <p><strong>Website Editor:</strong> Cindy Sumner</p>
          <p><strong>Newsletter Editor:</strong> Arlene Boehm</p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
