const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const pty = require('node-pty');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // Start Bash directly in /root
    const shell = 'bash'; 
    
    // PTY Process Creation
    const term = pty.spawn(shell, [], {
        name: 'xterm-256color',
        cols: 80,
        rows: 24,
        cwd: '/root',
        env: process.env
    });

    // Handle Data
    term.on('data', (data) => socket.emit('output', data));
    socket.on('input', (data) => term.write(data));
    
    // Resize Handler
    socket.on('resize', (size) => {
        if (term) term.resize(size.cols, size.rows);
    });

    socket.on('disconnect', () => {
        try {
            term.kill();
        } catch(e) {}
    });
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
