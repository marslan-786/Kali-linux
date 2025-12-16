const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const pty = require('node-pty');
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log("New Session Started");

    // Use bash directly
    const shell = 'bash'; 
    
    const term = pty.spawn(shell, [], {
        name: 'xterm-256color',
        cols: 80,
        rows: 24,
        cwd: '/root', // Volume will be mounted here
        env: process.env
    });

    // Send data to client
    term.on('data', (data) => socket.emit('output', data));
    
    // Receive input
    socket.on('input', (data) => term.write(data));
    
    socket.on('resize', (size) => {
        if (term) term.resize(size.cols, size.rows);
    });

    socket.on('disconnect', () => {
        term.kill();
        console.log("Session Ended");
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
