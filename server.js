const express = require('express');
const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

const { v4: uuidv4 } = require('uuid');

//EXPRESS SETUP
app.set('view engine', 'ejs');
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect(`${uuidv4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

//when use connects
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)
    });
    socket.on('disconnect', (roomId, userId) => {
        socket.to(roomId).broadcast.emit('user-disconnectd', userId);
    })
})

server.listen(3000);