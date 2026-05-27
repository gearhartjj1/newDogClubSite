import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const sidebarLinks = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/building-usage', icon: '🏢', label: 'Building Usage' },
  { to: '/calendar', icon: '📅', label: 'Calendar' },
  { to: '/classes', icon: '🎓', label: 'Classes' },
  { to: '/class-prices', icon: '💰', label: 'Class Prices' },
  { to: '/contact', icon: '📧', label: 'Contact Us' },
  { to: '/directions', icon: '🗺️', label: 'Directions' },
  { to: '/forms', icon: '📋', label: 'Forms' },
  { to: '/gift-certificates', icon: '🎁', label: 'Gift Certificates' },
  { to: '/history', icon: '📜', label: 'History' },
  { to: '/membership', icon: '🤝', label: 'Membership' },
  { to: '/members-only', icon: '🔒', label: 'Members Only' },
  { to: '/newsletter', icon: '📰', label: 'Newsletter' },
  { to: '/officers-and-board', icon: '👥', label: 'Officers & Board' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.heading}>Quick Access</h3>
      <nav className={styles.nav}>
        {sidebarLinks.map((link) => (
          <Link key={link.to} to={link.to} className={styles.button}>
            <span className={styles.icon}>{link.icon}</span>
            <span className={styles.label}>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
