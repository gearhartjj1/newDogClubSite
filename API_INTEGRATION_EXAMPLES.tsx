// Example: How to use the API in React Components

import { useState } from 'react';
import { signupsAPI, classesAPI, eventsAPI } from '../services/api';

// Example 1: Fetching data on component mount
export function ClassesList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classesAPI.getAll();
        if (response.success) {
          setClasses(response.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {classes.map(c => (
        <div key={c.class_id}>{c.title}</div>
      ))}
    </div>
  );
}

// Example 2: Submitting form data
export function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await signupsAPI.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dogName: formData.dogName,
        dogBreed: formData.dogBreed,
        dogAge: formData.dogAge,
        dogExperience: formData.dogExperience,
        classId: formData.classId,
      });

      if (response.success) {
        setSuccess(true);
        // Redirect or show success message
      } else {
        console.error('Signup failed:', response.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Form JSX
  );
}

// Example 3: Fetching user's signups
export function MySignups({ userEmail }) {
  const [signups, setSignups] = useState([]);

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const response = await signupsAPI.getByEmail(userEmail);
        if (response.success) {
          setSignups(response.data);
        }
      } catch (error) {
        console.error('Error fetching signups:', error);
      }
    };

    fetchSignups();
  }, [userEmail]);

  return (
    <div>
      {signups.map(signup => (
        <div key={signup.signup_id}>
          {signup.dog_name} - {signup.title}
        </div>
      ))}
    </div>
  );
}
