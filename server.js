/*
Pong game by Zibe.br server file 
*/

//Setup CHANGED
//#region
let express = require("express");
let app = express();
let server = app.listen(3000);
let socket = require("socket.io");
let io = socket(server);
app.use(express.static("Public"));
let numberConnections = 0;
//#endregion

//Running CHANGED
//#region
// Server connecting
io.on("connection", (socket) => {
  if (numberConnections >= 2) {
    console.log(
      `Maximum connections reached. Connection ${socket.id} will not be established.`
    );
    socket.disconnect(true);
    return;
  }

  numberConnections++;
  console.log(
    `New connection: ${socket.id} is connection number ${numberConnections}`
  );

  socket.on("disconnect", () => {
    numberConnections--;
    console.log(
      `Client disconnected: ${socket.id}. Current number of connections: ${numberConnections}`
    );
  });

  socket.on("paddleLocationUp", paddleMsgUp);
  socket.on("paddleLocationDown", paddleMsgDown);
  //socket.on("isStarted", isStarted);
  socket.on("isEnded", isEnded);
  socket.on("isYread", isYread);
  socket.on("isReadY", isReadY);
  socket.on("isUserName1", isUserName1);

  // Server sending data
  function paddleMsgUp(data) {
    socket.broadcast.emit("paddleLocationUp", data);
  }
  function paddleMsgDown(data) {
    socket.broadcast.emit("paddleLocationDown", data);
  }
  //function isStarted(data) {
  //socket.broadcast.emit("isStarted", data);
  //}
  function isEnded(data) {
    socket.broadcast.emit("isEnded", data);
  }
  function isYread(data) {
    socket.broadcast.emit("isYread", data);
  }
  function isReadY(data) {
    socket.broadcast.emit("isReadY", data);
  }
  function isUserName1(data) {
    socket.broadcast.emit("isUserName1", data);
  }
});
//#endregion
//#endregion
