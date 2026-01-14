import { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Header } from '../layout';
import { Button, Input } from '../common';
import styles from './Settings.module.css';

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const [userName, setUserName] = useState(settings.userName);
  const [userInitials, setUserInitials] = useState(settings.userInitials);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setUserName(settings.userName);
    setUserInitials(settings.userInitials);
  }, [settings]);

  const handleSave = async () => {
    await updateSettings({ userName, userInitials });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setUserName(name);
    // Auto-generate initials
    if (name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length === 1) {
        setUserInitials(parts[0].substring(0, 2).toUpperCase());
      } else {
        setUserInitials((parts[0][0] + parts[parts.length - 1][0]).toUpperCase());
      }
    } else {
      setUserInitials('');
    }
  };

  return (
    <div className={styles.settings}>
      <Header title="Settings" showSearch={false} />

      <main className="main-content">
        <div className="page-container">
          <div className={styles.header}>
            <p className={styles.subtitle}>Manage your profile and preferences</p>
          </div>

          <div className={styles.content}>
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Profile</h2>
              <div className={styles.card}>
                <div className={styles.profilePreview}>
                  <div className={styles.avatar}>
                    {userInitials || '?'}
                  </div>
                  <div className={styles.previewText}>
                    <span className={styles.previewName}>{userName || 'Your Name'}</span>
                    <span className={styles.previewHint}>This is how you'll appear in the app</span>
                  </div>
                </div>

                <div className={styles.form}>
                  <Input
                    label="Full Name"
                    value={userName}
                    onChange={handleNameChange}
                    placeholder="Enter your full name"
                    fullWidth
                  />

                  <Input
                    label="Initials"
                    value={userInitials}
                    onChange={(e) => setUserInitials(e.target.value.toUpperCase().slice(0, 3))}
                    placeholder="e.g., JD"
                    maxLength={3}
                    fullWidth
                  />

                  <div className={styles.actions}>
                    <Button variant="primary" onClick={handleSave}>
                      Save Changes
                    </Button>
                    {saved && <span className={styles.savedMessage}>Settings saved!</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Data</h2>
              <div className={styles.card}>
                <p className={styles.dataInfo}>
                  Your data is stored locally in an Excel file. You can open the data folder to view or backup your data.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => window.electronAPI?.showInFolder()}
                >
                  Open Data Folder
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
