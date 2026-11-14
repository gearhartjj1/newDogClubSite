import styles from '../pages/Profile.module.css';
import { type PastClass, type UserInfo } from '../context/UserDataContext';
import PayPalSection from './PayPalButton';

interface ClassDetailsModalProps {
  selectedClass: PastClass;
  userInfo: UserInfo;
  accountId?: number;
  onClose: () => void;
  showPayPal?: boolean;
}

// Shared enrollment/class details modal used by the profile and admin payments pages
export default function ClassDetailsModal({
  selectedClass,
  userInfo,
  accountId,
  onClose,
  showPayPal = false,
}: ClassDetailsModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>📚 {selectedClass.className} | Invoice #: {selectedClass.enrollmentId} | Account # {accountId}</h2>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalGrid}>
            <div className={styles.modalItem}>
              <label>User Info</label>
              <p>{userInfo.name} | {userInfo.email} | {userInfo.phone}</p>
            </div>
            <div className={styles.modalItem}>
              <label>Class Date Info</label>
              <p>{selectedClass.session} | {selectedClass.room} | classCode | {selectedClass.className} | {selectedClass.completedDate} | {selectedClass.time} | {selectedClass.instructor}</p>
            </div>
            <div className={styles.modalItem}>
              <label>Dog Info</label>
              <p>Dog Name: {selectedClass.dogName} | Age: {selectedClass.dogAge} | Breed: {selectedClass.dogBreed}</p>
            </div>
            <div className={styles.modalItem}>
              <label>Payment Info</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                <div style={{ whiteSpace: 'nowrap' }}>
                  <span>Method: {selectedClass.paymentMethod}</span>
                  <span style={{ marginLeft: '1rem' }} className={selectedClass.paidStatus === 'Paid' ? styles.statusPaid : styles.statusUnpaid}>
                    Status: {selectedClass.paidStatus}
                  </span>
                  <span style={{ marginLeft: '1rem' }} className={selectedClass.paidStatus === 'Paid' ? styles.statusPaid : styles.statusUnpaid}>
                    Cost: ${selectedClass.cost}
                  </span>
                </div>
                {selectedClass.paidStatus !== 'Paid' && showPayPal && (
                  <div style={{ marginLeft: 'auto', minWidth: '300px', textAlign: 'right' }}>
                    <PayPalSection price={selectedClass.cost} enrollmentId={selectedClass.enrollmentId} onSuccess={() => {
                      window.location.reload();
                    }} onError={() => { console.log('error'); }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
