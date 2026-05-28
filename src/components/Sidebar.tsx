import { Link } from 'react-router-dom';
import { useUserData } from '../context/UserDataContext';
import styles from './Sidebar.module.css';

interface SidebarLink {
  to: string;
  icon: string;
  label: string;
  external?: boolean;
  authRequired?: boolean;
}

const sidebarLinks: SidebarLink[] = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/building-usage', icon: '🏢', label: 'Building Usage' },
  { to: '/KCTC%20Calendar.pdf', icon: '📅', label: 'Calendar', external: true },
  { to: '/classes', icon: '🎓', label: 'Classes' },
  { to: '/class-prices', icon: '💰', label: 'Class Prices' },
  { to: '/contact', icon: '📧', label: 'Contact Us' },
  { to: '/directions', icon: '🗺️', label: 'Directions' },
  { to: '/forms', icon: '📋', label: 'Forms' },
  { to: '/gift-certificates', icon: '🎁', label: 'Gift Certificates' },
  { to: '/history', icon: '📜', label: 'History' },
  { to: '/membership', icon: '🤝', label: 'Membership' },
  { to: '/members-only', icon: '🔒', label: 'Members Only', authRequired: true },
  { to: '/officers-and-board', icon: '👥', label: 'Officers & Board' },
];

export default function Sidebar() {
  const { userData } = useUserData();

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.heading}>Quick Access</h3>
      <nav className={styles.nav}>
        {sidebarLinks
          .filter((link) => !link.authRequired || userData)
          .map((link) =>
            link.external ? (
              <a key={link.to} href={link.to} target="_blank" rel="noopener noreferrer" className={styles.button}>
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.label}>{link.label}</span>
              </a>
            ) : (
              <Link key={link.to} to={link.to} className={styles.button}>
                <span className={styles.icon}>{link.icon}</span>
                <span className={styles.label}>{link.label}</span>
              </Link>
            )
          )}
      </nav>
    </aside>
  );
}
