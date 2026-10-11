import express, { Request, Response } from 'express';
import pool from '../config/database.js';

const router = express.Router();

interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Update the logged-in user's profile data
router.put('/profile', async (req: Request, res: Response) => {
  try {
    // Only allow users to update their own profile (id comes from the session, never the client)
    const sessionUser = req.session.user;
    if (!sessionUser) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }

    const { firstName, lastName, email, phone } = req.body as UpdateProfileRequest;

    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'First name and last name are required'
      });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    const query = 'UPDATE Teacher SET FirstName = ?, LastName = ?, Email = ?, Phone = ? WHERE Family = ?';
    const [result]: any = await pool.query(query, [
      firstName.trim(),
      lastName.trim(),
      email?.trim() || '',
      phone?.trim() || '',
      sessionUser.id
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Keep the session in sync with the updated profile
    req.session.user = {
      ...sessionUser,
      username: lastName.trim(),
      firstName: firstName.trim(),
      email: email?.trim() || '',
      phone: phone?.trim() || '',
    };

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: req.session.user
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile'
    });
  }
});

export default router;
