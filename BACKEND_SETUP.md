# Backend Setup Guide

## Overview
The backend is a Node.js/Express server that connects to a MySQL database to manage:
- Dog club events
- Training classes
- Class signup registrations

## Prerequisites
- Node.js (v16 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn

## Installation

### 1. Install Backend Dependencies

```bash
npm install
```

This installs both frontend and backend dependencies.

### 2. Set Up MySQL Database

**Option A: Using MySQL Command Line**

```bash
mysql -u root -p < server/database.sql
```

**Option B: Using MySQL Workbench or GUI Tool**
- Open [server/database.sql](server/database.sql)
- Execute the SQL script in your MySQL client

This will:
- Create the `dog_club_db` database
- Create tables: `events`, `classes`, `class_signups`
- Insert sample data for testing

### 3. Configure Environment Variables

**Copy the example environment file:**

```bash
cp .env.example .env
```

**Edit `.env` with your MySQL credentials:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_password
DB_NAME=dog_club_db

# Server Configuration
SERVER_PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev:server
```

Server will run on `http://localhost:3001`

### Run Frontend & Backend Together

```bash
npm run dev:all
```

This runs:
- Frontend (Vite) on `http://localhost:5173`
- Backend (Node.js) on `http://localhost:3001`

### Production Mode

```bash
npm run build:server
npm run start:server
```

## Database Schema

### events table
- `event_id` (INT, Primary Key)
- `title` (VARCHAR)
- `event_date` (DATE)
- `event_time` (TIME)
- `location` (VARCHAR)
- `description` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

### classes table
- `class_id` (INT, Primary Key)
- `title` (VARCHAR)
- `level` (ENUM: Beginner, Intermediate, Advanced, All Levels)
- `instructor` (VARCHAR)
- `schedule` (VARCHAR)
- `price` (DECIMAL)
- `description` (TEXT)
- `max_students` (INT)
- `created_at`, `updated_at` (TIMESTAMP)

### class_signups table
- `signup_id` (INT, Primary Key)
- `class_id` (INT, Foreign Key → classes)
- `first_name`, `last_name` (VARCHAR)
- `email`, `phone` (VARCHAR)
- `dog_name`, `dog_breed`, `dog_age` (VARCHAR)
- `dog_experience` (ENUM: beginner, some, experienced)
- `signup_date` (TIMESTAMP)
- `status` (ENUM: pending, confirmed, cancelled)

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (admin)

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class with enrollment info
- `POST /api/classes` - Create class (admin)

### Signups
- `POST /api/signups` - Create new signup
- `GET /api/signups/email/:email` - Get user's signups
- `GET /api/signups/class/:classId` - Get class signups (admin)

### Health Check
- `GET /api/health` - Server status

## Connecting Your Existing Database

### To connect to an existing database:

1. **Update `.env` with your connection details:**
   ```env
   DB_HOST=your_host
   DB_PORT=your_port
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_database_name
   ```

2. **Verify your table structure matches the schema**, or update `/server/routes/*.ts` to match your existing tables

3. **Test the connection:**
   ```bash
   npm run dev:server
   ```
   You should see: `✅ MySQL Connected Successfully`

## Frontend Integration

The frontend uses the API service located at [src/services/api.ts](src/services/api.ts)

### Example Usage:

```typescript
import { signupsAPI } from '../services/api';

// Create a signup
const result = await signupsAPI.create({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '123-456-7890',
  dogName: 'Max',
  dogBreed: 'Golden Retriever',
  dogAge: '2 years',
  dogExperience: 'beginner',
  classId: 1
});
```

## Troubleshooting

### "Cannot find module 'mysql2'"
```bash
npm install mysql2
```

### "Connection refused"
- Check MySQL is running
- Verify database credentials in `.env`
- Check DB_HOST and DB_PORT are correct

### "Database not found"
- Run the database.sql script to create the database
- Verify DB_NAME in `.env` matches your database name

### CORS errors
- Check CORS_ORIGIN in `.env` matches your frontend URL
- For development: should be `http://localhost:5173`

## File Structure

```
server/
├── config/
│   └── database.ts          # MySQL connection pool
├── routes/
│   ├── events.ts            # Events API endpoints
│   ├── classes.ts           # Classes API endpoints
│   └── signups.ts           # Signup API endpoints
├── index.ts                 # Express server setup
└── database.sql             # Database schema & sample data

src/
└── services/
    └── api.ts               # Frontend API client
```

## Next Steps

1. ✅ Set up MySQL database with `server/database.sql`
2. ✅ Configure `.env` with your database credentials
3. ✅ Run `npm run dev:all` to start both servers
4. ✅ Update API route handlers to execute actual database queries
5. ✅ Test API endpoints with Postman or similar tool
6. ✅ Connect frontend components to use the API service

## Support

For issues or questions:
1. Check that MySQL is running
2. Verify `.env` configuration
3. Check console logs for error messages
4. Test endpoints directly at `http://localhost:3001/api/health`
