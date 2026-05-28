import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Welcome to Keystone Canine Training Club</h1>
        <p>Dog and puppy training in the Pittsburgh, PA area</p>
      </section>

      {/* CLASS NOTES */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📋 Class Notes</h2>
        <div className={styles.card}>
          <ul className={styles.notesList}>
            <li>Our Session III classes will begin on May 18.</li>
            <li>Building will be closed for Rodeo Trial and Set up July 14th through July 19th</li>
            <li>Building will be closed for CWAGS Trial Set up Sept 24th through Sept 26th</li>
            <li>Building will be closed for CWAGS Trial Set up Dec 3rd through Dec 5th</li>
          </ul>
        </div>
      </section>

      {/* 2026 TRIAL SCHEDULE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🏆 2026 Trial Schedule &amp; Other Events</h2>
        <div className={styles.card}>
          <ul className={styles.eventList}>
            <li>
              <strong>RODEO DOG TRIAL</strong> – July 18–19, 2026
              <span className={styles.subtext}>Premium to come at later date.</span>
            </li>
            <li>
              <strong>C-Wags TRIAL</strong> – September 27, 2026
              <span className={styles.subtext}>Premium to come at later date.</span>
            </li>
            <li>
              <strong>WCRL RALLY TRIAL</strong> – November 28–29, 2026
              <span className={styles.subtext}>Premium to come at later date.</span>
            </li>
            <li>
              <strong>C-Wags TRIAL</strong> – December 6, 2026
              <span className={styles.subtext}>Premium to come at later date.</span>
            </li>
            <li>
              <strong>RODEO DOG TRIAL</strong> – December 12–13, 2026
              <span className={styles.subtext}>Premium to come at later date.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ABOUT US */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🐕 About Us</h2>
        <div className={styles.card}>
          <p>
            Keystone Canine Training Club offers dog and puppy training in the Pittsburgh, PA area.
            We are a non-profit organization mainly devoted to providing basic obedience training to
            dogs and their owners, to make their pets well-behaved family members and welcome members
            of the community.
          </p>
          <p>
            We offer puppy and young dog classes (for dogs under one year old), Family Manners
            Obedience classes at Basic and more advanced levels. We also offer classes in Agility,
            Rally, Scent Work, and Tricks. We have preparation classes for Canine Good Citizen (CGC)
            testing. We have certified Puppy STAR and CGC evaluators.
          </p>
          <p>
            Our events and instructors have been featured in local newspapers, cable television, and
            even the Wall Street Journal. One of our instructors and her dog appeared with the
            Pittsburgh Symphony Orchestra!
          </p>
          <p>
            Our classes are open to the public. All of our instructors and officers are strictly
            volunteers, who freely donate their time and energy to benefit the community.
          </p>
          <p>
            Our location is 5167 Brownsville Road in Baldwin Borough, in the south suburbs of
            Pittsburgh, PA. Our mailing address is PO Box 921, Bethel Park, PA 15102-0921.
          </p>
          <p className={styles.aboutLinks}>
            <Link to="/classes" className={styles.link}>View Class Schedule →</Link>
            {' | '}
            <Link to="/contact" className={styles.link}>Contact Us →</Link>
          </p>
          <p className={styles.note}>We do not offer Service Dog training.</p>
        </div>
      </section>

      {/* ON-GOING EVENTS */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📅 On-Going Events</h2>

        <div className={styles.card}>
          <h3>KCTC on YouTube!</h3>
          <p>
            We have created a short video about KCTC that has been posted on YouTube.{' '}
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              Click here for the link.
            </a>
          </p>
        </div>

        <div className={styles.card}>
          <h3>Competition Level Obedience Training Drop-In Class</h3>
          <p>
            Our Competition Level Obedience class is held Saturdays at 9:00 am. Julie Agosti is the
            instructor, and she teaches the skills needed for AKC Open Obedience. It is intended for
            handlers ready to move on to AKC Open from AKC Novice. A Novice title is not a
            prerequisite to attend this class.
          </p>
          <p>
            Contact Terry Younkins (<a href="mailto:terryyounkins@hotmail.com" className={styles.link}>terryyounkins@hotmail.com</a>)
            by 8:00 pm each Friday before the class if you wish to attend. No drop-ins will be allowed.
          </p>
        </div>

        <div className={styles.card}>
          <h3>Conformation Drop-In Class &amp; Introduction to Conformation</h3>
          <p>
            Our Conformation Drop-In class with Clare Schmalz is held every Wednesday at 8:30 pm,
            even between class sessions. No advance registration is needed.
          </p>
          <p>
            Introduction to Conformation is a 5-week class, by appointment. Send an email to{' '}
            <a href="mailto:info@keystonecanine.com" className={styles.link}>info@keystonecanine.com</a>{' '}
            if you wish to enroll.
          </p>
        </div>

        <div className={styles.card}>
          <h3>Membership &amp; Board Meetings</h3>
          <p>
            Our regular membership meetings are normally held the third Sunday of odd-numbered months,
            at 7:00 at KCTC.
          </p>
          <p>Our Board meetings are held when appropriate.</p>
        </div>
      </section>
    </div>
  );
}
