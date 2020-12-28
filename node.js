function Node(i, j, s, lag = 1, t = "air") {
  this.x = i;
  this.y = j;
  this.w = s;
  this.t = t;
  this.spawn = (0 - i / side - j / side) / 2 * lag;
  this.nb = [];
  this.maze = {
    k: 0,
    t: "wall",
  }
  this.path = {
    weight: 0,
    here: 0,
    visit: false,
    prev: null
  }
  if (t == "air") {
    this.colour = 255;
  } else if (t == "wall") {
    this.colour = 50;
  }

  this.wall = function() {
    this.change("wall");
  }
  this.air = function() {
    this.change("air");
  }
  this.clearPath = function() {
    this.path = {
      weight: 0,
      here: 0,
      visit: false,
      prev: null
    }
    if (this.t == "path") {
      this.change("air");
    }
  }
  this.step = function(cont = true, dj = 0) {
    if (found) {
      if (this.path.prev) {
        if (this.path.prev.t == "start") {
          // reset
          // showPath = false;
        } else {
          this.path.prev.change("path");
          queue.push(this.path.prev);
        }
      }
    } else {
      this.path.visit = true;

      if (this.t == "finish") {
        founder = true;
        queue = [];
        maxWeightFound = this.path.weight;
        pathLen = finish.path.weight;
        if (cont) {
          queue.push(this);
        }
        return;
      }

      var rand = [...Array(this.nb.length).keys()];
      if (randomness) {
        rand = shuffle(rand);
      }
      for (var i = 0; i < rand.length; i++) {

        var node = this.nb[rand[i]];
        if (node && !node.path.visit && node.t == "finish" && cont && !dj) {
          node.path.visit = true;
          node.path.prev = this;
          node.path.weight = this.path.weight + 1;
          founder = true;
          queue = [];
          pathLen = finish.path.weight;
          if (cont) {
            queue.push(node);
          }

        } else if (node && !node.path.visit && (node.t == "air" || ((node.t == "finish" && dj)))) {

          if (dj == 1) {
            if (this.path.weight + 1 < node.path.weight || node.path.weight == 0) {
              node.path.prev = this;
              node.path.weight = this.path.weight + 1;
              maxWeight = max(maxWeight, node.path.weight);
              var array = queue.map(function(s) {
                return s.path.weight + s.path.here;
              });
              queue.splice(sortedIndex(array, this.path.weight + node.path.here + 0.5), 0, node)
            }
          } else if (dj == 2) {
            if (this.path.weight + 1 < node.path.weight || node.path.weight == 0) {
              node.path.prev = this;
              node.path.weight = this.path.weight + 1;
              maxWeight = max(maxWeight, node.path.weight);
              var array = queue.map(function(s) {
                return s.path.here;
              });
              queue.splice(sortedIndex(array, node.path.here), 0, node)
            }
          } else if (dj == 3) {
            if (this.path.weight + 1 < node.path.weight || node.path.weight == 0) {
              node.path.prev = this;
              node.path.visit = true;
              node.path.weight = this.path.weight + 1;
              maxWeight = max(maxWeight, node.path.weight);
              queue.splice(0, 0, node)
            }
          } else {
            node.path.prev = this;
            node.path.visit = true;
            node.path.weight = this.path.weight + 1;
            maxWeight = max(maxWeight, node.path.weight);
            queue.push(node);
          }
        }
      }
    }
  }

  this.change = function(t, opt = true) {
    if (this.t == t) {
      return;
    }
    this.t = t;
    if (opt) {
      this.spawn = 0;
    }
    if (t == "wall") {
      this.colour = 50;
    } else if (t == "start") {
      this.colour = color(255, 50, 50);
    } else if (t == "finish") {
      this.colour = color(50, 50, 255);
    } else if (t == "path") {
      this.colour = pathColour;
    } else {
      this.colour = 255;
    }
  }
  this.neighbors = function() {
    var nok = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0]
    ]
    for (var i = 0; i < nok.length; i++) {
      var up = nok[i][0];
      var right = nok[i][1];
      if (inBoard(this.x + up * side, this.y + right * side)) {
        this.nb.push(nodes[nth(this.x + up * side, this.y + right * side)]);
      }
    };
  }
}