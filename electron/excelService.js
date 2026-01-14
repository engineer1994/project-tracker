const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// Get the data file path - stored in user's app data directory
function getDataFilePath() {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'project-tracker-data.xlsx');
}

// Initialize with default data if file doesn't exist
function initializeDataFile() {
  const filePath = getDataFilePath();

  if (!fs.existsSync(filePath)) {
    // Create default workbook with Projects, Tasks, and Settings sheets
    const workbook = XLSX.utils.book_new();

    // Projects sheet headers
    const projectsData = [
      ['id', 'name', 'description', 'status', 'priority', 'category', 'owner', 'startDate', 'dueDate', 'completedDate', 'createdAt', 'updatedAt']
    ];
    const projectsSheet = XLSX.utils.aoa_to_sheet(projectsData);
    XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projects');

    // Tasks sheet headers
    const tasksData = [
      ['id', 'projectId', 'name', 'description', 'status', 'dueDate', 'completedDate', 'createdAt', 'updatedAt']
    ];
    const tasksSheet = XLSX.utils.aoa_to_sheet(tasksData);
    XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tasks');

    // Settings sheet with default values
    const settingsData = [
      ['key', 'value'],
      ['userName', ''],
      ['userInitials', '']
    ];
    const settingsSheet = XLSX.utils.aoa_to_sheet(settingsData);
    XLSX.utils.book_append_sheet(workbook, settingsSheet, 'Settings');

    // Write the file
    XLSX.writeFile(workbook, filePath);
    console.log('Created new data file at:', filePath);
  } else {
    // Check if Settings sheet exists, add if missing (for existing files)
    try {
      const workbook = XLSX.readFile(filePath);
      if (!workbook.Sheets['Settings']) {
        const settingsData = [
          ['key', 'value'],
          ['userName', ''],
          ['userInitials', '']
        ];
        const settingsSheet = XLSX.utils.aoa_to_sheet(settingsData);
        XLSX.utils.book_append_sheet(workbook, settingsSheet, 'Settings');
        XLSX.writeFile(workbook, filePath);
        console.log('Added Settings sheet to existing file');
      }
    } catch (error) {
      console.error('Error checking/adding Settings sheet:', error);
    }
  }

  return filePath;
}

// Read user settings from Excel
function readSettings() {
  const filePath = initializeDataFile();

  try {
    const workbook = XLSX.readFile(filePath);
    const settingsSheet = workbook.Sheets['Settings'];

    if (!settingsSheet) {
      return { success: true, data: { userName: '', userInitials: '' } };
    }

    const settingsRaw = XLSX.utils.sheet_to_json(settingsSheet, { defval: '' });
    const settings = {};
    settingsRaw.forEach(row => {
      settings[row.key] = row.value;
    });

    return { success: true, data: settings };
  } catch (error) {
    console.error('Error reading settings:', error);
    return { success: false, error: error.message };
  }
}

// Write user settings to Excel
function writeSettings(settings) {
  const filePath = initializeDataFile();

  try {
    const workbook = XLSX.readFile(filePath);

    // Convert settings object to array format
    const settingsData = [['key', 'value']];
    Object.entries(settings).forEach(([key, value]) => {
      settingsData.push([key, value]);
    });

    // Create new settings sheet
    const settingsSheet = XLSX.utils.aoa_to_sheet(settingsData);

    // Remove old Settings sheet and add new one
    if (workbook.Sheets['Settings']) {
      delete workbook.Sheets['Settings'];
      const index = workbook.SheetNames.indexOf('Settings');
      if (index > -1) {
        workbook.SheetNames.splice(index, 1);
      }
    }
    XLSX.utils.book_append_sheet(workbook, settingsSheet, 'Settings');

    // Write the file
    XLSX.writeFile(workbook, filePath);

    return { success: true };
  } catch (error) {
    console.error('Error writing settings:', error);
    return { success: false, error: error.message };
  }
}

// Read all projects and tasks from Excel
function readData() {
  const filePath = initializeDataFile();

  try {
    const workbook = XLSX.readFile(filePath);

    // Read Projects sheet
    const projectsSheet = workbook.Sheets['Projects'];
    const projectsRaw = XLSX.utils.sheet_to_json(projectsSheet, { defval: '' });

    // Read Tasks sheet
    const tasksSheet = workbook.Sheets['Tasks'];
    const tasksRaw = XLSX.utils.sheet_to_json(tasksSheet, { defval: '' });

    // Group tasks by projectId
    const tasksByProject = {};
    tasksRaw.forEach(task => {
      if (!tasksByProject[task.projectId]) {
        tasksByProject[task.projectId] = [];
      }
      tasksByProject[task.projectId].push({
        id: task.id,
        projectId: task.projectId,
        name: task.name,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        completedDate: task.completedDate || null,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });
    });

    // Build projects with their tasks
    const projects = projectsRaw.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      category: project.category,
      owner: project.owner,
      startDate: project.startDate,
      dueDate: project.dueDate,
      completedDate: project.completedDate || null,
      tasks: tasksByProject[project.id] || [],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    }));

    return { success: true, data: projects };
  } catch (error) {
    console.error('Error reading data:', error);
    return { success: false, error: error.message };
  }
}

// Write all projects and tasks to Excel
function writeData(projects) {
  const filePath = initializeDataFile();

  try {
    const workbook = XLSX.utils.book_new();

    // Prepare projects data (without tasks array)
    const projectsData = projects.map(project => ({
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

    // Prepare tasks data (flatten all tasks from all projects)
    const tasksData = [];
    projects.forEach(project => {
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

    // Create sheets
    const projectsSheet = XLSX.utils.json_to_sheet(projectsData);
    const tasksSheet = XLSX.utils.json_to_sheet(tasksData);

    // Set column widths for better readability
    projectsSheet['!cols'] = [
      { wch: 36 }, // id
      { wch: 30 }, // name
      { wch: 50 }, // description
      { wch: 12 }, // status
      { wch: 10 }, // priority
      { wch: 15 }, // category
      { wch: 20 }, // owner
      { wch: 12 }, // startDate
      { wch: 12 }, // dueDate
      { wch: 12 }, // completedDate
      { wch: 12 }, // createdAt
      { wch: 12 }, // updatedAt
    ];

    tasksSheet['!cols'] = [
      { wch: 36 }, // id
      { wch: 36 }, // projectId
      { wch: 30 }, // name
      { wch: 50 }, // description
      { wch: 12 }, // status
      { wch: 12 }, // dueDate
      { wch: 12 }, // completedDate
      { wch: 12 }, // createdAt
      { wch: 12 }, // updatedAt
    ];

    XLSX.utils.book_append_sheet(workbook, projectsSheet, 'Projects');
    XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tasks');

    // Write the file
    XLSX.writeFile(workbook, filePath);

    return { success: true };
  } catch (error) {
    console.error('Error writing data:', error);
    return { success: false, error: error.message };
  }
}

// Get the file path for display purposes
function getFilePath() {
  return getDataFilePath();
}

module.exports = {
  readData,
  writeData,
  getFilePath,
  initializeDataFile,
  readSettings,
  writeSettings,
};
