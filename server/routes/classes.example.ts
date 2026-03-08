import express, { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

// Get all classes
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM classes';
    const [classes] = await pool.query(query);
    
    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch classes' 
    });
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
    const [classes]: any = await pool.query(query, [id]);
    
    if (classes.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Class not found' 
      });
    }

    res.json({
      success: true,
      data: classes[0]
    });
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch class' 
    });
  }
});

// Create class (admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, level, instructor, schedule, price, description, max_students } = req.body;
    
    if (!title || !level || !instructor) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    const query = `
      INSERT INTO classes (title, level, instructor, schedule, price, description, max_students)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result: any = await pool.query(query, [title, level, instructor, schedule, price, description, max_students]);
    
    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      classId: result.insertId
    });
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create class' 
    });
  }
});

export default router;
