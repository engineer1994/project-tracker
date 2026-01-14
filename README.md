# Project Tracker

A desktop application for tracking projects and tasks with a Kanban-style interface. Built with React, TypeScript, and Electron, using Microsoft Excel as the data backend for easy data portability and backup.

![Project Tracker Screenshot](docs/screenshot.png)

## Features

- **Kanban Board**: Visual project management with To Do, In Progress, and Completed columns
- **Project Management**: Create, edit, and delete projects with priority levels, categories, and due dates
- **Task Tracking**: Break down projects into individual tasks with their own status tracking
- **Progress Tracking**: Automatic progress calculation based on task completion
- **Schedule Indicators**: Visual indicators for on-track, at-risk, and delayed projects
- **Dark/Light Mode**: Toggle between dark and light themes
- **Excel Backend**: All data stored in a local Excel file for easy backup and portability
- **User Profile**: Customizable user name and initials displayed in the app
- **Search & Filter**: Find projects quickly with search and filter by status, priority, or category

## Tech Stack

- **Frontend**: React 19, TypeScript, CSS Modules
- **Desktop**: Electron 28
- **Data Storage**: Excel (xlsx library)
- **Routing**: React Router DOM
- **Build Tool**: Vite

## Installation

### Windows Installer

Download the latest installer from the [Releases](../../releases) page and run `Project Tracker Setup.exe`.

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-tracker.git
   cd project-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode:
   ```bash
   npm run electron:dev
   ```

4. Build the installer:
   ```bash
   npm run electron:build
   ```

## Project Structure

```
project-tracker/
├── electron/           # Electron main process files
│   ├── main.js         # Main Electron process
│   ├── preload.js      # Preload script for IPC
│   └── excelService.js # Excel read/write operations
├── src/
│   ├── components/     # React components
│   │   ├── common/     # Reusable UI components
│   │   ├── dashboard/  # Dashboard and Kanban board
│   │   ├── layout/     # Header, Sidebar, ThemeToggle
│   │   ├── modals/     # Modal dialogs
│   │   ├── project/    # Project detail view
│   │   └── settings/   # Settings page
│   ├── contexts/       # React Context providers
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Global styles and CSS variables
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── public/             # Static assets
└── scripts/            # Build scripts
```

## Data Storage

Project data is stored in an Excel file located at:
- Windows: `%APPDATA%/project-tracker/project-data.xlsx`

The Excel file contains three sheets:
- **Projects**: All project data
- **Tasks**: All task data linked to projects
- **Settings**: User settings (name, initials)

You can open the data folder directly from the Settings page to backup or modify your data.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (web only) |
| `npm run build` | Build the React app |
| `npm run electron:dev` | Build and run Electron in dev mode |
| `npm run electron:build` | Build Windows installer |
| `npm run lint` | Run ESLint |

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
