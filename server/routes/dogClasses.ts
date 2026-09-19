import express, { Request, Response } from 'express';
import pool from '../config/database.js';
import emailServiceResend from '../config/emailServiceResend.js';
import crypto from 'crypto';
import { getEnrollmentEmail } from '../config/utils.js';

function secureRandomString(length: number) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Max lengths from the legacy Teacher/Enrollment column definitions
const LIMITS = {
  teacherName: 50,    // Teacher.FirstName / Teacher.LastName varchar(50)
  teacherPhone: 50,   // Teacher.Phone varchar(50)
  teacherEmail: 50,   // Teacher.Email varchar(50)
  teacherComment: 50, // Teacher.Comment1 varchar(50)
  dogName: 255,       // Enrollment.DogName varchar(255)
  dogBreed: 30,       // Enrollment.DogBreed varchar(30)
} as const;

// Coerce to string, strip control characters, collapse whitespace, trim, and truncate
const sanitizeString = (value: unknown, maxLength: number): string => {
  if (typeof value !== 'string' && typeof value !== 'number') return '';
  return String(value)
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
};

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
    const query = `SELECT c.*, e.DogName, e.ID AS EnrollmentID, e.PayMethod, e.PaidYN, e.MemberYN,
        e.DogBreed, e.DogAge, SUM(p.AmtPaid) AS AmtPaid
        FROM KCTCSession c
        INNER JOIN Enrollment e ON c.ID = e.SID
        LEFT JOIN Payment p ON p.FamilyId = e.ID
        WHERE e.PID = ? AND e.PayMethod != 7 AND e.PayMethod != 9
        GROUP BY e.ID`;
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

// TODO This weekend
//    Hook up paypal integration with clubs paypal
//    Email club about planning next test session

// Create enrollment
router.post('/', async (req: Request, res: Response) => {
  const enrollStartTime = Date.now();
  try {
    // --- Input validation & sanitization ---
    const classId = parseInt(req.body.classId, 10);
    let userId = parseInt(req.body.userId, 10);
    const paymentMethod = parseInt(req.body.paymentMethod, 10);
    const dogName = sanitizeString(req.body.dogName, LIMITS.dogName);
    const dogBreed = sanitizeString(req.body.dogBreed, LIMITS.dogBreed);
    const firstName = sanitizeString(req.body.firstName, LIMITS.teacherName);
    const lastName = sanitizeString(req.body.lastName, LIMITS.teacherName);
    const email = sanitizeString(req.body.email, LIMITS.teacherEmail);
    const phone = sanitizeString(req.body.phone, LIMITS.teacherPhone);

    // Write sanitized values back so downstream consumers (email template, logs) use clean data
    req.body.dogName = dogName;
    req.body.dogBreed = dogBreed;
    req.body.firstName = firstName;
    req.body.lastName = lastName;
    req.body.email = email;
    req.body.phone = phone;
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
      firstName,
      lastName,
      email,
      dogClassName: req.body.dogClassName,
      dogClassCode: req.body.dogClassCode,
      ip: req.ip,
      isActiveMember: req.body.isActiveMember,
    });

    if (!email || !isValidEmail(email)) {
      betaLog('ENROLLMENT_VALIDATION_FAIL', { reason: 'invalid_email', email });
      res.status(400).json({ error: 'A valid email address is required' });
      return;
    }

    // TODO: putting the code here for now but the logic to create a user should be moved elsewhere for account creation later
    if (isNaN(userId)) {
      if (!firstName || !lastName) {
        betaLog('ENROLLMENT_VALIDATION_FAIL', { reason: 'missing_name', firstName, lastName });
        res.status(400).json({ error: 'firstName and lastName are required' });
        return;
      }

      // Check if a user with the provided email already exists
      const checkUserQuery = 'SELECT Family FROM teacher WHERE Email = ? and LastName = ?';
      const checkUserResult = await pool.query(checkUserQuery, [email, lastName]);
      if ((checkUserResult[0] as any).length > 0) {
        userId = (checkUserResult[0] as any)[0].Family;
      }

      // if no account is found, create one for the user
      if (isNaN(userId)) {
        const newUserIdQuery = "select max(Family) from Teacher";
        const newUserIdResult = await pool.query(newUserIdQuery);
        const newUserId = ((newUserIdResult[0] as any)[0]['max(Family)'] || 0) + 1;
        userId = newUserId;
        newUserCreated = true;
        newUserPassword = secureRandomString(16); // Teacher.Password is varchar(16)
        const createUserQuery = 'INSERT INTO Teacher (Family, Email, FirstName, LastName, Phone, Comment1, Security, Password) VALUES (?, ?, ?, ?, ?, ?, 5, ?)';
        await pool.query(createUserQuery, [newUserId, email, firstName, lastName, phone, dogName.slice(0, LIMITS.teacherComment), newUserPassword]);
      }
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
    // Enrollment.DogAge is varchar(3): clamp so the stored value fits in 3 characters
    if (parsedDogAge != null) {
      parsedDogAge = Math.min(parsedDogAge, 999);
      if (String(parsedDogAge).length > 3) {
        parsedDogAge = Math.min(Math.round(parsedDogAge), 999);
      }
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
    await emailServiceResend.sendEmail(email, 'KEYSTONE CANINE TRAINING CLUB CLASS ENROLLMENT', emailHtml);
    betaLog('ENROLLMENT_EMAIL_SENT', { email, spotsOpen, enrollmentId: newIdValue });

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
