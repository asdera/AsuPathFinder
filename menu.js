function preload() {
  fontT = loadFont('Habisa.ttf');
  fontD = loadFont('GarbataTrial-Regular.ttf');
}

var menu = {
  x: 0,
  width: 0,
  quarter: 0,
  extra: false,
  on: true,
  speed: 20,
  rotate: [24, 24, 0],
  turn: 12,
  setup: function() {
    this.width = windowHeight * 0.35;
    this.quarter = this.width / 4;
    cur = {
      sel: 0,
      colour: color(191, 255, 0),
    }
  },
  update: function() {
    if (menu.on) {
      this.x = min(this.x + this.speed, this.width);
    } else {
      this.x = max(this.x - this.speed, 0);
    }

    if (0 < this.x && this.x <= this.speed) {
      mixNodes(0, 0, 0, 0);
    }

    var g = this.quarter;
    var gg = g / 6;
    var booty = 2 * gg;
    var spe = f > 65 ? 0 : sin(f*PI / 20 - 1) ** 2 / (f*PI /20);
    var kate = f > 65 ? 0 : 2**(0-(f/10-3)**2);
    this.extra = this.extra || showPath
    var op = min(f / 80, 1) * 255;
    var op0 = (1-min((f-65) / 30, 1)) * 255;
    var op05 = (1-min((f-65) / 30, 1)) * 255;
    var op1 = min((f-105) / 30, 1) * 255;
    var op2 = min((f-145) / 30, 1) * 255;
    var op25 = min((f-185) / 30, 1) * 255;
    var op3 = min((f-255) / 30, 1) * 255;
    var op4 = min((f-295) / 30, 1) * 255;
    // var op = 255;
    // var op1 = 255;
    // var op2 = 255;
    // var op25 = 255;
    // var op3 = 255;
    // var op4 = 255;
    translate(0, booty);


    fill(100, 200, 250, op);
    textFont(fontT);
    textAlign(CENTER);
    rectMode(CENTER);
    textSize(g * 0.8);
    translate(-2.65 * g - spe * 3 * g, g * 0.6);
    rotate(-2*PI*kate);
    text("Asu", 0, 0);
    rotate(2*PI*kate);
    translate(2.65 * g + spe * 3 * g, -g * 0.6);
    translate(-1.35 * g + spe * 3 * g, g * 0.6);
    rotate(2*PI*kate);
    text("Path", 0, 0);
    rotate(-2*PI*kate);
    translate(1.35 * g - spe * 3 * g, -g * 0.6);
    textSize(g * 0.4);
    fill(0, op0);
    text("A Pathfinding", -g*2, 3.2*g);
    text("Visualizer", -g*2, 4*g);
    text("By Andrew Wang", -g*2, 4.8*g);
    fill(0, op05);
    text("Press Space or", -g*2, 6.6*g);
    text("Click Outside the Grid ", -g*2, 7.4*g);
    text("to Search for a Path!", -g*2, 8.2*g);
    strokeWeight(2);

    textSize(g * 0.25);

    for (var i = 2.7; i < 9; i++) {
      stroke(100, 200, 250, op1);
      line(-22 * gg, i * g, -2 * gg, i * g);
      noStroke();
      fill(50, op3);
      rect(-3.6 * g, i * g - gg-g/10, gg, gg / 5)
      rect(-3.7 * g+g/10, i * g - 1.6 * gg, gg / 5, gg)
      text("Shift", -3.2 * g, i * g - gg);
      if (i == 4.7) i += 0.5;
    }
    fill(50, op1);
    textFont(fontD);
    text("Algorithm", -2.9 * g, 9.8 * g - gg);
    text("Grid", -1.1 * g, 9.8 * g - gg);
    
    textSize(g * 0.20);
    fill(250, 20, 200, instant ? op4 : op4/3);
    text("Instant Solve", -2.9 * g, 10.75 * g - gg);
    fill(250, 20, 200, randomness ? op4 : op4/3);
    text("Randomness", -1.1 * g, 10.75 * g - gg);
    textFont(fontT);
    stroke(100, 200, 250, op1);
    line(-22 * gg, 9.3 * g, -2 * gg, 9.3 * g);
    stroke(100, 200, 250, op1);
    line(-22 * gg, 10.3 * g, -2 * gg, 10.3 * g);
    noStroke();
    fill(50, op3);
    rect(-2.5 * g, 9.3 * g - gg - g/10, gg, gg / 5)
    rect(-2.6 * g+g/10, 9.3 * g - 1.6 * gg, gg / 5, gg)
    textSize(g * 0.25)
    text("Shift", -2.1 * g, 9.3 * g - gg);

    fill(180, 250, 200, op2);

    stroke(100, 200, 250, op1);
    rect(-3.2 * g, 2.7 * g + 2 * gg, 6.25 * gg, 2.25 * gg, gg / 3);
    stroke(50, op1);
    line(-3.5 * g, 3.1 * g, -2.9 * g, 3.1 * g);
    stroke(100, 200, 250, op1);
    fill(50, op2);
    rect(-3.1 * g, 1.25 * g, 2.25 * gg, 2.25 * gg, gg / 3);
    fill(255, op2);
    rect(-2.7 * g, 1.25 * g, 2.25 * gg, 2.25 * gg, gg / 3);
    line(-1.6 * g, 1.15 * g, -0.6 * g, 1.35 * g);
    fill(255, 50, 50, op2);
    rect(-1.6 * g, 1.15 * g, 2.25 * gg, 2.25 * gg, gg / 3);
    fill(255, op2);

    rect(-0.6 * g, 1.35 * g, 2.25 * gg, 2.25 * gg, gg / 3);
    fill(255, 50, 50, op2);
    noStroke();
    rect(-0.6 * g, 1.35 * g, 1.1 * gg, 1.1 * gg, gg / 3);
    ellipseMode(CENTER);
    fill(180, 250, 200, op2);
    stroke(100, 200, 250, op1);
    ellipse(-2.25 * g, 1.25 * g, 1.8 * gg, 2.5 * gg)
    ellipse(-3.55 * g, 1.25 * g, 1.8 * gg, 2.5 * gg)
    fill(50, op2);
    arc(-2.25 * g, 1.2 * g, 1.8 * gg, 1.8 * gg, -PI / 2, 0, PIE);
    arc(-3.55 * g, 1.2 * g, 1.8 * gg, 1.8 * gg, PI, -PI / 2, PIE);
    line(-3.7 * g, 1.05 * g, -3.75 * g, g)
    line(-2.1 * g, 1.05 * g, -2.05 * g, g)
    line(-1.95 * g, 1 * g, -1.95 * g, 2.2 * g)
    line(-1.95 * g, 9.5 * g, -1.95 * g, 10.1 * g)

    fill(100, 200, 250, op2);
    noStroke();
    rect(-3.2 * g, 8.7 * g, 4.5 * gg, 4.5 * gg, gg / 3);
    fill(255, op2);
    rect(-3.2 * g, 8.7 * g, 2.25 * gg, 2.25 * gg, gg / 3);
    noFill();
    stroke(255, op1);
    rect(-3.2 * g, 8.7 * g, 4 * gg, 4 * gg, gg / 3);

    fill(180, 250, 200, op2);
    stroke(50, op1);

    quad(-0.6 * g, 1.35 * g, -0.6 * g, 1.07 * g,
      -0.42 * g, 1.29 * g, -0.525 * g, 1.27 * g,
    )
    quad(-2.95 * g, 8.95 * g, -2.95 * g, 8.67 * g,
      -2.77 * g, 8.89 * g, -2.875 * g, 8.87 * g,
    )
    var k = 1
    for (var i = 3.7; i < 8; i++) {
      fill(180, 250, 200, op2);
      stroke(100, 200, 250, op1);
      rect(-3.2 * g, i * g + 2 * gg, 2.25 * gg, 2.25 * gg, gg / 3);
      noStroke();
      fill(50, op2);
      text(str(k), -3.2 * g, i * g + 2.4 * gg);
      k++;
      if (i == 3.7 || i == 6.2) {
        fill(180, 250, 200, op2);
        stroke(100, 200, 250, op1);
        rect(-1.8 * g, i * g + 2 * gg, 2.25 * gg, 2.25 * gg, gg / 3);
        noStroke();
        fill(50, op2);
        text(str(k), -1.8 * g, i * g + 2.4 * gg);
        k++;
      }
      if (i == 4.7) i -= 0.5;
    }

    fill(180, 250, 200, op2);
    stroke(100, 200, 250, op1);
    rect(-3.5 * g, 8.15 * g + 2 * gg, 2.25 * gg, 2.25 * gg, gg / 3);
    noStroke();
    fill(50, op2);
    text(str(k), -3.5 * g, 8.15 * g + 2.4 * gg);
    k++;
    fill(180, 250, 200, op2);
    stroke(100, 200, 250, op1);
    rect(-3.5 * g, 8.6 * g + 2 * gg, 2.25 * gg, 2.25 * gg, gg / 3);
    noStroke();
    fill(50, op2);
    text(str(k), -3.5 * g, 8.6 * g + 2.4 * gg);

    textFont(fontD);
    textSize(g * 0.22);
    fill(100, 200, 250, op25);
    text("L-Click to Draw", -2.9 * g, 1.8 * g);
    text("R-Click to Erase", -2.9 * g, 2.1 * g);

    text("Click+Drag the", -1.1 * g, 1.8 * g);
    text("Start or Finish", -1.1 * g, 2.1 * g);
    textSize(g * 0.32);
    const algs = ["Dijkstra's", "A Star", "Greedy BFS", "Blind Monkey"];
    textFont(fontT);
    // print(djPath)
    text(algs[djPath], -2.9 * g, 10 * g + 0.4*gg);
    const numText = (found || (queue.length == 0 && showPath) || (instant == 2 && f-lastReset > 10)) ? (pathLen ? "Found " + str(pathLen) : "Lost :(") : str(rowNum) + " by " + str(colNum);
    text(numText, -1.1 * g, 10 * g + 0.4*gg);
    textSize(g * 0.22);
    textFont(fontD);
    textAlign(LEFT);
    text("Space to Pathfind!", -2.5 * g, 2.95 * g + 0.75 * gg);
    text("Fill", -2.8 * g, 3.95 * g + 0.75 * gg);
    text("Clear", -1.4 * g, 3.95 * g + 0.75 * gg);
    text("Generate Perfect Maze", -2.8 * g, 4.95 * g + 0.75 * gg);
    text("Generate Noise Terrain", -2.8 * g, 5.425 * g + 0.75 * gg);
    text("S/F", -2.8 * g, 6.425 * g + 0.75 * gg);
    text("Invert", -1.4 * g, 6.425 * g + 0.75 * gg);
    text("Toggle Instant Solve", -2.8 * g, 7.425 * g + 0.75 * gg);
    text("Click Egdes to Increase", -2.6 * g, 8.45 * g + 0.75 * gg);
    text("or Decrease Grid Size", -2.6 * g, 8.7 * g + 0.75 * gg);
    


    fill(250, 20, 200, op4);
    text("Increase Draw Radius", -2.8 * g, 2.4 * g + 0.75 * gg);
    text("Change Search Algorithm", -2.8 * g, 3.4 * g + 0.75 * gg);
    text("Fill All or Clear All", -2.8 * g, 4.4 * g + 0.75 * gg);
    text("Orthogonal Layout", -2.8 * g, 5.9 * g + 0.75 * gg);
    text("Relocate S/F Far Away", -2.8 * g, 6.9 * g + 0.75 * gg);
    text("Toggle Randomness", -2.8 * g, 7.9 * g + 0.75 * gg);
    text("Double/Half", -1.7 * g, 9 * g + 0.75 * gg)
    // rect(-3.2 * g, 3*g+1.8*gg, 2.5*gg, 2.5*gg, gg/3);
    rectMode(CORNER);
    
    // fill(255, op3);
    // rect(-4*g, 3.65*g, 4*g, 5.6*g);
    
    translate(0, -booty)
    textSize(g * 0.20);
    noStroke();
    fill(0, op2);
    textAlign(CENTER);
    text("Press Tab or Q to Toggle Menu", -2.2 * g, 11.25 * g);
    
    
    textAlign(CENTER, CENTER);
    
    //rect(marginX - shielding / 2, marginY - shielding / 2, w + shielding, h + shielding, 10);
    rectMode(CENTER);
    
    textFont(fontT);
    textSize(min(shielding*0.4, w/7));
    var noiseX = mouseX - menu.x;
    const sido = min(shielding*0.4, w/6);
    var numboy = 0;
    for (var i = 0; i < 7; i++) {
      noFill();
      stroke(255);
      if (abs(marginX + w/6*i-noiseX) < sido/2 && abs(marginY - 2*shielding / 3 + sido/10-mouseY) < sido/2) {
        fill(cur.colour, 100);
        numboy = i + 1;
      }
      rect(marginX + w/6*i, marginY - 2*shielding / 3 + sido/10, sido, sido, 10);
      fill(255);
      noStroke();
      text(str(i+1), marginX + w/6*i, marginY - 2*shielding / 3);
    }
    if (cur.sel) keyDowned(numboy==1, numboy==2, cur.sel == 2);
    stroke(255);
    noFill();
    if (abs(marginX + w / 4 - noiseX) < w / 6 && abs(marginY + h + 2 * shielding / 3 - mouseY) < sido / 2) fill(cur.colour);
    rect(marginX + w/4, marginY+h+2*shielding/3, w/3, sido, 10);
    noFill();
    if (abs(marginX + 3 * w / 4 - noiseX) < w / 6 && abs(marginY + h + 2 * shielding / 3 - mouseY) < sido / 2) fill(cur.colour);
    rect(marginX + 3*w/4, marginY+h+2*shielding/3, w/3, sido, 10)
    fill(255);
    noStroke();
    text("Search", marginX + w/4, marginY+h+2*shielding/3);
    text("Change", marginX + 3*w/4, marginY+h+2*shielding/3);
    
    
    rectMode(CORNER);
    
    push();
    translate(windowWidth-menu.x + 200, windowHeight + 200)
    if (menu.rotate[0] % (menu.turn*4) != djPath*menu.turn) {
      menu.rotate[0]++;
    }
    rotate(PI*2*menu.rotate[0]/(4*menu.turn));
    fill(140, 250, 200, 180);
    circle(-120, -120, 400);
    fill(255, 160, 200, 180)
    circle(-120, 120, 400);
    fill(250, 250, 90, 180);
    circle(120, 120, 400);
    fill(220, 220, 220, 180);
    circle(120, -120, 400);
    rotate(-PI*2*menu.rotate[0]/(2*menu.turn));
    fill(100, 200, 250, 120);
    circle(-120, -120, 330);
    circle(-120, 120, 330);
    circle(120, 120, 330);
    circle(120, -120, 330);
    pop();
    
    push();
    translate(windowWidth-menu.x + 200, -200)
    if (menu.rotate[1] % (menu.turn*4) != min(1, instant)*menu.turn*2) {
      menu.rotate[1]++;
    }
    rotate(PI*2*menu.rotate[1]/(4*menu.turn));
    fill(255, 120)
    circle(-120, 120, 400);
    fill(50, 120);
    circle(120, -120, 400)

    if (menu.rotate[2] % (menu.turn*4) != randomness*menu.turn*2) {
      menu.rotate[2]++;
    }
    rotate(-PI*2*menu.rotate[1]/(4*menu.turn));
    rotate(-PI*2*menu.rotate[2]/(4*menu.turn));
    fill(255, 120)
    circle(-120, 120, 330);
    fill(50, 120);
    circle(120, -120, 330)
    pop();
  }
}



