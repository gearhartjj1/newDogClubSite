import express, { Request, Response } from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Extend express-session types to include our user data
declare module 'express-session' {
  interface SessionData {
    user: {
      id: number;
      username: string;
      firstName: string;
      email: string;
      phone: string;
    };
  }
}

interface SignInRequest {
  username: string;
  password: string;
}

interface SignInResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    username: string;
    firstName: string;
    email: string;
    phone: string;
  };
  error?: string;
}

// Sign in user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as SignInRequest;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      } as SignInResponse);
    }

    // Query the database for the user
    const query = 'SELECT * FROM Teacher WHERE LastName = ? LIMIT 1';
    try {
      const [rows]: any = await pool.query(query, [username]);

      if (!rows || rows.length === 0) {
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        } as SignInResponse);
      }

      const user = rows[0];

      // Compare password (basic comparison - TODO: implement bcrypt hashing for production)
      if (user.Password !== password) {
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        } as SignInResponse);
      }

      // Build session user data (only what the client needs)
      const sessionUser = {
        id: user.Family,
        username: user.LastName,
        firstName: user.FirstName,
        email: user.Email || '',
        phone: user.Phone || '',
      };

      // Store user in session
      req.session.user = sessionUser;

      // Successful login - return user data from session
      res.status(200).json({
        success: true,
        message: 'Sign in successful',
        user: sessionUser,
      } as SignInResponse);

    } catch (dbError: any) {
      console.error('Database error during sign in: ', dbError);
      if (dbError.message && dbError.message.includes('ER_NO_SUCH_TABLE')) {
        console.error('Teacher table not found. Check database schema.');
        return res.status(500).json({
          success: false,
          error: 'Database configuration error. Teacher table not found.'
        } as SignInResponse);
      }
      throw dbError;
    }

  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process sign in request'
    } as SignInResponse);
  }
});

// Get current session user
router.get('/me', (req: Request, res: Response) => {
  if (req.session.user) {
    return res.status(200).json({
      success: true,
      user: req.session.user,
    });
  }
  return res.status(401).json({
    success: false,
    error: 'Not authenticated',
  });
});

// Logout - destroy session
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
      return res.status(500).json({ success: false, error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
});

export default router;