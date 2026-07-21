import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { useUserData, type Dog, type PastClass, type UserInfo } from '../context/UserDataContext';
import { dogClassAPI, memberDogsAPI, signinAPI } from '../services/api';

export default function Profile() {
  const navigate = useNavigate();
  const { userData, setUserData } = useUserData();

  const [showAddDog, setShowAddDog] = useState(false);
  const [newDogForm, setNewDogForm] = useState({
    name: '',
    breed: '',
    age: '',
  });

  const [dogs, setDogs] = useState<Dog[]>([]);
  const [pastClasses, setPastClasses] = useState<PastClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<PastClass | null>(null);

  // there is a bu here where on refresh the userData is not loaded causing this to go to the login page
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userData) {
      navigate('/login');
    }
  }, [userData, navigate]);

  // Fetch user's dogs from database on component load
  useEffect(() => {
    const fetchUserDogs = async () => {
      try {
        if (userData?.id) {
          const response = await memberDogsAPI.getByFamilyId(userData.id);
          if (response.success && response.data) {
            const formattedDogs: Dog[] = response.data.map((dog: any) => ({
              id: dog.id,
              name: dog.name,
              breed: dog.breed,
              age: dog.age,
            }));
            setDogs(formattedDogs);
          }
        }
      } catch (error) {
        console.error('Error fetching user dogs:', error);
      }
    };

    fetchUserDogs();
  }, [userData?.id]);

  // Fetch user's enrolled classes on component load
  useEffect(() => {
    const fetchUserClasses = async () => {
      try {
        if (userData?.id) {
          const response = await dogClassAPI.getByUserId(userData.id);

          const paymentMethodNames: { [key: number]: string } = {
            1: 'PayPal',
            2: 'Cash',
            3: 'Check',
            4: 'Instructor Perk',
            7: 'Waitlist',
          };

          setPastClasses(response.map(cls => ({
            id: cls.ID,
            className: cls.Class,
            instructor: cls.Instructors || 'N/A',
            completedDate: cls.Start + ' ' + (cls.Session ? cls.Session.split('-')[0] : ''),
            classDate: new Date(cls.Start + ' ' + (cls.Session ? cls.Session.split('-')[0] : '')),
            dogName: cls.DogName || 'N/A',
            enrollmentId: (cls as any).EnrollmentID,
            sessionId: cls.ID,
            paymentMethod: paymentMethodNames[(cls as any).PayMethod] || `Unknown (${(cls as any).PayMethod})`,
            paidStatus: (cls as any).PaidYN === '1' || (cls as any).PaidYN === 'Y' ? 'Paid' : 'Unpaid',
            dogBreed: (cls as any).DogBreed || 'N/A',
            dogAge: (cls as any).DogAge != null ? String((cls as any).DogAge) : 'N/A',
            session: cls.Session || 'N/A',
            day: (cls as any).Day || 'N/A',
            time: (cls as any).Time || 'N/A',
            room: (cls as any).Room || 'N/A',
          })).sort((a, b) => b.classDate.getTime() - a.classDate.getTime())); // Sort by most recent
        }
      } catch (error) {
        console.error('Error fetching user classes:', error);
      }
    };

    fetchUserClasses();
  }, [userData?.id]);

  // Don't render profile content if not authenticated
  if (!userData) {
    return null;
  }

  // Use user data from context, with fallback values
  const userInfo: UserInfo = {
    name: userData.username || 'User',
    email: userData.email || '',
    phone: userData.userInfo?.phone || '',
    memberSince: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
  };

  const handleAddDog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDogForm.name || !newDogForm.breed || !newDogForm.age) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (!userData?.id) {
        alert('User ID not found');
        return;
      }

      const response = await memberDogsAPI.add(
        userData.id,
        newDogForm.name,
        newDogForm.breed,
        newDogForm.age
      );

      if (response.success) {
        const newDog: Dog = {
          id: response.data.id,
          name: response.data.name,
          breed: response.data.breed,
          age: response.data.age,
        };

        setDogs([...dogs, newDog]);
        setNewDogForm({ name: '', breed: '', age: '' });
        setShowAddDog(false);
      } else {
        alert('Failed to add dog: ' + response.error);
      }
    } catch (error) {
      console.error('Error adding dog:', error);
      alert('Failed to add dog');
    }
  };

  const handleRemoveDog = async (id: number) => {
    try {
      const response = await memberDogsAPI.remove(id);

      if (response.success) {
        setDogs(dogs.filter(dog => dog.id !== id));
      } else {
        alert('Failed to remove dog: ' + response.error);
      }
    } catch (error) {
      console.error('Error removing dog:', error);
      alert('Failed to remove dog');
    }
  };

  const handleLogout = async () => {
    const response = await signinAPI.logout();
    if (response.success) {
      setUserData(null);
      navigate('/login');
    } else {
      alert('Failed to logout: ' + response.error);
    }
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
                <div key={cls.enrollmentId} className={styles.classCard}>
                  <div className={styles.classInfo}>
                    <h3>📚 {cls.className}</h3>
                    <p><strong>Instructor:</strong> {cls.instructor}</p>
                    <p><strong>Class start date:</strong> {cls.completedDate}</p>
                    <p><strong>Dog name:</strong> {cls.dogName}</p>
                  </div>
                  <button
                    className={styles.expandButton}
                    onClick={() => setSelectedClass(cls)}
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Class Details Modal */}
      {selectedClass && (
        <div className={styles.modalOverlay} onClick={() => setSelectedClass(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>📚 {selectedClass.className}</h2>
              <button className={styles.modalClose} onClick={() => setSelectedClass(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                <div className={styles.modalItem}>
                  <label>Session</label>
                  <p>{selectedClass.session}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Session ID</label>
                  <p>{selectedClass.sessionId}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Enrollment ID</label>
                  <p>{selectedClass.enrollmentId}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Class Start Date</label>
                  <p>{selectedClass.completedDate}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Day &amp; Time</label>
                  <p>{selectedClass.day} at {selectedClass.time}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Room</label>
                  <p>{selectedClass.room}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Instructor</label>
                  <p>{selectedClass.instructor}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Dog Name</label>
                  <p>{selectedClass.dogName}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Dog Breed</label>
                  <p>{selectedClass.dogBreed}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Dog Age</label>
                  <p>{selectedClass.dogAge}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Payment Method</label>
                  <p>{selectedClass.paymentMethod}</p>
                </div>
                <div className={styles.modalItem}>
                  <label>Payment Status</label>
                  <p className={selectedClass.paidStatus === 'Paid' ? styles.statusPaid : styles.statusUnpaid}>
                    {selectedClass.paidStatus}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}