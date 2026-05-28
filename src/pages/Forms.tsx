import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function Forms() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>📋 Forms</h1>
        <p>Downloadable forms for members and applicants</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card}>
          <h2>Forms</h2>
          <hr />
          <p>
            Here is the link to the enrollment instructions and the{' '}
            <Link to="/classes">Online Enrollment Form</Link>, which are built into the
            CLASS SCHEDULE page. We no longer accept hardcopy enrollment forms.
          </p>

          <hr />

          <h3>Hardcopy Forms (PDF format)</h3>

          <hr style={{ border: 'none', borderTop: '1px dashed #ccc' }} />

          <ul>
            <li><a href="/KCTC LIABILITY WAIVER Version May 2026.pdf" download>Liability Waiver and Refund Policy</a> <em>Revision 5/12/26</em></li>
            <li><a href="/EVENT LIABILITY WAIVER 4-14-15.pdf" download>Event Liability Waiver Form</a> <em>Revision 4-14-15</em></li>
            <li><a href="/LIABILITY WAIVER FOR VOLUNTEERS 4-12-15.pdf" download>Liability Waiver for Volunteers</a> <em>Revision 4-12-15</em></li>
          </ul>

          <hr style={{ border: 'none', borderTop: '1px dashed #ccc' }} />

          <ul>
            <li><a href="/MEMBERSHIP APP 1-18-16.pdf" download>Membership Application</a> <em>Revision 1-18-16</em></li>
            <li><a href="/MEMBERSHIP RENEWAL FORM.pdf" download>Membership Renewal</a> <em>Revision 2026-2027</em></li>
          </ul>

          <hr style={{ border: 'none', borderTop: '1px dashed #ccc' }} />

          <ul>
            <li><a href="/Volunteer Timesheet.pdf" download>Volunteer Timesheet (PDF format)</a> or <a href="/Volunteer Timesheet.doc" download>Volunteer Timesheet (MS Word format)</a></li>
            <li><a href="#" download>KCTC Flyer</a></li>
          </ul>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
