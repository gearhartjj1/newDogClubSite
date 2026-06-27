import express, { Request, Response } from 'express';
import pool from '../config/database.js';
import emailService from '../config/emailService.js';

const router = express.Router();

const getCurrentSession = async (): Promise<string> => {
  try {
    const result = await pool.query('SELECT Session from kctcsession where id = 0');
    return (result[0] as any)[0].Session as string;
  }  catch (error) {
    console.error('Error fetching current session: ', error);
    return "";
  }
}

// Get all dog classes
router.get('/', async (req: Request, res: Response) => {
  try {
    const currentSession = await getCurrentSession();
    const query = 'SELECT c.*, COUNT(e.ID) AS DogsInClass FROM KCTCSession c LEFT JOIN Enrollment e ON c.ID = e.SID WHERE c.Session = ? GROUP BY c.ID, c.class ORDER BY c.class';
    const dogClasses = await pool.query(query, [currentSession]);
    res.json(dogClasses);
  } catch (error) {
    console.error('Error fetching dog classes: ', error);
    res.status(500).json({ error: 'Failed to fetch dog classes' });
  }
});

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

// Create event (admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    //query the database to make sure there are still spots open for the class
    const dogsInClassQuery = 'SELECT MaxDog, COUNT(e.ID) AS DogsInClass FROM KCTCSession c LEFT JOIN Enrollment e ON c.ID = e.SID WHERE c.ID = ?';
    const dogsInClassResult = await pool.query(dogsInClassQuery, [req.body.classId]);
    const dogsInClassCount = (dogsInClassResult[0] as any)[0].DogsInClass;
    const maxDogs = (dogsInClassResult[0] as any)[0].MaxDog;
    const spotsOpen = dogsInClassCount < maxDogs;
    const forcedWaitlist = req.body.paymentMethod !== 7 && !spotsOpen;

    const maxIdResult = await pool.query('SELECT MAX(ID) AS maxId FROM Enrollment');
    //TODO: this works well, but I should probably add some error handling here in case of failures
    const newIdValue = (maxIdResult[0] as any)[0].maxId + 1;
    const newQuery = 'INSERT INTO Enrollment VALUES (?, ?, ?, \'Y\', \'Y\', ?, ?, ?, ?, \'Y\', \'None\', \'internet\', ?)';
    const response = await pool.query(newQuery, [newIdValue, req.body.userId, req.body.classId, spotsOpen ? req.body.paymentMethod : 7, req.body.dogName, req.body.dogAge, req.body.dogBreed, Date.now()]);

    //if class is sign up succeeds then send confirmation email
    //TODO: Should also figure out the email info for the club email or make a custom one
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
          <p><em>If you are not a KCTC member, please bring a copy of your dog's up-to-date vaccine records to your first class and give it to your instructor.</em></p>
          <hr style="border: 1px solid #3498db; margin: 20px 0;" />
          <h3 style="color: #2c3e50;">Enrollment Information</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr style="background-color: #f8f9fa;">
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
              <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${req.body.paymentMethod}</td>
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
    await emailService.sendEmail(req.body.email, 'KEYSTONE CANINE TRAINING CLUB CLASS ENROLLMENT', emailHtml);
    if (spotsOpen) {
      res.status(201).json({
        message: 'Event created - connect to database',
        status: 'ready'
      });
    } else {
      res.status(400).json({ error: 'No spots available in the class', status: 'waitlisted' });
    }
  } catch (error) {
    console.error('Error creating event: ', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
