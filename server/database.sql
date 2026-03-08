-- MySQL Database Schema for Dog Club Website
-- Create and populate this database with your MySQL server

-- Create database
CREATE DATABASE IF NOT EXISTS dog_club_db;
USE dog_club_db;

-- Events table
CREATE TABLE IF NOT EXISTS events (
  event_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  class_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  level ENUM('Beginner', 'Intermediate', 'Advanced', 'All Levels') NOT NULL,
  instructor VARCHAR(255) NOT NULL,
  schedule VARCHAR(255),
  price DECIMAL(10, 2),
  description TEXT,
  max_students INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Class signups table
CREATE TABLE IF NOT EXISTS class_signups (
  signup_id INT AUTO_INCREMENT PRIMARY KEY,
  class_id INT NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  dog_name VARCHAR(100) NOT NULL,
  dog_breed VARCHAR(100),
  dog_age VARCHAR(50),
  dog_experience ENUM('beginner', 'some', 'experienced') DEFAULT 'beginner',
  signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
  FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_class (class_id),
  INDEX idx_date (signup_date)
);

-- Insert sample events data
INSERT INTO events (title, event_date, event_time, location, description) VALUES
('Beach Playdate', '2024-03-10', '10:00:00', 'Sandy Beach Park', 'Fun beach outing where dogs can play in water and sand'),
('Agility Training Workshop', '2024-03-15', '14:00:00', 'Community Center', 'Professional agility training techniques'),
('Puppy Socialization Meetup', '2024-03-17', '18:00:00', 'Riverside Park', 'Puppies meeting and playing with other young dogs'),
('Spring Obedience Rally', '2024-03-24', '09:00:00', 'Fairgrounds Arena', 'Obedience competition for all skill levels'),
('Hiking Adventure', '2024-03-31', '08:00:00', 'Mountain Trail Head', 'Scenic hiking adventure with your furry friend'),
('Dog Owners Social Hour', '2024-04-05', '17:00:00', 'Local Coffee Shop', 'Casual gathering for dog owners to chat');

-- Insert sample classes data
INSERT INTO classes (title, level, instructor, schedule, price, description, max_students) VALUES
('Puppy Kindergarten', 'Beginner', 'Sarah Johnson', 'Mondays & Wednesdays, 10:00 AM', 149.00, 'Perfect for puppies 8-16 weeks old', 8),
('Basic Obedience', 'Beginner', 'Mike Chen', 'Saturdays, 2:00 PM', 199.00, 'Learn sit, stay, come, and loose leash walking', 10),
('Intermediate Training', 'Intermediate', 'Emma Davis', 'Tuesdays & Thursdays, 6:00 PM', 249.00, 'Advanced obedience and off-leash skills', 8),
('Agility Fundamentals', 'Intermediate', 'Alex Rivera', 'Sundays, 3:00 PM', 199.00, 'Introduction to agility obstacles and techniques', 6),
('Reactive Dogs Workshop', 'Advanced', 'Dr. Patricia Lee', 'Saturdays, 4:00 PM', 299.00, 'Specialized training for reactive dogs', 4),
('Trick Training', 'All Levels', 'Tom Wilson', 'Fridays, 5:00 PM', 79.00, 'Fun tricks and impressive skills', 12);
