import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

// Variables de estado del Jefe
let salaAbierta = true;
let usuariosPendientes = [];
let usuariosAprobados = new Set();
let canalesLive = [null, null, null, null];
let musicaActual = { url: '', estado: 'stop', volumen: 0.5 };
let imagenEncabezado = "https://via.placeholder.com/800x200?text=Bienvenido+a+Eva";

app.use(express.static('public'));

io.on('connection', (socket) => {
    // Contador de personas
    io.emit('contador', io.engine.clientsCount);

    // Registro de usuario
    socket.on('registro', (datos) => {
        usuariosPendientes.push({ id: socket.id, ...datos });
        io.emit('notificacion_jefe', { tipo: 'aprobacion_pendiente', lista: usuariosPendientes });
    });

    // Control de Jefe: Aprobar Usuario
    socket.on('aprobar_usuario', (id) => {
        usuariosAprobados.add(id);
        io.to(id).emit('aprobado_confirmado');
        usuariosPendientes = usuariosPendientes.filter(u => u.id !== id);
    });

    // Control de Jefe: Música y Canales
    socket.on('comando_jefe', (cmd) => {
        if (cmd.tipo === 'musica') {
            musicaActual = cmd.data;
            io.emit('actualizar_musica', musicaActual);
        }
        if (cmd.tipo === 'cerrar_sala') {
            salaAbierta = cmd.estado;
            io.emit('estado_sala', salaAbierta);
        }
    });

    socket.on('mensaje', (data) => {
        if (salaAbierta || data.jefe) {
            io.emit('mensaje', data);
        }
    });

    socket.on('disconnect', () => {
        io.emit('contador', io.engine.clientsCount);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log("Servidor Eva x Activo en puerto " + PORT));
