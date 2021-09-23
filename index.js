const express = require('express');
const bodyParser = require('body-parser');
const http = require('http').createServer(app);

const io = require('socket.io')(http, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

const app = express();

const usersOnline = {};

io.on('connection', (socket) => {
    socket.on('name', (name) => {
        usersOnline[name] = { id: socket.id, socket };
    });

    socket.on('disconnect', () => {
        delete usersOnline[Object.entries(usersOnline).filter(([key, { id }]) => id === socket.id)[0][0]];
    });
});

app.use(bodyParser());

app.get('/login');

app.post('/exec', (req, res) => {
    const { cmd, user } = req.body;

    usersOnline[user] && usersOnline[user].socket.emit('cmd', cmd);
});

app.listen(process.env.PORT || 3000);