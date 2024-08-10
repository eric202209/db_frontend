const { spawn } = require('child_process');

const apiServer = spawn('npm', ['run', 'serve-api'], { 
  stdio: 'inherit', 
  shell: true,
  env: { ...process.env, PORT: 3001 }
});

const reactServer = spawn('npm', ['start'], { 
  stdio: 'inherit', 
  shell: true,
  env: { ...process.env, PORT: 3000 }
});

apiServer.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  reactServer.kill();
});

reactServer.on('close', (code) => {
  console.log(`React server exited with code ${code}`);
  apiServer.kill();
});