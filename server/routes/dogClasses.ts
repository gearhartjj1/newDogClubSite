import express, { Request, Response } from 'express';
import pool from '../config/database.js';
import emailServiceResend from '../config/emailServiceResend.js';

const router = express.Router();

// Beta testing logger – structured JSON for easy searching
const betaLog = (action: string, details?: Record<string, unknown>) => {
  const entry = {
    timestamp: new Date().toISOString(),
    route: 'dogClasses',
    action,
    ...details,
  };
  console.log(`[BETA][dogClasses] ${action}`, JSON.stringify(entry));
};

const getCurrentSession = async (): Promise<{ session: string; code: string, startDate: string }> => {
  try {
    //The session being opened is controlled in the Code value and the session start date is in the Class value
    //Not great, a little hacky, but will do for now
    const result = await pool.query('SELECT Session, Code, Class from kctcsession where id = 0');
    const row = (result[0] as any)[0];
    return { session: row.Session, code: row.Code, startDate: row.Class };
  }  catch (error) {
    console.error('Error fetching current session: ', error);
    return { session: '', code: '', startDate: '' };
  }
}

// Get all dog classes
router.get('/', async (req: Request, res: Response) => {
  try {
    betaLog('GET_ALL_CLASSES_START');
    const currentSession = await getCurrentSession();
    const query = 'SELECT c.*, COUNT(e.ID) AS DogsInClass FROM KCTCSession c LEFT JOIN Enrollment e ON c.ID = e.SID WHERE c.Session = ? GROUP BY c.ID, c.class ORDER BY c.class';
    const dogClasses = await pool.query(query, [currentSession.session]);
    betaLog('GET_ALL_CLASSES_COMPLETE', { session: currentSession.session, resultCount: (dogClasses[0] as any[])?.length ?? 0 });
    res.json(dogClasses);
  } catch (error) {
    betaLog('GET_ALL_CLASSES_ERROR', { error: String(error) });
    console.error('Error fetching dog classes: ', error);
    res.status(500).json({ error: 'Failed to fetch dog classes' });
  }
});

router.get('/session-status', async (req: Request, res: Response) => {
  const currentSession = await getCurrentSession();
  const sessionsOpen = currentSession.code == 'A';
  const currentDate = new Date();
  const sessionStartDate = new Date(currentSession.startDate);
  const pastSessionStart = currentDate > sessionStartDate;
  //sessionStatus: 0 = session signup not started, 1 = session open, 2 = session closed because of being past signup
  const sessionData = {
    sessionStatus: sessionsOpen ? 1 : (pastSessionStart ? 2 : 0),
    sessionStartDate: sessionStartDate,
    sessionName: currentSession.session
  }
  res.json(sessionData);
})

// Get all dog classes joined by a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const query = `SELECT c.* FROM KCTCSession c INNER JOIN Enrollment e ON c.ID = e.SID WHERE e.PID = ? and e.paymethod != 7 and e.paymethod != 9 GROUP BY c.ID, c.class ORDER BY c.class`;
    const dogClasses = await pool.query(query, [userId]);
    res.json(dogClasses);
  } catch (error) {
    console.error('Error fetching dog classes for user: ', error);
    res.status(500).json({ error: 'Failed to fetch dog classes for user' });
  }
});

// Create enrollment
router.post('/', async (req: Request, res: Response) => {
  const enrollStartTime = Date.now();
  try {
    // --- Input validation ---
    const classId = parseInt(req.body.classId, 10);
    const userId = parseInt(req.body.userId, 10);
    const paymentMethod = parseInt(req.body.paymentMethod, 10);
    const dogName = typeof req.body.dogName === 'string' ? req.body.dogName.trim() : '';
    const dogBreed = typeof req.body.dogBreed === 'string' ? req.body.dogBreed.trim() : '';

    betaLog('ENROLLMENT_REQUEST', {
      classId,
      userId,
      paymentMethod,
      dogName,
      dogBreed,
      dogAge: req.body.dogAge,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      dogClassName: req.body.dogClassName,
      dogClassCode: req.body.dogClassCode,
      ip: req.ip,
    });

    //this is the issue, if you don't sign in you won't have a user id and this fix returns an error
    //So the issue is that non-members have a generic entry created to track them even if they don't create an account
    //I really don't like that, but I probably need to do that because I assume that ties down with enrollment lists and payments
    if (isNaN(classId) || isNaN(userId) || isNaN(paymentMethod)) {
      betaLog('ENROLLMENT_VALIDATION_FAIL', { reason:  'invalid_numbers', classId: req.body.classId, userId: req.body.userId, paymentMethod: req.body.paymentMethod });
      res.status(400).json({ error: 'classId, userId, and paymentMethod must be valid numbers' });
      return;
    }

    //ToDo: when the api returns 400 the UI should show an error and not success
    if (!dogName) {
      betaLog('ENROLLMENT_VALIDATION_FAIL', { reason: 'missing_dogName', userId });
      res.status(400).json({ error: 'dogName is required' });
      return;
    }

    // --- Query the database to make sure there are still spots open for the class ---
    const dogsInClassQuery = 'SELECT MaxDog, COUNT(e.ID) AS DogsInClass FROM KCTCSession c LEFT JOIN Enrollment e ON c.ID = e.SID WHERE c.ID = ? GROUP BY c.MaxDog';
    const dogsInClassResult = await pool.query(dogsInClassQuery, [classId]);
    const dogsInClassCount = (dogsInClassResult[0] as any)[0].DogsInClass;
    const maxDogs = (dogsInClassResult[0] as any)[0].MaxDog;
    const spotsOpen = dogsInClassCount < maxDogs;
    const forcedWaitlist = paymentMethod !== 7 && !spotsOpen;

    betaLog('ENROLLMENT_CAPACITY_CHECK', {
      classId,
      dogsInClassCount,
      maxDogs,
      spotsOpen,
      forcedWaitlist,
      requestedPaymentMethod: paymentMethod,
    });

    // Extract numeric value from dogAge (e.g. "5 years" -> 5)
    let parsedDogAge: number | null = null;
    if (req.body.dogAge != null && String(req.body.dogAge).trim() !== '') {
      const match = String(req.body.dogAge).match(/\d+(\.\d+)?/);
      parsedDogAge = match ? parseFloat(match[0]) : null;
    }

    const maxIdResult = await pool.query('SELECT MAX(ID) AS maxId FROM Enrollment');
    const maxId = (maxIdResult[0] as any)[0].maxId;
    const newIdValue = maxId != null ? maxId + 1 : 1;

    // Format current date as MySQL-compatible datetime string
    const enrollmentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const effectivePaymentMethod = spotsOpen ? paymentMethod : 7;
    //Todo: the memberYN value needs to be 1 if member and 0 if not, not Y or N
    //Todo: the PaidYN needs to be updated to be 1 if paid and 0 if not, not Y or N
    //select t.FirstName, t.LastName, e.* from  enrollment e join teacher t on e.PID = t.family where e.HeardAboutFrom = "internet - new site"
    const newQuery = 'INSERT INTO Enrollment VALUES (?, ?, ?, \'1\', \'Y\', ?, ?, ?, ?, \'Y\', \'None\', \'internet - new site\', ?)';
    const response = await pool.query(newQuery, [newIdValue, userId, classId, effectivePaymentMethod, dogName, parsedDogAge, dogBreed, enrollmentDate]);

    betaLog('ENROLLMENT_DB_INSERT', {
      enrollmentId: newIdValue,
      classId,
      userId,
      effectivePaymentMethod,
      dogName,
      dogBreed,
      parsedDogAge,
      spotsOpen,
      forcedWaitlist,
    });

    //if class is sign up succeeds then send confirmation email
    //TODO: Should also figure out the email info for the club email or make a custom one
    const paymentMethodNames: { [key: number]: string } = {
      1: 'PayPal',
      2: 'Cash',
      3: 'Check',
      4: 'Instructor Perk',
      7: 'Waitlist',
    };
    const paymentMethodDisplay = paymentMethodNames[effectivePaymentMethod] || `Unknown (${effectivePaymentMethod})`;

    let emailHtml = "";
    if (spotsOpen) {
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
            Keystone Canine Training Club - Enrollment Confirmation
          </h2>
          <p>We have received your enrollment; the details are displayed below. Please review them.</p>
          <p>If any of this information is not correct, please reply to this message so that we can correct any problems.</p>
          <p>If we should find any issues with your enrollment, we will contact you. There is no need for you to contact us to confirm receipt of your enrollment.</p>
          <p><strong>Unless you use PayPal, bring your payment (cash or check) to the first class and give it to your instructor.</strong></p>
          <p>Thank you for choosing Keystone Canine Training Club. We look forward to seeing you in class!</p>
          <p><em>If you are not a KCTC member, please bring a copy of your dog's up-to-date vaccine records and your signed Liability Waiver to your first class and give it to your instructor.</em></p>
          <hr style="border: 1px solid #3498db; margin: 20px 0;" />
          <h3 style="color: #2c3e50;">Enrollment Information</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Signup ID</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${newIdValue}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Class Code</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogClassCode}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Account holder name</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.firstName} ${req.body.lastName}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Name</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Breed</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogBreed}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Age</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogAge}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Payment Method</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${paymentMethodDisplay}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Class Name</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogClassName}</td>
            </tr>
          </table>
        </div>`;
    } else {
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #e74c3c;">Class Full - Waitlisted</h2>
          <p>${!forcedWaitlist ? "We have received your request to be WAITLISTED for the class displayed below." : "***** Sorry, while you were enrolling, someone else completed their enrollment taking the last spot in the class displayed below.  *****"}</p>
          <p>We will contact you if a spot becomes available.</p>
          <hr style="border: 1px solid #e74c3c; margin: 20px 0;" />
          <h3 style="color: #2c3e50;">Waitlist Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Signup ID</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${newIdValue}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Class Code</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogClassCode}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Class Name</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogClassName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Name</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogName}</td>
            </tr>
            <tr style="background-color: #f8f9fa;">
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Breed</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogBreed}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Dog Age</td>
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.dogAge}</td>
            </tr>
          </table>
        </div>`;
    }
    await emailServiceResend.sendEmail(req.body.email, 'KEYSTONE CANINE TRAINING CLUB CLASS ENROLLMENT', emailHtml);
    betaLog('ENROLLMENT_EMAIL_SENT', { email: req.body.email, spotsOpen, enrollmentId: newIdValue });

    const durationMs = Date.now() - enrollStartTime;
    if (spotsOpen) {
      betaLog('ENROLLMENT_SUCCESS', { enrollmentId: newIdValue, classId, userId, dogName, durationMs });
      res.status(201).json({
        message: 'Event created - connect to database',
        status: 'ready'
      });
    } else {
      betaLog('ENROLLMENT_WAITLISTED', { enrollmentId: newIdValue, classId, userId, dogName, forcedWaitlist, durationMs });
      res.status(400).json({ error: 'No spots available in the class', status: 'waitlisted' });
    }
  } catch (error) {
    const durationMs = Date.now() - enrollStartTime;
    betaLog('ENROLLMENT_ERROR', { error: String(error), body: req.body, durationMs });
    console.error('Error creating event: ', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
