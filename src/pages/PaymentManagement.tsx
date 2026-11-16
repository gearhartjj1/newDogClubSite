import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './PaymentManagement.module.css';
import { useUserData, type PastClass, type UserInfo } from '../context/UserDataContext';
import { dogClassAPI, paymentsAPI, type ClassRate, type SessionEnrollment } from '../services/api';
import ClassDetailsModal from '../components/ClassDetailsModal';

/**
 * TODO:
 * Update grid to have data on the existing site -- Done
 * Look into number discrpenancy from existing site
 * Have email section be a link that will go to the email communication section (once I build it...)
 * Have member name be a link that will go to the admin read only version of the user's data
 */


const paymentMethodNames: { [key: number]: string } = {
  1: 'PayPal',
  2: 'Cash',
  3: 'Check',
  4: 'Instructor Perk',
  7: 'Waitlist',
};

const isPaid = (row: { PaidYN?: string; AmtPaid?: number | null }) =>
  row.PaidYN === '1' || row.PaidYN === 'Y' || (row.AmtPaid != null && Number(row.AmtPaid) > 0);

export default function PaymentManagement() {
  const navigate = useNavigate();
  const { userData, isLoading } = useUserData();

  const [classRates, setClassRates] = useState<ClassRate[]>([]);

  // Enrollment search state
  const [searchId, setSearchId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [selectedClass, setSelectedClass] = useState<PastClass | null>(null);
  const [enrollmentUserInfo, setEnrollmentUserInfo] = useState<UserInfo>({ name: '', email: '', phone: '' });
  const [enrollmentAccountId, setEnrollmentAccountId] = useState<number | undefined>(undefined);

  // Session enrollments state
  const [sessions, setSessions] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState('');
  const [enrollments, setEnrollments] = useState<SessionEnrollment[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [hasLoadedEnrollments, setHasLoadedEnrollments] = useState(false);
  const [enrollmentFilter, setEnrollmentFilter] = useState<'all' | 'paid' | 'waitlisted'>('all');

  // Redirect non-admins away from this page
  useEffect(() => {
    if (!isLoading && (!userData || !userData.isAdmin)) {
      navigate(userData ? '/profile' : '/login');
    }
  }, [isLoading, userData, navigate]);

  // Fetch class rates (needed to compute enrollment cost) and session list
  useEffect(() => {
    if (!userData?.isAdmin) return;
    dogClassAPI.getClassRates()
      .then(setClassRates)
      .catch((error) => console.error('Error fetching class rates:', error));
    paymentsAPI.adminGetSessions()
      .then(setSessions)
      .catch((error) => console.error('Error fetching sessions:', error));
  }, [userData?.isAdmin]);

  const mapToPastClass = (cls: any): PastClass => {
    const classRate = classRates.find(rate => rate.Id == cls.Rate);
    const signedUpAsMember = cls.MemberYN === '1' || cls.MemberYN === 'Y';
    const classPrice = classRate ? (signedUpAsMember ? classRate.MemberRate : classRate.NonMemberRate) : '100.00';
    return {
      id: cls.ID,
      className: cls.Class,
      instructor: cls.Instructors || 'N/A',
      completedDate: cls.Start + ' ' + (cls.Session ? cls.Session.split('-')[0] : ''),
      dogName: cls.DogName || 'N/A',
      enrollmentId: cls.EnrollmentID,
      sessionId: cls.ID,
      paymentMethod: paymentMethodNames[cls.PayMethod] || `Unknown (${cls.PayMethod})`,
      paidStatus: isPaid(cls) ? 'Paid' : 'Unpaid',
      dogBreed: cls.DogBreed || 'N/A',
      dogAge: cls.DogAge != null ? String(cls.DogAge) : 'N/A',
      session: cls.Session || 'N/A',
      day: cls.Day || 'N/A',
      time: cls.Time || 'N/A',
      room: cls.Room || 'N/A',
      cost: classPrice,
    };
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const enrollmentId = Number(searchId.trim());
    if (!searchId.trim() || !Number.isInteger(enrollmentId)) {
      setSearchError('Please enter a valid enrollment ID');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    try {
      const enrollment = await paymentsAPI.adminGetEnrollment(enrollmentId);
      setEnrollmentUserInfo({
        name: `${enrollment.FirstName || ''} ${enrollment.LastName || ''}`.trim() || 'N/A',
        email: enrollment.Email || '',
        phone: enrollment.Phone || '',
      });
      setEnrollmentAccountId(enrollment.PID);
      setSelectedClass(mapToPastClass(enrollment));
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Failed to fetch enrollment');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSessionChange = async (session: string) => {
    setSelectedSession(session);
    setEnrollments([]);
    setSessionError('');
    setHasLoadedEnrollments(false);
    setEnrollmentFilter('all');
    if (!session) return;

    setIsLoadingEnrollments(true);
    try {
      const results = await paymentsAPI.adminGetSessionEnrollments(session);
      setEnrollments(results);
      setHasLoadedEnrollments(true);
    } catch (err) {
      setSessionError(err instanceof Error ? err.message : 'Failed to fetch session enrollments');
    } finally {
      setIsLoadingEnrollments(false);
    }
  };

  const handleSendReminders = () => {
    // TODO: send reminder emails to enrolled members who haven't paid yet
    alert('Sending reminders to non-payers is not implemented yet.');
  };

  if (isLoading || !userData?.isAdmin) {
    return <p>Loading...</p>;
  }

  const waitlistedCount = enrollments.filter((e) => Number(e.PayMethod) === 7).length;
  const registeredCount = enrollments.filter((e) => Number(e.PayMethod) !== 7 && Number(e.PayMethod) !== 9).length;

  const filteredEnrollments = enrollments.filter((enrollment) => {
    if (enrollmentFilter === 'paid') return Number(enrollment.PayMethod) !== 7 && isPaid(enrollment);
    if (enrollmentFilter === 'waitlisted') return Number(enrollment.PayMethod) === 7;
    return true;
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>💳 Manage Payments</h1>
          <p>Look up enrollments by ID and review enrollment data for a session.</p>
        </div>
        <Link to="/profile" className={styles.backLink}>← Back to Profile</Link>
      </header>

      {/* Enrollment search */}
      <section className={styles.section}>
        <h2>Search Enrollments</h2>
        <form onSubmit={handleSearch} className={styles.searchRow}>
          <input
            type="number"
            className={styles.searchInput}
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter enrollment ID (invoice #)"
          />
          <button type="submit" className={styles.submitButton} disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
        {searchError && <p className={styles.error}>{searchError}</p>}
      </section>

      {/* Session enrollments */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Session Enrollments</h2>
          <button type="button" className={styles.reminderButton} onClick={handleSendReminders}>
            ✉️ Send reminder to non-payers
          </button>
        </div>
        <div className={styles.searchRow}>
          <label htmlFor="sessionSelect" className={styles.selectLabel}>Session:</label>
          <select
            id="sessionSelect"
            className={styles.sessionSelect}
            value={selectedSession}
            onChange={(e) => handleSessionChange(e.target.value)}
          >
            <option value="">Select a session...</option>
            {sessions.map((session) => (
              <option key={session} value={session}>{session}</option>
            ))}
          </select>
        </div>
        {sessionError && <p className={styles.error}>{sessionError}</p>}
        {isLoadingEnrollments && <p className={styles.emptyState}>Loading enrollments...</p>}

        {hasLoadedEnrollments && (
          <>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{registeredCount}</span>
                <span className={styles.statLabel}>Registered Enrollments</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{waitlistedCount}</span>
                <span className={styles.statLabel}>Waitlisted Enrollments</span>
              </div>
            </div>
            <div className={styles.filterRow}>
              <button
                type="button"
                className={`${styles.filterButton} ${enrollmentFilter === 'all' ? styles.filterButtonActive : ''}`}
                onClick={() => setEnrollmentFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`${styles.filterButton} ${enrollmentFilter === 'paid' ? styles.filterButtonActive : ''}`}
                onClick={() => setEnrollmentFilter('paid')}
              >
                Paid Only
              </button>
              <button
                type="button"
                className={`${styles.filterButton} ${enrollmentFilter === 'waitlisted' ? styles.filterButtonActive : ''}`}
                onClick={() => setEnrollmentFilter('waitlisted')}
              >
                Waitlisted Only
              </button>
            </div>
            {filteredEnrollments.length === 0 ? (
              <p className={styles.emptyState}>
                {enrollments.length === 0
                  ? 'No enrollments found for this session.'
                  : `No ${enrollmentFilter} enrollments found for this session.`}
              </p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.enrollmentTable}>
                  <thead>
                    <tr>
                      <th>Amt Paid</th>
                      <th>Check No</th>
                      <th>Account ID</th>
                      <th>Member</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Enrollment ID</th>
                      <th>Dog</th>
                      <th>Pay Method</th>
                      <th>Class</th>
                      <th>Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.EnrollmentID}>
                        <td className={isPaid(enrollment) ? styles.paid : styles.unpaid}>
                          {enrollment.AmtPaid != null ? `$${Number(enrollment.AmtPaid).toFixed(2)}` : '—'}
                        </td>
                        <td>{enrollment.CheckNo || '—'}</td>
                        <td>{enrollment.PID || 'N/A'}</td>
                        <td>{`${enrollment.FirstName || ''} ${enrollment.LastName || ''}`.trim() || 'N/A'}</td>
                        <td>{enrollment.Email || ''}</td>
                        <td>{enrollment.Phone || ''}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.idLink}
                            onClick={() => {
                              setSearchId(String(enrollment.EnrollmentID));
                              setSelectedSession(selectedSession);
                              paymentsAPI.adminGetEnrollment(enrollment.EnrollmentID).then((data) => {
                                setEnrollmentUserInfo({
                                  name: `${data.FirstName || ''} ${data.LastName || ''}`.trim() || 'N/A',
                                  email: data.Email || '',
                                  phone: data.Phone || '',
                                });
                                setEnrollmentAccountId(data.PID);
                                setSelectedClass(mapToPastClass(data));
                              }).catch((error) => console.error('Error fetching enrollment:', error));
                            }}
                          >
                            {enrollment.EnrollmentID}
                          </button>
                        </td>
                        <td>{enrollment.DogName || 'N/A'}</td>
                        <td>{paymentMethodNames[Number(enrollment.PayMethod)] || `Unknown (${enrollment.PayMethod})`}</td>
                        <td>{enrollment.Class}</td>
                        <td>{enrollment.Code || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>

      {/* Enrollment details modal (shared with the profile page) */}
      {selectedClass && (
        <ClassDetailsModal
          selectedClass={selectedClass}
          userInfo={enrollmentUserInfo}
          accountId={enrollmentAccountId}
          onClose={() => setSelectedClass(null)}
        />
      )}
    </div>
  );
}
