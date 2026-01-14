const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const excelService = require('./excelService.js');

let mainWindow;

function createWindow() {
  // Check if running in development mode with live reload
  // Set ELECTRON_DEV_MODE=1 to use localhost instead of dist folder
  const useDevServer = process.env.ELECTRON_DEV_MODE === '1';

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'Project Tracker',
    backgroundColor: '#0d1117',
    show: false,
  });

  // Load the app - always use dist folder unless ELECTRON_DEV_MODE is set
  const startUrl = useDevServer
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools if not packaged (for debugging)
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App ready
app.whenReady().then(() => {
  // Initialize the data file
  excelService.initializeDataFile();

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers for Excel operations

// Read all data
ipcMain.handle('excel:read', async () => {
  return excelService.readData();
});

// Write all data
ipcMain.handle('excel:write', async (event, projects) => {
  return excelService.writeData(projects);
});

// Get file path
ipcMain.handle('excel:getFilePath', async () => {
  return excelService.getFilePath();
});

// Read user settings
ipcMain.handle('settings:read', async () => {
  return excelService.readSettings();
});

// Write user settings
ipcMain.handle('settings:write', async (event, settings) => {
  return excelService.writeSettings(settings);
});

// Show file in explorer
ipcMain.handle('excel:showInFolder', async () => {
  const filePath = excelService.getFilePath();
  shell.showItemInFolder(filePath);
  return { success: true };
});

// Export data to a chosen location
ipcMain.handle('excel:export', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Export Data',
    defaultPath: 'project-tracker-export.xlsx',
    filters: [
      { name: 'Excel Files', extensions: ['xlsx'] },
    ],
  });

  if (!result.canceled && result.filePath) {
    const data = excelService.readData();
    if (data.success) {
      // Create a new workbook at the chosen location
      const XLSX = require('xlsx');
      const workbook = XLSX.utils.book_new();

      // Prepare projects data
      const projectsData = data.data.map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: project.status,
        priority: project.priority,
        category: project.category,
        owner: project.owner,
        startDate: project.startDate,
        dueDate: project.dueDate,
        completedDate: project.completedDate || '',
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      }));

      // Prepare tasks data
      const tasksData = [];
      data.data.forEach(project => {
        project.tasks.forEach(task => {
          tasksData.push({
            id: task.id,
            projectId: task.projectId,
            name: task.name,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate,
            completedDate: task.completedDate || '',
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          });
        });
      });

      const projectsSheet = XLSX.utils.json_to_sheet(projectsData);
      const tasksSheet = XLSX.utils.json_to_sheet(tasksData);

      XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projects');
      XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tasks');

      XLSX.writeFile(workbook, result.filePath);
      return { success: true, filePath: result.filePath };
    }
    return { success: false, error: 'Failed to read data' };
  }

  return { success: false, canceled: true };
});
