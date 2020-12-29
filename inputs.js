function getDist(a) {
  resetPath();
  start = a;
  var cut = 0
  queue.push(start);
  while (queue.length && cut < (w / side * h / side)) {
    // pp(queue);
    pathStep(false);
    cut++;
  }
  const farthest = nodes.reduce(function(prev, current) {
    return (prev.path.weight > current.path.weight) ? prev : current
  })
  // var dist = maxWeight;
  return farthest;
}

var selected = "";
var cur;

function mousePressed() {
  if (mouseButton === LEFT) {
    cur.sel = 1;
    cur.colour = color(255, 50, 50);
  } else if (mouseButton === RIGHT) {
    cur.sel = 2;
    cur.colour = color(50, 50, 255);
  }

  resetPath();
  var noiseX = mouseX - menu.x;
  if (inBoard(noiseX, mouseY)) {
    if (nodes[nth(noiseX, mouseY)].t == "start" || nodes[nth(noiseX, mouseY)].t == "finish") {
      selected = nodes[nth(noiseX, mouseY)].t;
      if (mouseButton === LEFT) {
        nodes[nth(noiseX, mouseY)].air();
        // nodes[nth(noiseX, mouseY)].nb.forEach((a)=>{a.wall()});
      } else if (mouseButton === RIGHT) {
        nodes[nth(noiseX, mouseY)].wall();

      }
    } else if (mouseButton === LEFT) {
      nodes[nth(noiseX, mouseY)].wall();
      if (keyIsDown(16)) {
        nodes[nth(noiseX, mouseY)].nb.forEach((a) => {
          if (a.t == "air") a.wall();
        });
      }
    } else if (mouseButton === RIGHT) {
      nodes[nth(noiseX, mouseY)].air();
      if (keyIsDown(16)) {
        nodes[nth(noiseX, mouseY)].nb.forEach((a) => {
          if (a.t == "wall") a.air();
        });
      }
    }
  } else if (inBoard(noiseX, mouseY, shielding / 3)) {
    var k = 0;
    if (mouseButton === LEFT) {
      k = 1;
    } else if (mouseButton === RIGHT) {
      k = -1;
    }
    var ch5 = keyIsDown(16);
    var ch1 = false;
    if (noiseX < marginX) ch1 = true;
    var ch2 = false;
    if (noiseX > w + marginX) ch2 = true;
    var ch3 = false;
    if (mouseY < marginY) ch3 = true;
    var ch4 = false;
    if (mouseY > h + marginY) ch4 = true;
    if (ch1) {
      if (ch5) {
        mixNodes(0, 0, 0, 0, 2 ** k, 1);
      } else {
        mixNodes(k, 0, 0, 0);
      }
    }
    if (ch2) {
      if (ch5) {
        mixNodes(0, 0, 0, 0, 2 ** k, 1);
      } else {
        mixNodes(0, 0, k, 0);
      }
    }
    if (ch3) {
      if (ch5) {
        mixNodes(0, 0, 0, 0, 1, 2 ** k);
      } else {
        mixNodes(0, k, 0, 0);
      }
    }
    if (ch4) {
      if (ch5) {
        mixNodes(0, 0, 0, 0, 1, 2 ** k);
      } else {
        mixNodes(0, 0, 0, k);
      }
    }
  } else if (noiseX < (menu.on ? 0 : 2 * shielding / 3)) {
    menu.on = !menu.on;
  } else {
    var buttonClicked = false;
    var numboy = 0;
    const sido = min(shielding * 0.4, w / 6);
    for (var i = 0; i < 7; i++) {
      if (abs(marginX + w / 6 * i - noiseX) < sido / 2 && abs(marginY - 2 * shielding / 3 + sido / 10 - mouseY) < sido / 2) numboy = i + 1;
    }
    if (abs(marginX + w / 4 - noiseX) < w / 6 && abs(marginY + h + 2 * shielding / 3 - mouseY) < sido / 2) {
      search();
    } else if (abs(marginX + 3 * w / 4 - noiseX) < w / 6 && abs(marginY + h + 2 * shielding / 3 - mouseY) < sido / 2) {
      search(true);
    } else if (numboy) {
      actions(numboy, mouseButton === RIGHT);
    } else {
      if (mouseButton === LEFT) {
        search(false);
      } else if (mouseButton === RIGHT) {
        search(true);
      }
    }
  }

}


function mouseDragged() {
  var noiseX = mouseX - menu.x;
  if (inBoard(noiseX, mouseY) && nodes[nth(noiseX, mouseY)] && nodes[nth(noiseX, mouseY)].t != "start" && nodes[nth(noiseX, mouseY)].t != "finish") {
    resetPath();
    if (selected == "start") {
      start = nodes[nth(noiseX, mouseY)];
    } else if (selected == "finish") {
      finish = nodes[nth(noiseX, mouseY)];
    } else if (mouseButton === LEFT) {
      nodes[nth(noiseX, mouseY)].wall();
      if (keyIsDown(16)) {
        nodes[nth(noiseX, mouseY)].nb.forEach((a) => {
          if (a.t == "air") a.wall();
        });
      }
    } else if (mouseButton === RIGHT) {
      nodes[nth(noiseX, mouseY)].air();
      if (keyIsDown(16)) {
        nodes[nth(noiseX, mouseY)].nb.forEach((a) => {
          if (a.t == "wall") a.air();
        });
      }
    }
  }
}

function mouseReleased() {
  cur.sel = 0;
  cur.colour = color(191, 255, 0);
  if (selected) {
    start.change("start");
    finish.change("finish");
    selected = "";
  }
}

function recMaze() {
  var jogI = int(random(1 + (colNum + 1) % 2));
  var jogJ = int(random(1 + (rowNum + 1) % 2));
  for (var i = 0; i < colNum; i++) {
    for (var j = 0; j < rowNum; j++) {
      var node = nodes[i * rowNum + j];
      node.maze = {
        k: i,
        visit: false,
        t: ((i + jogI) % 2 == 1 && (j + jogJ) % 2 == 1) ? "wall" : "air",
      }
    }
  }
  recGen(jogI, jogJ, jogI + colNum - (colNum - 1) % 2, jogJ + rowNum - (rowNum - 1) % 2);
  for (var i = 0; i < nodes.length; i++) {
    var nod = nodes[i];
    nod.change(nod.maze.t)
  }
  cleanNodes();
}

function recGen(a, b, c, d) {
  if ((c - a) < 2 || (d - b) < 2) {
    return;
  }
  var possis = [];

  for (var i = a; i < c; i++) {
    for (var j = b; j < d; j++) {
      if ((a + i + b + j) % 2 == 1) {
        possis.push([i, j]);
      }
    }
  }
  var choosen = random(possis);
  var mack = nodes[choosen[0] * rowNum + choosen[1]];
  if ((choosen[0] + a) % 2 == 1) {
    for (var j = b; j < d; j++) {
      nodes[choosen[0] * rowNum + j].maze.t = "wall";
    }
    mack.maze.t = "air";
    recGen(a, b, choosen[0], d)
    recGen(choosen[0] + 1, b, c, d)
  } else {
    for (var i = a; i < c; i++) {
      nodes[i * rowNum + choosen[1]].maze.t = "wall";
    }
    mack.maze.t = "air";
    recGen(a, b, c, choosen[1])
    recGen(a, choosen[1] + 1, c, d)
  }


}

function search(ace = false) {
  if (ace) {
    djPath = (djPath + 1) % 4;
    const patherColours = [color(140, 250, 200), color(255, 140, 180), color(250, 250, 90), color(220, 220, 220)]
    pathColour = patherColours[djPath];
  } else if (instant == 0) {
    queue.push(start);
    showPath = true;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      node.path.here = round((abs(node.x - finish.x) + abs(node.y - finish.y)) / side);
    }

  } else {
    instant = instant == 1 ? 2 : 1;
  }
}

function keyPressed() {
  resetPath();
  if ((keyCode == 32 || keyCode == 13) && !selected) {
    search(keyIsDown(16));
  }
  if (51 <= keyCode && keyCode <= 57) actions(keyCode - 48, keyIsDown(16));
  if (keyCode == 9 || keyCode == 81) {
    menu.on = !menu.on;
  }
}

function actions(n, alt = false) {
  if (n == 3) {

    if (alt) {
      recMaze();
    } else {
      perfectMaze();

    }
    farNodes();
  }
  if (n == 4) {
    noiseSeed(random(0, 100000));
    if (!alt) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (noise(node.x, node.y) < 0.4) {
          node.wall();
        } else {
          node.air();
        }
      }
      cleanNodes(true);
    } else {
      imperfectMaze();
    }
    farNodes();
  }

  if (n == 5) {
    if (alt) {
      farNodes();
    } else {
      cleanNodes();
    }
  }
  if (n == 6) {
    if (alt) {
      if (f % 2) {
        for (var i = 0; i < colNum; i++) {
          for (var j = 0; j < rowNum; j++) {
            nodes[i * rowNum + j].maze.t = nodes[(colNum - 1 - i) * rowNum + j].t;
          }
        }
      } else {
        for (var i = 0; i < colNum; i++) {
          for (var j = 0; j < rowNum; j++) {
            nodes[i * rowNum + j].maze.t = nodes[i * rowNum + (rowNum - 1 - j)].t;
          }
        }
      }
      for (var i = 0; i < nodes.length; i++) {
        var nod = nodes[i];
        if (nod.maze.t == "start") {
          start = nod;
        } else if (nod.maze.t == "finish") {
          finish = nod;
        }
        nod.change(nod.maze.t)
      }
    } else {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (node.t == "air") {
          node.wall();
        } else if (node.t == "wall") {
          node.air();
        }
      }
    }
  }
  if (n == 7) {
    if (alt) {
      randomness = !randomness;
    } else {
      instant = instant == 0 ? 2 : 0;
    }
  }
  if (n == 8) {
    if (alt) {
      mixNodes(0, 0, 0, 0, 0.5, 1);
      mixNodes(0, 0, 0, 0, 1, 0.5);
    } else {
      mixNodes(0, 0, -1, 0);
      mixNodes(0, 0, 0, -1);
    }
  }
  if (n == 9) {
    if (alt) {
      mixNodes(0, 0, 0, 0, 2, 1);
      mixNodes(0, 0, 0, 0, 1, 2);
    } else {
      mixNodes(0, 0, 1, 0);
      mixNodes(0, 0, 0, 1);
    }
  }
}

function keyDowned(conda, condb, alt) {
  var magic = sqrt(rowNum * colNum);
  var speed = alt ? 1 : max(1, int(50 / magic));
  var craz = alt ? magic : 1;
  if (conda) {

    resetPath();
    if (f % speed == 0) {
      for (var i = 0; i < craz; i++) {
        var queen = random(nodes.filter(function(s) {
          return s.t == "air";
        }));
        if (queen) queen.wall();
      }
    }
  } else if (condb) {

    resetPath();
    if (f % speed == 0) {
      for (var i = 0; i < craz; i++) {
        var queen = random(nodes.filter(function(s) {
          return s.t == "wall";
        }));
        if (queen) queen.air();
      }
    }
  }
}






function farNodes() {
  var accuracy = sqrt(w / side * h / side);
  start.change("air");
  finish.change("air");
  var cho = random(nodes.filter(function(s) {
    return s.t == "air";
  }));
  var maxs = [null, null, -1]

  for (var i = 0; i < accuracy; i++) {
    var far1 = getDist(cho);
    var far2 = getDist(far1);
    if (maxWeight > maxs[2]) {
      maxs = [far1, far2, maxWeight]
    }
  }
  start = far1;
  finish = far2;
  start.change("start");
  finish.change("finish");
  resetPath();

}






function cleanNodes(any = false) {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    if (node.t == "start" || node.t == "finish") {
      node.air();
    }
  }
  var monk = shuffle(nodes.filter(function(s) {
    return s.t == "air";
  }));
  if (any) {
    monk = nodes;
  }
  start = monk[0];
  finish = monk[monk.length - 1];
  start.change("start");
  finish.change("finish");
}

function perfectMaze() {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.maze = {
      k: i,
      visit: false,
      t: "wall",
    }
  }
  var reem = false;
  while (true) {
    var walls = shuffle(nodes.filter(function(s) {
      return s.maze.t == "wall";
    }));
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      node.maze.visit = false;
    }
    reem = false;
    for (var i = 0; i < walls.length; i++) {
      var queen = walls[i];
      var nights = queen.nb.map(function(s) {
        return s.maze.k;
      });
      if (nights.length === new Set(nights).size) {
        queen.maze.t = "air";
        queen.maze.visit = true;
        var qq = queen.nb.filter(function(s) {
          if (s.maze.t == "air") {
            s.maze.k = queen.maze.k;
            s.maze.visit = true;
          }
          return s.maze.t == "air";
        });

        while (qq.length > 0) {
          var next = qq.shift();
          var nice = next.nb.filter(function(s) {
            return s.maze.t == "air" && !s.maze.visit;
          });
          for (var j = 0; j < nice.length; j++) {
            var noder = nice[j];
            noder.maze.k = next.maze.k;
            noder.maze.visit = true;
            qq.push(noder);
          }
        }

        reem = true;
        break;
      }
    }
    if (!reem) {
      break
    }

  }
  for (var i = 0; i < nodes.length; i++) {
    var noded = nodes[i];
    noded.change(noded.maze.t)
  }
  cleanNodes();
}

function imperfectMaze() {
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.maze = {
      k: i,
      visit: false,
      t: "air",
    }
  }
  var reem = true;
  while (true) {
    var walls = shuffle(nodes.filter(function(s) {
      return s.maze.t == "air";
    }));

    reem = false;
    for (var i = 0; i < walls.length; i++) {
      var queen = walls[i];
      var nights = queen.nb.map(function(s) {
        return s.maze.k;
      });
      if (nights.length === new Set(nights).size) {
        queen.maze.t = "wall";
        queen.maze.visit = true;
        var qq = queen.nb.filter(function(s) {
          s.maze.k = queen.maze.k;
          return s.maze.t == "wall";
        });

        while (qq.length > 0) {
          var next = qq.shift();
          var nice = next.nb.filter(function(s) {
            return s.maze.t == "wall" && !s.maze.visit;
          });
          for (var j = 0; j < nice.length; j++) {
            var noder = nice[j];
            noder.maze.k = nice.maze.k;
            noder.maze.visit = true;
            qq.push(noder);
          }
        }
        reem = true;
        break;
      }
    }
    if (!reem) {
      break
    }

  }
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.change(node.maze.t)
  }
  cleanNodes();
}

function pp(x) {
  console.log(x);
}