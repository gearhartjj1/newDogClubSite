import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ClassSignup.module.css';
import { dogClassAPI } from '../services/api';

// Convert legacy date strings to the yyyy-MM-dd format required by <input type="date">
// DB dates have no year (e.g. "Oct 27"), so default to the current year instead of 2001
const toDateInputValue = (dateString: string): string => {
  if (!dateString) return '';
  const hasYear = /\d{4}/.test(dateString);
  const date = new Date(hasYear ? dateString : `${dateString} ${new Date().getFullYear()}`);
  if (isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export default function AddClass() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const isEditMode = classId != null;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    session: '',
    room: '',
    code: '',
    className: '',
    prerequisites: '',
    maxDogs: '',
    startDate: '',
    time: '',
    instructors: '',
    instructorIds: '',
    rate: '',
  });

  // In edit mode, look up the class and prefill the form
  useEffect(() => {
    if (!classId) return;
    const loadClass = async () => {
      try {
        const allClasses = await dogClassAPI.getAll();
        const dogClass = allClasses.find(c => c.ID === parseInt(classId, 10));
        if (!dogClass) {
          setError('Class not found');
          return;
        }
        setFormData({
          session: dogClass.Session ?? '',
          room: dogClass.Room ?? '',
          code: dogClass.Code ?? '',
          className: dogClass.Class ?? '',
          prerequisites: dogClass.Prerequisites ?? '',
          maxDogs: dogClass.MaxDog != null ? String(dogClass.MaxDog) : '',
          startDate: toDateInputValue(dogClass.Start),
          time: dogClass.Time ?? '',
          instructors: dogClass.Instructors ?? '',
          instructorIds: '',
          rate: dogClass.Rate != null ? String(dogClass.Rate) : '',
        });
      } catch (err) {
        console.error('Error loading class: ', err);
        setError('Failed to load class data.');
      }
    };
    loadClass();
  }, [classId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //TODO: need to get the update query working
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      if (isEditMode) {
        await dogClassAPI.updateClass(parseInt(classId, 10), formData);
      } else {
        await dogClassAPI.createNewClass(formData);
      }
      navigate('/classes');
    } catch (err) {
      console.error('Error saving class: ', err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} class. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{isEditMode ? '✏️ Edit Class' : '➕ Add a New Class'}</h1>
        <p>{isEditMode ? 'Update the details for this class' : 'Enter the details for the new class'}</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>Class Information</h2>

          <div className={styles.formGroup}>
            <label htmlFor="session">Session *</label>
            <input
              type="text"
              id="session"
              name="session"
              value={formData.session}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="room">Room *</label>
            <select
              id="room"
              name="room"
              value={formData.room}
              onChange={handleChange}
              required
            >
              <option value="">Select a room</option>
              <option value="Front">Front</option>
              <option value="Back">Back</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="code">Code *</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="className">Class *</label>
            <input
              type="text"
              id="className"
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="prerequisites">Prerequisites</label>
            <input
              type="text"
              id="prerequisites"
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="maxDogs">Maximum Dogs *</label>
            <input
              type="number"
              id="maxDogs"
              name="maxDogs"
              min="1"
              value={formData.maxDogs}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Schedule</h2>

          <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="time">Time *</label>
            <input
              type="text"
              id="time"
              name="time"
              placeholder="e.g. 7:00 PM"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Instructors & Rate</h2>

          <div className={styles.formGroup}>
            <label htmlFor="instructors">Instructors *</label>
            <input
              type="text"
              id="instructors"
              name="instructors"
              value={formData.instructors}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="instructorIds">Instructor IDs</label>
            <input
              type="text"
              id="instructorIds"
              name="instructorIds"
              placeholder="Comma-separated IDs"
              value={formData.instructorIds}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rate">Rate *</label>
            <input
              type="number"
              id="rate"
              name="rate"
              min="0"
              value={formData.rate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {error && <p style={{ color: '#dc2626', textAlign: 'center' }}>{error}</p>}

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Add Class')}
          </button>
          <button type="button" className={styles.cancelButton} onClick={() => navigate('/classes')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
