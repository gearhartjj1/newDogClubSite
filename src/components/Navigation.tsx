import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './Navigation.module.css';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          🐕 Keystone Canine Training Club
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ''}`}>
          <li>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)}>
              Events
            </Link>
          </li>
          <li>
            <Link to="/classes" onClick={() => setMobileMenuOpen(false)}>
              Classes
            </Link>
          </li>
          <li>
            <Link to="/signup" className={styles.cta} onClick={() => setMobileMenuOpen(false)}>
              Sign Up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
