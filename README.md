# 🐕 Pawsome Dogs Club Website

A modern React + TypeScript website for a dog club with event listings, training classes, and member signup functionality. Includes a Node.js/Express backend with MySQL database integration.

## Features

✨ **Frontend**
- Home page with club information
- Events listing page with event details
- Training classes page with enrollment tracking
- Class signup form with validation
- Responsive design (mobile-friendly)
- Client-side routing with React Router

🔧 **Backend**
- Express.js REST API
- MySQL database integration
- CORS enabled for frontend communication
- Health check endpoint
- Error handling and validation

📊 **Database**
- Events management
- Classes management
- Class signups with member information
- Sample data included

## Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL Server (v5.7+)
- npm or yarn

### Installation

```bash
# 1. Clone or navigate to the project
cd newDogSite

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=dog_club_db
```

### Setup Database

```bash
# Run the database schema
mysql -u root -p < server/database.sql
```

This creates the database and tables, plus inserts sample data.

### Run the Application

**Option 1: Frontend only**
```bash
npm run dev
# Runs on http://localhost:5173
```

**Option 2: Backend only**
```bash
npm run dev:server
# Runs on http://localhost:3001
```

**Option 3: Both (Recommended)**
```bash
npm run dev:all
# Frontend on http://localhost:5173
# Backend on http://localhost:3001
```

## Project Structure

```
newDogSite/
├── src/                           # Frontend source
│   ├── components/
│   │   └── Navigation.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Events.tsx
│   │   ├── Classes.tsx
│   │   └── ClassSignup.tsx
│   ├── services/
│   │   └── api.ts                 # API client
│   ├── App.tsx
│   └── main.tsx
│
├── server/                        # Backend source
│   ├── config/
│   │   └── database.ts            # MySQL connection
│   ├── routes/
│   │   ├── events.ts
│   │   ├── classes.ts
│   │   └── signups.ts
│   └── index.ts                   # Express server
│
├── server/database.sql            # Database schema
├── .env.example                   # Environment template
├── DATABASE_SETUP.md              # Detailed setup guide
└── BACKEND_SETUP.md               # Backend documentation
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

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

## Database Schema

### events
- event_id, title, event_date, event_time, location, description

### classes
- class_id, title, level, instructor, schedule, price, description, max_students

### class_signups
- signup_id, class_id, first_name, last_name, email, phone, dog_name, dog_breed, dog_age, dog_experience, signup_date, status

## Usage Examples

### Fetching data in React
```typescript
import { classesAPI } from '../services/api';

// In a component
useEffect(() => {
  classesAPI.getAll().then(response => {
    setClasses(response.data);
  });
}, []);
```

### Submitting signup form
```typescript
const handleSignup = async (formData) => {
  const result = await signupsAPI.create(formData);
  if (result.success) {
    console.log('Signup successful!');
  }
};
```

## Build for Production

```bash
# Build frontend
npm run build

# Build backend
npm run build:server

# Start server
npm run start:server
```

## Troubleshooting

### MySQL Connection Error
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
- Change port in `.env` (SERVER_PORT)
- Or kill the process using the port

### CORS Errors
- Check CORS_ORIGIN in `.env`
- Ensure it matches your frontend URL

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for more detailed troubleshooting.

## Documentation

- [DATABASE_SETUP.md](DATABASE_SETUP.md) - Complete database setup guide
- [BACKEND_SETUP.md](BACKEND_SETUP.md) - Backend configuration and API reference
- [API_INTEGRATION_EXAMPLES.tsx](API_INTEGRATION_EXAMPLES.tsx) - React component examples
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed project overview

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router, CSS Modules
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL
- **Tools**: npm, ESLint, Vite

## Next Steps

1. ✅ Setup MySQL and database
2. ✅ Configure `.env` file
3. ✅ Start frontend and backend servers
4. ✅ Replace placeholder API routes with complete implementations (use .example.ts files)
5. ✅ Connect React components to API (see API_INTEGRATION_EXAMPLES.tsx)
6. ✅ Add authentication (optional)
7. ✅ Deploy to production

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, refer to the documentation files or check:
- Backend server logs: `npm run dev:server`
- Frontend console: Check browser DevTools
- Database connection: Test with `mysql -u root -p dog_club_db`

```
