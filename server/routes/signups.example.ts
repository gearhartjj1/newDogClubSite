import express, { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

// Create a new class signup
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dogName,
      dogBreed,
      dogAge,
      dogExperience,
      classId,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !dogName || !classId) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    // Check if class exists
    const [classCheck]: any = await pool.query('SELECT * FROM classes WHERE class_id = ?', [classId]);
    if (classCheck.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Class not found' 
      });
    }

    const query = `
      INSERT INTO class_signups 
      (class_id, first_name, last_name, email, phone, dog_name, dog_breed, dog_age, dog_experience, signup_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [classId, firstName, lastName, email, phone, dogName, dogBreed, dogAge, dogExperience];
    const result: any = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Signup created successfully',
      signupId: result.insertId,
      data: { classId, firstName, lastName, email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create signup' 
    });
  }
});

// Get signups for a class (admin)
router.get('/class/:classId', async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const query = 'SELECT * FROM class_signups WHERE class_id = ? ORDER BY signup_date DESC';
    const [signups] = await pool.query(query, [classId]);
    
    res.json({
      success: true,
      data: signups
    });
  } catch (error) {
    console.error('Error fetching signups:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch signups' 
    });
  }
});

// Get user signups
router.get('/email/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const query = `
      SELECT s.*, c.title, c.schedule
      FROM class_signups s
      JOIN classes c ON s.class_id = c.class_id
      WHERE s.email = ?
      ORDER BY s.signup_date DESC
    `;
    const [signups] = await pool.query(query, [email]);
    
    res.json({
      success: true,
      data: signups
    });
  } catch (error) {
    console.error('Error fetching user signups:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch signups' 
    });
  }
});

export default router;
