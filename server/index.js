import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
// Configuramos el servidor para recibir archivos pesados (fotos/videos)
const io = new Server(httpServer, { 
    maxHttpBufferSize: 1e8, 
    cors: { origin: "*" } 
});

let usuariosAprobados = new Set();

app.use(express.static('public'));

io.on('connection', (socket) => {
    // Escucha cuando tú o un usuario suben un archivo desde la galería
    socket.on('archivo_multimedia', (data) => {
        io.emit('nuevo_archivo', data);
    });

    socket.on('registro', (datos) => {
        io.emit('peticion_acceso', { id: socket.id, ...datos });
    });

    socket.on('aprobar_usuario', (id) => {
        usuariosAprobados.add(id);
        io.to(id).emit('aprobado_confirmado');
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log("Eva x: Motor Multimedia Activo"));
