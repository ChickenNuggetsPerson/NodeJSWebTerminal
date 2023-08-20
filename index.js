const express = require('express');
const http = require('http');
const pty = require('node-pty');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public')); // Serve the frontend files

const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
io.on('connection', socket => {
  const term = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 30,
    cwd: process.env.HOME,
    env: process.env
  });

  term.onData(data => {
    socket.emit('output', data);
  });

  socket.on('input', data => {
    term.write(data);
  });

  socket.on('disconnect', () => {
    term.kill();
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
