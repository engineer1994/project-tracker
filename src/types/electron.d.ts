import type { Project } from './index';

interface ExcelReadResult {
  success: boolean;
  data?: Project[];
  error?: string;
}

interface ExcelWriteResult {
  success: boolean;
  error?: string;
}

interface ExcelExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
  canceled?: boolean;
}

interface UserSettings {
  userName: string;
  userInitials: string;
}

interface SettingsReadResult {
  success: boolean;
  data?: UserSettings;
  error?: string;
}

interface SettingsWriteResult {
  success: boolean;
  error?: string;
}

interface ElectronAPI {
  readData: () => Promise<ExcelReadResult>;
  writeData: (projects: Project[]) => Promise<ExcelWriteResult>;
  getFilePath: () => Promise<string>;
  showInFolder: () => Promise<{ success: boolean }>;
  exportData: () => Promise<ExcelExportResult>;
  readSettings: () => Promise<SettingsReadResult>;
  writeSettings: (settings: UserSettings) => Promise<SettingsWriteResult>;
  isElectron: boolean;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
