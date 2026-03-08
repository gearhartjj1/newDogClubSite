import express, { Request, Response } from 'express';

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
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO class_signups 
      (class_id, first_name, last_name, email, phone, dog_name, dog_breed, dog_age, dog_experience, signup_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [classId, firstName, lastName, email, phone, dogName, dogBreed, dogAge, dogExperience];
    
    // TODO: Execute query using database connection
    // const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Signup created - connect to database',
      status: 'ready',
      data: { classId, firstName, lastName, email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create signup' });
  }
});

// Get signups for a class (admin)
router.get('/class/:classId', async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const query = 'SELECT * FROM class_signups WHERE class_id = ? ORDER BY signup_date DESC';
    
    // TODO: Execute query using database connection
    
    res.json({
      message: `Signups for class ${classId} - connect to database`,
      status: 'ready'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch signups' });
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
    
    // TODO: Execute query using database connection
    
    res.json({
      message: `Signups for ${email} - connect to database`,
      status: 'ready'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user signups' });
  }
});

export default router;
