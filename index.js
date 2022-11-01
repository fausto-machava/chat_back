const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});


io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User with id: ${socket.id} joined ${room}`);
    });

    socket.on('send_message', (data) => {
        console.log(data);
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('create_channel', (data) => {
        console.log(data);
        socket.broadcast.emit('receive_channel', data);
    })

    socket.on('getRooms', function() {
        console.log(io.sockets.adapter.socketRooms(socket.id));
        socket.emit('rooms', io.sockets.adapter.socketRooms);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id)
    });
});

server.listen(3001, () => {
    console.log("Server running...");
});