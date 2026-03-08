import express, { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

// Get all dog classes
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM KCTCSession';
    // TODO: Execute query using database connection
    const dogClasses = await pool.query(query);
    console.log('Dog classes fetched:', dogClasses);
    res.json(dogClasses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dog classes' });
  }
});

// Get single event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM events WHERE event_id = ?';
    // TODO: Execute query using database connection
    
    res.json({
      message: `Event ${id} endpoint - connect to database`,
      status: 'ready'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Create event (admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, date, time, location, description } = req.body;
    
    if (!title || !date || !time || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = 'INSERT INTO events (title, event_date, event_time, location, description) VALUES (?, ?, ?, ?, ?)';
    // TODO: Execute query using database connection
    
    res.status(201).json({
      message: 'Event created - connect to database',
      status: 'ready'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
