import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function BuildingUsage() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>🏢 Building Usage</h1>
        <p>Guidelines and scheduling for our training facility</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card}>
          <h2>Existing Bookings</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Room</th>
                <th>Day/Time</th>
                <th>Member/Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Front Room</td>
                <td>Saturdays 6:00 – 8:00 PM</td>
                <td>Judy Muller</td>
              </tr>
              <tr>
                <td>Front Room</td>
                <td>Mondays 8:30 – 10:30 AM</td>
                <td>Linda Irwin</td>
              </tr>
              <tr>
                <td>Both Rooms</td>
                <td>Tuesdays 7:30 AM – 10:30 AM</td>
                <td>Regularly scheduled cleaning</td>
              </tr>
              <tr>
                <td>Front Room</td>
                <td>Wednesdays 10:00 AM – 6:00 PM</td>
                <td>Rally and Agility set-up and classes</td>
              </tr>
              <tr>
                <td>Back Room</td>
                <td>Wednesdays 9:00 AM – 12:00 PM</td>
                <td>Intro to Conformation lessons</td>
              </tr>
              <tr>
                <td>Both Rooms</td>
                <td>One hour before &amp; after any regularly scheduled class</td>
                <td>See Class Schedule</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.card}>
          <h2>Guidelines for Use</h2>
          <p>
            If you are an Instructor and want to use the building when classes or events are not scheduled, you can do so by following this procedure: First, check the schedule below to pick a time when the building is free. Then send an e-mail to info@keystonecanine.com with your name and desired room and time slot (date and time - start &amp; end time; default is 1 hr if endtime is not provided). We will confirm your time slot and add your name to the schedule below. Please note that any official club events (seminars, run-thrus, trials, etc.) supersede private building usage, even if they are scheduled after you reserve a time slot. Building usage is for the private use of instructors, not for formal lessons or classes, and non-members are not allowed to participate. Also, please comply with the requirements below.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Requirements</h2>
          <ul>
            <li>When entering, sign the sign-in sheet. When leaving, turn out all lights (including the one near the front door), check the bathrooms for running toilets, and sign out (and check off the boxes) on the sign-in sheet.</li>
            <li>In cold weather, turn the thermostats down to 45 degrees. In hot weather, turn off all fans, and set the thermostat to 85 degrees (Front Room) or to OFF (Back Room).</li>
            <li>If your dog has peed or pooped, clean it up!</li>
          </ul>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
