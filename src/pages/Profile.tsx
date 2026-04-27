import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './Profile.module.css';
import { useUserData, type Dog, type PastClass, type UserInfo } from '../context/UserDataContext';

export default function Profile() {
  const navigate = useNavigate();
  const { userData, setUserData } = useUserData();
  console.log("Profile page user data: ", userData);

  // Redirect to login if not authenticated
  if (!userData) {
    navigate('/login');
    return null;
  }

  const [showAddDog, setShowAddDog] = useState(false);
  const [newDogForm, setNewDogForm] = useState({
    name: '',
    breed: '',
    age: '',
    experience: 'beginner',
  });

  // Use user data from context, with fallback values
  const userInfo: UserInfo =  {
    name: userData.username || 'User',
    email: userData.email || '',
    phone: userData.userInfo?.phone || '',
    memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
  };

  const [dogs, setDogs] = useState<Dog[]>(userData.dogs || [
    { id: 1, name: 'Max', breed: 'Golden Retriever', age: '3 years', experience: 'experienced' },
    { id: 2, name: 'Bella', breed: 'Labrador', age: '2 years', experience: 'some' },
  ]);

  const [pastClasses] = useState<PastClass[]>(userData.pastClasses || [
    { id: 1, className: 'Basic Obedience', instructor: 'Sarah Smith', completedDate: 'December 2023' },
    { id: 2, className: 'Advanced Training', instructor: 'Sarah Smith', completedDate: 'August 2023' },
  ]);

  const handleAddDog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDogForm.name || !newDogForm.breed || !newDogForm.age) {
      alert('Please fill in all fields');
      return;
    }

    const newDog: Dog = {
      id: Math.max(...dogs.map(d => d.id), 0) + 1,
      ...newDogForm,
    };

    setDogs([...dogs, newDog]);
    setNewDogForm({ name: '', breed: '', age: '', experience: 'beginner' });
    setShowAddDog(false);
  };

  const handleRemoveDog = (id: number) => {
    setDogs(dogs.filter(dog => dog.id !== id));
  };

  const handleLogout = () => {
    setUserData(null);
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>👤 My Profile</h1>
          <p>Welcome, {userData.userInfo?.name}!</p>
        </div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Sign Out
        </button>
      </header>

      <div className={styles.content}>
        {/* Personal Information Section */}
        <section className={styles.section}>
          <h2>Personal Information</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Name</label>
              <p>{userInfo.name}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Email</label>
              <p>{userInfo.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Phone</label>
              <p>{userInfo.phone}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Member Since</label>
              <p>{userInfo.memberSince}</p>
            </div>
          </div>
        </section>

        {/* My Dogs Section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>My Dogs</h2>
            <button
              onClick={() => setShowAddDog(!showAddDog)}
              className={styles.addButton}
            >
              {showAddDog ? '✕' : '+ Add Dog'}
            </button>
          </div>

          {showAddDog && (
            <form onSubmit={handleAddDog} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="dogName">Dog's Name</label>
                  <input
                    type="text"
                    id="dogName"
                    value={newDogForm.name}
                    onChange={(e) =>
                      setNewDogForm({ ...newDogForm, name: e.target.value })
                    }
                    placeholder="Enter dog's name"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="dogBreed">Breed</label>
                  <input
                    type="text"
                    id="dogBreed"
                    value={newDogForm.breed}
                    onChange={(e) =>
                      setNewDogForm({ ...newDogForm, breed: e.target.value })
                    }
                    placeholder="Enter breed"
                    required
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="dogAge">Age</label>
                  <input
                    type="text"
                    id="dogAge"
                    value={newDogForm.age}
                    onChange={(e) =>
                      setNewDogForm({ ...newDogForm, age: e.target.value })
                    }
                    placeholder="e.g., 2 years"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="experience">Experience Level</label>
                  <select
                    id="experience"
                    value={newDogForm.experience}
                    onChange={(e) =>
                      setNewDogForm({ ...newDogForm, experience: e.target.value })
                    }
                  >
                    <option value="beginner">Beginner</option>
                    <option value="some">Some Experience</option>
                    <option value="experienced">Experienced</option>
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  Save Dog
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDog(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className={styles.dogsList}>
            {dogs.length === 0 ? (
              <p className={styles.emptyState}>No dogs added yet.</p>
            ) : (
              dogs.map((dog) => (
                <div key={dog.id} className={styles.dogCard}>
                  <div className={styles.dogInfo}>
                    <h3>🐕 {dog.name}</h3>
                    <p><strong>Breed:</strong> {dog.breed}</p>
                    <p><strong>Age:</strong> {dog.age}</p>
                    <p><strong>Experience:</strong> {dog.experience}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveDog(dog.id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Past Classes Section */}
        <section className={styles.section}>
          <h2>Class History</h2>
          <div className={styles.classList}>
            {pastClasses.length === 0 ? (
              <p className={styles.emptyState}>No classes completed yet.</p>
            ) : (
              pastClasses.map((cls) => (
                <div key={cls.id} className={styles.classCard}>
                  <div className={styles.classInfo}>
                    <h3>📚 {cls.className}</h3>
                    <p><strong>Instructor:</strong> {cls.instructor}</p>
                    <p><strong>Completed:</strong> {cls.completedDate}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
