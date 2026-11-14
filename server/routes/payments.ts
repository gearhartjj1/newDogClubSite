import express, { Request, Response, NextFunction } from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Require a logged-in admin (applied per-route; member-facing routes stay open)
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  if (!req.session.user.isAdmin) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

// Admin: get full enrollment details (class, member, dog, payment) by enrollment ID
router.get('/admin/enrollment/:enrollmentId', requireAdmin, async (req: Request, res: Response) => {
  try {
    const enrollmentId = Number(req.params.enrollmentId);
    if (!Number.isInteger(enrollmentId)) {
      return res.status(400).json({ success: false, error: 'Invalid enrollment id' });
    }

    const query = `SELECT c.*, e.DogName, e.ID AS EnrollmentID, e.PID, e.PayMethod, e.PaidYN, e.MemberYN,
        e.DogBreed, e.DogAge, SUM(p.AmtPaid) AS AmtPaid,
        t.FirstName, t.LastName, t.Email, t.Phone
        FROM Enrollment e
        INNER JOIN KCTCSession c ON c.ID = e.SID
        LEFT JOIN Teacher t ON t.Family = e.PID
        LEFT JOIN Payment p ON p.FamilyId = e.ID
        WHERE e.ID = ?
        GROUP BY e.ID`;
    const [rows]: any = await pool.query(query, [enrollmentId]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Enrollment not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching enrollment: ', error);
    res.status(500).json({ success: false, error: 'Failed to fetch enrollment' });
  }
});

// Admin: list all distinct class sessions
router.get('/admin/sessions', requireAdmin, async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query(
      `SELECT DISTINCT Session FROM KCTCSession WHERE Session IS NOT NULL AND Session <> '' ORDER BY Session DESC`
    );
    res.json({ success: true, data: (rows || []).map((r: any) => r.Session) });
  } catch (error) {
    console.error('Error fetching sessions: ', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
});

// Admin: all enrollment data for a given session
router.get('/admin/session-enrollments', requireAdmin, async (req: Request, res: Response) => {
  try {
    const session = typeof req.query.session === 'string' ? req.query.session.trim() : '';
    if (!session) {
      return res.status(400).json({ success: false, error: 'session query parameter is required' });
    }

    const query = `SELECT e.ID AS EnrollmentID, e.PID, e.PayMethod, e.PaidYN, e.MemberYN, e.DogName,
        t.FirstName, t.LastName, t.Email,
        c.Class, c.Day, c.Time, c.Instructors, c.Rate,
        SUM(p.AmtPaid) AS AmtPaid
        FROM Enrollment e
        INNER JOIN KCTCSession c ON c.ID = e.SID
        LEFT JOIN Teacher t ON t.Family = e.PID
        LEFT JOIN Payment p ON p.FamilyId = e.ID
        WHERE c.Session = ?
        GROUP BY e.ID
        ORDER BY c.Class, t.LastName, t.FirstName`;
    const [rows]: any = await pool.query(query, [session]);
    res.json({ success: true, data: rows || [] });
  } catch (error) {
    console.error('Error fetching session enrollments: ', error);
    res.status(500).json({ success: false, error: 'Failed to fetch session enrollments' });
  }
});

// Get all payment data
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM payments';
    const payments = await pool.query(query);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments: ', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get all payments joined by a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const query = `SELECT P.*, E.PID FROM Payment P JOIN Enrollment E ON E.ID = P.FamilyId WHERE E.PID = ?`;
    const payments = await pool.query(query, [userId]);
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments for user: ', error);
    res.status(500).json({ error: 'Failed to fetch payments for user' });
  }
});
/*
INSERT INTO Payment VALUES (
    <EnrollmentID>,          -- FamilyId (links to Enrollment.ID)
    <EnrollmentID>,          -- (duplicate ID field)
    'MM/DD/YYYY',            -- JournalDate (transaction date)
    <Amount>,                -- AmtPaid (e.g. 100.00)
    'MM/DD/YYYY',            -- DatePosted
    '<Description>',         -- CheckNo ('PayPal', check#, 'Cash', etc.)
    0, 0, 0, 0, 0, 0,       -- Unused fields
    '01/01/01'               -- Placeholder date
)
*/
//TODO
//This works but there are a few issues
//The date being generated appears to be wrong - It is now close enough but the day is behind by one day
//The UI needs to refresh after it is done - the modal should still be displayed but should reflect that the item is now paid
//Need to be able to generate a link that will direct the user to log in and then open the modal for the given class
//Then on the confirmation emails, include link so users can go straight to payments

// Create a new payment record
router.post('/', async (req: Request, res: Response) => {
    try {
        const query = `INSERT INTO Payment VALUES (?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, ?)`;
        // checkNo will be "PayPal" for PayPal payments, or the check number for check payments, or "Cash" for cash payments
        const { enrollmentId, amountPaid, checkNo } = req.body;
        console.log('Creating payment with enrollmentId:', enrollmentId, 'amountPaid:', amountPaid, 'checkNo:', checkNo);
        if (!enrollmentId || !amountPaid || !checkNo) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const now = new Date();
        // MySQL parses date literals as year-month-day, so use ISO format
        const paymentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        console.log('Payment date:', paymentDate);
        const paymentResult = await pool.query(query, [enrollmentId, enrollmentId, paymentDate, amountPaid, paymentDate, checkNo, paymentDate]);
        console.log('Payment record created:', paymentResult);
        //UPDATE Enrollment SET PaidYN = '1', PayMethod = ? WHERE ID = ?
        //ToDo: should probably make sure above query passes before upating enrollment entry
        const updateEnrollmentQuery = `UPDATE Enrollment SET PaidYN = '1' WHERE ID = ?`;
        await pool.query(updateEnrollmentQuery, [enrollmentId]);
        res.json({ message: 'Payment record created', paymentResult });
    } catch (error) {
        console.error('Error creating payment: ', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
})

export default router;