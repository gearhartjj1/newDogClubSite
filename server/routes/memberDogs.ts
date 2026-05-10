import express, { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: string;
}

// Get all dogs for a specific family
router.get('/:familyId', async (req: Request, res: Response) => {
  try {
    const { familyId } = req.params;

    const query = 'SELECT DogID as id, DogName as name, DogBreed as breed, DogAge as age FROM MemberDogs WHERE FamilyID = ? ORDER BY DogName';
    const [dogs]: any = await pool.query(query, [familyId]);

    res.status(200).json({
      success: true,
      data: dogs || []
    });

  } catch (error) {
    console.error('Error fetching member dogs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch member dogs'
    });
  }
});

// Add a new dog for a member
router.post('/', async (req: Request, res: Response) => {
  try {
    const { familyId, dogName, dogBreed, dogAge } = req.body;

    // Validate required fields
    if (!familyId || !dogName) {
      return res.status(400).json({
        success: false,
        error: 'FamilyID and DogName are required'
      });
    }

    const query = 'INSERT INTO MemberDogs (FamilyID, DogName, DogBreed, DogAge) VALUES (?, ?, ?, ?)';
    const result: any = await pool.query(query, [familyId, dogName, dogBreed, dogAge]);

    res.status(201).json({
      success: true,
      message: 'Dog added successfully',
      dogId: result.insertId,
      data: {
        id: result.insertId,
        name: dogName,
        breed: dogBreed,
        age: dogAge
      }
    });

  } catch (error) {
    console.error('Error adding member dog:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add member dog'
    });
  }
});

// Remove a dog for a member
router.delete('/:dogId', async (req: Request, res: Response) => {
  try {
    const { dogId } = req.params;

    const query = 'DELETE FROM MemberDogs WHERE DogID = ?';
    const result: any = await pool.query(query, [dogId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Dog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Dog removed successfully'
    });

  } catch (error) {
    console.error('Error removing member dog:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove member dog'
    });
  }
});

export default router;
