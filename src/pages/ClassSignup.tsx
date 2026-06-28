import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styles from './ClassSignup.module.css';
import { dogClassAPI, memberDogsAPI, type DogClass } from '../services/api';
import { useUserData, type Dog } from '../context/UserDataContext';

export default function ClassSignup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userData } = useUserData();
  const classId = searchParams.get('classId');
  const isWaitlist = searchParams.get('waitlist') === 'true';
  const [dogClasses, setDogClasses] = useState<DogClass[]>([]);
  const [availableDogs, setAvailableDogs] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchDogClasses = async () => {
      const queryDogClasses = await dogClassAPI.getAll();
      setDogClasses(queryDogClasses);
    };
    fetchDogClasses();
  }, []);

  // Fetch user's dogs from database when logged in
  useEffect(() => {
    const fetchUserDogs = async () => {
      try {
        if (userData?.id) {
          const response = await memberDogsAPI.getByFamilyId(userData.id);
          if (response.success && response.data && response.data.length > 0) {
            const formattedDogs: Dog[] = response.data.map((dog: any) => ({
              id: dog.id,
              name: dog.name,
              breed: dog.breed,
              age: dog.age,
            }));
            setAvailableDogs(formattedDogs);
          }
        }
      } catch (error) {
        console.error('Error fetching member dogs:', error);
      }
    };

    fetchUserDogs();
  }, [userData?.id]);

  const [useUsersDogs, setUseUsersDogs] = useState(!!userData);
  const [selectedDogId, setSelectedDogId] = useState<number | ''>('');

  //I think maybe this should be useMemo?
  const [formData, setFormData] = useState({
    firstName: userData?.userInfo?.name?.split(' ')[0] || '',
    lastName: userData?.userInfo?.name?.split(' ')[1] || '',
    email: userData?.email || userData?.userInfo?.email || '',
    phone: userData?.userInfo?.phone || '',
    dogName: '',
    dogBreed: '',
    dogAge: '',
    classId: classId || '',
    paymentMethod: isWaitlist ? 'Waitlist' : '',
    agreeTerms: false,
    prerequesitesMet: false,
    userId: userData?.id || null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [classWaitListed, setClassWaitListed] = useState(false);

  const classes = dogClasses.map((cls) => ({ id: cls.ID, name: cls.Class }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDogSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dogId = parseInt(e.target.value);
    const selectedDog = availableDogs.find((dog) => dog.id === dogId);
    
    if (selectedDog) {
      setSelectedDogId(dogId);
      setFormData((prev) => ({
        ...prev,
        dogName: selectedDog.name,
        dogBreed: selectedDog.breed,
        dogAge: selectedDog.age,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (!formData.prerequesitesMet) {
      alert('Please confirm that you meet the prerequisites for this class');
      return;
    }

    // Map payment method text to numeric value
    const paymentMethodMap: { [key: string]: number } = {
      // 'PayPal': 1,
      'Cash': 2,
      'Check': 3,
      'Instructor Perk': 4,
      'Waitlist': 7,
    };

    const submissionData = {
      ...formData,
      paymentMethod: paymentMethodMap[formData.paymentMethod] || 1,
      dogClassName: classes.find((cls) => cls.id === parseInt(formData.classId))?.name || '',
    };

    setSubmitted(true);
    const apiResponse = await dogClassAPI.create(submissionData);
    console.log('API Response:', apiResponse);
    if (apiResponse.status === 'waitlisted') {
      setClassWaitListed(true);
    }
    // Simulate form submission
    setTimeout(() => {
      navigate('/classes');
    }, 3000);
  };

  //TODO: this logic isn't working?
  if (submitted && !classWaitListed) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h1>Thank You!</h1>
          <p>Your registration has been submitted successfully.</p>
          <p>We'll contact you soon to confirm your enrollment.</p>
          <button onClick={() => navigate('/classes')} className={styles.button}>
            Return to Classes
          </button>
        </div>
      </div>
    );
  }

  if (submitted && classWaitListed) {
    return (
      <div className={styles.container}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>⚠️</div>
          <h1>Class Full</h1>
          <p>The class you tried to sign up for is full.</p>
          <p>You have been added to the waitlist.</p>
          <button onClick={() => navigate('/classes')} className={styles.button}>
            Return to Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>📝 {isWaitlist ? 'Join Waitlist' : 'Sign Up for a Class'}</h1>
        <p>{isWaitlist ? 'Join the waitlist for this class' : 'Join our training program and start your dog\'s journey to success'}</p>
      </header>

      {isWaitlist && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          color: '#856404',
          padding: '12px 20px',
          borderRadius: '4px',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          ⚠️ This class is full. You are signing up for the waitlist.
        </div>
      )}

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

          {availableDogs.length ? (
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="useUsersDogs"
                name="useUsersDogs"
                checked={useUsersDogs}
                onChange={(e) => {
                  setUseUsersDogs(e.target.checked);
                  setSelectedDogId('');
                }}
              />
              <label htmlFor="useUsersDogs">Use one of my dogs</label>
            </div>
          ) : <></>}

          {useUsersDogs ? (
            <div className={styles.formGroup}>
              <label htmlFor="selectedDog">Select Your Dog *</label>
              <select
                id="selectedDog"
                value={selectedDogId}
                onChange={handleDogSelection}
                required
              >
                <option value="">- Choose a dog -</option>
                {availableDogs.map((dog) => (
                  <option key={dog.id} value={dog.id}>
                    {dog.name} - {dog.breed}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
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
            </>
          )}

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
          <h2>Payment Method</h2>

          <div className={styles.formGroup}>
            <label htmlFor="paymentMethod">Select Payment Method *</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              disabled={isWaitlist}
              required
            >
              {!isWaitlist && <option value="">- Choose a payment method -</option>}
              {/* {!isWaitlist && <option value="PayPal">PayPal</option>} */}
              {!isWaitlist && <option value="Cash">Cash</option>}
              {!isWaitlist && <option value="Check">Check</option>}
              {!isWaitlist && <option value="Instructor Perk">Instructor Perk</option>}
              {isWaitlist && <option value="Waitlist">Waitlist</option>}
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
              I accept the KCTC LIABILITY WAIVER AND REFUND POLICY, and COVID-19 WAIVER (click <a href="/LIABILITY_AND_COVID_WAIVER.pdf" target="_blank" rel="noopener noreferrer">here</a> for the link)
            </label>
          </div>
          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="prerequesitesMet"
              name="prerequesitesMet"
              checked={formData.prerequesitesMet}
              onChange={handleChange}
            />
            <label htmlFor="prerequesitesMet">
              Yes, I have completed KCTC Class Prerequisites OR My class choice has been approved by KCTC personnel
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
