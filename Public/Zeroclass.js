/*
Pong game by Zibe.br Zeroclass file
*/

//#region 
class Zeroclass {
  
 //Setup CHANGED
 //#region  
  constructor() {
    this.x = random(0, width);
    this.y = 0;
    this.r = 0; //random(0, 255);
    this.g = random(0, 255);
    this.b = random(0, 255);
    this.z = random(1, 3.5);
    this.a = random(50, 255);
  }
  //#endregion

 //Show CHANGED
 //#region  
  show() {
    stroke(this.r, this.g, this.b, this.a);
    strokeWeight(2);
    noFill();
    ellipse(this.x, this.y, 10, 15);
  }
 //#endregion 

 //Fall CHANGED
 //#region 
  fall() {
    this.y += this.z;
    this.a -= this.z + 0.5;
    if (this.a < 0) {
      this.y = 0;
      this.a = 255;
      this.y += this.z;
      this.a -= this.z + 0.5;
    }
  }
 //#endregion   
}
//#endregion  