# Database Connection Guide

## Quick Start

### 1. Setup Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dog_club_db
SERVER_PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 2. Create MySQL Database

Run the database schema script:

```bash
mysql -u root -p < server/database.sql
```

Or manually execute the SQL in MySQL Workbench or your preferred tool.

### 3. Start the Server

```bash
npm run dev:server
```

Server will run on `http://localhost:3001`

### 4. Start Frontend

In a new terminal:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

### 5. Or Run Both Together

```bash
npm run dev:all
```

## Database Connection Code

The connection is managed in `server/config/database.ts`:

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dog_club_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
```

## Using the Database in Routes

Here's an example of implementing a database query (see `events.example.ts` for full implementation):

```typescript
import pool from '../config/database';

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
    console.error('Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch events' 
    });
  }
});
```

## Complete Implementation Steps

### 1. Update Route Files

Replace the placeholder routes with actual database queries:

```bash
# Replace events.ts with the complete implementation
cp server/routes/events.example.ts server/routes/events.ts

# Replace classes.ts with the complete implementation
cp server/routes/classes.example.ts server/routes/classes.ts

# Replace signups.ts with the complete implementation
cp server/routes/signups.example.ts server/routes/signups.ts
```

### 2. Connect Frontend to API

Update your React components to use the API service:

```typescript
import { signupsAPI } from '../services/api';

// In your component
const handleSubmit = async (formData) => {
  try {
    const response = await signupsAPI.create(formData);
    if (response.success) {
      // Handle success
    }
  } catch (error) {
    // Handle error
  }
};
```

### 3. Test the API

Health check endpoint:
```
GET http://localhost:3001/api/health
```

Response:
```json
{
  "status": "Server is running",
  "timestamp": "2024-03-03T...",
  "environment": "development"
}
```

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:3306"
- MySQL server is not running
- Check that MySQL is installed and started
- Verify DB_HOST and DB_PORT in .env

### Error: "ER_BAD_DB_ERROR"
- Database doesn't exist
- Run `mysql -u root -p < server/database.sql` to create it

### Error: "ER_ACCESS_DENIED_FOR_USER"
- Wrong username or password
- Check DB_USER and DB_PASSWORD in .env
- Verify credentials with: `mysql -u root -p -e "SELECT 1"`

### CORS Error in Browser
- Ensure backend is running on the correct port
- Verify CORS_ORIGIN in .env matches your frontend URL
- Check that the API URL in frontend matches backend server

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3001
kill -9 <PID>
```

## API Endpoints

All endpoints return JSON with `success` boolean and `data` or `error` fields.

### Events
- `GET /api/events` - List all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event

### Classes
- `GET /api/classes` - List all classes
- `GET /api/classes/:id` - Get class with enrollment count
- `POST /api/classes` - Create class

### Signups
- `POST /api/signups` - Create new signup
- `GET /api/signups/email/:email` - Get user's signups
- `GET /api/signups/class/:classId` - Get class signups

## Next Steps

1. ✅ Set up .env with database credentials
2. ✅ Create database with database.sql script
3. ✅ Start backend server: `npm run dev:server`
4. ✅ Copy example route files to replace placeholder routes
5. ✅ Update React components to call API endpoints
6. ✅ Test API endpoints with Postman or browser
7. ✅ Deploy to production

## Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Express.js Guide](https://expressjs.com/)
- [mysql2/promise Documentation](https://github.com/sidorares/node-mysql2)
- [React Fetching Data](https://react.dev/learn/synchronizing-with-effects)
