const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('¡Alguien se conectó!');
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log('>>> SERVIDOR ACTIVO EN PUERTO ' + PORT);
}).on('error', (err) => {
    console.log('ERROR AL INICIAR:', err);
});
