import { Link } from 'react-router-dom';
import styles from './InfoPage.module.css';

export default function Directions() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>🗺️ Directions</h1>
        <p>How to find our training facility</p>
      </section>

      <section className={styles.contentStacked}>
        <div className={styles.card}>
          <h2>Directions to our Building (5167 Brownsville Rd.)</h2>

          <h3>From Downtown Pittsburgh</h3>
          <p>
            Take the Liberty Bridge and go thru the Liberty Tunnel, staying in the right lane. Turn right AFTER the light at the end of the tunnel onto the cloverleaf for Rt. 51 South. Turn right onto Streets Run Rd. Go to the T-intersection and turn left at the light onto Brownsville Rd. KCTC is on the left, just after Option Supply.
          </p>

          <h3>From I-79</h3>
          <p>
            Take I-79 to Exit 55. Turn right at the light at the end of the exit ramp onto Rt. 50 and get into the left lane. Turn left at the first light onto Vanadium Rd. Turn left at first light onto Bower Hill Rd. Turn right at the first light onto Kelso Rd. Go to the dead end and turn left at the T-intersection onto Painters Run Rd. It will change name to Conner Rd. Take it to the end at Rt. 88 (Library Rd.). Turn right onto Rt. 88, then turn left onto Broughton Road (Walgreens on the right corner). Go to the T-intersection and turn left at the light. Then go under the bridge and turn left onto Brownsville Rd. KCTC will be on your right just before Option Supply.
          </p>

          <h3>From the East</h3>
          <p>
            Take the Parkway East (I-376) to the Boulevard of the Allies to the Liberty Bridge and go thru the Liberty Tunnel, staying in the right lane. Turn right AFTER the light at the end of the tunnel onto the cloverleaf for Rt. 51 South. Turn right onto Streets Run Rd. Go to the T-intersection and turn left at the light onto Brownsville Rd. KCTC is on the left, just after Option Supply.
          </p>

          <h3>Alternate Directions from the Far East to Avoid Downtown Pittsburgh Traffic</h3>
          <p>
            Take I-70 West to Route 51 North. Go 18 miles and take the 2nd cloverleaf exit at the top of a long hill (just past the U-Haul rental on the right) onto Curry Hollow Road west-bound (follow the "Yellow Belt/Bethel Park/South Park" sign). Go past the Sunoco station on the right, then down a long hill, and turn right onto Brownsville Road just before the overhead railroad bridge. KCTC will be about 0.8 miles on the right, just before Option Supply.
          </p>

          <h3>From the South Hills or Finleyville or Library</h3>
          <p>
            Take South Park Road or Route 88 North to the 5-way intersection (GetGo on the far corner). Take a right onto South Park Road (if coming from Route 88). (Note - South Park Road becomes Baptist Road.) Take the 2nd right onto Broughton Rd. Go to the T-intersection and turn left at the light. Then go under the railroad bridge and turn left at a light onto Brownsville Rd. KCTC will be 0.8 miles on your right just before Option Supply.
          </p>

          <h3>From South Park</h3>
          <p>
            Take Brownsville Road. Go under a railroad bridge, then turn left at the first light to stay on Brownsville. Go about 0.8 miles and KCTC is on the right, just past the Loose Moose Tavern.
          </p>

          <h3>From Elizabeth or Pleasant Hills</h3>
          <p>
            Take Route 51 North. Exit at the cloverleaf just past the U-haul dealer and follow the signs that say "Yellow Belt/South Park/Bethel Park" and turn right onto Lebanon Church Road. Go past the Sunoco station on the right, then down a long hill, and turn right onto Brownsville Road just before the overhead railroad bridge. KCTC will be about 0.8 miles on the right, just before Option Supply.
          </p>

          <h3>Using GPS?</h3>
          <p>Punch in <strong>5167 Brownsville Rd., Pittsburgh PA 15236</strong></p>

          <hr style={{ margin: '30px 0', borderColor: '#e0e0e0' }} />

          <h3>Telephone</h3>
          <p>(412) 833-2211<br />Voice Mail answers 24 hours a day.</p>

          <h3>E-Mail</h3>
          <p><a href="mailto:info@keystonecanine.com">info@keystonecanine.com</a></p>

          <h3>Snail Mail</h3>
          <p>
            Keystone Canine Training Club<br />
            PO Box 921<br />
            Bethel Park, Pennsylvania 15102-0921
          </p>

          <p>The physical location is <strong>5167 Brownsville Rd.</strong></p>
        </div>
      </section>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
