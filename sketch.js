var w;
var h;
var fullW;
var fullH;
var marginX;
var marginY;
var mint;
var shielding;
var side;
var rowNum;
var colNum;
var nodes = [];
var queue = [];
var showPath = false;
var djPath = 0;
var pathColour;
var maxWeight = 0;
var maxWeightFound = 0;
var pathLen = 0;
var found = false;
var founder = false;
var randomness = true;
var instant = 0;
var start;
var finish;
var canvas;

function nth(x, y) {
  return int((x - marginX) / side) * rowNum + int((y - marginY) / side);
}

function mixNodes(a, b, c, d, e = 1, f = 1) {
  if (ceil((colNum + a + c) * e) < 2 || ceil((rowNum + b + d) * f) < 2 || ceil((colNum + a + c) * e) > 100 || ceil((rowNum + b + d) * f) > 100) return;
  if (selected) {
    mouseReleased();
  }
  var oldCol = colNum;
  var oldRow = rowNum;
  colNum += a + c;
  rowNum += b + d;
  colNum = ceil(colNum * e);
  rowNum = ceil(rowNum * f);
  var oldnodes = nodes.concat();
  bacon(colNum+rowNum > 50 ? 0 : 1);
  for (var i = 0; i < oldCol; i++) {
    for (var j = 0; j < oldRow; j++) {
      if (oldnodes[i * oldRow + j].t == "start") {
        start = nodes[min(colNum - 1, max(0, int((i + b) * e))) * rowNum + min(rowNum - 1, max(0, int((j + b) * f)))];
        start.change("start");
      } else if (oldnodes[i * oldRow + j].t == "finish") {
        finish = nodes[min(colNum - 1, max(0, int((i + b) * e))) * rowNum + min(rowNum - 1, max(0, int((j + b) * f)))];
        finish.change("finish");
      } else if (e==1 && f==1) {
        if (0 <= i + a && i + a < colNum && 0 <= j + b && j + b < rowNum) {
          if (nodes[(i + a) * rowNum + (j + b)].t == "air" || nodes[(i + a) * rowNum + (j + b)].t == "wall") nodes[(i + a) * rowNum + (j + b)].change(oldnodes[i * oldRow + j].t);
        }
      } else if (e==2 || f==2) {
        for (var ii = 0; ii < e; ii++) {
          for (var jj = 0; jj < f; jj++) {
            if (nodes[(i + a) * rowNum + (j + b)].t == "air" || nodes[(i + a) * rowNum + (j + b)].t == "wall") nodes[int((i + a)*e+ii) * rowNum + int((j + b)*f+jj)].change(oldnodes[i * oldRow + j].t);
          }
        }
      } else {
        if ((i % 2 == 0 || e==1) && (j % 2 == 0 || j==1)) {
          if (nodes[int((i + a)*e) * rowNum + int((j + b)*f)].t == "air" || nodes[int((i + a)*e) * rowNum + int((j + b)*f)].t == "wall") nodes[int((i + a)*e) * rowNum + int((j + b)*f)].change(oldnodes[i * oldRow + j].t);
        }
      } 
      
    }
  }

  if (start.t == finish.t) cleanNodes(true);
}

function bacon(lag = 1) {
  mint = max(colNum, rowNum) > 24 ? (max(colNum, rowNum) > 64 ? 0 : 1) : 2;
  fullW = windowWidth - shielding * 2 - (menu.on ? menu.width : 0);
  fullH = windowHeight - shielding * 2;
  side = min(fullW / colNum, fullH / rowNum);

  w = colNum * side;
  h = rowNum * side;
  marginX = (fullW - w) / 2 + shielding;
  marginY = (fullH - h) / 2 + shielding;



  // strokeWeight(2);
  // stroke(255);

  nodes = [];
  for (var i = 0; i < colNum; i++) {
    for (var j = 0; j < rowNum; j++) {
      nodes.push(new Node(marginX + i * side + mint, marginY + j * side + mint, side - mint * 2, lag))
    }
  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.neighbors(({
      x: i,
      y: j
    }));
  }
}

var fontT;
var fontD;

function setup() {
  canvas = createCanvas(displayWidth*2, displayHeight*2);
  menu.setup();
  noStroke();
  pathColour = color(140, 250, 200);
  shielding = 90;

  colNum = 12;
  rowNum = 12;

  bacon();

  start = nodes[0];
  finish = nodes[nodes.length - 1];
  start.change("start", false);
  finish.change("finish", false);
}

function windowResized() {
  menu.setup();
  mixNodes(0, 0, 0, 0);
}
var lastReset = 0;

function resetPath() {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.clearPath();
  }
  queue = [];
  lastReset = f;
  maxWeight = 0;
  maxWeightFound = 0;
  pathLen = 0;
  found = false;
  founder = false;
  showPath = false;
  // djPath = 0;
  // pathColour = color(180, 250, 200);
}

function inBoard(xx, yy, outie = 0) {
  return (marginX - outie <= xx && xx <= w + marginX + outie && marginY - outie <= yy && yy <= h + marginY + outie);
}

function pathStep(u = true, dj = 0) {
  var newt = queue.concat();
  if (found) {
    maxWeight++;
    maxWeightFound--;
    queue = [];
    if (newt.length) {
      newt[0].step(u);
    }
  } else {
    // if (!dj) maxWeight++;
    maxWeightFound++;
    // if(newt.length) {
    //   queue.pop(0).step();
    // }
    if (queue.length == 0) {
      maxWeight++;
    } else if (dj) {
      var nexer = queue.shift();
      if (nexer) nexer.step(u, dj);
    } else {
      queue = [];
      for (var i = 0; i < newt.length; i++) {
        var node = newt[i];
        node.step(u, dj);
      }
    }
    found = founder;
  }
}

function sortedIndex(array, value) {
  var low = 0,
    high = array.length;

  while (low < high) {
    var mid = (low + high) >>> 1;
    if (array[mid] < value) low = mid + 1;
    else high = mid;
  }
  return low;
}

var f = 0;

function draw() {
  f++;
  clear();

  if (instant == 2 && !selected && maxWeightFound > -9 && f-lastReset > 10) {

    queue.push(start);
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      node.path.here = round((abs(node.x - finish.x) + abs(node.y - finish.y)) / side);
    }
    while (maxWeightFound > -9) {
      pathStep(true, djPath);
      if (!found && queue.length == 0) {
        maxWeightFound-=2;
      }
    }
  } else if (showPath) { //  && f % max(mint, 1) == 0
    if (maxWeightFound > -9) {
      pathStep(true, djPath);
    }
  }
  // background(100);
  background(100, 200, 250);
  push();
  translate(menu.x, 0);
  fill(255);
  var curves = side / 10 + mint;
  rect(-menu.width, 0, menu.width / 2, windowHeight);
  rect(-menu.width, 0, menu.width, windowHeight, shielding);
  // fill(50, 100, 250);
  // rect(0, 0, menu.width, windowHeight, 100);
  noStroke();
  menu.update();

  noFill();
  stroke(255);
  var noiseX = mouseX - menu.x;
  if (!inBoard(noiseX, mouseY) && inBoard(noiseX, mouseY, shielding / 3)) {
    stroke(cur.colour);
  }
  strokeWeight(2);
  // var kate = 2**(0-(f/10-4)**2);
  rect(marginX - shielding / 3, marginY - shielding / 3, w + 2*shielding/3, h + 2*shielding/3, 10);
  noStroke();
  // fill(100, 200, 250);
  // rect(marginX, marginY, w, h, curves);
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    fill(node.colour)
    node.spawn = min(8, node.spawn + 1);
    var p = max(0, node.spawn / 8);
    rect(node.x + node.w * (1 - p) / 2, node.y + node.w * (1 - p) / 2, node.w * p, node.w * p, curves);
    // rect(node.x, node.y, node.w, node.w, curves);
    if (node.t == "air" && node.path.weight > 0 && node.path.visit) {
      fill(pathColour, (maxWeight - node.path.weight + 1) * 25);
      var p = min(6, maxWeight - node.path.weight) / 6;
      rect(node.x + node.w * (1 - p) / 2, node.y + node.w * (1 - p) / 2, node.w * p, node.w * p, curves);
      // rect(node.x, node.y, node.w, node.w, curves);
    } else if (node.t == "path" && node.path.weight > 0) {
      fill(250, 20, 200, (node.path.weight - maxWeightFound) * 50)
      var p = min(6, node.path.weight - maxWeightFound) / 6;
      rect(node.x + node.w * (1 - p) / 2, node.y + node.w * (1 - p) / 2, node.w * p, node.w * p, curves);
    }
    fill(0);
    const debug = false;
    if (debug) {
      textSize(side * 0.8);
      textFont("Arial");
      text(str(node.path.here + node.path.weight), node.x + node.w / 2, node.y + node.w / 2);
    }
  }

  if (selected) {
    var node = start;
    fill(255, 50, 50)
    rect(node.x + node.w / 4, node.y + node.w / 4, node.w / 2, node.w / 2, curves);
    var node = finish;
    fill(50, 50, 255)
    rect(node.x + node.w / 4, node.y + node.w / 4, node.w / 2, node.w / 2, curves);
  } else if ((showPath || (instant == 2 && f-lastReset > 10)) && found) {
    var node = start;
    fill(255)
    rect(node.x + node.w / 4, node.y + node.w / 4, node.w / 2, node.w / 2, curves);
    var node = finish;
    rect(node.x + node.w / 4, node.y + node.w / 4, node.w / 2, node.w / 2, curves);
  } else if ((showPath ||  (instant == 2 && f-lastReset > 10)) && !found && queue.length == 0) {
    var node = start;
    fill(50)
    rect(node.x + node.w / 4, node.y + node.w / 4, node.w / 2, node.w / 2, curves);
    var node = finish;
    rect(node.x + node.w / 4, node.y + node.w / 4, node.w / 2, node.w / 2, curves);
  }
  pop();
  keyDowned(keyIsDown(49), keyIsDown(50), keyIsDown(16));
}





