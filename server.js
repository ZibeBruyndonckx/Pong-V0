/*
Pong game by Zibe.br server file c
*/ 

//Setup CHANGED
//#region 
let express = require('express');
let app = express();
let server = app.listen(3000);
let socket = require('socket.io');
let io = socket(server);
app.use(express.static('Public'));
let numberConnections = 0;
//#endregion

//Running CHANGED
//#region 
// Server connecting
io.on('connection', (socket) => {
  if (numberConnections >= 2) {
    console.log(`Maximum connections reached. Connection ${socket.id} will not be established.`);
    socket.disconnect(true);
    return;
  }

  numberConnections++;  
  console.log(`New connection: ${socket.id} is connection number ${numberConnections}`);
  
  socket.on('disconnect', () => {
    numberConnections--;
    console.log(`Client disconnected: ${socket.id}. Current number of connections: ${numberConnections}`);
  });
  
  socket.on('paddleLocationUp', paddleMsgUp);
  socket.on('paddleLocationDown', paddleMsgDown);
  socket.on('isStarted', isStarted);
  socket.on('isEnded', isEnded);
  socket.on('isYread', isYread);
  socket.on('isReadY', isReadY);

  // Server sending data
  function paddleMsgUp(data) {
    socket.broadcast.emit('paddleLocationUp', data);
    //console.log(data);
  }

  function paddleMsgDown(data) {
    socket.broadcast.emit('paddleLocationDown', data);
    //console.log(data);
  }

  function isStarted(data) {
    socket.broadcast.emit('isStarted', data);
    console.log(data + " isStarted");
  }

  function isEnded(data) {
    socket.broadcast.emit('isEnded', data);
    //console.log(data);
  }

  function isYread(data) {
    socket.broadcast.emit('isYread', isYread);
    console.log(data + " isYread");
  }

  function isReadY(data) {
    socket.broadcast.emit('isReadY', isReadY);
    console.log(data + " isReadY")
  }
});
//#endregion
//#endregion