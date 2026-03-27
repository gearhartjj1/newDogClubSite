import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  onLogin: (username: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Placeholder validation
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    // Placeholder authentication - accept any username/password combo
    // In a real app, this would validate against a backend
    onLogin(username);
    navigate('/profile');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1>🐕 Sign In</h1>
          <p>Access your Keystone Canine Training Club account</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Sign In
          </button>
        </form>

        <div className={styles.footer}>
          <p>Don't have an account? <a href="#signup">Sign up here</a></p>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px' }}>
            Demo: You can use any username and password
          </p>
        </div>
      </div>
    </div>
  );
}
