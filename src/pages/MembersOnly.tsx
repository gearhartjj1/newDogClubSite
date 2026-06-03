import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MembersOnly.module.css';

//TODO: Manual meeting notes is a terrible, this all needs to have a method for admins to upload new notes and have all this on the server in a simple loop
const meetingNotesOptions = [
  { label: '3/21/2026', value: '/meetingMinutes/2026/Keystone Membership Meeting 3-15-2026 (final).pdf' },
  { label: '1/18/2026', value: '/meetingMinutes/2026/Keystone Member Meeting 1-18-2026 Final.pdf' },
  { label: '11/16/2025', value: '/meetingMinutes/2025/Keystone Membership Meeting 11-16-25 final.pdf' },
  { label: '9/21/2025', value: '/meetingMinutes/2025/Membership Meeting Sept 21 2025.pdf' },
  { label: '7/20/2025', value: '/meetingMinutes/2025/KCTC Memebership Meeting 7-20-2025.pdf' },
  { label: '3/16/2025', value: '/meetingMinutes/2025/Membership Meeting March 16, 2025.pdf' },
  { label: '11/17/2024', value: '/meetingMinutes/2024/Membership Meeting November 17, 2024.pdf' },
  { label: '9/15/2024', value: '/meetingMinutes/2024/Membership Meeting September 15, 2024.docx' },
  { label: '5/19/2024', value: '/meetingMinutes/2024/Membership Meeting May 19, 2024.pdf' },
  { label: '3/17/2024', value: '/meetingMinutes/2024/Membership Meeting March 17, 2024.pdf' },
  { label: '1/21/2024', value: '/meetingMinutes/2024/Membership Meeting January 21, 2024.pdf' },
  { label: '11/19/2023', value: '/meetingMinutes/2024/Keystone Membership Meeting 11-19-2023.pdf' },
  { label: '9/17/2023', value: '/meetingMinutes/2023/Membership Meeting September 17, 2023.pdf' },
  { label: '7/16/2023', value: '/meetingMinutes/2023/KCTC Membership Meeting 7-16-2023.pdf' },
  { label: '5/28/2023', value: '/meetingMinutes/2023/Keystone Membership Meeting 5-28-2023.pdf' },
  { label: '3/19/2023', value: '/meetingMinutes/2023/MEMBERSHIP MEETING  3-19-2023.docx' },
  { label: '1/15/2023', value: '/meetingMinutes/2023/MEMBERSHIP MEETING  1_15_2023.docx' },
  { label: '11/20/2022', value: '/meetingMinutes/2022/MEMBERSHIP MEETING  11-20-22.docx' },
  { label: '9/18/2022', value: '/meetingMinutes/2022/MEMBERSHIP MEETING 9_18_22.docx' },
  { label: '5/22/2022', value: '/meetingMinutes/2022/MEMBERSHIP MEETING 5_22_22.docx' },
  { label: '3/20/2022', value: '/meetingMinutes/2022/MEMBERS_MEETING_3-20-2022.docx' },
  { label: '11/21/2021', value: '/meetingMinutes/2021/KCTC_MEMBERSHIP_MEETING_11-21-2021.docx' },
  { label: '9/19/2021', value: '/meetingMinutes/2021/KCTC MEMBERSHIP MEETING 09-19-2021.docx' },
  { label: '5/19/2019', value: '/meetingMinutes/2019/KCTC_MEMBERSHIP_MEETING_5_19_19.pdf' },
  { label: '3/17/2019', value: '/meetingMinutes/2019/KCTC_MEMBERSHIP_MEETING_3_17_19.pdf' },
];

const historicalByLawsOptions = [
  { label: '11-18-19', value: '/historicalBylaws/BYLAWS_11-18-19.pdf' },
  { label: '03-21-16', value: '/historicalBylaws/BYLAWS 3-21-16.pdf' },
  { label: '08-21-12', value: '/historicalBylaws/BYLAWS 8-21-12.pdf' },
  { label: '09-25-10', value: '/historicalBylaws/BYLAWS 9-25-10.pdf' },
  { label: '02-19-10', value: '/historicalBylaws/BYLAWS 2-19-10.pdf' },
];

const historicalPoliciesOptions = [
  { label: '3-13-22', value: '/historicalPolicies/POLICIES-AND-PROCEDURES_3-13-22.pdf' },
  { label: '3-27-20', value: '/historicalPolicies/POLICIES AND PROCEDURES 3-27-20.pdf' },
  { label: '5-12-16', value: '/historicalPolicies/POLICIES AND PROCEDURES 5-12-16.pdf' },
  { label: '11-10-13', value: '/historicalPolicies/POLICIES AND PROCEDURES 11-10-13.pdf' },
  { label: '1-16-12', value: '/historicalPolicies/POLICIES AND PROCEDURES 1-16-12.pdf' },
  { label: '11-16-11', value: '/historicalPolicies/POLICIES AND PROCEDURES 11-16-11.pdf' },
  { label: '6-25-11', value: '/historicalPolicies/POLICIES AND PROCEDURES 6-25-11.pdf' },
  { label: '5-23-11', value: '/historicalPolicies/POLICIES AND PROCEDURES 5-23-11.pdf' },
  { label: '4-9-11', value: '/historicalPolicies/POLICIES AND PROCEDURES 4-9-11.pdf' },
  { label: '9-24-10', value: '/historicalPolicies/POLICIES AND PROCEDURES 9-24-10.pdf' },
  { label: '4-23-10', value: '/historicalPolicies/POLICIES AND PROCEDURES 4-23-10.pdf' },
];

export default function MembersOnly() {
  const [selectedMeetingNotes, setSelectedMeetingNotes] = useState('');
  const [selectedHistoricalByLaws, setSelectedHistoricalByLaws] = useState('');
  const [selectedHistoricalPolicies, setSelectedHistoricalPolicies] = useState('');

  const handleDownload = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Members Only</h1>
        <p>Exclusive documents and resources for club members</p>
      </section>

      <div className={styles.sectionsWrapper}>
        {/* Current Data Section */}
        <div className={styles.section}>
          <h2>Current Data</h2>

          <ul className={styles.documentList}>
            <li className={styles.documentItem}>
              <a
                href="/BYLAWS CLEAN COPY 5-10-26 REVISION.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.documentLink}
              >
                📄 By-Laws
              </a>
            </li>
            <li className={styles.documentItem}>
              <a
                href="/POLICIES AND PROCEDURES 1-10-24.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.documentLink}
              >
                📄 Policies and Procedures
              </a>
            </li>
            <li className={styles.documentItem}>
              <a
                href="/Instructors Manual_5-15-2022.docx"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.documentLink}
              >
                📄 Instructor's Manual
              </a>
            </li>
            <li className={styles.documentItem}>
              <a
                href="/Members  List - MARCH, 2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.documentLink}
              >
                📄 Members List
              </a>
            </li>
            <li className={styles.documentItem}>
              <a
                href="/FACEBOOK AND TWITTER POLICIES.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.documentLink}
              >
                📄 Social Website Policies
              </a>
            </li>
          </ul>

          <div className={styles.dropdownGroup}>
            <span className={styles.dropdownLabel}>Meeting Notes</span>
            <div className={styles.dropdownRow}>
              <select
                className={styles.dropdown}
                value={selectedMeetingNotes}
                onChange={(e) => setSelectedMeetingNotes(e.target.value)}
              >
                <option value="">-- Select a date --</option>
                {meetingNotesOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className={styles.downloadBtn}
                disabled={!selectedMeetingNotes}
                onClick={() => handleDownload(selectedMeetingNotes)}
              >
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Historical Data Section */}
        <div className={styles.section}>
          <h2>Historical Data</h2>

          <div className={styles.dropdownGroup}>
            <span className={styles.dropdownLabel}>Constitutions and By-Laws</span>
            <div className={styles.dropdownRow}>
              <select
                className={styles.dropdown}
                value={selectedHistoricalByLaws}
                onChange={(e) => setSelectedHistoricalByLaws(e.target.value)}
              >
                <option value="">-- Select a version --</option>
                {historicalByLawsOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className={styles.downloadBtn}
                disabled={!selectedHistoricalByLaws}
                onClick={() => handleDownload(selectedHistoricalByLaws)}
              >
                Open
              </button>
            </div>
          </div>

          <div className={styles.dropdownGroup}>
            <span className={styles.dropdownLabel}>Policies and Procedures</span>
            <div className={styles.dropdownRow}>
              <select
                className={styles.dropdown}
                value={selectedHistoricalPolicies}
                onChange={(e) => setSelectedHistoricalPolicies(e.target.value)}
              >
                <option value="">-- Select a version --</option>
                {historicalPoliciesOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className={styles.downloadBtn}
                disabled={!selectedHistoricalPolicies}
                onClick={() => handleDownload(selectedHistoricalPolicies)}
              >
                Open
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.backLink}>
        <Link to="/">← Back to Home</Link>
      </div>
    </div>
  );
}
