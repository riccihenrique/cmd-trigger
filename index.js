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
        try {
            data = JSON.parse(data);
        }
        catch(ex) {
            let req = data.toString().split('\n')[0];

            if (req.startsWith('GET')) {
                req = req.substring(6).split(' ')[0].replace(/&/g, '=').split('=');
                data = {};
                for(let i = 0; i < req.length; i += 2) {
                    data[req[i]] = req[i + 1];
                }
                data.type = 'cmd';
                console.log(data);
            }
            else {
                throw {
                    error: 'request inválido',
                }
            }            
        }

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

app.get('/ping', (_, res) => {
    res.end();
});

app.post('/cmd', (req, res) => {
    const { user, cmd } = req.body;
    usersOnline[user] && usersOnline[user].conn.write(JSON.stringify({ type: 'cmd', cmd }));
    res.end();
});

server.listen(8080);
app.listen(80);