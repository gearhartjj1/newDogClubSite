import express, { Request, Response } from 'express';
import pool from '../config/database.js';

const router = express.Router();

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