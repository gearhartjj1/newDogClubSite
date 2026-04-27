import express, { Request, Response } from 'express';
import pool from '../config/database';

const router = express.Router();

// Get all dog classes
router.get('/', async (req: Request, res: Response) => {
  try {
    const query = 'SELECT c.*, COUNT(e.id) AS DogsInClass FROM KCTCSession c INNER JOIN Enrollment e ON c.id = e.SID WHERE c.Session = "2024-V" GROUP BY c.id, c.class ORDER BY c.class';
    //const query = 'SELECT * FROM KCTCSession WHERE Session = "2024-V"';
    const dogClasses = await pool.query(query);
    console.log('Dog classes fetched:', dogClasses);
    res.json(dogClasses);
  } catch (error) {
    console.log('Error fetching dog classes: ', error);
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

/**
 * [
[1]     `ID` INT NOT NULL PRIMARY KEY,
[1]     `PID` INT,
[1]     `SID` INT,
[1]     `MemberYN` VARCHAR(1),
[1]     `PaidYN` VARCHAR(1),
[1]     `PayMethod` VARCHAR(1),
[1]     `DogName` VARCHAR(255),
[1]     `DogAge` VARCHAR(3),
[1]     `DogBreed` VARCHAR(30),
[1]     `DogSpayNeut` VARCHAR(1),
[1]     `DogConcerns` VARCHAR(255),
[1]     `HeardAboutFrom` VARCHAR(255),
[1]     `TimeSTMP` VARCHAR(255)
[1]   ]
 */

// Create event (admin)
router.post('/', async (req: Request, res: Response) => {
  console.log('dog class post: ', req.body);
  try {
    //TODO: I have the basic query to add rnrollment data
    //-I need to update the form to be more similar to the form in the old site
    //-I need to pass in the class selection id and include it here
    //-I need to verify some of ht eother id values in the Enrollment table
    //-I need to create something to check your enrollment data for now I could check the num enrolled data on main ui
    //PID - Think is profile id?
    //SID - session id (class id)? - CORRECT
    //I need to add checks to pull the latest data from the database before performing this
    //I need to verify there are open spots in the class before enrolling
    //Update class page to not allow enrolling if the max limit of dogs is reached

    //TODO: I should have the user id value from the login, need to pass in the pId and pass that into this

    const maxIdResult = await pool.query('SELECT MAX(ID) AS maxId FROM Enrollment');
    //TODO: this works well, but I should probably add some error handling here in case of failures
    const newIdValue = (maxIdResult[0] as any)[0].maxId + 1;
    console.log("the new id is: ", (maxIdResult[0] as any)[0].maxId);
    const newQuery = `insert into Enrollment values (${newIdValue}, 1, ${req.body.classId}, 'Y', 'Y', 1, '${req.body.dogName}', '${req.body.dogAge}', '${req.body.dogBreed}', 'Y', 'None', 'internet', ${Date.now()})`;
    const response = await pool.query(newQuery);
    console.log('Database response: ', response);
    
    res.status(201).json({
      message: 'Event created - connect to database',
      status: 'ready'
    });
  } catch (error) {
    console.log('Error creating event: ', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

export default router;
