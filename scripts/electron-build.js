// Wrapper script to run electron-builder without ELECTRON_RUN_AS_NODE
const { spawn } = require('child_process');
const path = require('path');

// Remove the ELECTRON_RUN_AS_NODE variable
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

// Run electron-builder
const child = spawn('npx', ['electron-builder', 'build', '--win', '--publish', 'never'], {
  stdio: 'inherit',
  env,
  cwd: path.join(__dirname, '..'),
  shell: true,
});

child.on('close', (code) => {
  process.exit(code);
});
