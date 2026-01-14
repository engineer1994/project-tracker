import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Sidebar } from './components/layout';
import { Dashboard } from './components/dashboard';
import { ProjectDetail } from './components/project';
import { Settings } from './components/settings';
import './styles/global.css';

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ProjectProvider>
          <Router>
            <div className="app-layout">
              <Sidebar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </Router>
        </ProjectProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
