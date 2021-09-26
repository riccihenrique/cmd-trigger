const express = require('express');
const bodyParser = require('body-parser');

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


app.use(bodyParser.json());

app.get('/login');

app.get('/ping', (_, res) => {
    res.end();
});

app.post('/exec', (req, res) => {
    console.log('eae');
    const { cmd, user } = req.body;
    usersOnline[user] && usersOnline[user].conn.write(JSON.stringify({ type: 'cmd', cmd }));
    
    res.end();
});
server.listen(process.env.PORT || 3000, () => {
  console.log('Servidor escutando na porta 8080');
});