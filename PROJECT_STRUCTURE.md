# Pawsome Dogs Club - Project Structure

## Overview
A modern React + TypeScript website for a dog club featuring event listings, training classes, and class signup functionality.

## Project Structure

```
newDogSite/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx           # Main navigation bar component
│   │   └── Navigation.module.css    # Navigation styles
│   ├── pages/
│   │   ├── Home.tsx                # Home page with club information
│   │   ├── Home.module.css         # Home page styles
│   │   ├── Events.tsx              # Events listing page
│   │   ├── Events.module.css       # Events page styles
│   │   ├── Classes.tsx             # Training classes page
│   │   ├── Classes.module.css      # Classes page styles
│   │   ├── ClassSignup.tsx         # Class signup form
│   │   └── ClassSignup.module.css  # SignUp form styles
│   ├── App.tsx                     # Main app with routing
│   ├── App.css                     # App styles
│   ├── index.css                   # Global styles
│   ├── main.tsx                    # Entry point
│   └── assets/                     # Static assets
├── public/                         # Public assets
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript config
└── vite.config.ts                  # Vite configuration
```

## Features

### Pages

1. **Home Page** (`/`)
   - Welcome hero section
   - Information about the club
   - Links to events and classes
   - Call-to-action for signup

2. **Events Page** (`/events`)
   - List of upcoming events
   - Event details (date, time, location, description)
   - Event cards with visual design

3. **Classes Page** (`/classes`)
   - Available training classes
   - Skill level badges (Beginner, Intermediate, Advanced)
   - Enrollment status with progress bars
   - Signup buttons for each class

4. **Class Signup Page** (`/signup`)
   - Form for new member registration
   - Fields for personal info and dog information
   - Class selection dropdown
   - Form validation
   - Success confirmation message

### Components

- **Navigation**: Sticky header with responsive mobile menu

## Key Technologies

- **React 18**: UI library
- **TypeScript**: Type-safe development
- **React Router DOM**: Client-side routing
- **Vite**: Modern build tool
- **CSS Modules**: Scoped component styling

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173/` to view the site.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Styling

The site uses CSS Modules for component-scoped styling with a modern color scheme:
- Primary: `#667eea` (Purple-blue)
- Secondary: `#764ba2` (Purple)
- Gradient backgrounds for visual appeal
- Responsive design with mobile-first approach

## Form Data

The signup form collects:
- User information (name, email, phone)
- Dog information (name, breed, age, experience level)
- Class selection
- Terms and conditions agreement

Form data is logged to the console and shows a success message after submission.

## Future Enhancements

- Backend integration for persistent data storage
- Email notifications for signups
- User accounts and login system
- Class scheduling calendar
- Payment integration
- Admin dashboard for managing events and classes
- Photo gallery of club activities
- Member testimonials section

## Responsive Design

The site is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

Mobile menu toggles navigation on smaller screens for better UX.
