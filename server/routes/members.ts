import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import pool from '../config/database.js';

const router = express.Router();

function secureRandomString(length: number) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Max lengths from the legacy Teacher column definitions
const LIMITS = {
  teacherName: 50,
  teacherPhone: 50,
  teacherEmail: 50,
  teacherAddress: 50,
  teacherCityStZip: 50,
  teacherComment: 50,
} as const;

// Require a logged-in admin for all member management endpoints
const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  if (!req.session.user.isAdmin) {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
};

router.use(requireAdmin);

const memberSelect =
  'SELECT Family as id, FirstName as firstName, LastName as lastName, Email as email, Phone as phone, Security as security FROM Teacher';

// Get all members
router.get('/', async (req: Request, res: Response) => {
  try {
    const [members]: any = await pool.query(`${memberSelect} ORDER BY LastName, FirstName`);
    res.status(200).json({ success: true, data: members || [] });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch members' });
  }
});

// Search members by last name
router.get('/search', async (req: Request, res: Response) => {
  try {
    const lastName = typeof req.query.lastName === 'string' ? req.query.lastName.trim() : '';
    if (!lastName) {
      return res.status(400).json({ success: false, error: 'lastName query parameter is required' });
    }

    const [members]: any = await pool.query(
      `${memberSelect} WHERE LastName LIKE ? ORDER BY LastName, FirstName`,
      [`${lastName}%`]
    );
    res.status(200).json({ success: true, data: members || [] });
  } catch (error) {
    console.error('Error searching members:', error);
    res.status(500).json({ success: false, error: 'Failed to search members' });
  }
});

// Get a single member's info by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid member id' });
    }

    const [rows]: any = await pool.query(
      'SELECT Family as id, FirstName as firstName, LastName as lastName, Email as email, Phone as phone, CourseList as courseList FROM Teacher WHERE Family = ?',
      [id]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    const member = rows[0];
    res.status(200).json({
      success: true,
      data: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email || '',
        phone: member.phone || '',
        isActiveMember: member.courseList ? String(member.courseList).includes('1') : false,
      },
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch member' });
  }
});

// Add a new member
router.post('/', async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, homePhone, workPhone, cellPhone, address, cityStZip, comment1, comment2 } = req.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      homePhone?: string;
      workPhone?: string;
      cellPhone?: string;
      address?: string;
      cityStZip?: string;
      comment1?: string;
      comment2?: string;
    };

    if (!firstName?.trim() || !lastName?.trim()) {
      return res.status(400).json({ success: false, error: 'First name and last name are required' });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email address' });
    }

    const trimmedFirst = firstName.trim().slice(0, LIMITS.teacherName);
    const trimmedLast = lastName.trim().slice(0, LIMITS.teacherName);
    const trimmedEmail = (email || '').trim().slice(0, LIMITS.teacherEmail);
    const trimmedHomePhone = (homePhone || '').trim().slice(0, LIMITS.teacherPhone);
    const trimmedWorkPhone = (workPhone || '').trim().slice(0, LIMITS.teacherPhone);
    const trimmedCellPhone = (cellPhone || '').trim().slice(0, LIMITS.teacherPhone);
    const trimmedAddress = (address || '').trim().slice(0, LIMITS.teacherAddress);
    const trimmedCityStZip = (cityStZip || '').trim().slice(0, LIMITS.teacherCityStZip);
    const trimmedComment1 = (comment1 || '').trim().slice(0, LIMITS.teacherComment);
    const trimmedComment2 = (comment2 || '').trim().slice(0, LIMITS.teacherComment);

    // Legacy schema has no auto-increment on Teacher.Family
    const [maxRows]: any = await pool.query('SELECT max(Family) as maxId FROM Teacher');
    const newId = (maxRows[0]?.maxId || 0) + 1;
    const password = secureRandomString(16); // Teacher.Password is varchar(16)

    await pool.query(
      'INSERT INTO Teacher (Family, Email, FirstName, LastName, Phone, WorkPhone, CellPhone, Addr1, CitySTZip, Comment1, Comment2, Seq, Birthdate, Security, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURDATE(), 5, ?)',
      [newId, trimmedEmail, trimmedFirst, trimmedLast, trimmedHomePhone, trimmedWorkPhone, trimmedCellPhone, trimmedAddress, trimmedCityStZip, trimmedComment1, trimmedComment2, password]
    );

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data: {
        id: newId,
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        phone: trimmedHomePhone,
      },
    });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ success: false, error: 'Failed to add member' });
  }
});

export default router;
