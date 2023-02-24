/*
Pong game by Zibe.br sketch file c
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
let bUtton;
let start;
let readY;
let Yread;
let myText;
//#endregion

//Usernames preSetup changed
//#region
let input;
let userName1;
let nameCheck1;
//#endregion

//#endregion

//Setup changed
//#region
function setup() {
  //Ball setup changed
  //#region
  ballX = 750;
  ballY = 350;
  //ballSpeedY = -6;
  //ballSpeedX = 6;
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

  //BUtton setup CHANGED
  //#region
  bUtton = createButton("READY");
  bUtton.size(80, 80);
  bUtton.position(750 - 40, 350 - 40);
  bUtton.mousePressed(goReadY);
  start = false;
  readY = 0;
  Yread = 0;
  input = createInput("");
  input.position(750 - 75, 350 + 125);
  myText = createP("Enter your name below.");
  myText.position(690, 420);
  myText.style("color", "white");
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
  socket = io.connect("http://localhost:3000");
  socket.on("paddleLocationUp", newPaddleUp);
  socket.on("paddleLocationDown", newPaddleDown);
  socket.on("isStarted", isStarted);
  socket.on("isEnded", isEnded);
  socket.on("isYread", isYread);
  socket.on("isReadY", isReadY);
  socket.on("isUserName1", isUserName1);
  //#endregion
}
//#endregion

//Receive data CHANGED
//#region
function newPaddleUp(data) {
  player1Y = data.y;
}
function newPaddleDown(data) {
  player1Y = data.y;
}
function isStarted(data) {
  start = data.s;
  ballSpeedY = data.b;
  ballSpeedX = data.d;
}
function isEnded(data) {
  start = data.e;
  ballX = 750;
  ballY = 350;
  bUtton.show();
  ballSpeedX = data.p;
  ballSpeedX = data.q;
}
function isYread(data) {
  Yread = data.w;
  console.log("Y" + data.w);
  console.log(readY, Yread);
  if (readY === 1 && Yread === 1) {
    goStart();
  }
}
function isReadY(data) {
  readY = data.v;
  console.log(data.v + "Y");
  console.log(readY, Yread);
  if (readY === 1 && Yread === 1) {
    goStart();
  }
}
function isUserName1(data) {
  userName1 = data.i;
  nameCheck1 = true;
}
//#endregion

//GoStart CHANGED
//#region
function goReadY() {
  if (Yread === 1) {
    readY = 1;
    let data = {
      v: 1,
    };
    socket.emit("isReadY", data);
  }
  if (Yread === 0) {
    Yread = 1;
    let data = {
      w: 1,
    };
    socket.emit("isYread", data);
  }
  bUtton.style("background-color", "green");
}

function goStart() {
  ballSpeedY = random(-7, -8) || random(6, 7);
  ballSpeedX = random(-7, -8) || random(6, 7);
  start = true;
  let data = {
    s: start,
    d: Math.abs(ballSpeedX),
    b: ballSpeedY,
  };
  socket.emit("isStarted", data);
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
    }
  }
  //#endregion

  //Start CHANGED
  //#region
  if (start) {
    //Hide button CHANGED
    bUtton.hide();
    input.hide();
    myText.hide();
    fill(255);
    text(input.value(), 20, 30);
    let data = {
      i: input.value(),
    };
    socket.emit("isUserName1", data);
    if (nameCheck1 === true) {
      text(userName1, 1500 - 200, 30);
    }

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
    let data = {
      y: player2Y,
    };
    socket.emit("paddleLocationUp", data);
  }
  if (keyIsDown(DOWN_ARROW) && player2Y < 750 - playerHeight) {
    //S
    player2Y += playerSpeed;
    let data = {
      y: player2Y,
    };
    socket.emit("paddleLocationDown", data);
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
    start = false;
    ballSpeedX *= -1;
    ballSpeedY = random(-7, -8) || random(6, 7);
    let data = {
      e: start,
      p: Math.abs(ballSpeedY),
      q: ballSpeedX,
    };
    socket.emit("isEnded", data);
    ballX = 750;
    ballY = 350;
    button.show();
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
