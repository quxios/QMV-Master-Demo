//=============================================================================
// QPathfind
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.0')) {
  alert('Error: QPathfind requires QPlus 1.4.0 or newer to work.');
  throw new Error('Error: QPathfind requires QPlus 1.4.0 or newer to work.');
} else if (Imported.QMovement && !QPlus.versionCheck(Imported.QMovement, '1.1.9')) {
  alert('Error: QPathfind requires QMovement 1.1.9 or newer to work.');
  throw new Error('Error: QPathfind requires QMovement 1.1.9 or newer to work.');
}

Imported.QPathfind = '1.4.7';

//=============================================================================
 /*:
 * @plugindesc <QPathfind>
 * A* Pathfinding algorithm
 * @author Quxios  | Version 1.4.7
 *
 * @requires QPlus
 *
 * @video TODO
 *
 * @param Diagonals
 * @desc Set to true or false to enable diagonals in the route
 * @type Boolean
 * @on Enable
 * @off Disable
 * @default false
 *
 * @param Any Angle
 * @desc (Only for QMovement) Set to true or false to enable moving at
 * any angle
 * @type Boolean
 * @on Enable
 * @off Disable
 * @default false
 *
 * @param Intervals
 * @desc Set to the number of calculations per frame
 * Higher value will calculate faster but can lower frames
 * @type Number
 * @min 1
 * @default 100
 *
 * @param Smart Wait
 * @desc How long should the pathfind smart 2 wait(in frames) until it
 * tries again. Default: 60
 * @type Number
 * @min 1
 * @default 60
 *
 * @param Dash on Mouse
 * @desc Should player dash when mouse clicking?
 * MV Default: true
 * @type Boolean
 * @default true
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin will calculate a path for a character to take to reach a target
 * position. You can also use this plugin to make a character chase a target.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * **Pathfind**
 * ----------------------------------------------------------------------------
 * To start a pathfind, you need to use a plugin command:
 * ~~~
 *  qPathfind [CHARAID] [list of options]
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 *
 * Possible options:
 * - xX: where X is the x position in grid terms
 * - yY: where Y is the y position in grid terms
 * - pxX: where X is the x position in pixel terms (QMovement only)
 * - pyY: where Y is the y position in pixel terms (QMovement only)
 * - smartX: where X is 1 or 2.
 *  - When 1, pathfind will recalculate when its path is blocked
 *  - When 2, pathfind will also recalucate at a set interval
 * - wait: the event that called this will wait until the pathfind is complete
 * ----------------------------------------------------------------------------
 * **Pathfind Towards**
 * ----------------------------------------------------------------------------
 * To start a pathfind towards a character, you need to use a plugin command:
 * ~~~
 *  qPathfind [CHARAID] towards [TARGETCHARAID] [list of options]
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 * - TARGETCHARAID: The CharaID of who you want the CHARAID to move towards
 *
 * Possible options:
 * - xX: where X is the x position in grid terms
 * - yY: where Y is the y position in grid terms
 * - pxX: where X is the x position in pixel terms (QMovement only)
 * - pyY: where Y is the y position in pixel terms (QMovement only)
 * - smartX: where X is 1 or 2.
 *  - When 1, pathfind will recalculate when its path is blocked
 *  - When 2, pathfind will also recalucate at a set interval
 * - wait: the event that called this will wait until the pathfind is complete
 * ----------------------------------------------------------------------------
 * **Chase**
 * ----------------------------------------------------------------------------
 * To start a chase, use the plugin command:
 * ~~~
 *  qPathfind [CHARAID] chase [TARGETCHARAID]
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 * - TARGETCHARAID: The CharaID of who you want the CHARAID to chase
 *
 * * Chasing ends when event page changes.
 * * To force end a chase, you'll need to clear it.
 * ----------------------------------------------------------------------------
 * **Clear / End Pathfind**
 * ----------------------------------------------------------------------------
 * If you need to end a pathfind early, for example to end a chase. Then use
 * the plugin command:
 * ~~~
 *  qPathfind [CHARAID] clear
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 * ----------------------------------------------------------------------------
 * **Examples**
 * ----------------------------------------------------------------------------
 * Make the player pathfind to 5, 1. With no smart
 * ~~~
 *  qPathfind 0 x5 y1
 *  qPathfind p x5 y1
 *  qPathfind player x5 y1
 * ~~~
 * *Note: All 3 are the same, just using a different character id method*
 *
 * Make the player pathfind to 2, 4. With smart 1
 * ~~~
 *  qPathfind 0 x2 y4 smart1
 *  qPathfind p x2 y4 smart1
 *  qPathfind player x2 y4 smart1
 * ~~~
 *
 * Make the event 1 pathfind to 2, 4. With a wait
 * ~~~
 *  qPathfind 1 x2 y4 wait
 *  qPathfind e1 x2 y4 wait
 *  qPathfind event1 x2 y4 wait
 * ~~~
 *
 * Make the event 1 chase player
 * ~~~
 *  qPathfind 1 chase 0
 *  qPathfind e1 chase p
 *  qPathfind event1 chase player1
 * ~~~
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QPathfind
 *
 * RPGMakerWebs:
 *
 *  http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *  https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *
 *  https://www.patreon.com/quxios
 *
 * @tags pathfind, chase, character
 */
//=============================================================================

//=============================================================================
// QPathfind

function QPathfind() {
  this.initialize.apply(this, arguments);
}

(function() {
  var _PARAMS = QPlus.getParams('<QPathfind>', true);
  var _DIAGONALS = _PARAMS['Diagonals'];
  var _INTERVALS = _PARAMS['Intervals'];
  var _SMARTWAIT = _PARAMS['Smart Wait'];
  var _DASHONMOUSE = _PARAMS['Dash on Mouse'];
  var _ANYANGLE = _PARAMS['Any Angle'];
  if (_ANYANGLE && Imported.QMovement) _DIAGONALS = false;
  var _DEFAULTOPTIONS = {
    smart: 0, // 0 no smart, 1 recalc on blocked, 2 recalc at intervals
    chase: undefined, // charaID of character it's chasing
    breakable: false, // moving with input breaks pathfind
    earlyEnd: true, // end early if final point isn't passable
    adjustEnd: false, // adjust end point if not passable
    towards: false // a short A*, returns first 2 steps (similar to Game_Character.prototype.findDirectionTo)
  }
  // value to use to offset smart ticker when target is far away
  // when target is far away no need to calc as often, so we slow it down with offset
  var _SMARTOT = 300;
  // debug will show the console timers
  var _DEBUG = false;
  // smart intervals is based off time instead of a const num
  // it will do as many intervals as it can in about half a frame
  var _SMARTINTERVAL = !true;

  //-----------------------------------------------------------------------------
  // QPathfind
  // Life Cycle:
  // Game_Character.initPathfind >
  // QPathfind.initialize > QPathfind.initMembers > Qpathfind.beforeStart
  // QPathfind.update > QPathfind.aStar
  // -if path found:
  //   QPathfind.onComplete > Game_Character.startPathfind
  //   -when character completes route:
  //     Game_Character.onPathfindComplete
  // -if path wasn't found
  //   QPathfind.onFail > Game_Character.clearPathfind

  QPathfind._pathfinders = 0;

  QPathfind.prototype.initialize = function(charaId, endPoint, options) {
    this.initMembers(charaId, endPoint, options);
    this.beforeStart();
    QPathfind._pathfinders++;
  };

  QPathfind.prototype.initMembers = function(charaId, endPoint, options) {
    this._charaId = charaId;
    this.options = Object.assign({}, _DEFAULTOPTIONS, options);
    if (this.options.towards) {
      this.options.earlyEnd = false;
      this.options.adjustEnd = false;
    }
    if (options.chase !== undefined) {
      var chasing = QPlus.getCharacter(options.chase);
      if (!chasing) {
        return this.character().clearPathfind();
      }
      if (Imported.QMovement) {
        endPoint = new Point(chasing.px, chasing.py);
      } else {
        endPoint = new Point(chasing.x, chasing.y);
      }
    }
    var startPoint;
    if (Imported.QMovement) {
      this._mapWidth = $gameMap.width() * QMovement.tileSize;
      startPoint = new Point(this.character().px, this.character().py);
    } else {
      this._mapWidth = $gameMap.width();
      startPoint = new Point(this.character().x, this.character().y);
    }
    this._startNode = this.node(null, startPoint);
    this._startNode.visited = true;
    this._endNode = this.node(null, endPoint);
    this._originalEnd = this.node(null, endPoint);
    this._openNodes = [this._startNode];
    this._grid = {};
    this._grid[this._startNode.value] = this._startNode;
    this._closed = {};
    this._current = null;
    this._completed = false;
    this._tick = 0;
    this._forceReq = false;
    if (this.options.smart > 1) {
      // TODO smart wait should probably be calculated
      // based on how many pathfinders there are
      // The random is to try to have pathfinders run at different frames
      // inorder to stretch the performance on multiple frames instead of on the same frames
      this._smartTime = _SMARTWAIT + Math.randomIntBetween(0, 10);
    }
    this._intervals = _INTERVALS;
  };

  QPathfind.prototype.beforeStart = function() {
    if (_DEBUG) console.time('Pathfind');
    var x = this._endNode.x;
    var y = this._endNode.y;
    var canPass = true;
    if (Imported.QMovement) {
      canPass = this.character().canPixelPass(x, y, 5, null, '_pathfind');
    } else {
      canPass = this.character().canPass(x, y, 5);
    }
    if (!canPass && this.options.adjustEnd) {
      canPass = true;
      if (!this.adjustEndNode()) {
        canPass = false;
      }
    }
    if (!canPass && this.options.earlyEnd) {
      this.onFail();
    }
    return canPass;
  };

  QPathfind.prototype.adjustEndNode = function() {
    var x1 = this._endNode.x;
    var y1 = this._endNode.y;
    var x2 = x1;
    var y2 = y1;
    var steps = 0;
    var horz = 0;
    var vert = 0;
    var maxDist = Imported.QMovement ? QMovement.tileSize : 1;
    var neighbors = [];
    var dirs = _DIAGONALS ? 9 : 5;
    for (var i = 1; i < dirs; i++) {
      if (i < 5) {
        horz = vert = i * 2;
      } else {
        horz = i === 5 || i === 6 ? 4 : 6;
        vert = i === 5 || i === 7 ? 2 : 8;
      }
      x2 = x1;
      y2 = y1;
      steps = 0;
      if (Imported.QMovement) {
        while (!this.character().canPixelPass(x2, y2, 5, null, '_pathfind')) {
          x2 = $gameMap.roundPXWithDirection(x2, horz, this.character().moveTiles());
          y2 = $gameMap.roundPYWithDirection(y2, vert, this.character().moveTiles());
          steps += this.character().moveTiles();
          if (steps >= maxDist) break;
        }
      } else {
        x2 = $gameMap.roundXWithDirection(x1, horz);
        y2 = $gameMap.roundYWithDirection(y1, vert);
        if (!this.character().canPass(x2, y2, 5)) {
          continue;
        }
      }
      if (Imported.QMovement && !this.character().canPixelPass(x2, y2, 5, null, '_pathfind')) continue;
      var distx1 = Imported.QMovement ? Math.abs(this.character().px - x2) : Math.abs(this.character().x - x2);
      var distx2 = Math.abs(x1 - x2);
      var disty1 = Imported.QMovement ? Math.abs(this.character().py - y2) : Math.abs(this.character().y - y2);
      var disty2 = Math.abs(y1 - y2);
      var score = this.heuristic(new Point(distx1, disty1), new Point(distx2, disty2));
      neighbors.push({
        x: x2,
        y: y2,
        score: score
      })
    }
    if (neighbors.length === 0) return false;
    neighbors.sort(function(a, b) {
      return a.score - b.score;
    })
    this._endNode = this.node(null, new Point(neighbors[0].x, neighbors[0].y));
    return true;
  };

  QPathfind.prototype.compress = function() {
    return {
      options: this._options,
      x: this._endNode.x,
      y: this._endNode.y
    }
  };

  QPathfind.prototype.update = function() {
    if (this._completed && this.options.smart > 1) {
      this.updateSmart();
    } else if (!this._completed) {
      var stepsPerFrame = this._intervals;
      if (this.options.towards) {
        stepsPerFrame = Math.min(stepsPerFrame, 100);
      }
      var ti;
      if (_SMARTINTERVAL) {
        ti = Date.now();
        stepsPerFrame = 20000; // random large num
      }
      for (var i = 0; i < stepsPerFrame; i++) {
        if (this.options.chase !== undefined) {
          var chasing = QPlus.getCharacter(this.options.chase);
          var oldThrough = chasing._through;
          chasing.setThrough(true);
        }
        this.aStar();
        if (this.options.chase !== undefined) {
          chasing.setThrough(oldThrough);
        }
        if (this._completed) {
          break;
        } else if (this._openNodes.length === 0) {
          this.onFail();
          break;
        }
        if (_SMARTINTERVAL) {
          var dt = Date.now() - ti;
          if (i !== 0 && dt >= (16.67 / (QPathfind._pathfinders + 1))) {
            break;
          }
        }
      }
      if (this.options.towards) {
        this.onComplete();
      }
    }
  };

  QPathfind.prototype.updateSmart = function() {
    // TODO try to make this even "smarter"
    this._tick++;
    var ot = 0;
    if (!this._forceReq && this.options.chase !== undefined) {
      // TODO return if already touching the character it's chasing
      // TODO if character hasn't moved in X frames force a restart
      var chasing = QPlus.getCharacter(this.options.chase);
      var p1 = new Point(chasing.x, chasing.y);
      var p2 = new Point(this.character().x, this.character().y);
      var dist = this.heuristic(p1, p2);
      var range = 5;
      if (dist > range) {
        ot = _SMARTOT;
      }
      if (!this.options.towards && !this._failed) {
        // If endpoint hasn't changed, no need to recalc
        if (Imported.QMovement) {
          if (this._endNode.x === chasing.px && this._endNode.y === chasing.py) {
            return;
          }
        } else {
          if (this._endNode.x === chasing.x && this._endNode.y === chasing.y) {
            return;
          }
        }
      }
    }
    if (this._tick > this._smartTime + ot) {
      return this.character().restartPathfind();
    }
  };

  QPathfind.prototype.requestRestart = function(ot) {
    if (!this._completed) return;
    if (this.options.chase !== undefined) {
      var chasing = QPlus.getCharacter(this.options.chase);
      if (!chasing) return this.character().clearPathfind();
      var dx = chasing.cx() - this.character().cx();
      var dy = chasing.cy() - this.character().cy();
      var radian = Math.atan2(dy, dx);
      var x2 = this.character().px + (Math.cos(radian) * this.character().moveTiles());
      var y2 = this.character().py + (Math.sin(radian) * this.character().moveTiles());
      var colliderA = this.character().collider('collision');
      var colliderB = chasing.collider('collision');
      colliderA.moveTo(x2, y2);
      var collided = colliderA.intersects(colliderB);
      colliderA.moveTo(this.character().px, this.character().py);
      if (collided) return;
    }
    ot = ot === undefined ? 0 : ot;
    this._tick = this._smartTime - ot;
    this._forceReq = true;
  };

  QPathfind.prototype.node = function(parent, point) {
    return {
      parent: parent,
      visited: false,
      x: point.x,
      y: point.y,
      value: point.x + (point.y * this._mapWidth),
      f: 0,
      g: 0,
      h: 0
    }
  };

  QPathfind.prototype.getNodeAt = function(current, x, y) {
    var node;
    var val = x + (y * this._mapWidth);
    if (this._grid[val]) {
      node = this._grid[val];
    } else {
      node = this.node(current, new Point(x, y));
      this._grid[val] = node;
    }
    return node;
  };

  QPathfind.prototype.character = function() {
    return QPlus.getCharacter(this._charaId);
  };

  QPathfind.prototype.aStar = function() {
    var currI = 0;
    var i, j;
    this._current = this._openNodes[0];
    j = this._openNodes.length;
    for (i = 0; i < j; i++) {
      if (this._openNodes[i].f < this._current.f) {
        this._current = this._openNodes[i];
        currI = i;
      }
    }
    if (this._current.value === this._endNode.value) {
      return this.onComplete();
    }
    this._openNodes.splice(currI, 1);
    this._closed[this._current.value] = true;
    var neighbors = this.findNeighbors(this._current);
    j = neighbors.length;
    for (i = 0; i < j; i++) {
      if (this._closed[neighbors[i].value]) continue;
      var gScore = this._current.g + this.heuristic(this._current, neighbors[i]);
      if (!neighbors[i].visited) {
        neighbors[i].visited = true;
        this._openNodes.push(neighbors[i]);
      } else if (gScore >= neighbors[i].g) {
        continue;
      }
      neighbors[i].g = gScore;
      neighbors[i].f = gScore + this.heuristic(neighbors[i], this._endNode);
      neighbors[i].parent = this._current;
    }
  };

  QPathfind.prototype.findNeighbors = function(current) {
    var chara = this.character();
    var x = current.x;
    var y = current.y;
    var xf = this._endNode.x;
    var yf = this._endNode.y;
    var neighbors = [];
    var stepDist = 1;
    if (Imported.QMovement) {
      stepDist = chara.moveTiles();
      var nearEnd = Math.abs(x - xf) < chara.optTiles() &&
                    Math.abs(y - yf) < chara.optTiles();
      var tiles = nearEnd ? chara.moveTiles() : chara.optTiles();
    }
    var i;
    var j = !Imported.QMovement && _DIAGONALS ? 8 : 4;
    var dirs = [2, 4, 6, 8, 1, 3, 7, 9];
    var diags = {
      1: [4, 2], 3: [6, 2],
      7: [4, 8], 9: [6, 8]
    }
    for (i = 0; i < j; i++) {
      var dir = dirs[i];
      var horz = dirs[i];
      var vert = dirs[i];
      if (i >= 4) {
        horz = diags[dir][0];
        vert = diags[dir][1];
      }
      var passed = false;
      var onEnd = false;
      var x2, y2;
      if (Imported.QMovement) {
        x2 = $gameMap.roundPXWithDirection(x, horz, tiles);
        y2 = $gameMap.roundPYWithDirection(y, vert, tiles);
        passed = chara.canPixelPass(x, y, dir, tiles, '_pathfind');
        if (!passed && tiles / 2 > chara.moveTiles()) {
          x2 = $gameMap.roundPXWithDirection(x, horz, tiles / 2);
          y2 = $gameMap.roundPYWithDirection(y, vert, tiles / 2);
          passed = chara.canPixelPass(x, y, dir, tiles / 2, '_pathfind');
        }
      } else {
        x2 = $gameMap.roundXWithDirection(x, horz);
        y2 = $gameMap.roundYWithDirection(y, vert);
        if (i >= 4) {
          passed = chara.canPassDiagonally(x, y, horz, vert);
        } else {
          passed = chara.canPass(x, y, dir);
        }
      }
      var val = x2 + (y2 * this._mapWidth);
      if (passed || val === this._endNode.value) {
        var node = this.getNodeAt(current, x2, y2);
        if (Imported.QMovement) {
          if (Math.abs(x2 - xf) < stepDist && Math.abs(y2 - yf) < stepDist) {
            // this is as close as we can get
            // so force early end
            node.value = this._endNode.value;
          }
        }
        neighbors.push(node);
      }
    }
    return neighbors;
  };

  QPathfind.prototype.onComplete = function() {
    if (_DEBUG) console.timeEnd('Pathfind');
    QPathfind._pathfinders--;
    this._completed = true;
    this._failed = false;
    this._grid = {};
    if (this.options.towards) {
      var firstSteps = this.createFinalPath().slice(0, 3);
      return this.character().startPathfind(firstSteps);
    }
    this.character().startPathfind(this.createFinalPath());
  };

  QPathfind.prototype.onFail = function() {
    if (_DEBUG) console.timeEnd('Pathfind');
    QPathfind._pathfinders--;
    this._completed = true;
    this._failed = true;
    this._grid = {};
    if (this.options.towards) {
      return this.onComplete();
    }
    if (this.options.chase !== undefined) {
      return;
    }
    this.character().clearPathfind();
  };

  QPathfind.prototype.createFinalPath = function() {
    var node = this._current;
    var path = [node];
    while (node.parent) {
      var next = node.parent;
      if (_ANYANGLE) {
        while (next.parent && this.character().canPassToFrom(node.x, node.y, next.parent.x, next.parent.y, '_pathfind')) {
          next = next.parent;
        }
      } else if (_DIAGONALS) {
        while (next.parent) {
          var dx = node.x - next.parent.x;
          var dy = node.y - next.parent.y;
          var rad = Math.atan2(dy, dx);
          rad += rad < 0 ? Math.PI * 2 : 0;
          var deg = Math.floor(rad * 180 / Math.PI);
          if ([45, 135, 225, 315].contains(deg) && this.character().canPassToFrom(node.x, node.y, next.parent.x, next.parent.y, '_pathfind')) {
            next = next.parent;
          } else {
            break;
          }
        }
      }
      node = next;
      path.unshift(node);
    }
    return path;
  };

  // http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
  QPathfind.prototype.heuristic = function(initial, final) {
    var dx = Math.abs(initial.x - final.x);
    var dy = Math.abs(initial.y - final.y);
    if (!_DIAGONALS) {
      return dx + dy;
    } else {
      var D = 1;
      var D2 = Math.sqrt(2);
      return D * (dx + dy) + (D2 - 2 * D) * Math.min(dx, dy);
    }
  };

  // static
  QPathfind.pathToRoute = function(chara, path) {
    var route = {
      list: [],
      repeat: false,
      skippable: false,
      wait: false
    }
    var current = path[0];
    var codes = {
      2: 1, 4: 2,
      6: 3, 8: 4,
      1: 5, 3: 6,
      7: 7, 9: 8
    }
    for (var i = 1; i < path.length; i++) {
      if (!path[i]) break;
      var sx = current.x - path[i].x;
      var sy = current.y - path[i].y;
      var dist, dir;
      if (sx !== 0 && sy !== 0) { // diag
        var horz = sx > 0 ? 4 : 6;
        var vert = sy > 0 ? 8 : 2;
        if (horz === 4 && vert === 8) dir = 7;
        if (horz === 4 && vert === 2) dir = 1;
        if (horz === 6 && vert === 8) dir = 9;
        if (horz === 6 && vert === 2) dir = 3;
        dist = Math.abs(sx);
      } else if (sx !== 0) { // horz
        dir = sx > 0 ? 4 : 6;
        dist = Math.abs(sx);
      } else if (sy !== 0) { // vert
        dir = sy > 0 ? 8 : 2;
        dist = Math.abs(sy);
      }
      var command = {};
      if (Imported.QMovement) {
        if (_ANYANGLE) {
          var radian = Math.atan2(-sy, -sx);
          if (radian < 0) radian += Math.PI * 2;
          dist = Math.sqrt(sx * sx + sy * sy);
          command.code = Game_Character.ROUTE_SCRIPT;
          command.parameters = ['qmove2(' + radian + ',' + dist + ')'];
        } else {
          command.code = Game_Character.ROUTE_SCRIPT;
          command.parameters = ['qmove(' + dir + ',' + dist + ')'];
        }
      } else {
        command.code = codes[dir];
      }
      route.list.push(command);
      current = path[i];
    }
    route.list.push({
      code: 0
    })
    return route;
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
  Game_Interpreter.prototype.updateWaitMode = function() {
    var waiting = false
    if (this._waitMode === 'pathfind') {
      waiting = this._character._pathfind || this._character._isPathfinding;
      if (!waiting) {
        this._waitMode = '';
      }
    }
    return waiting || Alias_Game_Interpreter_updateWaitMode.call(this);
  };

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qpathfind') {
      this.qPathfindCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPathfindCommand = function(args) {
    // qPathfind CHARAID X Y
    // qPathfind CHARAID chase CHARAID2
    // qPathfind CHARAID clear
    var chara;
    if (args[0].toLowerCase() === 'this') {
      chara = this.character(0);
    } else {
      chara = QPlus.getCharacter(args[0]);
    }
    if (!chara) return;
    var args2 = args.slice(1);
    if (args2[0].toLowerCase() === 'chase') {
      if (args2[1].toLowerCase() === 'this') {
        chara.initChase(this.character(0).charaId());
      } else if (QPlus.getCharacter(args2[1])) {
        chara.initChase(QPlus.getCharacter(args2[1]).charaId());
      }
      return;
    }
    if (args2[0].toLowerCase() === 'clear') {
      chara.clearPathfind();
      return;
    }
    var x;
    var y;
    if (args2[0].toLowerCase() === 'towards') {
      var chara2;
      if (args2[1].toLowerCase() === 'this') {
        chara2 = this.character(0);
      } else {
        chara2 = QPlus.getCharacter(args2[1]);
      }
      if (Imported.QMovement) {
        var pos = chara.centerWith(chara2);
        x = pos.x;
        y = pos.y;
      } else {
        x = chara2.x;
        y = chara2.y;
      }
    } else {
      x = QPlus.getArg(args2, /^x(\d+)/i);
      y = QPlus.getArg(args2, /^y(\d+)/i);
      if (Imported.QMovement) {
        if (x === null) {
          x = QPlus.getArg(args2, /^px(\d+)/i);
        } else {
          x = Number(x) * QMovement.tileSize;
        }
        if (y === null) {
          y = QPlus.getArg(args2, /^py(\d+)/i);
        } else {
          y = Number(y) * QMovement.tileSize;
        }
      }
    }
    if (x === null && y === null) return;
    chara.initPathfind(Number(x), Number(y), {
      smart: Number(QPlus.getArg(args2, /^smart(\d+)/i)),
      adjustEnd: true
    })
    var wait = QPlus.getArg(args2, /^wait$/i);
    if (wait) {
      this._character = chara;
      this.setWaitMode('pathfind');
    }
  };

  //-----------------------------------------------------------------------------
  // Game_System

  var Alias_Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function() {
    Alias_Game_System_onBeforeSave.call(this);
    $gameMap.compressPathfinders();
    QPathfind._needsUncompress = true;
  };

  var Alias_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    Alias_Game_System_onAfterLoad.call(this);
    QPathfind._needsUncompress = true;
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    Alias_Game_Map_update.call(this, sceneActive);
    if (QPathfind._needsUncompress) {
      this.uncompressPathfinders();
      QPathfind._needsUncompress = false;
    }
  };

  Game_Map.prototype.compressPathfinders = function() {
    for (var i = 0; i < this.events().length; i++) {
      var event = this.events()[i];
      if (event._pathfind) {
        event._compressedPathfind = event._pathfind.compress();
        event.clearPathfind();
      }
    }
    if ($gamePlayer._pathfind) {
      $gamePlayer._compressedPathfind = $gamePlayer._pathfind.compress();
      $gamePlayer.clearPathfind();
    }
  };

  Game_Map.prototype.uncompressPathfinders = function() {
    for (var i = 0; i < this.events().length; i++) {
      var event = this.events()[i];
      if (event._compressedPathfind) {
        var old = event._compressedPathfind;
        event.initPathfind(old.x, old.y, old.options);
        delete event._compressedPathfind;
      }
    }
    if ($gamePlayer._compressedPathfind) {
      var old = $gamePlayer._compressedPathfind;
      $gamePlayer.initPathfind(old.x, old.y, old.options);
      delete $gamePlayer._compressedPathfind;
    }
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._pathfind = null;
    this._isPathfinding = false;
    this._isChasing = false;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    Alias_Game_CharacterBase_update.call(this);
    if (this._pathfind) {
      this._pathfind.update();
    }
  };

  var Alias_Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    Alias_Game_CharacterBase_setPosition.call(this, x, y);
    if (this._pathfind) {
      this.clearPathfind();
    }
  };

  if (Imported.QMovement) {
    var Alias_Game_CharacterBase_ignoreCharacters = Game_CharacterBase.prototype.ignoreCharacters;
    Game_CharacterBase.prototype.ignoreCharacters = function(type) {
      var ignores = Alias_Game_CharacterBase_ignoreCharacters.call(this, type);
      if (this._isChasing !== false && type === '_pathfind') {
        ignores.push(Number(this._isChasing));
      }
      return ignores;
    };

    Game_CharacterBase.prototype.optTiles = function() {
      if (!QMovement.offGrid) {
        return this.moveTiles();
      }
      if (!this._optTiles) {
        var w = Math.round(this.collider('collision').width);
        var h = Math.round(this.collider('collision').height);
        while (w % this.moveTiles() !== 0) {
          w--;
          if (w <= this.moveTiles()) break;
        }
        while (h % this.moveTiles() !== 0) {
          h--;
          if (h <= this.moveTiles()) break;
        }
        this._optTiles = Math.max(Math.min(w, h), this.moveTiles());
      }
      return this._optTiles;
    };

    var Alias_Game_CharacterBase_setupColliders = Game_CharacterBase.prototype.setupColliders;
    Game_CharacterBase.prototype.setupColliders = function() {
      Alias_Game_CharacterBase_setupColliders.call(this);
      var collider = this.collider('collision');
      this._colliders['_pathfind'] = JsonEx.parse(JsonEx.stringify(collider));
      this._optTiles = null;
    };
  }

  //-----------------------------------------------------------------------------
  // Game_Character

  // if using QMovement, x and y are pixel values
  Game_Character.prototype.initPathfind = function(x, y, options) {
    if (!this.isSamePathfind(x, y, options)) {
      return;
    }
    if (this._isPathfinding) {
      this.clearPathfind();
    }
    options = options || {};
    this._isChasing = options.chase !== undefined ? options.chase : false;
    this._pathfind = new QPathfind(this.charaId(), new Point(x, y), options);
    this._pathfind.update();
  };

  Game_Character.prototype.initChase = function(charaId) {
    if (this.charaId() === charaId) return;
    if (!QPlus.getCharacter(charaId)) return;
    if (this._isChasing === charaId) return;
    this.initPathfind(0, 0, {
      smart: 2,
      chase: charaId,
      adjustEnd: true,
      //towards: true
    })
  };

  Game_Character.prototype.isSamePathfind = function(x, y, options) {
    if (!this._pathfind) {
      return true;
    }
    if (options.chase !== undefined) {
      return options.chase !== this._isChasing;
    }
    var oldX1 = this._pathfind._originalEnd.x;
    var oldY1 = this._pathfind._originalEnd.y;
    var oldX2 = this._pathfind._endNode.x;
    var oldY2 = this._pathfind._endNode.y;
    if ((x === oldX1 && y === oldY1) || (x === oldX2 && y === oldY2)) {
      return false;
    }
    return true;
  };

  Game_Character.prototype.restartPathfind = function() {
    if (!this._pathfind._completed) return;
    var x = this._pathfind._endNode.x;
    var y = this._pathfind._endNode.y;
    this._isPathfinding = false;
    if (this._moveRoute) {
      this.processRouteEnd();
    }
    var options = this._pathfind.options;
    this._isChasing = options.chase !== undefined ? options.chase : false;
    this._pathfind = new QPathfind(this.charaId(), new Point(x, y), options);
  };

  Game_Character.prototype.startPathfind = function(path) {
    this._isPathfinding = true;
    this.forceMoveRoute(QPathfind.pathToRoute(this, path));
  };

  Game_Character.prototype.onPathfindComplete = function() {
    if (this._isChasing !== false) {
      var chara = QPlus.getCharacter(this._isChasing);
      if (chara) {
        this._isPathfinding = false;
        this.processRouteEnd();
        this._pathfind.requestRestart(5);
        this.turnTowardCharacter(chara);
        return;
      } else {
        this._isChasing = false;
      }
    }
    this._isPathfinding = false;
    this._pathfind = null;
  };

  Game_Character.prototype.clearPathfind = function() {
    this._pathfind = null;
    this._isChasing = false;
    if (this._isPathfinding) {
      this.processRouteEnd();
    }
  };

  var Alias_Game_Character_processRouteEnd = Game_Character.prototype.processRouteEnd;
  Game_Character.prototype.processRouteEnd = function() {
    Alias_Game_Character_processRouteEnd.call(this);
    if (this._isPathfinding) {
      this.onPathfindComplete();
    }
  };

  var Alias_Game_Character_isMoveRouteForcing = Game_Character.prototype.isMoveRouteForcing;
  Game_Character.prototype.isMoveRouteForcing = function() {
    if (this._isPathfinding && this._pathfind.options.breakable) {
      return false;
    }
    return Alias_Game_Character_isMoveRouteForcing.call(this);
  };

  var Alias_Game_Character_advanceMoveRouteIndex = Game_Character.prototype.advanceMoveRouteIndex;
  Game_Character.prototype.advanceMoveRouteIndex = function() {
    if (this._isPathfinding) {
      var moveRoute = this._moveRoute;
      if (moveRoute && (!this.isMovementSucceeded() && this._pathfind.options.smart > 0)) {
        this._isPathfinding = false;
        this.processRouteEnd();
        this._pathfind.requestRestart(5);
        return;
      }
    }
    Alias_Game_Character_advanceMoveRouteIndex.call(this);
  };

  //-----------------------------------------------------------------------------
  // Game_Player

  if (Imported.QMovement) {
    var Alias_Scene_Map_updateDestination = Scene_Map.prototype.updateDestination;
    Scene_Map.prototype.updateDestination = function() {
      Alias_Scene_Map_updateDestination.call(this);
      if (!this.isMapTouchOk()) {
        $gamePlayer.clearMouseMove();
      }
    };

    var Alias_Game_Player_requestMouseMove = Game_Player.prototype.requestMouseMove;
    Game_Player.prototype.requestMouseMove = function() {
      if (this._pathfind && !this._pathfind._completed) {
        this._requestMouseMove = false;
        return;
      }
      Alias_Game_Player_requestMouseMove.call(this);
    };

    var Alias_Game_Player_moveByMouse = Game_Player.prototype.moveByMouse;
    Game_Player.prototype.moveByMouse = function(x, y) {
      var half = QMovement.tileSize / 2;
      this.initPathfind(x - half, y - half, {
        smart: 2,
        earlyEnd: true,
        breakable: true,
        adjustEnd: true
      })
      $gameTemp.setPixelDestination(x, y);
      Alias_Game_Player_moveByMouse.call(this, x, y);
    };

    var Alias_Game_Player_clearMouseMove = Game_Player.prototype.clearMouseMove;
    Game_Player.prototype.clearMouseMove = function() {
      if (this._movingWithMouse && this._isPathfinding) this.clearPathfind();
      Alias_Game_Player_clearMouseMove.call(this);
    };

    Game_Player.prototype.onPathfindComplete = function() {
      Game_Character.prototype.onPathfindComplete.call(this);
      if (this._movingWithMouse) {
        this.clearMouseMove();
      }
    };

    var Alias_Game_Player_triggerTouchAction = Game_Player.prototype.triggerTouchAction;
    Game_Player.prototype.triggerTouchAction = function() {
      var triggered = Alias_Game_Player_triggerTouchAction.call(this);
      if (triggered && this._movingWithMouse) {
        this.clearMouseMove();
      }
      return triggered;
    };
  }

  if (!_DASHONMOUSE) {
    Game_Player.prototype.updateDashing = function() {
      if (Imported.QMovement ? this.startedMoving() : this.isMoving()) {
        return;
      }
      if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
        this._dashing = this.isDashButtonPressed();
      } else {
        this._dashing = false;
      }
    };
  }

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    if (this._isChasing !== false) {
      this.clearPathfind();
    }
    Alias_Game_Event_setupPage.call(this);
  };
})()
