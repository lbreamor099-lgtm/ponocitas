import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Carpeta de archivos públicos (donde estará tu index.html)
app.use(express.static('public'));

// Lógica del Chat para miles de personas
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    socket.on('mensaje', (data) => {
        // Esto envía el mensaje a TODAS las personas conectadas al mismo tiempo
        io.emit('mensaje', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor tecnológico corriendo en puerto ${PORT}`);
});
