import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './ClassSignup.module.css';

export default function ClassSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const classId = searchParams.get('classId');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dogName: '',
    dogBreed: '',
    dogAge: '',
    dogExperience: 'beginner',
    classId: classId || '',
    agreeTerms: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const classes = [
    { id: '1', name: 'Puppy Kindergarten' },
    { id: '2', name: 'Basic Obedience' },
    { id: '3', name: 'Intermediate Training' },
    { id: '4', name: 'Agility Fundamentals' },
    { id: '5', name: 'Reactive Dogs Workshop' },
    { id: '6', name: 'Trick Training' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    console.log('Form submitted:', formData);
    setSubmitted(true);

    // Simulate form submission
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h1>Thank You!</h1>
          <p>Your registration has been submitted successfully.</p>
          <p>We'll contact you soon to confirm your enrollment.</p>
          <button onClick={() => navigate('/')} className={styles.button}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📝 Sign Up for a Class</h1>
        <p>Join our training program and start your dog's journey to success</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>Your Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Your Dog's Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="dogName">Dog's Name *</label>
            <input
              type="text"
              id="dogName"
              name="dogName"
              value={formData.dogName}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dogBreed">Breed *</label>
            <input
              type="text"
              id="dogBreed"
              name="dogBreed"
              value={formData.dogBreed}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dogAge">Age *</label>
            <input
              type="text"
              id="dogAge"
              name="dogAge"
              placeholder="e.g., 2 years, 6 months"
              value={formData.dogAge}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dogExperience">Training Experience Level *</label>
            <select
              id="dogExperience"
              name="dogExperience"
              value={formData.dogExperience}
              onChange={handleChange}
            >
              <option value="beginner">Beginner - Little to no training</option>
              <option value="some">Some Experience - Basic commands known</option>
              <option value="experienced">Experienced - Well trained dog</option>
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Class Selection</h2>

          <div className={styles.formGroup}>
            <label htmlFor="classId">Select Class *</label>
            <select
              id="classId"
              name="classId"
              value={formData.classId}
              onChange={handleChange}
              required
            >
              <option value="">- Choose a class -</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeTerms">
              I agree to the terms and conditions and understand the class policies *
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            Complete Registration
          </button>
          <button
            type="button"
            onClick={() => navigate('/classes')}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
