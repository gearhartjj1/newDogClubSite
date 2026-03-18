import express, { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

//TODO: get existing database to connect
//Update sql queries based on how the current database is structured
//Build basic pages for UI
//Plan out more phases

//TODO: Get query configured to get full data on classes includeing number enrolled

// Get all classes
router.get('/', async (req: Request, res: Response) => {
  try {
    //const query = 'SELECT * FROM KCTCSession';
    //const query = 'SELECT * FROM Enrollment';
    //const query = 'SELECT  S.class,S.Start,S.Time,S.Instructors,S.CurDog,E.DogName FROM Enrollment E, KCTCSession S where E.SID = S.ID';
    //const query = 'SELECT Count(*) FROM Enrollment E, KCTCSession S where E.SID = S.ID';
    const query = 'SELECT c.*, COUNT(e.id) AS enrolled_dogs FROM KCTCSession c INNER JOIN Enrollment e ON c.id = e.SID GROUP BY c.id, c.class ORDER BY c.class';
    const stuffFromEnrollment = await pool.query(query);
    console.log('Enrollment data fetched:', stuffFromEnrollment);
    // TODO: Execute query using database connection
    
    res.json({
      message: 'Classes endpoint - connect to database',
      status: 'ready'
    });
  } catch (error) {
    console.log("the error: ", error);
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
});

// Get single class with enrollment info
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT c.*, COUNT(s.signup_id) as enrolled_count
      FROM classes c
      LEFT JOIN class_signups s ON c.class_id = s.class_id
      WHERE c.class_id = ?
      GROUP BY c.class_id
    `;
    // TODO: Execute query using database connection
    
    res.json({
      message: `Class ${id} endpoint - connect to database`,
      status: 'ready'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch class' });
  }
});

// Create class (admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, level, instructor, schedule, price, description, max_students } = req.body;
    
    if (!title || !level || !instructor) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO classes (title, level, instructor, schedule, price, description, max_students)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    // TODO: Execute query using database connection
    
    res.status(201).json({
      message: 'Class created - connect to database',
      status: 'ready'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class' });
  }
});

export default router;
