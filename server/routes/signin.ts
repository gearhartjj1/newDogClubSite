import express, { Request, Response } from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Beta testing logger – structured JSON for easy searching
const betaLog = (action: string, details?: Record<string, unknown>) => {
  const entry = {
    timestamp: new Date().toISOString(),
    route: 'signin',
    action,
    ...details,
  };
  console.log(`[BETA][signin] ${action}`, JSON.stringify(entry));
};

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

// Reject non-secure login requests in production
router.use((req: Request, res: Response, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.status(403).json({
      success: false,
      error: 'HTTPS is required for authentication. Please use a secure connection.'
    });
  }
  next();
});

// Sign in user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body as SignInRequest;

    betaLog('SIGNIN_ATTEMPT', {
      username,
      ip: req.ip,
      hasPassword: Boolean(password),
      passwordLength: typeof password === 'string' ? password.length : 0,
    });

    // Validate required fields
    if (!username || !password) {
      betaLog('SIGNIN_FAIL', { reason: 'missing_fields', username, ip: req.ip });
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      } as SignInResponse);
    }

    // Query the database for the user
    //TODO: this will fail if you have multiple users with the same last name
    const query = 'SELECT * FROM Teacher WHERE LastName = ?';
    try {
      const [rows]: any = await pool.query(query, [username]);

      if (!rows || rows.length === 0) {
        betaLog('SIGNIN_FAIL', { reason: 'user_not_found', username, ip: req.ip });
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        } as SignInResponse);
      }

      const potentialUsers: any[] = rows;
      const user = potentialUsers.find(u => u.Password === password);
      
      // Compare password (basic comparison - TODO: implement bcrypt hashing for production)
      if (!user) {
        // Detect near-misses (whitespace/case issues) without logging the password itself
        const nearMatch = potentialUsers.some(u =>
          typeof u.Password === 'string' &&
          (u.Password.trim().toLowerCase() === password.trim().toLowerCase())
        );
        betaLog('SIGNIN_FAIL', {
          reason: 'wrong_password',
          username,
          ip: req.ip,
          candidateCount: potentialUsers.length,
          nearMatch,
        });
        return res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        } as SignInResponse);
      }

      // Build session user data (only what the client needs)
      const activeMember = user.CourseList ? (user.CourseList as string).includes('1') : false;
      console.log("User's CourseList:", user.CourseList);
      console.log('Active member status:', activeMember);
      const sessionUser = {
        id: user.Family,
        username: user.LastName,
        firstName: user.FirstName,
        email: user.Email || '',
        phone: user.Phone || '',
        isActiveMember: activeMember || false,
      };

      // Store user in session
      req.session.user = sessionUser;

      betaLog('SIGNIN_SUCCESS', {
        userId: user.Family,
        username: user.LastName,
        ip: req.ip,
        isActiveMember: activeMember,
        candidateCount: potentialUsers.length,
      });

      // Successful login - return user data from session
      res.status(200).json({
        success: true,
        message: 'Sign in successful',
        user: sessionUser,
      } as SignInResponse);

    } catch (dbError: any) {
      betaLog('SIGNIN_DB_ERROR', { username, ip: req.ip, error: String(dbError) });
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
    betaLog('SIGNIN_ERROR', { ip: req.ip, error: String(error) });
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process sign in request'
    } as SignInResponse);
  }
});

// Get current session user
router.get('/me', (req: Request, res: Response) => {
  console.log('Current session user:', req.session.user);
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
  betaLog('LOGOUT', { userId: req.session.user?.id, ip: req.ip });
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