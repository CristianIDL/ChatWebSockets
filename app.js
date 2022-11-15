const express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.set('port', process.env.PORT || 8080);
server.listen(app.get('port'), () => console.log('Servidor iniciado en 8080'));

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'public');
});

io.on('connection', (socket) => {
  console.log('Socket conectado', socket.id);
  io.emit('socket_conectado',
    'El socket ' 
    + '<b>' + socket.id + '</b>' +
      ' Se ha conectado 📨');

    socket.on('disconnect', () => {
      console.log('Socket desconectado', socket.id);
      io.emit('socket_desconectado', 
      'El socket '   
      + '<b>' + socket.id + '</b>' +
        ' Se ha desconectado 👋'
      );
    });

  socket.on('chat:mensaje', (data) => {
    io.emit('chat:mensaje', data);
  });

  socket.on('chat:escribiendo', (usuario) => {
    socket.broadcast.emit('chat:escribiendo', usuario);
  });
});