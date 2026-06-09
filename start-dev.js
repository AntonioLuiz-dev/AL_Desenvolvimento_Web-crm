const { spawn } = require('child_process')

const api = spawn('node', ['server.js'], { stdio: 'inherit', shell: true })
const vite = spawn('node', ['node_modules/vite/bin/vite.js'], { stdio: 'inherit', shell: true })

function kill() {
  api.kill()
  vite.kill()
}

process.on('SIGINT', kill)
process.on('SIGTERM', kill)
process.on('exit', kill)
