import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    maxHttpBufferSize: 1e8, 
    cors: { origin: "*" } 
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('archivo_multimedia', (data) => {
        io.emit('nuevo_archivo', data);
    });
    socket.on('registro', (datos) => {
        io.emit('peticion_acceso', { id: socket.id, ...datos });
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log("Servidor Online"));
