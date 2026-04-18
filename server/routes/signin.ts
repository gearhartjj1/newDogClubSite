import express, { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

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
    email?: string;
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
    // Note: The Teacher table is where user login data is stored
    const query = 'SELECT * FROM Teacher WHERE UserName = ? LIMIT 1';
    
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

      // Successful login
      res.status(200).json({
        success: true,
        message: 'Sign in successful',
        user: {
          id: user.ID,
          username: user.UserName,
          email: user.Email || undefined
        }
      } as SignInResponse);

    } catch (dbError: any) {
      // If table doesn't exist, provide helpful error message
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

export default router;
