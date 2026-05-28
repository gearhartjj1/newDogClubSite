import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function History() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>📜 History</h1>
        <p>Our story through the years</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card}>
          <h2>History of Keystone Canine Training Club</h2>

          <p>
            In early 1990, dog enthusiasts in the South Hills of Pittsburgh were devastated to learn of the sale of the Obedience club to which they belonged. Rather than do without a place to get together and exchange doggy knowledge, information and ideas, these dedicated dog lovers decided to establish their own canine Obedience club. The club's founding members wanted their organization to be not-for-profit and open to anyone interested in canine sports and training, regardless of whether their dog was purebred or a Heinz 57.
          </p>

          <p>
            In the Spring of 1990, the newly formed Keystone Canine Club held its first meeting in an outdoor grove in Allegheny County's South Park. Training continued to be held outdoors in South Park throughout the summer. When the weather turned cool, classes moved indoors to locations including the Carrick Sportsmen's Club in South Park Township and the Alpha Dog Training facility in Whitehall.
          </p>

          <p>
            In January, 1991, Keystone Canine relocated to 2938 Industrial Boulevard. Members volunteered many hours cleaning, painting and renovating the building and on Thursday, January 21, 1991, Keystone Canine Club proudly held its first meeting in its very own new home. Two weeks later, on February 9, 1991, the Club held its first Show &amp; Go at the new building. Both Club members and the community considered the event a huge success!
          </p>

          <p>
            Keystone Canine Club continued to expand its membership and its activities, and on June 9, 1991 the Club held the first of many successful Fun Matches at the Park Avenue School's football field in Bethel Park.
          </p>

          <p>
            In August 2003, we moved right next door to 2942 Industrial Boulevard and doubled the size of our floor area. The Club's activities have expanded to include not only Basic Obedience, but classes in more advanced Obedience, Agility, Rally, Scentwork, Tricks, Flyball, and Canine Good Citizenship/Therapy Dog. Besides classes, Keystone Canine offers Therapy Dog visits, "Keystone K9er" dance troupe performances, and school and community obedience demonstrations. In March 2009, we held our first sanctioned Teacup Agility trial (agility for little dogs). We also changed our name to Keystone Canine Training Club, to better reflect our purpose.
          </p>

          <p>
            In August 2010, we moved again to a larger building at 5167 Brownsville Road in Baldwin Borough, and installed a new cushioned rolled rubber matting surface to increase traction for agility dogs. The new building has two rooms, which enabled us to expand our class offerings. In September 2012, we held our first sanctioned APDT (now WCRL) Rally Obedience trial.
          </p>

          <p>
            The Club's membership has appeared on television, performed at community events, and been featured in dozens of magazines newsletters, and newspapers (including the Wall Street Journal!). Members and their dogs have titles and certifications in almost every area of canine achievement, including Obedience, Earthdog, Rally, Therapy, Scentwork, Freestyle Dancing, Tricks, and Agility.
          </p>

          <p>
            We look forward to continuing to serve the training needs of the community.
          </p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
