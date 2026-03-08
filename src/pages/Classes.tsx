import { Link } from 'react-router-dom';
import styles from './Classes.module.css';

interface Class {
  id: number;
  title: string;
  level: string;
  instructor: string;
  schedule: string;
  price: number;
  description: string;
  maxStudents: number;
  enrolled: number;
}

export default function Classes() {
  const classes: Class[] = [
    {
      id: 1,
      title: 'Puppy Kindergarten',
      level: 'Beginner',
      instructor: 'Sarah Johnson',
      schedule: 'Mondays & Wednesdays, 10:00 AM',
      price: 149,
      description: 'Perfect for puppies 8-16 weeks old. Focus on socialization, basic commands, and crate training.',
      maxStudents: 8,
      enrolled: 6,
    },
    {
      id: 2,
      title: 'Basic Obedience',
      level: 'Beginner',
      instructor: 'Mike Chen',
      schedule: 'Saturdays, 2:00 PM',
      price: 199,
      description: 'Learn sit, stay, come, and loose leash walking. Great foundation for all dogs.',
      maxStudents: 10,
      enrolled: 9,
    },
    {
      id: 3,
      title: 'Intermediate Training',
      level: 'Intermediate',
      instructor: 'Emma Davis',
      schedule: 'Tuesdays & Thursdays, 6:00 PM',
      price: 249,
      description: 'Advanced obedience, off-leash skills, and impulse control for dogs with basic training.',
      maxStudents: 8,
      enrolled: 7,
    },
    {
      id: 4,
      title: 'Agility Fundamentals',
      level: 'Intermediate',
      instructor: 'Alex Rivera',
      schedule: 'Sundays, 3:00 PM',
      price: 199,
      description: 'Introduction to agility obstacles and techniques. Fun, energetic class for athletic dogs.',
      maxStudents: 6,
      enrolled: 5,
    },
    {
      id: 5,
      title: 'Reactive Dogs Workshop',
      level: 'Advanced',
      instructor: 'Dr. Patricia Lee',
      schedule: 'Saturdays, 4:00 PM',
      price: 299,
      description: 'Specialized training for dogs with reactivity, aggression, or anxiety issues.',
      maxStudents: 4,
      enrolled: 3,
    },
    {
      id: 6,
      title: 'Trick Training',
      level: 'All Levels',
      instructor: 'Tom Wilson',
      schedule: 'Fridays, 5:00 PM',
      price: 79,
      description: 'Fun tricks and impressive skills! Single session classes, no prerequisites needed.',
      maxStudents: 12,
      enrolled: 10,
    },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🎓 Training Classes</h1>
        <p>Professional dog training programs for all levels</p>
      </header>

      <div className={styles.classesGrid}>
        {classes.map((dogClass) => (
          <div key={dogClass.id} className={styles.classCard}>
            <div className={styles.classHeader}>
              <h2>{dogClass.title}</h2>
              <span className={`${styles.badge} ${styles[dogClass.level.toLowerCase()]}`}>
                {dogClass.level}
              </span>
            </div>

            <div className={styles.classInfo}>
              <p>
                <strong>Instructor:</strong> {dogClass.instructor}
              </p>
              <p>
                <strong>Schedule:</strong> {dogClass.schedule}
              </p>
              <p>
                <strong>Price:</strong> ${dogClass.price}/month
              </p>
            </div>

            <p className={styles.description}>{dogClass.description}</p>

            <div className={styles.enrollment}>
              <div className={styles.progress}>
                <div
                  className={styles.progressBar}
                  style={{
                    width: `${(dogClass.enrolled / dogClass.maxStudents) * 100}%`,
                  }}
                ></div>
              </div>
              <span className={styles.enrollmentText}>
                {dogClass.enrolled}/{dogClass.maxStudents} enrolled
              </span>
            </div>

            <Link to={`/signup?classId=${dogClass.id}`} className={styles.signupButton}>
              Sign Up
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
