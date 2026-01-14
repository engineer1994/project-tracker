// Wrapper script to run Electron without ELECTRON_RUN_AS_NODE
const { spawn } = require('child_process');
const path = require('path');

// Remove the ELECTRON_RUN_AS_NODE variable
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

// Get the electron path
const electronPath = require('electron');

// Run electron
const child = spawn(electronPath, ['.'], {
  stdio: 'inherit',
  env,
  cwd: path.join(__dirname, '..'),
});

child.on('close', (code) => {
  process.exit(code);
});
