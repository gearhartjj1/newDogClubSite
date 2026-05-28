import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function Membership() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>🤝 Membership</h1>
        <p>Join our community of dog enthusiasts</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card}>
          <h2>Membership</h2>

          <p>
            You do not have to be a member of Keystone Canine Training Club (KCTC) to take our classes. However, if you become a member, there are many benefits including a lower price for classes. Anyone over the age of 16 who owns and works a dog at KCTC or who actively participates in club events may apply for membership in the Club.
          </p>

          <p><strong>In order to become a member, you must:</strong></p>

          <ul>
            <li>Take two classes at the Non-Member rate (currently $100 for most classes).</li>
            <li>After that, submit a membership application endorsed by two members (can be instructors), along with your annual dues (currently $70). Then your name is published in our monthly newsletter.</li>
            <li>Then the membership votes on your application at a membership meeting held every other month.</li>
            <li>After you are voted into membership, your class price drops to the Members' rate (currently $30).</li>
            <li>If you become a member after the beginning of our fiscal year, your next year's dues are pro-rated.</li>
          </ul>
          <br/>
          <p>
            All members must volunteer their services annually for at least one of the Club's dog shows, community events, or special events. You can download a membership application by clicking on <Link to="/forms">Forms</Link>.
          </p>

          <h2>What are the benefits of belonging to Keystone Canine Training Club?</h2>

          <h3><strong>Lots of benefits!!!</strong></h3>

          <p>
            <strong>Financial:</strong> After paying the annual membership fee, members may attend classes for a reduced cost.
          </p>

          <p>
            <strong>Educational:</strong> Members get to work their dogs and get personal tips and attention from some of the most successful amateur and professional dog trainers in Western Pennsylvania.
          </p>

          <p>
            <strong>Family:</strong> Members not only develop a well behaved dog, but also get to participate in wholesome, healthy activities like Agility, Rally, Scentwork and Tricks that the whole family can enjoy together!
          </p>

          <p>
            <strong>Emotional:</strong> Keystone Canine Training Club members and their dogs serve the public good in many different ways, including school demonstrations and nursing home visits. There is no more enjoyable way to feel good about yourself and give back to the community at the same time!
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
