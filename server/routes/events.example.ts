import express, { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

// Get all events
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM events ORDER BY event_date ASC';
    const [events] = await pool.query(query);
    
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch events' 
    });
  }
});

// Get single event
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM events WHERE event_id = ?';
    const [events]: any = await pool.query(query, [id]);
    
    if (events.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Event not found' 
      });
    }

    res.json({
      success: true,
      data: events[0]
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch event' 
    });
  }
});

// Create event (admin)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, date, time, location, description } = req.body;
    
    if (!title || !date || !time || !location) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      });
    }

    const query = 'INSERT INTO events (title, event_date, event_time, location, description) VALUES (?, ?, ?, ?, ?)';
    const result: any = await pool.query(query, [title, date, time, location, description]);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      eventId: result.insertId
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create event' 
    });
  }
});

export default router;
