import express, { Request, Response } from 'express';
import pool from '../config/database.js';
import emailServiceResend from '../config/emailServiceResend.js';
import crypto from 'crypto';
import { getEnrollmentEmail } from '../config/utils.js';

function secureRandomString(length: number) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

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
  } catch (error) {
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
    const query = `SELECT c.*, e.DogName, e.ID AS EnrollmentID, e.PayMethod, e.PaidYN, e.MemberYN, e.DogBreed, e.DogAge FROM KCTCSession c INNER JOIN Enrollment e ON c.ID = e.SID WHERE e.PID = ? and e.paymethod != 7 and e.paymethod != 9`;
    const dogClasses = await pool.query(query, [userId]);
    res.json(dogClasses);
  } catch (error) {
    console.error('Error fetching dog classes for user: ', error);
    res.status(500).json({ error: 'Failed to fetch dog classes for user' });
  }
});

// Get class rate data
router.get('/rates', async (req: Request, res: Response) => {
  try {
    const query = `SELECT * FROM rate`;
    const classRates = await pool.query(query);
    res.json(classRates);
  } catch (error) {
    console.error('Error fetching class rates: ', error);
    res.status(500).json({ error: 'Failed to fetch class rates' });
  }
});

//TODO:
// Update PayPal to use account for club
// Update signup system to properly record if someone is a member or not, riht now I am defaulting to yes
//    If someone is an active member it is determined by checking the CourseList property on the teacher entry, if it contains 1 then they are a member
//    New design - check if someone is a member based on the value, if it shows they are a member set that in the enrollment entry
//    If it is a guest signup then create the generic non-member account if one does not exist and set enrollment as non-member
//    On the UI indicate if they are going to be signing up as a member or not
//    Add option to say I am am member during sign up. If this doesn't match the database trigger email to admin@keystonecanine.com to let an admin know that this is the case
//    That way an admin will know if someone is either trying to sign up falsely or that the database needs fixed
//      This is almost done. Just need to pass the checked value into the server during enrollment
//      Should add in logic to email the admin email when someone not marked as member tries to sign up as a member
//  
// Update system to properly work for non-members
//    The old site always creates a generic user non-member account to tie data to?
//    This is necessary for things like payment and emails on classes, is there a better method?

// TODO This weekend
//    Configure signup method for non-members --- Done just need to finalize email notifications
//    Hook up paypal integration with clubs paypal
//    Email club about planning next test session

// Create enrollment
router.post('/', async (req: Request, res: Response) => {
  const enrollStartTime = Date.now();
  try {
    // --- Input validation ---
    const classId = parseInt(req.body.classId, 10);
    let userId = parseInt(req.body.userId, 10);
    const paymentMethod = parseInt(req.body.paymentMethod, 10);
    const dogName = typeof req.body.dogName === 'string' ? req.body.dogName.trim() : '';
    const dogBreed = typeof req.body.dogBreed === 'string' ? req.body.dogBreed.trim() : '';
    //TODO: configure this to send email to admin if this value is true... Maybe just store in database for review?
    const isNotValidatedMember = req.body.notValidatedMember || false;
    let newUserCreated = false;
    let newUserPassword = '';

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
      isActiveMember: req.body.isActiveMember,
    });

    //this is the issue, if you don't sign in you won't have a user id and this fix returns an error
    //So the issue is that non-members have a generic entry created to track them even if they don't create an account
    //I really don't like that, but I probably need to do that because I assume that ties down with enrollment lists and payments
    
    //How to handle signing up without a logged in user...
    // 1. Check if user is logged in - if so great
    // 2. If the user is not logged in, check the system for a matching account based on the email provided
    // 3. If not account for the email exists, create a new user account based on the provided data
    // 4. Enroll user in the class with the new account
    // 5. Send confirmation email but also include details on how to log into account to review enrollment and pay for class

    // TODO: putting the code here for now but the logic to create a user should be moved elsewhere for account creation later
    if (isNaN(userId)) {
      // Check if a user with the provided email already exists
      const checkUserQuery = 'SELECT Family FROM teacher WHERE Email = ? and LastName = ?';
      const checkUserResult = await pool.query(checkUserQuery, [req.body.email, req.body.lastName]);
      if ((checkUserResult[0] as any).length > 0) {
        userId = (checkUserResult[0] as any)[0].Family;
      }
      console.log("what the id is now: ", userId);

      // if no account is found, create one for the user
      if (isNaN(userId)) {
        const newUserIdQuery = "select max(Family) from Teacher";
        const newUserIdResult = await pool.query(newUserIdQuery);
        const newUserId = ((newUserIdResult[0] as any)[0]['max(Family)'] || 0) + 1;
        userId = newUserId;
        newUserCreated = true;
        console.log("user token now again: ", userId);
        newUserPassword = secureRandomString(16);
        const createUserQuery = 'INSERT INTO Teacher (Family, Email, FirstName, LastName, Phone, Comment1, Security, Password) VALUES (?, ?, ?, ?, ?, ?, 5, ?)';
        //This works well, 
        // TODO: I need to include details in the email in this scenario so the user knows how to access the account
        await pool.query(createUserQuery, [newUserId, req.body.email, req.body.firstName, req.body.lastName, req.body.phone, req.body.dogName, newUserPassword]);
      }

      //Create user if non exists
      //const createUserQuery = 'INSERT INTO Enrollment VALUES (?, ?, ?, ?, \'0\', ?, ?, ?, ?, \'Y\', \'None\', \'internet - new site\', ?)';
      //const response = await pool.query(createUserQuery, [newIdValue, userId, classId, req.body.isActiveMember ? 1 : 0, effectivePaymentMethod, dogName, parsedDogAge, dogBreed, enrollmentDate]);
    }

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
    const newQuery = 'INSERT INTO Enrollment VALUES (?, ?, ?, ?, \'0\', ?, ?, ?, ?, \'Y\', \'None\', \'internet - new site\', ?)';
    const response = await pool.query(newQuery, [newIdValue, userId, classId, req.body.isActiveMember ? 1 : 0, effectivePaymentMethod, dogName, parsedDogAge, dogBreed, enrollmentDate]);

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
    let emailHtml = getEnrollmentEmail(spotsOpen, forcedWaitlist, paymentMethod, req, newIdValue, newUserCreated, newUserPassword);
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
