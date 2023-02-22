/*
Pong game by Zibe.br sketch file
*/ 

//PreSetup CHANGED
//#region 

 //Socket preSetup CHANGED
 //#region 
  let socket;
  //#endregion

 //Background preSetup CHANGED
 //#region 
  let one = [];
  let zero = [];
  //#endregion

 //Ball preSetup CHANGED
 //#region 
  let ballX;
  let ballY;
  let ballSpeedX;
  let ballSpeedY;
  let ballSize;
  //#endregion

 //Paddle preSetup CHANGED
 //#region 
  let player1Y;
  let player2Y;
  let playerWidth;
  let playerHeight;
  let playerSpeed;
  let playerSpeed1;
  //#endregion

 //Button preSetup CHANGED
 //#region 
  let button;
  let start;
  //#endregion

//#endregion
  
//Setup changed  
//#region 
 function setup() {
  //Ball setup changed
  //#region 
  ballX = 750;
  ballY = 350;
  ballSpeedY = -6
  ballSpeedX = 6;
  ballSize = 30;
  //#endregion

  //Paddle setup CHANGED
  //#region 
  player1Y = 350;
  player2Y = 350;
  playerWidth = 20;
  playerHeight = 90;
  playerSpeed = 6;
  playerSpeed1 = 6;
  //#endregion

  //Button setup CHANGED
  //#region 
  button = createButton("GO");
  button.size(80,80)
  button.position(750 - 30, 350 - 50);
  button.mousePressed(goStart)
  start = false
  //#endregion

  //Background setup CHANGED
  //#region 
  createCanvas(1500, 700);
  for (let i = 0; i < 50; i++) {
   zero[i] = new Zeroclass();
  }
  for (let j = 0; j < 50; j++) {
   one[j] = new Oneclass();
  }
  //#endregion

  //Socket setup changed
  //#region 
   socket = io.connect('http://localhost:3000');
   socket.on('paddleLocationUp', newPaddleUp);
   socket.on('paddleLocationDown', newPaddleDown);
   socket.on('isStarted', isStarted);
   socket.on('isEnded', isEnded);
   //#endregion
}
//#endregion

//Receive data CHANGED
//#region 
function newPaddleUp(data) {
  player1Y = data.y
}
function newPaddleDown(data) {
  player1Y = data.y
}
function isStarted(data) {
  start = data.s
  ballSpeedY = data.b
}
function isEnded(data) {
  start = data.e
  ballX = 750;
  ballY = 350;
  button.show();
  ballSpeedX *= -1;
  data.p = ballSpeedY
}
//#endregion

//GoStart CHANGED
//#region 
function goStart() {
  ballSpeedY = random(-6, -7) || random(6, 7);
  start = true;
  console.log("Transfering isStarted: " + start);
  let data = {
    s: start,
    b: ballSpeedY 
  }
  socket.emit('isStarted', data);
}
//#endregion

//Draw changed
//#region 
function draw() { 

  //Background CHANGED
  //#region 
  background(0);
  if (start === false) {
  for (let y = 0; y < 50; y++) {
    zero[y].fall();
    zero[y].show();
    one[y].fall();
    one[y].show();
  } }
  //#endregion

  //Start CHANGED
  //#region 
  if (start) {
    //Hide button CHANGED
    button.hide();

    //Move the ball CHANGED
    ballY += ballSpeedY;
    ballX += ballSpeedX;
  }
  //#endregion
 
  //Move player2 CHANGED
  //#region 
  if (keyIsDown(UP_ARROW) && player2Y > 0) {
    //Z
    player2Y -= playerSpeed;
    console.log("Transfering paddleLocationUp: " + player2Y);
    let data = {
        y: player2Y
    }
    socket.emit('paddleLocationUp', data);
  }
  if (keyIsDown(DOWN_ARROW) && player2Y < 750 - playerHeight) {
    //S
    player2Y += playerSpeed;
    console.log("Transfering paddleLocationDown: " + player2Y);
    let data = {
        y: player2Y
    }
    socket.emit('paddleLocationDown', data);
  }
  //#endregion
  
  //Check ball hitting changed
  //#region 
  //Check for ball hitting edges changed
  if (ballY < 0 || ballY > 700) {
    ballSpeedY *= -1;
  }

  //Check for ball hitting goal changed
  if (ballX < 0 || ballX > 1500) {
    console.log("Again");
    start = false
    ballSpeedY = random(-6, -7) || random(6, 7);
    console.log("Transfering isEnded start = " + start);
    let data = {
     e: start,
     p: ballSpeedY
    }
    socket.emit('isEnded', data);
    ballX = 750;
    ballY = 350;
    button.show();
    ballSpeedX *= -1;
  }

  //Check for ball hitting player1 changed
  if (
    ballX >= 1500 - playerWidth - playerWidth - 1 &&
    ballY >= player1Y &&
    ballY <= player1Y + playerHeight
  ) {
    ballSpeedX *= -1;
  }

  //Check for ball hitting player2 changed
  if (
    ballX <= playerWidth + playerWidth + 1 &&
    ballY >= player2Y &&
    ballY <= player2Y + playerHeight
  ) {
    ballSpeedX *= -1;
  }
  //#endregion

  //Draw CHANGED
  //#region 
  //Draw player1 CHANGED
  noStroke();
  fill(0, 255, 0);
  rect(1500 - playerWidth - playerWidth, player1Y, playerWidth, playerHeight);

  //Draw player2 CHANGED
  noStroke();
  fill(255);
  rect(0 + playerWidth, player2Y, playerWidth, playerHeight);

  //Draw the ball CHANGED
  noStroke();
  fill(255, 102, 0);
  ellipse(ballX, ballY, ballSize, ballSize);
  //#endregion
}
//#endregion