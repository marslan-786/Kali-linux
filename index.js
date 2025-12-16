const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const pty = require('node-pty');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log("💀 New Kali Session Started");

    // ٹرمینل کو 'bash' یا 'zsh' (اگر کالی میں ہے) پر چلائیں
    // ہم کالی میں روٹ یوزر (root) کے طور پر چلائیں گے تاکہ سب کچھ انسٹال کر سکیں
    const shell = 'bash'; 
    
    const term = pty.spawn(shell, [], {
        name: 'xterm-256color', // Full color support for Kali tools
        cols: 80,
        rows: 24,
        cwd: '/root', // <--- سب کا ہوم فولڈر ایک ہی ہے
        env: process.env
    });

    // Welcome Message (ASCII Art)
    term.write('clear\r');
    term.write('\x1b[1;31m' + `
    _  __     _ _   _     _                 
   | |/ /    | (_) | |   (_)                
   | ' / __ _| |_  | |    _ _ __  _   ___  __
   |  < / _\` | | | | |   | | '_ \\| | | \\ \\/ /
   | . \\ (_| | | | | |___| | | | | |_| |>  < 
   |_|\\_\\__,_|_|_| \\_____/_|_| |_|\\__,_/_/\\_\\
                                             
    ` + '\x1b[0m\r\n');
    term.write('\x1b[1;32mWelcome to Web-Kali (Root Access)\x1b[0m\r\n');
    term.write('----------------------------------------\r\n');

    term.on('data', (data) => socket.emit('output', data));
    
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
    console.log(`Kali Server listening on port ${PORT}`);
});
