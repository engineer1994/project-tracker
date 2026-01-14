import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import '../types/electron.d.ts';

interface UserSettings {
  userName: string;
  userInitials: string;
}

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: UserSettings = {
  userName: '',
  userInitials: '',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Check if running in Electron
const isElectron = () => {
  return window.electronAPI?.isElectron === true;
};

// Generate initials from name
function generateInitials(name: string): string {
  if (!name.trim()) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    async function loadSettings() {
      if (isElectron() && window.electronAPI) {
        try {
          const result = await window.electronAPI.readSettings();
          if (result.success && result.data) {
            setSettings({
              userName: result.data.userName || '',
              userInitials: result.data.userInitials || '',
            });
          }
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
      setIsLoading(false);
    }

    loadSettings();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings };

    if (newSettings.userName !== undefined) {
      updatedSettings.userName = newSettings.userName;
      // Auto-generate initials if not provided
      if (newSettings.userInitials === undefined) {
        updatedSettings.userInitials = generateInitials(newSettings.userName);
      }
    }

    if (newSettings.userInitials !== undefined) {
      updatedSettings.userInitials = newSettings.userInitials;
    }

    setSettings(updatedSettings);

    // Save to Excel if in Electron
    if (isElectron() && window.electronAPI) {
      try {
        await window.electronAPI.writeSettings(updatedSettings);
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
