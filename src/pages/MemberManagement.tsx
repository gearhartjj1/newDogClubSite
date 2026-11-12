import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './MemberManagement.module.css';
import { useUserData } from '../context/UserDataContext';
import { membersAPI, type Member } from '../services/api';

export default function MemberManagement() {
  const navigate = useNavigate();
  const { userData, isLoading } = useUserData();

  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');

  const [showAddMember, setShowAddMember] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const emptyMemberForm = {
    firstName: '',
    lastName: '',
    email: '',
    homePhone: '',
    workPhone: '',
    cellPhone: '',
    address: '',
    cityStZip: '',
    comment1: '',
    comment2: '',
  };
  const [newMemberForm, setNewMemberForm] = useState(emptyMemberForm);

  // Redirect non-admins away from this page
  useEffect(() => {
    if (!isLoading && (!userData || !userData.isAdmin)) {
      navigate(userData ? '/profile' : '/login');
    }
  }, [isLoading, userData, navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsFetching(true);
    setError('');
    try {
      const results = await membersAPI.searchByLastName(searchTerm.trim());
      setMembers(results);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search members');
    } finally {
      setIsFetching(false);
    }
  };

  const handleShowAll = async () => {
    setIsFetching(true);
    setError('');
    try {
      const results = await membersAPI.getAll();
      setMembers(results);
      setSearchTerm('');
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.firstName.trim() || !newMemberForm.lastName.trim()) {
      alert('Please enter a first and last name');
      return;
    }

    setIsSaving(true);
    try {
      const response = await membersAPI.add({
        firstName: newMemberForm.firstName.trim(),
        lastName: newMemberForm.lastName.trim(),
        email: newMemberForm.email.trim(),
        homePhone: newMemberForm.homePhone.trim(),
        workPhone: newMemberForm.workPhone.trim(),
        cellPhone: newMemberForm.cellPhone.trim(),
        address: newMemberForm.address.trim(),
        cityStZip: newMemberForm.cityStZip.trim(),
        comment1: newMemberForm.comment1.trim(),
        comment2: newMemberForm.comment2.trim(),
      });

      if (response.success) {
        setMembers([...members, response.data]);
        setNewMemberForm(emptyMemberForm);
        setShowAddMember(false);
      } else {
        alert('Failed to add member: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add member');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !userData?.isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>👥 Member Management</h1>
          <p>Search for members, view the full member list, or add a new member.</p>
        </div>
        <Link to="/profile" className={styles.backLink}>← Back to Profile</Link>
      </header>

      {/* Search / list controls */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Find Members</h2>
          <button
            onClick={() => setShowAddMember(!showAddMember)}
            className={styles.addButton}
          >
            {showAddMember ? '✕' : '+ Add Member'}
          </button>
        </div>

        {showAddMember && (
          <form onSubmit={handleAddMember} className={styles.form}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="newFirstName">First Name</label>
                <input
                  type="text"
                  id="newFirstName"
                  value={newMemberForm.firstName}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, firstName: e.target.value })
                  }
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newLastName">Last Name</label>
                <input
                  type="text"
                  id="newLastName"
                  value={newMemberForm.lastName}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, lastName: e.target.value })
                  }
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="newEmail">Email</label>
                <input
                  type="email"
                  id="newEmail"
                  value={newMemberForm.email}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, email: e.target.value })
                  }
                  placeholder="Enter email"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newHomePhone">Home Phone</label>
                <input
                  type="tel"
                  id="newHomePhone"
                  value={newMemberForm.homePhone}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, homePhone: e.target.value })
                  }
                  placeholder="Enter home phone number"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="newWorkPhone">Work Phone</label>
                <input
                  type="tel"
                  id="newWorkPhone"
                  value={newMemberForm.workPhone}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, workPhone: e.target.value })
                  }
                  placeholder="Enter work phone number"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newCellPhone">Cell Phone</label>
                <input
                  type="tel"
                  id="newCellPhone"
                  value={newMemberForm.cellPhone}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, cellPhone: e.target.value })
                  }
                  placeholder="Enter cell phone number"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="newAddress">Address</label>
                <input
                  type="text"
                  id="newAddress"
                  value={newMemberForm.address}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, address: e.target.value })
                  }
                  placeholder="Enter street address"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newCityStZip">City/St/Zip</label>
                <input
                  type="text"
                  id="newCityStZip"
                  value={newMemberForm.cityStZip}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, cityStZip: e.target.value })
                  }
                  placeholder="e.g. Pittsburgh, PA 15102"
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="newComment1">Comment 1</label>
                <input
                  type="text"
                  id="newComment1"
                  value={newMemberForm.comment1}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, comment1: e.target.value })
                  }
                  placeholder="Enter comment"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newComment2">Comment 2</label>
                <input
                  type="text"
                  id="newComment2"
                  value={newMemberForm.comment2}
                  onChange={(e) =>
                    setNewMemberForm({ ...newMemberForm, comment2: e.target.value })
                  }
                  placeholder="Enter comment"
                />
              </div>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Member'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddMember(false)}
                className={styles.cancelButton}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <form onSubmit={handleSearch} className={styles.searchRow}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by last name"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.submitButton} disabled={isFetching}>
            Search
          </button>
          <button
            type="button"
            onClick={handleShowAll}
            className={styles.secondaryButton}
            disabled={isFetching}
          >
            Show All Members
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
      </section>

      {/* Results */}
      <section className={styles.section}>
        <h2>
          Members{hasSearched ? ` (${members.length})` : ''}
        </h2>
        {isFetching ? (
          <p className={styles.emptyState}>Loading members...</p>
        ) : !hasSearched ? (
          <p className={styles.emptyState}>
            Search by last name or click "Show All Members" to see the member list.
          </p>
        ) : members.length === 0 ? (
          <p className={styles.emptyState}>No members found.</p>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.memberTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Last Name</th>
                  <th>First Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>
                      <Link to={`/profile/user/${member.id}`} className={styles.memberLink}>
                        {member.lastName}
                      </Link>
                    </td>
                    <td>{member.firstName}</td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
