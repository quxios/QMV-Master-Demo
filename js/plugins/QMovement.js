//=============================================================================
// QMovement
//=============================================================================

var Imported = Imported || {};
Imported.QMovement = '1.1.1';

if (!Imported.QPlus) {
  var msg = 'Error: QMovement requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
} else if (!QPlus.versionCheck(Imported.QPlus, '1.1.3')) {
  var msg = 'Error: QName requires QPlus 1.1.3 or newer to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QMovement>
 * More control over character movement
 * @author Quxios  | Version 1.1.1
 *
 * @repo https://github.com/quxios/QMovement
 *
 * @requires QPlus
 *
 * @video
 *
 * @param Grid
 * @desc The amount of pixels you want to move per Movement.
 * Plugin Default: 1   MV Default: 48
 * @default 1
 *
 * @param Tile Size
 * @desc Size of tiles in pixels
 * Default: 48
 * @default 48
 *
 * @param Off Grid
 * @desc Allow characters to move off grid?
 * Set to true to enable, false to disable
 * @default true
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Smart Move
 * @desc If the move didn't succeed, try again at lower speeds.
 * 0: Disabled  1: Speed  2: Dir  3: Speed & Dir
 * @default 2
 *
 * @param Mid Pass
 * @desc An extra collision check for the midpoint of the Movement.
 * Set to true to enable, false to disable
 * @default false
 *
 * @param Move on click
 * @desc Set if player moves with mouse click
 * * Requires QPathfind to work
 * @default true
 *
 * @param Diagonal
 * @desc Allow for diagonal movement?
 * Set to true or false
 * @default true
 *
 * @param Diagonal Speed
 * @desc Adjust the speed when moving diagonal.
 * Default: 0 TODO not functional
 * @default 0
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Player Collider
 * @desc Default player collider.
 * type width, height, ox, oy
 * @default box, 36, 24, 6, 24
 *
 * @param Event Collider
 * @desc Default event collider.
 * type width, height, ox, oy
 * @default box, 36, 24, 6, 24
 *
 * @param =================
 * @desc spacer
 * @default
 *
 * @param Show Colliders
 * @desc Show the Box Colliders by default during testing.
 * Set to true or false      -Toggle on/off with F10 during play test
 * @default true
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin completely rewrites the collision system to use colliders. Using
 * colliders enabled more accurate collision checking with dealing with pixel
 * movement. This plugin also lets you change how many pixels the characters
 * move per step, letting you set up a 24x24 movement or a 1x1 (pixel movement)
 *
 * Note there are a few mv features disabled/broken; mouse movement, followers,
 * and vehicles.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * To setup a pixel based movement, you'll need to change the plugin parameters
 * to something like:
 *
 * - Grid = 1
 * - Off Grid = true
 * - Mid Pass = false
 *
 * Other parameters can be set to your preference.
 *
 * For a grid based movement, set it something like:
 *
 * - Grid = GRIDSIZE YOU WANT
 * - Off Grid = false
 * - Mid Pass = true
 *
 * When in grid based movement, you want your colliders to fill up most of the
 * grid size but with a padding of 4 pixels on all sides (this is because some
 * tile colliders are 4 tiles wide or tall). So if your grid size was 48, your
 * colliders shouldn't be 48x48, instead they should be 40x40, with an ox and oy
 * of 4. So your collider setting would look like: box, 40, 40, 4, 4
 * ============================================================================
 * ## Colliders
 * ============================================================================
 * There are 3 types of colliders; Polygon, Box and Circle. Though you can only
 * create box and circle colliders, unless you modify the code to accept
 * polygons. This is intentional since polygon would be "harder" to setup.
 *
 * ![Colliders Image](https://quxios.github.io/imgs/qmovement/colliders.png)
 *
 * - Boxes takes in width, height, offset x and offset y
 * - Circles similar to boxes, takes in width, height, offset x and offset y
 * ----------------------------------------------------------------------------
 * **Setting up colliders**
 * ----------------------------------------------------------------------------
 * Colliders are setup inside the Players notebox or as a comment inside an
 * Events page. Events colliders depends it's page, so you may need to make the
 * collider on all pages.
 *
 * There are two ways to setup colliders. using `<collider:-,-,-,->` and using
 * `<colliders>-</colliders>`. The first method sets the 'Default' collider for
 * that character. The second one you create the colliders for every collider
 * type.
 * ----------------------------------------------------------------------------
 * **Collider Types**
 * ----------------------------------------------------------------------------
 * There are 3 collider types. Default, Collision and Interaction.
 * - Default: This is the collider to use if collider type that was called was
 * not found
 * - Collision: This collider is used for collision checking
 * - Interaction: This collider is used for checking interaction.
 * ============================================================================
 * ## Collider Terms
 * ============================================================================
 * ![Colliders Terms Image](https://quxios.github.io/imgs/qmovement/colliderInfo.png)
 * ----------------------------------------------------------------------------
 * **Collider Notetag**
 * ----------------------------------------------------------------------------
 * ~~~
 * <collider: shape, width, height, ox, oy>
 * ~~~
 * This notetag sets all collider types to these values.
 * - Shape: Set to box or circle
 * - Width: The width of the collider
 * - Height: The height of the collider
 * - OX: The x offset value of the collider
 * - OY: The y offset value of the collider
 * ----------------------------------------------------------------------------
 * **Colliders Notetag**
 * ----------------------------------------------------------------------------
 * ~~~
 * <colliders>
 * type: shape, width, height, ox, oy
 * </colliders>
 * ~~~
 * This notetag sets all collider types to these values.
 * - Type: The type of collider, set to default, collision or interaction
 * - Shape: Set to box or circle
 * - Width: The width of the collider
 * - Height: The height of the collider
 * - OX: The x offset value of the collider
 * - OY: The y offset value of the collider
 *
 * To add another type, just add `type: shape, width, height, ox, oy` on
 * another line.
 *
 * Example:
 * ~~~
 * <colliders>
 * default: box, 48, 48
 * collision: circle, 24, 24, 12, 12
 * interaction: box: 32, 32, 8, 8
 * </colliders>
 * ~~~
 * ============================================================================
 * ## Move Routes
 * ============================================================================
 * By default, event move commands (moveup, movedown, ect) will convert to a
 * qmove that moves the character based off your tilesize. So if your tilesize
 * is 48 and your gridsize is 1. Then a moveup command will move the character
 * up 48 pixels not 1. But if you want to move the character by a fixed amount
 * of pixels, then you will use the QMove commands.
 * ----------------------------------------------------------------------------
 * **QMove**
 * ----------------------------------------------------------------------------
 * ![QMove Script Call](https://quxios.github.io/imgs/qmovement/qmove.png)
 *
 * To do a QMove, add a script in the move route in the format:
 * ~~~
 *  qmove(DIR, AMOUNT, MULTIPLER)
 * ~~~
 * - DIR: Set to a number representing the direction to move,
 *  2: left, 4: right, 8: up 2: down,
 *  1: lower left, 3: lower right, 7: upper left, 9: upper right,
 *  5: current direction, 0: reverse direction
 * - AMOUNT: The amount to move in that direction, in pixels
 * - MULTIPLIER: multiplies against amount to make larger values easier [OPTIONAL]
 *
 * Example:
 * ~~~
 *  qmove(4, 24)
 * ~~~
 * Will move that character 24 pixels to the left.
 * ----------------------------------------------------------------------------
 * **Arc**
 * ----------------------------------------------------------------------------
 * Arcing is used to make a character orbit around a position. Note that collisions
 * are ignored when arcing, but interactions still work. To add a arc add a script
 * in the move route in the format:
 * ~~~
 *  arc(PIVOTX, PIVOTY, RADIAN, CCWISE?, FRAMES)
 * ~~~
 * - PIVOTX: The x position to orbit around, in pixels
 * - PIVOTY: The y position to orbit around, in pixels
 * - RADIAN: The degrees to move, in radians
 * - CCWISE?: set to true or false; if true it will arc countclock wise
 * - FRAMES: The amount of frames to complete the arc
 *
 * Example:
 * ~~~
 *  arc(480,480,Math.PI*2,false,60)
 * ~~~
 * Will make the character do a full 360 arc clockwise around the point 480, 480
 * and it'll take 60 frames.
 * ============================================================================
 * ## Addons
 * ============================================================================
 * **Pathfind**
 * ----------------------------------------------------------------------------
 * https://quxios.github.io/#/plugins/QPathfind
 *
 * QPathfind is an A* pathfinding algorithm. This algorithm can be pretty heavy
 * if you are doing pixel based movements. So to help preform better it will
 * still try to calculate the path based on a grid, but this can lead to
 * some paths not being found even though it should since the character started
 * in a middle of a tile. To fix this issue, you'll need to enable Half Opt.
 * It will increase the pathfinding accuracy but will also increase performance
 * since it makes the "grid" smaller, which means paths are now larger.
 *
 * For the interval settings, you want to set this to a value where the path
 * can be found in 1-3 frames. You can think of intervals as the number of
 * moves to try per frame. The default setting 100, is good for grid based
 * since that will take you 100 grid spaces away. But for a pixel based, 100
 * steps isn't as far. If most of your pathfinds will be short (paths less then
 * 10 tiles away), then you should set this to a value between 100-300. For medium
 * paths (10-20 tiles away) try a value between 300-700. For large or complicated
 * paths (20+ tiles away or lots of obsticles) try something between 1000-2000.
 * I would avoid going over 2000. My opinion is to keep it below 1000, and simplify
 * any of your larger paths by either splitting it into multiple pathfinds or
 * just making the path less complex.
 *
 * ----------------------------------------------------------------------------
 * **Collision Map**
 * ----------------------------------------------------------------------------
 * TODO add link
 *
 * Collision Map is an addon for this plugin that lets you use images for
 * collisions. Note that collision map checks are a lot heavier then normal
 * collision checks. So this plugin can make your game laggier if used with
 * other heavy plugins.
 *
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *  http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *  https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *  https://www.patreon.com/quxios
 *
 * @tags movement, pixel, character
 */
//=============================================================================
//=============================================================================
// QMovement Static Class

function QMovement() {
  throw new Error('This is a static class');
}

(function() {
  var _params = QPlus.getParams('<QMovement>');

  QMovement.grid = Number(_params['Grid']) || 1;
  QMovement.tileSize = Number(_params['Tile Size'])
  QMovement.offGrid = _params['Off Grid'] === 'true';
  QMovement.smartMove = Number(_params['Smart Move']);
  QMovement.midPass = _params['Mid Pass'] === 'true';
  QMovement.moveOnClick = _params['Move on click'] === 'true';
  QMovement.diagonal = _params['Diagonal'] === 'true';
  QMovement.collision = '#FF0000'; // will be changable in a separate addon
  QMovement.water1 = '#00FF00'; // will be changable in a separate addon
  QMovement.water2 = '#0000FF'; // will be changable in a separate addon
  QMovement.water1Tag = 1; // will be changable in a separate addon
  QMovement.water2Tag = 2; // will be changable in a separate addon
  QMovement.playerCollider = _params['Player Collider'];
  QMovement.eventCollider = _params['Event Collider'];
  QMovement.showColliders = _params['Show Colliders'] === 'true';
  QMovement.tileBoxes = {
    1537: [48, 6, 0, 42],
    1538: [6, 48],
    1539: [[48, 6, 0, 42], [6, 48]],
    1540: [6, 48, 42],
    1541: [[48, 6, 0, 42], [6, 48, 42]],
    1542: [[6, 48], [6, 48, 42]],
    1543: [[48, 6, 0, 42], [6, 48], [6, 48, 42]],
    1544: [48, 6],
    1545: [[48, 6], [48, 6, 0, 42]],
    1546: [[48, 6], [6, 48]],
    1547: [[48, 6], [48, 6, 0, 42], [6, 48]],
    1548: [[48, 6], [6, 48, 42]],
    1549: [[48, 6], [48, 6, 0, 42], [6, 48, 42]],
    1550: [[48, 6], [6, 48], [6, 48, 42]],
    1551: [48, 48], // Impassable A5, B
    2063: [48, 48], // Impassable A1
    2575: [48, 48],
    3586: [6, 48],
    3588: [6, 48, 42],
    3590: [[6, 48], [6, 48, 42]],
    3592: [48, 6],
    3594: [[48, 6], [6, 48]],
    3596: [[48, 6], [6, 48, 42]],
    3598: [[48, 6], [6, 48], [6, 48, 42]],
    3599: [48, 48],  // Impassable A2, A3, A4
    3727: [48, 48]
  };
  QMovement.regionColliders = {}; // will be changable in a separate addon
})();

//=============================================================================
// Colliders

//-----------------------------------------------------------------------------
// Polygon_Collider

function Polygon_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Polygon_Collider._counter = 0;

  Polygon_Collider.prototype.initialize = function(points) {
    this._position = new Point(0, 0);
    this._scale = new Point(1, 1);
    this._offset = new Point(0, 0);
    this._pivot = new Point(0, 0);
    this._radian = 0;
    this.id = Polygon_Collider._counter++;
    this.makeVertices(points);
  };

  Object.defineProperty(Polygon_Collider.prototype, 'x', {
    get() {
      return this._position.x;
    },
    set(x) {
      this._position.x = x;
    }
  });

  Object.defineProperty(Polygon_Collider.prototype, 'y', {
    get() {
      return this._position.y;
    },
    set(y) {
      this._position.y = y;
    }
  });

  Object.defineProperty(Polygon_Collider.prototype, 'ox', {
    get() {
      return this._offset.x + this._pivot.x;1
    }
  });

  Object.defineProperty(Polygon_Collider.prototype, 'oy', {
    get() {
      return this._offset.y + this._pivot.y;
    }
  });

  Polygon_Collider.prototype.isPolygon = function() {
    return true;
  };

  Polygon_Collider.prototype.isBox = function() {
    return true;
  };

  Polygon_Collider.prototype.isCircle = function() {
    return false;
  };

  Polygon_Collider.prototype.makeVertices = function(points) {
    this._vertices = [];
    this._baseVertices = [];
    for (var i = 0; i < points.length; i++) {
      var x = points[i].x;
      var y = points[i].y;
      this._vertices.push(new Point(x, y));
      this._baseVertices.push(new Point(x, y));
    }
    this.makeVectors();
    this.refreshVertices();
  };

  Polygon_Collider.prototype.makeVectors = function() {
    this._vectors = this._baseVertices.map((function (vertex) {
      var dx = vertex.x - this._pivot.x;
      var dy = vertex.y - this._pivot.y;
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? Math.PI * 2 : 0;
      var dist = Math.sqrt(dx * dx + dy * dy);
      return { radian, dist };
    }).bind(this));
  };

  Polygon_Collider.prototype.setBounds = function() {
    this._xMin = null;
    this._xMax = null;
    this._yMin = null;
    this._yMax = null;
    for (var i = 0; i < this._baseVertices.length; i++) {
      var x = this._baseVertices[i].x;
      var y = this._baseVertices[i].y;
      if (this._xMin === null || this._xMin > x) {
        this._xMin = x;
      }
      if (this._xMax === null || this._xMax < x) {
        this._xMax = x;
      }
      if (this._yMin === null || this._yMin > y) {
        this._yMin = y;
      }
      if (this._yMax === null || this._yMax < y) {
        this._yMax = y;
      }
    }
    this.width = Math.abs(this._xMax - this._xMin);
    this.height = Math.abs(this._yMax - this._yMin);
    var x1 = this._xMin + this.x + this.ox;
    var y1 = this._yMin + this.y + this.oy;
    this.center = new Point(x1 + this.width / 2, y1 + this.height / 2);
  };

  Polygon_Collider.prototype.refreshVertices = function() {
    var i, j;
    for (i = 0, j = this._vertices.length; i < j; i++) {
      var vertex = this._vertices[i];
      vertex.x = this.x + this._baseVertices[i].x + this.ox;
      vertex.y = this.y + this._baseVertices[i].y + this.oy;
    }
    this.setBounds();
  };

  Polygon_Collider.prototype.sectorEdge = function() {
    var x1 = this._xMin + this.x + this.ox;
    var x2 = this._xMax + this.x + this.ox - 1;
    var y1 = this._yMin + this.y + this.oy;
    var y2 = this._yMax + this.y + this.oy - 1;
    x1 = Math.floor(x1 / ColliderManager._sectorSize);
    x2 = Math.floor(x2 / ColliderManager._sectorSize);
    y1 = Math.floor(y1 / ColliderManager._sectorSize);
    y2 = Math.floor(y2 / ColliderManager._sectorSize);
    return {
      x1: x1, x2: x2,
      y1: y1, y2: y2
    }
  };

  Polygon_Collider.prototype.gridEdge = function() {
    var x1 = this._xMin + this.x + this.ox;
    var x2 = this._xMax + this.x + this.ox - 1;
    var y1 = this._yMin + this.y + this.oy;
    var y2 = this._yMax + this.y + this.oy - 1;
    x1 = Math.floor(x1 / QMovement.tileSize);
    x2 = Math.floor(x2 / QMovement.tileSize);
    y1 = Math.floor(y1 / QMovement.tileSize);
    y2 = Math.floor(y2 / QMovement.tileSize);
    return {
      x1: x1, x2: x2,
      y1: y1, y2: y2
    }
  };

  Polygon_Collider.prototype.edge = function() {
    var x1 = this._xMin + this.x + this.ox;
    var x2 = this._xMax + this.x + this.ox;
    var y1 = this._yMin + this.y + this.oy;
    var y2 = this._yMax + this.y + this.oy;
    return {
      x1: x1, x2: x2,
      y1: y1, y2: y2
    }
  };

  Polygon_Collider.prototype.setPivot = function(x, y) {
    this._pivot.x = x;
    this._pivot.y = y;
    this.makeVectors();
    this.refreshVertices();
  };

  Polygon_Collider.prototype.centerPivot = function() {
    this._pivot.x = this.width / 2;
    this._pivot.y = this.height / 2;
    this.makeVectors();
    this.rotate(0); // Resets base vertices
    this.refreshVertices();
  };

  Polygon_Collider.prototype.setRadian = function(radian) {
    radian = radian !== undefined ? radian : 0;
    this.rotate(radian - this._radian);
  };

  Polygon_Collider.prototype.rotate = function(radian) {
    this._radian += radian;
    for (var i = 0; i < this._vectors.length; i++) {
      var vector = this._vectors[i];
      vector.radian += radian;
      var x = vector.dist * Math.cos(vector.radian);
      var y = vector.dist * Math.sin(vector.radian);
      this._baseVertices[i].x = Math.round(x);
      this._baseVertices[i].y = Math.round(y);
    }
    this.refreshVertices();
  };

  Polygon_Collider.prototype.setScale = function(zX, zY) {
    zX = zX !== undefined ? zX : 1;
    zY = zY !== undefined ? zY : 1;
    this.scale(zX / this._scale.x, zY / this._scale.y);
  };

  Polygon_Collider.prototype.scale = function(zX, zY) {
    this._scale.x *= zX;
    this._scale.y *= zY;
    for (var i = 0; i < this._vectors.length; i++) {
      var vector = this._vectors[i];
      var x = vector.dist * Math.cos(vector.radian);
      var y = vector.dist * Math.sin(vector.radian);
      x *= zX;
      y *= zY;
      vector.radian = Math.atan2(y, x);
      vector.radian += vector.radian < 0 ? Math.PI * 2 : 0;
      vector.dist = Math.sqrt(x * x + y * y);
      this._baseVertices[i].x = Math.round(x);
      this._baseVertices[i].y = Math.round(y);
    }
    this.refreshVertices();
  };

  Polygon_Collider.prototype.moveTo = function(x, y) {
    if (x !== this.x || y !== this.y) {
      this.x = x;
      this.y = y;
      this.refreshVertices();
    }
  };

  Polygon_Collider.prototype.intersects = function(other) {
    if (this.height === 0 || this.width === 0) return false;
    if (other.height === 0 || other.width === 0) return false;
    if (this.containsPoint(other.center.x, other.center.y)) return true;
    if (other.containsPoint(this.center.x, this.center.y)) return true;
    var i, j, x, y;
    for (i = 0, j = other._vertices.length; i < j; i++) {
      x = other._vertices[i].x;
      y = other._vertices[i].y;
      if (this.containsPoint(x, y)) return true;
    }
    for (i = 0, j = this._vertices.length; i < j; i++) {
      x = this._vertices[i].x;
      y = this._vertices[i].y;
      if (other.containsPoint(x, y)) return true;
    }
    return false;
  };

  Polygon_Collider.prototype.inside = function(other) {
    if (this.height === 0 || this.width === 0) return false;
    if (other.height === 0 || other.width === 0) return false;
    var i, j, x, y;
    for (i = 0, j = other._vertices.length; i < j; i++) {
      x = other._vertices[i].x;
      y = other._vertices[i].y;
      if (!this.containsPoint(x, y)) {
        return false;
      }
    }
    return true;
  };

  Polygon_Collider.prototype.containsPoint = function(x, y) {
    var i;
    var j = this._vertices.length - 1;
    var odd = false;
    var poly = this._vertices;
    for (i = 0; i < this._vertices.length; i++) {
      if (poly[i].y < y && poly[j].y >= y || poly[j].y < y && poly[i].y >= y) {
        if (poly[i].x + (y - poly[i].y) / (poly[j].y - poly[i].y) * (poly[j].x - poly[i].x) < x) {
          odd = !odd;
        }
      }
      j = i;
    }
    return odd;
  };
})();

//-----------------------------------------------------------------------------
// Box_Collider

function Box_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Box_Collider.prototype = Object.create(Polygon_Collider.prototype);
  Box_Collider.prototype.constructor = Box_Collider;

  Box_Collider.prototype.initialize = function(width, height, ox, oy) {
    ox = ox !== undefined ? ox : 0;
    oy = oy !== undefined ? oy : 0;
    var points = [
      new Point(0, 0),
      new Point(width, 0),
      new Point(width, height),
      new Point(0, height)
    ];
    this._position = new Point(0, 0);
    this._scale = new Point(1, 1);
    this._offset = new Point(ox, oy);
    this._pivot = new Point(width / 2, height / 2);
    this._radian = 0;
    this.id = Polygon_Collider._counter++;
    this.makeVertices(points);
    this.rotate(0); // readjusts the pivot
  };

  Box_Collider.prototype.isPolygon = function() {
    return false;
  };

  Box_Collider.prototype.isBox = function() {
    return true;
  };

  Box_Collider.prototype.containsPoint = function(x, y) {
    if (this._radian === 0) {
      var xMin = this._xMin + this.x + this.ox;
      var xMax = this._xMax + this.x + this.ox;
      var yMin = this._yMin + this.y + this.oy;
      var yMax = this._yMax + this.y + this.oy;
      var insideX = x >= xMin && x <= xMax;
      var insideY = y >= yMin && y <= yMax;
      return insideX && insideY;
    } else {
      return Polygon_Collider.prototype.containsPoint.call(this, x, y);
    }
  };
})();

//-----------------------------------------------------------------------------
// Circle_Collider

function Circle_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Circle_Collider.prototype = Object.create(Polygon_Collider.prototype);
  Circle_Collider.prototype.constructor = Circle_Collider;

  Circle_Collider.prototype.initialize = function(width, height, ox, oy) {
    ox = ox !== undefined ? ox : 0;
    oy = oy !== undefined ? oy : 0;
    this._radius = new Point(width / 2, height / 2);
    var points = [];
    for (var i = 7; i >= 0; i--) {
      var rad = Math.PI / 4 * i + Math.PI;
      var x = this._radius.x + this._radius.x * Math.cos(rad);
      var y = this._radius.y + this._radius.y * -Math.sin(rad);
      points.push(new Point(x, y));
    }
    this._position = new Point(0, 0);
    this._scale  = new Point(1, 1);
    this._offset = new Point(ox, oy);
    this._pivot  = new Point(width / 2, height / 2);
    this._radian = 0;
    this.id = Polygon_Collider._counter++;
    this.makeVertices(points);
    this.rotate(0); // readjusts the pivot
  };

  Object.defineProperty(Circle_Collider.prototype, 'radiusX', {
    get() {
      return this._radius.x;
    }
  });

  Object.defineProperty(Circle_Collider.prototype, 'radiusY', {
    get() {
      return this._radius.y;
    }
  });

  Circle_Collider.prototype.isPolygon = function() {
    return false;
  };

  Circle_Collider.prototype.isCircle = function() {
    return true;
  };

  Circle_Collider.prototype.scale = function(zX, zY) {
    Polygon_Collider.prototype.scale.call(this, zX, zY);
    this._radius.x *= zX;
    this._radius.y *= zY;
  };

  Circle_Collider.prototype.circlePosition = function(radian) {
    var x = this.radiusX * Math.cos(radian);
    var y = this.radiusY * -Math.sin(radian);
    var dist = Math.sqrt(x * x + y * y);
    radian -= this._radian;
    x = dist * Math.cos(radian);
    y = dist * -Math.sin(radian);
    return new Point(this.center.x + x, this.center.y + y);
  };

  Circle_Collider.prototype.intersects = function(other) {
    if (this.height === 0 || this.width === 0) return false;
    if (other.height === 0 || other.width === 0) return false;
    if (this.containsPoint(other.center.x, other.center.y)) return true;
    if (other.containsPoint(this.center.x, this.center.y)) return true;
    var x1 = this.center.x;
    var x2 = other.center.x;
    var y1 = this.center.y;
    var y2 = other.center.y;
    var rad = Math.atan2(y1 - y2, x2 - x1);
    rad += rad < 0 ? 2 * Math.PI : 0;
    var pos = this.circlePosition(rad);
    if (other.containsPoint(pos.x, pos.y)) return true;
    if (other.isCircle()) {
      rad = Math.atan2(y2 - y1, x1 - x2);
      rad += rad < 0 ? 2 * Math.PI : 0;
      pos = other.circlePosition(rad);
      if (this.containsPoint(pos.x, pos.y)) return true;
    }
    var i, j;
    for (i = 0, j = other._vertices.length; i < j; i++) {
      x1 = other._vertices[i].x;
      y1 = other._vertices[i].y;
      if (this.containsPoint(x1, y1)) return true;
    }
    for (i = 0, j = this._vertices.length; i < j; i++) {
      x1 = this._vertices[i].x;
      y1 = this._vertices[i].y;
      if (other.containsPoint(x1, y1)) return true;
    }
    return false;
  };
})();

//-----------------------------------------------------------------------------
// ColliderManager

function ColliderManager() {
  throw new Error('This is a static class');
}

(function() {
  ColliderManager._colliders = [];
  ColliderManager._colliderGrid = [];
  ColliderManager._characterGrid = [];
  ColliderManager._sectorSize = 48;
  ColliderManager._needsRefresh = true;
  ColliderManager.container = new Sprite();
  ColliderManager.container.alpha = 0.3;
  ColliderManager.visible = QMovement.showColliders;

  ColliderManager.clear = function() {
    this._colliders = [];
    this._colliderGrid = [];
    this._characterGrid = [];
    this.container.removeChildren();
    this._needsRefresh = true;
  };

  ColliderManager.refresh = function() {
    this.clear();
    // rest of refresh is done inside Game_Map
  };

  ColliderManager.addCollider = function(collider, duration, ignoreGrid) {
    if (!$dataMap) return;
    var i = this._colliders.indexOf(collider);
    if (i === -1) {
      this._colliders.push(collider);
      if (duration > 0 || duration === -1) {
        this.draw(collider, duration);
      }
    }
    if (!ignoreGrid) {
      this.updateGrid(collider);
    }
  };

  ColliderManager.addCharacter = function(character, duration) {
    if (!$dataMap) return;
    var i = this._colliders.indexOf(character);
    if (i === -1) {
      this._colliders.push(character);
      if (duration > 0 || duration === -1) {
        this.draw(character.collider('bounds'), duration);
      }
    }
    this.updateGrid(character);
  };

  ColliderManager.remove = function(collider) {
    var i = this._colliders.indexOf(collider);
    if (i < 0) return;
    this.removeFromGrid(collider);
    collider.kill = true;
    this._colliders.splice(i, 1);
  };

  ColliderManager.removeSprite = function(sprite) {
    this.container.removeChild(sprite);
  };

  ColliderManager.updateGrid = function(collider, prevGrid) {
    var maxWidth  = this.sectorCols();
    var maxHeight = this.sectorRows();
    var currGrid;
    var grid;
    if (collider._colliders) {
      grid = this._characterGrid;
      currGrid = collider.collider('bounds').sectorEdge();
    } else {
      grid = this._colliderGrid;
      currGrid = collider.sectorEdge();
    }
    // TODO make this into 1 single 2d loop
    var x, y;
    if (prevGrid) {
      if (currGrid.x1 == prevGrid.x1 && currGrid.y1 === prevGrid.y1 &&
          currGrid.x2 == prevGrid.x2 && currGrid.y2 === prevGrid.y2) {
        return;
      }
      for (x = prevGrid.x1; x <= prevGrid.x2; x++) {
        for (y = prevGrid.y1; y <= prevGrid.y2; y++) {
          if ((x < 0 || x >= maxWidth) || (y < 0 || y >= maxHeight) ) {
            continue;
          }
          var i = grid[x][y].indexOf(collider);
          if (i !== -1) {
            grid[x][y].splice(i, 1);
          }
        }
      }
    }
    for (x = currGrid.x1; x <= currGrid.x2; x++) {
      for (y = currGrid.y1; y <= currGrid.y2; y++) {
        if (x < 0 || x >= maxWidth) {
          continue;
        } else if (y < 0 || y >= maxHeight) {
          continue;
        }
        grid[x][y].push(collider);
      }
    }
  };

  ColliderManager.removeFromGrid = function(collider) {
    var edge;
    var grid;
    if (collider._colliders) { // Is a character obj
      grid = this._characterGrid;
      currGrid = collider.collider('bounds').sectorEdge();
    } else { // is a collider
      grid = this._colliderGrid;
      currGrid = collider.sectorEdge();
    }
    for (x = grid.x1; x <= grid.x2; x++) {
      for (y = grid.y1; y <= grid.y2; y++) {
        var i = grid[x][y].indexOf(collider);
        if (i !== -1) {
          grid[x][y].splice(i, 1);
        }
      }
    }
  };

  // TODO create a similar function that gets
  // characters that intersect with the collider passed in
  ColliderManager.getCharactersNear = function(collider, only) {
    var grid = collider.sectorEdge();
    var arr = [];
    var isBreaking = false;
    var x, y, i;
    for (x = grid.x1; x <= grid.x2; x++) {
      for (y = grid.y1; y <= grid.y2; y++) {
        if (x < 0 || x >= this.sectorCols()) continue;
        if (y < 0 || y >= this.sectorRows()) continue;
        var charas = this._characterGrid[x][y];
        for (i = 0; i < charas.length; i++) {
          if (arr.contains(charas[i])) {
            continue;
          }
          if (only) {
            if (only(charas[i]) === 'break') {
              isBreaking = true;
              break;
            }
            if (!only(charas[i])) continue;
          }
          arr.push(charas[i]);
        }
        if (isBreaking) break;
      }
      if (isBreaking) break;
    }
    only = null;
    return arr;
  };

  ColliderManager.getCollidersNear = function(collider, only) {
    var grid = collider.sectorEdge();
    var arr = [];
    var isBreaking = false;
    var x, y, i;
    for (x = grid.x1; x <= grid.x2; x++) {
      for (y = grid.y1; y <= grid.y2; y++) {
        if (x < 0 || x >= this.sectorCols()) continue;
        if (y < 0 || y >= this.sectorRows()) continue;
        var colliders = this._colliderGrid[x][y];
        for (i = 0; i < colliders.length; i++) {
          if (arr.contains(colliders[i])) {
            continue;
          }
          if (only) {
            if (only(colliders[i]) === 'break') {
              isBreaking = true;
              break;
            }
            if (!only(colliders[i])) continue;
          }
          arr.push(colliders[i]);
        }
        if (isBreaking) break;
      }
      if (isBreaking) break;
    }
    only = null;
    return arr;
  };

  ColliderManager.sectorCols = function() {
    return Math.floor($gameMap.width() * QMovement.tileSize / this._sectorSize);
  };

  ColliderManager.sectorRows = function() {
    return Math.floor($gameMap.height() * QMovement.tileSize / this._sectorSize);
  };

  ColliderManager.draw = function(collider, duration) {
    if ($gameTemp.isPlaytest()) {
      var sprites = this.container.children;
      for (var i = 0; i < sprites.length; i++) {
        if (sprites[i]._collider.id === collider.id) {
          sprites[i]._collider.kill = false;
          sprites[i]._duration = duration;
          return;
        }
      }
      collider.kill = false;
      var sprite = new Sprite_Collider(collider, duration || -1);
      this.container.addChild(sprite);
    }
  };

  ColliderManager.update = function() {
    if (this.visible) {
      this.show();
    } else {
      this.hide();
    }
  };

  ColliderManager.toggle = function() {
    this.visible = !this.visible;
  };

  ColliderManager.show = function() {
    this.container.alpha = 0.3;
  };

  ColliderManager.hide = function() {
    this.container.alpha = 0;
  };

  ColliderManager.convertToCollider = function(arr) {
    var type = arr[0];
    var w = arr[1] || 0;
    var h = arr[2] || 0;
    var ox = arr[3] || 0;
    var oy = arr[4] || 0;
    if (type === 'box') {
      var collider = new Box_Collider(w, h, ox, oy);
    } else if (type === 'circle') {
      var collider = new Circle_Collider(w, h, ox, oy);
    }
    return collider;
  };
})();

//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

(function() {
  var Alias_Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    Alias_Game_Temp_initialize.call(this);
    this._destinationPX = null;
    this._destinationPY = null;
  };

  Game_Temp.prototype.setPixelDestination = function(x, y) {
    this._destinationPX = x;
    this._destinationPY = y;
    var x1 = $gameMap.roundX(Math.floor(x / $gameMap.tileWidth()));
    var y1 = $gameMap.roundY(Math.floor(y / $gameMap.tileHeight()));
    this.setDestination(x1, y1);
  };

  var Alias_Game_Temp_clearDestination = Game_Temp.prototype.clearDestination;
  Game_Temp.prototype.clearDestination = function() {
    if ($gamePlayer._movingWithMouse) return;
    Alias_Game_Temp_clearDestination.call(this);
    this._destinationPX = null;
    this._destinationPY = null;
  };

  Game_Temp.prototype.destinationPX = function() {
    return this._destinationPX;
  };

  Game_Temp.prototype.destinationPY = function() {
    return this._destinationPY;
  };
})();

//-----------------------------------------------------------------------------
// Game_System

(function() {
  var Alias_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    Alias_Game_System_onAfterLoad.call(this);
    ColliderManager.refresh();
  };
})();

//-----------------------------------------------------------------------------
// Game_Map

(function() {
  Game_Map.prototype.tileWidth = function() {
    return QMovement.tileSize;
  };

  Game_Map.prototype.tileHeight = function() {
    return QMovement.tileSize;
  };

  Game_Map.prototype.flagAt = function(x, y) {
    var x = x || $gamePlayer.x;
    var y = y || $gamePlayer.y;
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
      var flag = flags[tiles[i]];
      console.log('layer', i, ':', flag);
      if (flag & 0x20)  console.log('layer', i, 'is ladder');
      if (flag & 0x40)  console.log('layer', i, 'is bush');
      if (flag & 0x80)  console.log('layer', i, 'is counter');
      if (flag & 0x100) console.log('layer', i, 'is damage');
    }
  };

  var Alias_Game_Map_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setupEvents = function() {
    ColliderManager.clear();
    this.setupColliders();
    Alias_Game_Map_setupEvents.call(this);
  };

  Game_Map.prototype.setupColliders = function() {
    ColliderManager._colliderGrid = new Array(this.width());
    for (var x = 0; x < ColliderManager._colliderGrid.length; x++) {
      ColliderManager._colliderGrid[x] = [];
      for (var y = 0; y < this.height(); y++) {
        ColliderManager._colliderGrid[x].push([]);
      }
    }
    ColliderManager._characterGrid = new Array(this.width());
    for (var x = 0; x < ColliderManager._characterGrid.length; x++) {
      ColliderManager._characterGrid[x] = [];
      for (var y = 0; y < this.height(); y++) {
        ColliderManager._characterGrid[x].push([]);
      }
    }
  };

  var Alias_Game_Map_refreshIfNeeded = Game_Map.prototype.refreshIfNeeded;
  Game_Map.prototype.refreshIfNeeded = function() {
    Alias_Game_Map_refreshIfNeeded.call(this);
    if (ColliderManager._needsRefresh) {
      this.reloadAllColliders();
      ColliderManager._needsRefresh = false;
    }
  };

  Game_Map.prototype.reloadAllColliders = function() {
    this.setupColliders();
    this.reloadTileMap();
    var events = this.events();
    var i, j;
    for (i = 0, j = events.length; i < j; i++) {
      events[i].reloadColliders();
    }
    var vehicles = this._vehicles;
    for (i = 0, j = vehicles.length; i < j; i++) {
      vehicles[i].reloadColliders();
    }
    $gamePlayer.reloadColliders();
    var followers = $gamePlayer.followers()._data;
    for (i = 0, j = followers.length; i < j; i++) {
      followers[i].reloadColliders();
    }
  };

  Game_Map.prototype.reloadTileMap = function() {
    this.setupMapColliders();
    // load collision maps here
  };

  Game_Map.prototype.setupMapColliders = function() {
    this._tileCounter = 0;
    for (var x = 0; x < this.width(); x++) {
      for (var y = 0; y < this.height(); y++) {
        var flags = this.tilesetFlags();
        var tiles = this.allTiles(x, y);
        var id = x + y * this.width();
        for (var i = tiles.length - 1; i >= 0; i--) {
          var flag = flags[tiles[i]];
          if (flag === 16) continue;
          this.getMapCollider(x, y, flag);
        }
      }
    }
  };

  Game_Map.prototype.getMapCollider = function(x, y, flag) {
    var realFlag = flag;
    if (flag >> 12 > 0) {
      flag = flag.toString(2);
      flag = flag.slice(flag.length - 12, flag.length);
      flag = parseInt(flag, 2);
    }
    var boxData;
    if (QMovement.regionColliders[this.regionId(x, y)]) {
      var regionData = QMovement.regionColliders[this.regionId(x, y)];
      boxData = [];
      for (var i = 0; i < regionData.length; i++) {
        boxData[i] = [
          regionData[i].width || 0,
          regionData[i].height || 0,
          regionData[i].ox || 0,
          regionData[i].oy || 0,
          regionData[i].tag || regionData[i].note || '',
          regionData[i].type || 'box'
        ]
      }
      flag = 0;
    } else {
      boxData = QMovement.tileBoxes[flag];
    }
    if (!boxData) {
      if (flag & 0x20 || flag & 0x40 || flag & 0x80 || flag & 0x100) {
        boxData = [this.tileWidth(), this.tileHeight(), 0, 0];
      } else {
        return;
      }
    }
    if (boxData[0].constructor === Array) {
      var i = 0;
      for (var i = 0; i < boxData.length; i++) {
        this.makeTileCollider(x, y, realFlag, boxData[i], i);
      }
    } else {
      this.makeTileCollider(x, y, realFlag, boxData, 0);
    }
  };

  Game_Map.prototype.makeTileCollider = function(x, y, flag, boxData, index) {
    // boxData is array [width, height, ox, oy, note, type]
    var x1 = x * this.tileWidth();
    var y1 = y * this.tileHeight();
    var ox = boxData[2] || 0;
    var oy = boxData[3] || 0;
    var w  = boxData[0];
    var h  = boxData[1];
    if (w === 0 || h === 0) return;
    var type = boxData[5] || 'box';
    var newBox;
    if (type === 'circle') {
      newBox = new Circle_Collider(w, h, ox, oy);
    } else if (type === 'box') {
      newBox = new Box_Collider(w, h, ox, oy);
    } else {
      return;
    }
    newBox.isTile = true;
    newBox.moveTo(x1, y1);
    newBox.note      = boxData[4] || '';
    newBox.flag      = flag;
    newBox.terrain   = flag >> 12;
    newBox.isWater1  = flag >> 12 === QMovement.water1Tag || /<water1>/i.test(newBox.note);
    newBox.isWater2  = flag >> 12 === QMovement.water2Tag || /<water2>/i.test(newBox.note);
    newBox.isLadder  = (flag & 0x20)  || /<ladder>/i.test(newBox.note);
    newBox.isBush    = (flag & 0x40)  || /<bush>/i.test(newBox.note);
    newBox.isCounter = (flag & 0x80)  || /<counter>/i.test(newBox.note);
    newBox.isDamage  = (flag & 0x100) || /<damage>/i.test(newBox.note);
    var vx = x * this.height() * this.width();
    var vy = y * this.height();
    var vz = index;
    newBox.location  = vx + vy + vz;
    if (newBox.isWater2) {
      newBox.color = QMovement.water2.toLowerCase();
    } else if (newBox.isWater1) {
      newBox.color = QMovement.water1.toLowerCase();
    } else if (newBox.isLadder || newBox.isBush || newBox.isDamage) {
      newBox.color = '#ffffff';
    } else {
      newBox.color = QMovement.collision.toLowerCase();
    }
    ColliderManager.addCollider(newBox, -1);
  };

  Game_Map.prototype.adjustPX = function(x) {
    return this.adjustX(x / QMovement.tileSize) * QMovement.tileSize;
  };

  Game_Map.prototype.adjustPY = function(y) {
    return this.adjustY(y / QMovement.tileSize) * QMovement.tileSize;
  };

  Game_Map.prototype.roundPX = function(x) {
    return this.isLoopHorizontal() ? x.mod(this.width() * QMovement.tileSize) : x;
  };

  Game_Map.prototype.roundPY = function(y) {
    return this.isLoopVertical() ? y.mod(this.height() * QMovement.tileSize) : y;
  };

  Game_Map.prototype.pxWithDirection = function(x, d, dist) {
    return x + (d === 6 ? dist : d === 4 ? -dist : 0);
  };

  Game_Map.prototype.pyWithDirection = function(y, d, dist) {
    return y + (d === 2 ? dist : d === 8 ? -dist : 0);
  };

  Game_Map.prototype.roundPXWithDirection = function(x, d, dist) {
    return this.roundPX(x + (d === 6 ? dist : d === 4 ? -dist : 0));
  };

  Game_Map.prototype.roundPYWithDirection = function(y, d, dist) {
    return this.roundPY(y + (d === 2 ? dist : d === 8 ? -dist : 0));
  };

  Game_Map.prototype.deltaPX = function(x1, x2) {
    var result = x1 - x2;
    if (this.isLoopHorizontal() && Math.abs(result) > (this.width() * QMovement.tileSize) / 2) {
      if (result < 0) {
        result += this.width() * QMovement.tileSize;
      } else {
        result -= this.width() * QMovement.tileSize;
      }
    }
    return result;
  };

  Game_Map.prototype.deltaPY = function(y1, y2) {
    var result = y1 - y2;
    if (this.isLoopVertical() && Math.abs(result) > (this.height() * QMovement.tileSize) / 2) {
      if (result < 0) {
        result += this.height() * QMovement.tileSize;
      } else {
        result -= this.height() * QMovement.tileSize;
      }
    }
    return result;
  };

  Game_Map.prototype.canvasToMapPX = function(x) {
    var tileWidth = this.tileWidth();
    var originX = this._displayX * tileWidth;
    return this.roundPX(originX + x);
  };

  Game_Map.prototype.canvasToMapPY = function(y) {
    var tileHeight = this.tileHeight();
    var originY = this._displayY * tileHeight;
    return this.roundPY(originY + y);
  };
})();

//-----------------------------------------------------------------------------
// Game_CharacterBase

(function() {
  Object.defineProperties(Game_CharacterBase.prototype, {
      px: { get: function() { return this._px; }, configurable: true },
      py: { get: function() { return this._py; }, configurable: true }
  });

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._px = 0;
    this._py = 0;
    this._realPX = 0;
    this._realPY = 0;
    this._radian = 0;
    this._adjustFrameSpeed = false;
    this._freqCount = 0;
    this._diagonal = false;
    this._currentRad = 0;
    this._targetRad = 0;
    this._pivotX = 0;
    this._pivotY = 0;
    this._radiusL = 0;
    this._radisuH = 0;
    this._angularSpeed;
    this._passabilityLevel = 0; // todo
    this._isMoving = false;
  };

  Game_CharacterBase.prototype.direction8 = function(horz, vert) {
    if (horz === 4 && vert === 8) return 7;
    if (horz === 4 && vert === 2) return 1;
    if (horz === 6 && vert === 8) return 9;
    if (horz === 6 && vert === 2) return 3;
    return 5;
  };

  Game_CharacterBase.prototype.isMoving = function() {
    return this._isMoving;
  };

  Game_CharacterBase.prototype.startedMoving = function() {
    return this._realPX !== this._px || this._realPY !== this._py;
  };

  Game_CharacterBase.prototype.isDiagonal = function() {
    return this._diagonal;
  };

  Game_CharacterBase.prototype.isArcing = function() {
    return this._currentRad !== this._targetRad;
  };

  var Alias_Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    Alias_Game_CharacterBase_setPosition.call(this, x, y);
    this._px = this._realPX = x * QMovement.tileSize;
    this._py = this._realPY = y * QMovement.tileSize;
    if (!this._colliders) this.collider();
    this.moveColliders();
  };

  var Alias_Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
  Game_CharacterBase.prototype.copyPosition = function(character) {
    Alias_Game_CharacterBase_copyPosition.call(this, character);
    this._px = character._px;
    this._py = character._py;
    this._realPX = character._realPX;
    this._realPY = character._realPY;
    if (!this._colliders) this.collider();
    this.moveColliders();
  };

  var Alias_Game_CharacterBase_setDirection = Game_CharacterBase.prototype.setDirection;
  Game_CharacterBase.prototype.setDirection = function(d) {
    if (!this.isDirectionFixed() && d) {
      this._radian = this.directionToRadian(d);
      if ([1, 3, 7, 9].contains(d)) {
        this._diagonal = d;
        this.resetStopCount();
        return;
      } else {
        this._diagonal = false;
      }
    }
    Alias_Game_CharacterBase_setDirection.call(this, d);
  };

  Game_CharacterBase.prototype.moveTiles = function() {
    if (QMovement.grid < this.frameSpeed()) {
      return QMovement.offGrid ? this.frameSpeed() : QMovement.grid;
    }
    return QMovement.grid;
  };

  Game_CharacterBase.prototype.frameSpeed = function(multi) {
    var multi = multi === undefined ? 1 : Math.abs(multi);
    return this.distancePerFrame() * QMovement.tileSize * multi;
  };

  Game_CharacterBase.prototype.angularSpeed = function() {
    return this._angularSpeed || this.frameSpeed() / this._radiusL;
  };

  Game_CharacterBase.prototype.canMove = function() {
    return !this._locked;
  };

  Game_CharacterBase.prototype.canPass = function(x, y, dir) {
    return this.canPixelPass(x * QMovement.tileSize, y * QMovement.tileSize, dir);
  };

  Game_CharacterBase.prototype.canPixelPass = function(x, y, dir, dist, type) {
    dist = dist || this.moveTiles();
    type = type || 'collision';
    var x1 = $gameMap.roundPXWithDirection(x, dir, dist);
    var y1 = $gameMap.roundPYWithDirection(y, dir, dist);
    if (!this.collisionCheck(x1, y1, dir, dist, type)) {
      this.collider(type).moveTo(this._px, this._py);
      return false;
    }
    if (type[0] !== '_') {
      this.moveColliders(x1, y1);
    }
    return true;
  };

  Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
    return this.canPixelPassDiagonally(x * QMovement.tileSize, y * QMovement.tileSize, horz, vert);
  };

  // old version, keeping incase issues appear with new one
  Game_CharacterBase.prototype._canPixelPassDiagonally = function(x, y, horz, vert, dist, type) {
    dist = dist || this.moveTiles();
    type = type || 'collision';
    var x1 = $gameMap.roundPXWithDirection(x, horz, dist);
    var y1 = $gameMap.roundPYWithDirection(y, vert, dist);
    return (this.canPixelPass(x, y, vert, dist, type) && this.canPixelPass(x, y1, horz, dist, type)) ||
           (this.canPixelPass(x, y, horz, dist, type) && this.canPixelPass(x1, y, vert, dist, type));
  };

  // new version, less checks should perform better
  Game_CharacterBase.prototype.canPixelPassDiagonally = function(x, y, horz, vert, dist, type) {
    dist = dist || this.moveTiles();
    type = type || 'collision';
    var x1 = $gameMap.roundPXWithDirection(x, horz, dist);
    var y1 = $gameMap.roundPYWithDirection(y, vert, dist);
    if (!this.canPixelPass(x1, y1, 5, null, type)) return false;
    if (QMovement.midPass) {
      var x2 = $gameMap.roundPXWithDirection(x, horz, dist / 2);
      var y2 = $gameMap.roundPYWithDirection(y, vert, dist / 2);
      if (!this.canPixelPass(x2, y2, 5, null, type)) return false;
    }
    return true;
  };

  Game_CharacterBase.prototype.collisionCheck = function(x, y, dir, dist, type) {
    this.collider(type).moveTo(x, y);
    if (!this.valid(type)) return false;
    if (this.isThrough() || this.isDebugThrough()) return true;
    if (QMovement.midPass && dir !== 5) {
      if (!this.middlePass(x, y, dir, dist, type)) return false;
    }
    if (this.collideWithTile(type)) return false;
    if (this.collideWithCharacter(type)) return false;
    return true;
  };

  Game_CharacterBase.prototype.middlePass = function(x, y, dir, dist, type) {
    var dist = dist / 2 || this.moveTiles() / 2;
    var x2 = $gameMap.roundPXWithDirection(x, this.reverseDir(dir), dist);
    var y2 = $gameMap.roundPYWithDirection(y, this.reverseDir(dir), dist);
    this.collider(type).moveTo(x2, y2);
    if (this.collideWithTile(type)) return false;
    if (this.collideWithCharacter(type)) return false;
    this.collider(type).moveTo(x, y);
    return true;
  };

  Game_CharacterBase.prototype.collideWithTile = function(type) {
    var collider = this.collider(type);
    var collided = false;
    ColliderManager.getCollidersNear(collider, (function(tile) {
      if (!tile.isTile) return false;
      if (this.passableColors().contains(tile.color)) {
        return false;
      }
      collided = tile.intersects(collider);
      if (collided) return 'break';
    }).bind(this));
    return collided;
  };

  Game_CharacterBase.prototype.collideWithCharacter = function(type) {
    var collider = this.collider(type);
    var collided = false;
    ColliderManager.getCharactersNear(collider, (function(chara) {
      if (chara.isThrough() || chara === this || !chara.isNormalPriority()) {
        return false;
      }
      if (this.ignoreCharacters(type).contains(chara.charaId())) {
        return false;
      }
      collided = chara.collider('collision').intersects(collider);
      if (collided) return 'break';
    }).bind(this));
    return collided;
  };

  Game_CharacterBase.prototype.ignoreCharacters = function(type) {
    var ignore = {
      default: []
    }
    return ignore[type] || ignore.default;
  };

  Game_CharacterBase.prototype.valid = function(type) {
    var edge = this.collider(type).gridEdge();
    var maxW = $gameMap.width();
    var maxH = $gameMap.height();
    if (!$gameMap.isLoopHorizontal()) {
      if (edge.x1 < 0 || edge.x2 >= maxW) return false;
    }
    if (!$gameMap.isLoopVertical()) {
      if (edge.y1 < 0 || edge.y2 >= maxH) return false;
    }
    return true;
  };

  Game_CharacterBase.prototype.passableColors = function() {
    // #00000000 is a transparent return value in collisionmap addon
    var colors = ['#ffffff', '#00000000'];
    switch (this._passabilityLevel) {
      case 1:
      case 3: {
        colors.push(QMovement.water1);
        break;
      }
      case 2:
      case 4: {
        colors.push(QMovement.water1);
        colors.push(QMovement.water2);
        break;
      }
    }
    return colors;
  };

  Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
    var x2 = $gameMap.roundPXWithDirection(this.px, d, this.moveTiles());
    var y2 = $gameMap.roundPYWithDirection(this.py, d, this.moveTiles());
    this.checkEventTriggerTouch(x2, y2);
  };

  Game_CharacterBase.prototype.isOnLadder = function() {
    if (!this.collider()) return false;
    var collider = this.collider('collision');
    var collided = false;
    var colliders = ColliderManager.getCollidersNear(collider, function(tile) {
      if (!tile.isTile) return false;
      if (tile.isLadder && tile.intersects(collider)) {
        collided = true;
        return 'break';
      }
      return false;
    });
    return collided;
  };

  Game_CharacterBase.prototype.isOnBush = function() {
    if (!this.collider()) return false;
    var collider = this.collider('collision');
    var collided = false;
    var colliders = ColliderManager.getCollidersNear(collider, function(tile) {
      if (!tile.isTile) return false;
      if (tile.isBush && tile.intersects(collider)) {
        collided = true;
        return 'break';
      }
      return false;
    });
    return collided;
  };

  Game_CharacterBase.prototype.freqThreshold = function() {
    return QMovement.tileSize;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var prevX = this._realPX;
    var prevY = this._realPY;
    if (this.startedMoving()) {
      this._isMoving = true;
    } else {
      this.updateStop();
    }
    if (this.isArcing()) {
      this.updateArc();
    } else if (this.isJumping()) {
      this.updateJump();
    } else if (this.isMoving()) {
      this.updateMove();
    }
    this.updateAnimation();
    this.updateColliders();
    if (prevX !== this._realPX || prevY !== this._realPY) {
      this.onPositionChange();
    } else {
      this._isMoving = false;
    }
  };

  Game_CharacterBase.prototype.updateMove = function() {
    if (this.isArcing()) return;
    var xSpeed = 1;
    var ySpeed = 1;
    if (this._adjustFrameSpeed) {
      xSpeed = Math.cos(this._radian);
      ySpeed = Math.sin(this._radian);
    }
    if (this._px < this._realPX) {
      this._realPX = Math.max(this._realPX - this.frameSpeed(xSpeed), this._px);
    }
    if (this._px > this._realPX) {
      this._realPX = Math.min(this._realPX + this.frameSpeed(xSpeed), this._px);
    }
    if (this._py < this._realPY) {
      this._realPY = Math.max(this._realPY - this.frameSpeed(ySpeed), this._py);
    }
    if (this._py > this._realPY) {
      this._realPY = Math.min(this._realPY + this.frameSpeed(ySpeed), this._py);
    }
    this._x = Math.floor(this._px / QMovement.tileSize);
    this._y = Math.floor(this._py / QMovement.tileSize);
    this._realX = this._realPX / QMovement.tileSize;
    this._realY = this._realPY / QMovement.tileSize;
    this._freqCount += this.frameSpeed();
  };

  Game_CharacterBase.prototype.updateArc = function() {
    if (this._currentRad < this._targetRad) {
      var newRad = Math.min(this._currentRad + this.angularSpeed(), this._targetRad);
    }
    if (this._currentRad > this._targetRad) {
      var newRad = Math.max(this._currentRad - this.angularSpeed(), this._targetRad);
    }
    var x1 = this._pivotX + this._radiusL * Math.cos(newRad);
    var y1 = this._pivotY + this._radiusH * Math.sin(newRad);
    this._currentRad = newRad;
    this._px = this._realPX = x1;
    this._py = this._realPY = y1;
    this._x = Math.floor(this._px / QMovement.tileSize);
    this._y = Math.floor(this._py / QMovement.tileSize);
    this._realX = this._realPX / QMovement.tileSize;
    this._realY = this._realPY / QMovement.tileSize;
    this.moveColliders(x1, y1);
    this.checkEventTriggerTouchFront(this._direction);
  };

  var Alias_Game_CharacterBase_updateJump = Game_CharacterBase.prototype.updateJump;
  Game_CharacterBase.prototype.updateJump = function() {
    Alias_Game_CharacterBase_updateJump.call(this);
    this._px = this._realPX = this._x * QMovement.tileSize;
    this._py = this._realPY = this._y * QMovement.tileSize;
    this.moveColliders(this._px, this._py);
  };

  Game_CharacterBase.prototype.updateColliders = function() {
    var colliders = this._colliders;
    if (!colliders) return;
    var hidden = false;
    hidden = this.isTransparent() || this._erased;
    if (!hidden && this.isVisible) {
      hidden = !this.isVisible();
    }
    for (var type in colliders) {
      if (colliders.hasOwnProperty(type)) {
        colliders[type]._isHidden = !!hidden;
      }
    }
  };

  Game_CharacterBase.prototype.onPositionChange = function() {
    this.refreshBushDepth();
  };

  Game_CharacterBase.prototype.refreshBushDepth = function() {
    if (this.isNormalPriority() && !this.isObjectCharacter() &&
        this.isOnBush() && !this.isJumping()) {
      if (!this.startedMoving()) this._bushDepth = 12;
    } else {
      this._bushDepth = 0;
    }
  };

  Game_CharacterBase.prototype.pixelJump = function(xPlus, yPlus) {
    return this.jump(xPlus / QMovement.tileSize, yPlus / QMovement.tileSize);
  };

  Game_CharacterBase.prototype.pixelJumpForward = function(dist, dir) {
    dir = dir || this._direction;
    dist = dist / QMovement.tileSize;
    var x = dir === 6 ? dist : dir === 4 ? -dist : 0;
    var y = dir === 2 ? dist : dir === 8 ? -dist : 0;
    this.jump(x, y);
  };

  Game_CharacterBase.prototype.pixelJumpBackward = function(dist) {
    this.pixelJumpFixed(this.reverseDir(this.direction()), dist);
  };

  Game_CharacterBase.prototype.pixelJumpFixed = function(dir, dist) {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.pixelJumpForward(dist, dir);
    this.setDirectionFix(lastDirectionFix);
  };

  Game_CharacterBase.prototype.moveStraight = function(d, dist) {
    dist = dist || this.moveTiles();
    this.setMovementSuccess(this.canPixelPass(this._px, this._py, d, dist));
    var originalSpeed = this._moveSpeed;
    if (this.smartMove() === 1 || this.smartMove() > 2) {
      this.smartMoveSpeed(d);
      dist = this.moveTiles();
    }
    if (this.isMovementSucceeded()) {
      this._diagonal = false;
      this._adjustFrameSpeed = false;
      this.setDirection(d);
      this._px = $gameMap.roundPXWithDirection(this._px, d, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, d, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(d), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(d), dist);
      this.increaseSteps();
    } else {
      this.setDirection(d);
      this.checkEventTriggerTouchFront(d);
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      this.smartMoveDir8(d);
    }
  };

  Game_CharacterBase.prototype.moveDiagonally = function(horz, vert, dist) {
    dist = dist || this.moveTiles();
    this.setMovementSuccess(this.canPixelPassDiagonally(this._px, this._py, horz, vert, dist));
    var originalSpeed = this._moveSpeed;
    if (this.smartMove() === 1 || this.smartMove() > 2) this.smartMoveSpeed([horz, vert]);
    if (this.isMovementSucceeded()) {
      this._diagonal = this.direction8(horz, vert);
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, horz, this.moveTiles());
      this._py = $gameMap.roundPYWithDirection(this._py, vert, this.moveTiles());
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), this.moveTiles());
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), this.moveTiles());
      this.increaseSteps();
    } else {
      this._diagonal = false;
    }
    if (this._direction === this.reverseDir(horz)) {
      this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
      this.setDirection(vert);
    }
    this._moveSpeed = originalSpeed;
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      if (this.canPixelPass(this._px, this._py, horz)) {
        this.moveStraight(horz);
      } else if (this.canPixelPass(this._px, this._py, vert)) {
        this.moveStraight(vert);
      }
    }
  };

  Game_CharacterBase.prototype.moveRadian = function(radian, dist) {
    dist = dist || this.moveTiles();
    var realDir = this.radianToDirection(radian, true);
    var dir = this.radianToDirection(radian);
    var xAxis = Math.cos(radian);
    var yAxis = Math.sin(radian);
    var horzSteps = Math.abs(xAxis) * dist;
    var vertSteps = Math.abs(yAxis) * dist;
    var horz = xAxis > 0 ? 6 : xAxis < 0 ? 4 : 0;
    var vert = yAxis > 0 ? 2 : yAxis < 0 ? 8 : 0;
    var x2 = $gameMap.roundPXWithDirection(this._px, horz, horzSteps);
    var y2 = $gameMap.roundPYWithDirection(this._py, vert, vertSteps);
    this.setMovementSuccess(
      (this.canPixelPass(this._px, this._py, vert, vertSteps) && this.canPixelPass(this._px, y2, horz, horzSteps)) ||
      (this.canPixelPass(this._px, this._py, horz, horzSteps) && this.canPixelPass(x2, this._py, vert, vertSteps))
    );
    if (this.isMovementSucceeded()) {
      this._diagonal = false;
      if ([1, 3, 7, 9].contains(realDir)) {
        this._diagonal = realDir;
      }
      this._adjustFrameSpeed = true;
      this.setDirection(dir);
      this._radian = radian;
      this._px = x2;
      this._py = y2;
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), horzSteps);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), vertSteps);
      this.increaseSteps();
    } else {
      this.setDirection(dir);
      this.checkEventTriggerTouchFront(dir);
    }
    if (!this.isMovementSucceeded() && this.smartMove() > 1) {
      if ([1, 3, 7, 9].contains(realDir)) {
        if (this.canPixelPass(this._px, this._py, horz, horzSteps)) {
          this.moveStraight(horz, horzSteps);
        } else if (this.canPixelPass(this._px, this._py, vert, vertSteps)) {
          this.moveStraight(vert, vertSteps);
        }
      } else {
        this.smartMoveDir8(dir);
      }
    }
  };

  Game_CharacterBase.prototype.fixedMove = function(dir, dist) {
    dir = dir === 5 ? this.direction() : dir;
    if ([1, 3, 7, 9].contains(dir)) {
      var diag = {
        1: [4, 2],
        3: [6, 2],
        7: [4, 8],
        9: [6, 8]
      }
      return this.fixedDiagMove(diag[dir][0], diag[dir][1], dist);
    }
    this.setMovementSuccess(this.canPixelPass(this._px, this._py, dir, dist));
    if (this.isMovementSucceeded()) {
      this._diagonal = false;
      this._adjustFrameSpeed = false;
      this.setDirection(dir);
      this._px = $gameMap.roundPXWithDirection(this._px, dir, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, dir, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(dir), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(dir), dist);
      this.increaseSteps();
    } else {
      this.setDirection(dir);
      this.checkEventTriggerTouchFront(dir);
    }
  };

  Game_CharacterBase.prototype.fixedDiagMove = function(horz, vert, dist) {
    this.setMovementSuccess(this.canPixelPassDiagonally(this._px, this._py, horz, vert));
    if (this.isMovementSucceeded()) {
      this._diagonal = this.direction8(horz, vert);
      this._adjustFrameSpeed = false;
      this._px = $gameMap.roundPXWithDirection(this._px, horz, dist);
      this._py = $gameMap.roundPYWithDirection(this._py, vert, dist);
      this._realPX = $gameMap.pxWithDirection(this._px, this.reverseDir(horz), dist);
      this._realPY = $gameMap.pyWithDirection(this._py, this.reverseDir(vert), dist);
      this.increaseSteps();
    } else {
      this._diagonal = false;
    }
    if (this._direction === this.reverseDir(horz)) {
      this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
      this.setDirection(vert);
    }
  };

  Game_CharacterBase.prototype.fixedMoveBackward = function(dist) {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.fixedMove(this.reverseDir(this.direction()), dist);
    this.setDirectionFix(lastDirectionFix);
  };

  Game_CharacterBase.prototype.arc = function(pivotX, pivotY, radians, cc, frames) {
    var cc = cc ? 1 : -1;
    var dx = this._px - pivotX;
    var dy = this._py - pivotY;
    var rad = Math.atan2(dy, dx);
    frames = frames || 1;
    rad += rad < 0 ? 2 * Math.PI : 0;
    this._currentRad = rad;
    this._targetRad  = rad + radians * cc;
    this._pivotX = pivotX;
    this._pivotY = pivotY;
    this._radiusL = this._radiusH = Math.sqrt(dy * dy + dx * dx);
    this._angularSpeed = radians / frames;
  };

  Game_CharacterBase.prototype.smartMove = function() {
    return 0;
  };

  Game_CharacterBase.prototype.smartMoveDir8 = function(dir) {
    var x1 = this._px;
    var y1 = this._py;
    var dist = this.moveTiles();
    var horz = [4, 6].contains(dir) ? true : false;
    var collider = this.collider('collision');
    var steps = horz ? collider.height : collider.width;
    steps /= 2;
    for (var i = 0; i < 2; i++) {
      var sign = i === 0 ? 1 : -1;
      var j = 0;
      var x2 = x1;
      var y2 = y1;
      if (horz) {
        x2 = $gameMap.roundPXWithDirection(x1, dir, dist);
      } else {
        y2 = $gameMap.roundPYWithDirection(y1, dir, dist);
      }
      while (j < steps) {
        j += dist;
        if (horz) {
          y2 = y1 + j * sign;
        } else {
          x2 = x1 + j * sign;
        }
        var pass = this.canPixelPass(x2, y2, 5);
        if (pass) break;
      }
      if (pass) break;
    }
    if (pass) {
      var x3 = $gameMap.roundPXWithDirection(x1, dir, dist);
      var y3 = $gameMap.roundPYWithDirection(y1, dir, dist);
      collider.moveTo(x3, y3);
      var collided = false;
      ColliderManager.getCharactersNear(collider, (function(chara) {
        if (chara.isThrough() || chara === this || !chara.isNormalPriority()) {
          return false;
        }
        if (chara.collider('collision').intersects(collider) &&
          chara.notes && !/<smartdir>/i.test(chara.notes())) {
          collided = true;
          return 'break';
        }
        return false;
      }).bind(this));
      if (collided) {
        collider.moveTo(x1, y1);
        return;
      }
      collider.moveTo(x2, y2);
      this._realPX = x1;
      this._realPY = y1;
      this._px = x2;
      this._py = y2;
      this._radian = Math.atan2(y2 - y1, x2 - x1);
      this._radian += this._radian < 0 ? 2 * Math.PI : 0;
      this._adjustFrameSpeed = false;
      this.increaseSteps();
    }
  };

  Game_CharacterBase.prototype.smartMoveSpeed = function(dir) {
    var diag = dir.constructor === Array;
    while (!this.isMovementSucceeded()) {
      // should improve by figuring out what 1 pixel is in terms of movespeed
      // and subtract by that value instead
      this._moveSpeed--;
      if (diag) {
        this.setMovementSuccess(this.canPixelPassDiagonally(this._px, this._py, dir[0], dir[1]));
      } else {
        this.setMovementSuccess(this.canPixelPass(this._px, this._py, dir));
      }
      if (this._moveSpeed < 1) break;
    }
  };

  Game_CharacterBase.prototype.reloadColliders = function() {
    for (var collider in this._colliders) {
      if (!this._colliders.hasOwnProperty(collider)) continue;
      ColliderManager.remove(this._colliders[collider]);
      this._colliders[collider] = null;
    }
    this.setupColliders();
  };

  Game_CharacterBase.prototype.collider = function(type) {
    if (!$dataMap || !$gameMap) return;
    if (!this._colliders) this.setupColliders();
    return this._colliders[type] || this._colliders['default'];
  };

  Game_CharacterBase.prototype.defaultColliderConfig = function() {
    return 'box,0,0';
  };

  Game_CharacterBase.prototype.setupColliders = function() {
    this._colliders = {};
    var defaultCollider = this.defaultColliderConfig();
    var notes = this.notes(true);
    var configs = {};
    var multi = /<colliders>([\s\S]*)<\/colliders>/i.exec(notes);
    var single = /<collider[=|:]([0-9a-z,-\s]*?)>/i.exec(notes);
    if (multi) {
      configs = QPlus.stringToObj(multi[1]);
    }
    if (single) {
      configs.default = QPlus.stringToAry(single[1]);
    }
    if (!configs.default) {
      configs.default = QPlus.stringToAry(defaultCollider);
    }
    for (var collider in configs) {
      if (!configs.hasOwnProperty(collider)) continue;
      this.makeCollider(collider, configs[collider]);
    }
    this.makeBounds();
    this.moveColliders();
  };

  Game_CharacterBase.prototype.makeCollider = function(name, settings) {
    settings[4] = settings[4] || 0;
    settings[4] -= this.shiftY();
    this._colliders[name] = ColliderManager.convertToCollider(settings);
    this._colliders[name]._charaId = this.charaId();
    ColliderManager.addCollider(this._colliders[name], -1, true);
  };

  Game_CharacterBase.prototype.makeBounds = function() {
    var minX = null;
    var maxX = null;
    var minY = null;
    var maxY = null;
    for (var type in this._colliders) {
      if (!this._colliders.hasOwnProperty(type)) continue;
      var edge = this._colliders[type].edge();
      if (minX === null || minX > edge.x1) {
        minX = edge.x1;
      }
      if (maxX === null || maxX < edge.x2) {
        maxX = edge.x2;
      }
      if (minY === null || minY > edge.y1) {
        minY = edge.y1;
      }
      if (maxY === null || maxY < edge.y2) {
        maxY = edge.y2;
      }
    }
    var w = maxX - minX + 1;
    var h = maxY - minY + 1;
    this._colliders['bounds'] = new Box_Collider(w, h, minX, minY);
    this._colliders['bounds'].isTile = false;
    this._colliders['bounds']._charaId = String(this.charaId());
    ColliderManager.addCharacter(this, 0);
  };

  Game_CharacterBase.prototype.moveColliders = function(x, y) {
    if (!$dataMap) return;
    x = typeof x === 'number' ? x : this.px;
    y = typeof y === 'number' ? y : this.py;
    var prev = this._colliders['bounds'].sectorEdge();
    for (var collider in this._colliders) {
      if (this._colliders.hasOwnProperty(collider)) {
        this._colliders[collider].moveTo(x, y);
      }
    }
    ColliderManager.updateGrid(this, prev);
  };

  Game_CharacterBase.prototype.cx = function() {
    return this.collider('collision').center.x;
  };

  Game_CharacterBase.prototype.cy = function() {
    return this.collider('collision').center.y;
  };
})();

//-----------------------------------------------------------------------------
// Game_Character

(function() {
  var Alias_Game_Character_processMoveCommand = Game_Character.prototype.processMoveCommand;
  Game_Character.prototype.processMoveCommand = function(command) {
    this.subMVMoveCommands(command);
    if (this.subQMoveCommand(command)) {
      command = this._moveRoute.list[this._moveRouteIndex];
    }
    this.processQMoveCommands(command);
    Alias_Game_Character_processMoveCommand.call(this, command);
  };

  Game_Character.prototype.subMVMoveCommands = function(command) {
    var gc = Game_Character;
    var params = command.parameters;
    switch (command.code) {
      case gc.ROUTE_MOVE_DOWN: {
        this.subQMove("2, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LEFT: {
        this.subQMove("4, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_RIGHT: {
        this.subQMove("6, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UP: {
        this.subQMove("8, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LOWER_L: {
        this.subQMove("1, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_LOWER_R: {
        this.subQMove("3, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UPPER_L: {
        this.subQMove("7, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_UPPER_R: {
        this.subQMove("9, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_FORWARD: {
        this.subQMove("5, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_MOVE_BACKWARD: {
        this.subQMove("0, 1," + QMovement.tileSize);
        //this._moveRouteIndex++;
        break;
      }
      case gc.ROUTE_TURN_DOWN:
      case gc.ROUTE_TURN_LEFT:
      case gc.ROUTE_TURN_RIGHT:
      case gc.ROUTE_TURN_UP:
      case gc.ROUTE_TURN_90D_R:
      case gc.ROUTE_TURN_90D_L:
      case gc.ROUTE_TURN_180D:
      case gc.ROUTE_TURN_90D_R_L:
      case gc.ROUTE_TURN_RANDOM:
      case gc.ROUTE_TURN_TOWARD:
      case gc.ROUTE_TURN_AWAY: {
        this._freqCount = this.freqThreshold();
        break;
      }
    }
  };

  Game_Character.prototype.subQMoveCommand = function(command) {
    var gc = Game_Character;
    var code = command.code;
    var params = command.parameters;
    if (command.code === gc.ROUTE_SCRIPT) {
      var qmove = /^qmove\((.*)\)/i.exec(params[0]);
      var arc   = /^arc\((.*)\)/i.exec(params[0]);
      if (qmove) this.subQMove(qmove[1]);
      if (arc)   this.subArc(arc[1]);
      if (qmove || arc) return true;
    }
    return false;
  };

  Game_Character.prototype.processQMoveCommands = function(command) {
    var params = command.parameters;
    switch (command.code) {
      case 'arc': {
        this.arc(params[0], params[1], eval(params[2]), params[3], params[4]);
        break;
      }
      case 'moveRadian': {
        this.moveRadian(params[0], params[1]);
        break;
      }
      case 'fixedMove': {
        this.fixedMove(params[0], params[1]);
        break;
      }
      case 'fixedMoveBackward': {
        this.fixedMoveBackward(params[0]);
        break;
      }
      case 'fixedMoveForward': {
        this.fixedMove(this.direction(), params[0]);
        break;
      }
    }
  };

  Game_Character.prototype.subArc = function(settings) {
    var cmd = {};
    cmd.code = 'arc';
    cmd.parameters = QPlus.stringToAry(settings);
    this._moveRoute.list[this._moveRouteIndex] = cmd;
  };

  Game_Character.prototype.subQMove = function(settings) {
    settings  = QPlus.stringToAry(settings);
    var dir   = settings[0];
    if (dir === 5) dir = this._direction;
    var amt   = settings[1];
    var multi = settings[2] || 1;
    var tot   = amt * multi;
    var steps = Math.floor(tot / this.moveTiles());
    var moved = 0;
    for (var i = 0; i < steps; i++) {
      moved += this.moveTiles();
      var cmd = {};
      cmd.code = 'fixedMove';
      cmd.parameters = [dir, this.moveTiles()];
      if (dir ===0) {
        cmd.code = 'fixedMoveBackward';
        cmd.parameters = [this.moveTiles()];
      }
      this._moveRoute.list.splice(this._moveRouteIndex + 1, 0, cmd);
    }
    if (moved < tot) {
      var cmd = {};
      cmd.code = 'fixedMove';
      cmd.parameters = [dir, tot - moved];
      if (dir === 0) {
        cmd.code = 'fixedMoveBackward';
        cmd.parameters = [tot - moved];
      }
      this._moveRoute.list.splice(this._moveRouteIndex + 1 + i, 0, cmd);
    }
    this._moveRoute.list.splice(this._moveRouteIndex, 1);
  };

  Game_Character.prototype.moveRandom = function() {
    var d = 2 + Math.randomInt(4) * 2;
    if (this.canPixelPass(this.px, this.py, d)) {
      this.moveStraight(d);
    }
  };

  Game_Character.prototype.turnTowardCharacter = function(character) {
    var sx = this.deltaPXFrom(character.cx());
    var sy = this.deltaPYFrom(character.cy());
    if (Math.abs(sx) > Math.abs(sy)) {
      this.setDirection(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
      this.setDirection(sy > 0 ? 8 : 2);
    }
  };

  Game_Character.prototype.turnAwayFromCharacter = function(character) {
    var sx = this.deltaPXFrom(character.cx());
    var sy = this.deltaPYFrom(character.cy());
    if (Math.abs(sx) > Math.abs(sy)) {
      this.setDirection(sx > 0 ? 6 : 4);
    } else if (sy !== 0) {
      this.setDirection(sy > 0 ? 2 : 8);
    }
  };

  Game_Character.prototype.deltaPXFrom = function(x) {
    return $gameMap.deltaPX(this.cx(), x);
  };

  Game_Character.prototype.deltaPYFrom = function(y) {
    return $gameMap.deltaPY(this.cy(), y);
  };

  Game_Character.prototype.pixelDistanceFrom = function(x, y) {
    return $gameMap.distance(this.cx(), this.cy(), x, y);
  };

  // Returns the px, py needed for this character to be center aligned
  // with the character passed in (align is based off collision collider)
  Game_Character.prototype.centerWith = function(character) {
    var dx1 = this.cx() - this.px;
    var dy1 = this.cy() - this.py;
    var dx2 = character.cx() - character.px;
    var dy2 = character.cy() - character.py;
    var dx = dx1 - dx2;
    var dy = dy1 - dy2;
    return new Point(character.px + dx, character.py + dy);
  };
})();

//-----------------------------------------------------------------------------
// Game_Player

(function() {
  var Alias_Game_Player_initMembers = Game_Player.prototype.initMembers;
  Game_Player.prototype.initMembers = function() {
    Alias_Game_Player_initMembers.call(this);
    this._requestMouseMove = false;
    this._movingWithMouse = false;
  };

  Game_Player.prototype.defaultColliderConfig = function() {
    return QMovement.playerCollider;
  };

  Game_Player.prototype.smartMove = function() {
    return QMovement.smartMove;
  };

  Game_Player.prototype.requestMouseMove = function() {
    this._requestMouseMove = true;
  };

  Game_Player.prototype.moveByMouse = function(x, y) {
    $gameTemp.setPixelDestination(x, y);
    if (this.triggerTouchAction()) {
      return this.clearMouseMove();
    }
    this._requestMouseMove = false;
    this._movingWithMouse = true;
    // alias with pathfinding addon
  };

  Game_Player.prototype.clearMouseMove = function() {
    this._requestMouseMove = false;
    this._movingWithMouse = false;
    $gameTemp.clearDestination();
  };

  Game_Player.prototype.moveByInput = function() {
    if (!this.startedMoving() && this.canMove()) {
      if (this.triggerAction()) return;
      var direction = QMovement.diagonal ? Input.dir8 : Input.dir4;
      if (direction > 0) {
        this.clearMouseMove();
      } else if ($gameTemp.isDestinationValid() && this._requestMouseMove) {
        if (!QMovement.moveOnClick) {
          $gameTemp.clearDestination();
          return;
        }
        var x = $gameTemp.destinationPX();
        var y = $gameTemp.destinationPY();
        return this.moveByMouse(x, y);
      }
      if (Imported.QInput && Input.preferGamepad() && QMovement.offGrid) {
        this.moveWithAnalog();
      } else {
        if ([4, 6].contains(direction)) {
          this.moveInputHorizontal(direction);
        } else if ([2, 8].contains(direction)) {
          this.moveInputVertical(direction);
        } else if ([1, 3, 7, 9].contains(direction) && QMovement.diagonal) {
          this.moveInputDiagonal(direction);
        }
      }
    }
  };

  Game_Player.prototype.moveInputHorizontal = function(dir) {
    this.moveStraight(dir);
  };

  Game_Player.prototype.moveInputVertical = function(dir) {
    this.moveStraight(dir);
  };

  Game_Player.prototype.moveInputDiagonal = function(dir) {
    var diag = {
      1: [4, 2],   3: [6, 2],
      7: [4, 8],   9: [6, 8]
    };
    this.moveDiagonally(diag[dir][0], diag[dir][1]);
  };

  Game_Player.prototype.moveWithAnalog = function() {
    var horz = Input._dirAxesA.x;
    var vert = Input._dirAxesA.y;
    if (horz === 0 && vert === 0) return;
    var radian = Math.atan2(vert, horz);
    radian += radian < 0 ? Math.PI * 2 : 0;
    this.moveRadian(radian);
  };

  Game_Player.prototype.update = function(sceneActive) {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    var wasMoving = this.isMoving();
    this.updateDashing();
    if (sceneActive) {
      this.moveByInput();
    }
    Game_Character.prototype.update.call(this);
    this.updateScroll(lastScrolledX, lastScrolledY);
    this.updateVehicle();
    if (!this.startedMoving()) this.updateNonmoving(wasMoving);
    this._followers.update();
  };

  Game_Player.prototype.updateNonmoving = function(wasMoving) {
    if (!$gameMap.isEventRunning()) {
      if (wasMoving) {
        if (this._freqCount >= this.freqThreshold()) {
          $gameParty.onPlayerWalk();
        }
        this.checkEventTriggerHere([1,2]);
        if ($gameMap.setupStartingEvent()) return;
      }
      if (this.triggerAction()) return;
      if (wasMoving) {
        if (this._freqCount >= this.freqThreshold()) {
          this.updateEncounterCount();
          this._freqCount = 0;
        }
      } else if (!this.isMoving() && !this._movingWithMouse) {
        $gameTemp.clearDestination();
      }
    }
  };

  Game_Player.prototype.updateDashing = function() {
    if (this.startedMoving()) return;
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
      this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
    } else {
      this._dashing = false;
    }
  };

  Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
      var collider = this.collider('interaction');
      var x1 = this._px;
      var y1 = this._py;
      collider.moveTo(x, y);
      var events = ColliderManager.getCharactersNear(collider, (function(chara) {
        if (chara.constructor === Game_Event && !chara._erased) {
          return chara.collider('interaction').intersects(collider);
        }
        return false;
      }).bind(this))
      collider.moveTo(x1, y1);
      if (events.length === 0) {
        events = null;
        return;
      }
      var cx = this.cx();
      var cy = this.cy();
      events.sort(function(a, b) {
        return a.pixelDistanceFrom(cx, cy) - b.pixelDistanceFrom(cx, cy);
      })
      var event = events.shift();
      while (true) {
        if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
          event.start();
        }
        if (events.length === 0 || $gameMap.isAnyEventStarting()) {
          break;
        }
        event = events.shift();
      }
      events = null;
    }
  };

  Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
      this.startMapEvent(this.collider('interaction').x, this.collider('interaction').y, triggers, false);
    }
  };

  Game_Player.prototype.checkEventTriggerThere = function(triggers, x2, y2) {
    if (this.canStartLocalEvents()) {
      var direction = this.direction();
      var x1 = this.collider('interaction').x;
      var y1 = this.collider('interaction').y;
      x2 = x2 || $gameMap.roundPXWithDirection(x1, direction, this.moveTiles());
      y2 = y2 || $gameMap.roundPYWithDirection(y1, direction, this.moveTiles());
      this.startMapEvent(x2, y2, triggers, true);
      if (!$gameMap.isAnyEventStarting()) {
        return this.checkCounter(triggers);
      }
    }
  };

  Game_Player.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()) {
      var dx = $gameTemp.destinationPX() - this.cx();
      var dy = $gameTemp.destinationPY() - this.cy();
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? 2 * Math.PI : 0;
      var dir = this.radianToDirection(radian, true);
      var horz = dir;
      var vert = dir;
      if ([1, 3, 7, 9].contains(dir)) {
        if (dir === 1 || dir === 7) horz = 4;
        if (dir === 1 || dir === 3) vert = 2;
        if (dir === 3 || dir === 9) horz = 6;
        if (dir === 7 || dir === 9) vert = 8;
      }
      var dist = this.pixelDistanceFrom($gameTemp.destinationPX(), $gameTemp.destinationPY());
      if (dist <= QMovement.tileSize) {
        var x1 = $gameMap.roundPXWithDirection(this._px, horz, this.moveTiles());
        var y1 = $gameMap.roundPYWithDirection(this._py, vert, this.moveTiles());
        this.startMapEvent(x1, y1, [0, 1, 2], true);
        if (!$gameMap.isAnyEventStarting()) {
          if (this.checkCounter([0, 1, 2], $gameTemp.destinationPX(), $gameTemp.destinationPY())) {
            this.clearMouseMove();
            this.setDirection(dir);
            return true;
          }
        } else {
          this.clearMouseMove();
          this.setDirection(dir);
          return true;
        }
      }
    }
    return false;
  };

  Game_Player.prototype.checkCounter = function(triggers, x2, y2) {
    var direction = this.direction();
    var x1 = this._px;
    var y1 = this._py;
    x2 = x2 || $gameMap.roundPXWithDirection(x1, direction, this.moveTiles());
    y2 = y2 || $gameMap.roundPYWithDirection(y1, direction, this.moveTiles());
    var collider = this.collider('interaction');
    collider.moveTo(x2, y2);
    var counter;
    ColliderManager.getCollidersNear(collider, function(tile) {
      if (!tile.isTile) return false;
      if (tile.isCounter && tile.intersects(collider)) {
        counter = tile;
        return 'break';
      }
      return false;
    })
    collider.moveTo(x1, y1);
    if (counter) {
      if ([4, 6].contains(direction)) {
        var dist = Math.abs(counter.center.x - collider.center.x);
        dist += collider.width;
      }  else if ([8, 2].contains(direction)) {
        var dist = Math.abs(counter.center.y - collider.center.y);
        dist += collider.height;
      }
      var x3 = $gameMap.roundPXWithDirection(x1, direction, dist);
      var y3 = $gameMap.roundPYWithDirection(y1, direction, dist);
      return this.startMapEvent(x3, y3, triggers, true);
    }
    return false;
  };

  Game_Player.prototype.airshipHere = function() {
    // TODO
    return false;
  };

  Game_Player.prototype.shipBoatThere = function(x2, y2) {
    // TODO
    return false;
  };

  // TODO create follower support addon
  Game_Player.prototype.moveStraight = function(d, dist) {
    Game_Character.prototype.moveStraight.call(this, d, dist);
  };

  Game_Player.prototype.moveDiagonally = function(horz, vert) {
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
  };
})();

//-----------------------------------------------------------------------------
// Game_Event

(function() {
  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this.reloadColliders();
    this._randomDir = null;
  };

  Game_Event.prototype.defaultColliderConfig = function() {
    return QMovement.eventCollider;
  };

  Game_Event.prototype.updateStop = function() {
    if (this._locked) {
      this._freqCount = this.freqThreshold();
      this.resetStopCount();
    }
    Game_Character.prototype.updateStop.call(this);
    if (!this.isMoveRouteForcing()) {
      this.updateSelfMovement();
    }
  };

  Game_Event.prototype.updateSelfMovement = function() {
    if (this.isNearTheScreen() && this.canMove()) {
      if (this.checkStop(this.stopCountThreshold())) {
        this._stopCount = this._freqCount = 0;
      }
      if (this._freqCount < this.freqThreshold()) {
        switch (this._moveType) {
        case 1:
          this.moveTypeRandom();
          break;
        case 2:
          this.moveTypeTowardPlayer();
          break;
        case 3:
          this.moveTypeCustom();
          break;
        }
      }
    }
  };

  // TODO stop random dir from reseting every frame if event can't move
  Game_Event.prototype.moveTypeRandom = function() {
    if (this._freqCount === 0 || !this._randomDir) {
      this._randomDir = 2 * (Math.randomInt(4) + 1);
    }
    if (!this.canPixelPass(this.px, this.py, this._randomDir)) {
      this._randomDir = 2 * (Math.randomInt(4) + 1);
    }
    this.moveStraight(this._randomDir);
  };

  Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (!$gameMap.isEventRunning()) {
      if (this._trigger === 2 && !this.isJumping() && this.isNormalPriority()) {
        var collider = this.collider('collision');
        var prevX = collider.x;
        var prevY = collider.y;
        collider.moveTo(x, y);
        var collided = false;
        ColliderManager.getCharactersNear(collider, (function(chara) {
          if (chara.constructor !== Game_Player) return false;
          collided = chara.collider('collision').intersects(collider);
          return 'break';
        }).bind(this));
        collider.moveTo(prevX, prevY);
        if (collided) {
          this._stopCount = 0;
          this._freqCount = this.freqThreshold();
          this.start();
        }
      }
    }
  };
})();

//-----------------------------------------------------------------------------
// Scene_Map

(function() {
  Input.keyMapper[121] = 'f10';

  var Alias_Scene_Map_updateMain = Scene_Map.prototype.updateMain;
  Scene_Map.prototype.updateMain = function() {
    Alias_Scene_Map_updateMain.call(this);
    var key = Imported.QInput ? '#f10' : 'f10';
    if ($gameTemp.isPlaytest() && Input.isTriggered(key)) {
      ColliderManager.toggle();
    }
    ColliderManager.update();
  };

  Scene_Map.prototype.processMapTouch = function() {
    if ( $gamePlayer.canClick() && TouchInput.isTriggered() || this._touchCount > 0) {
      if (TouchInput.isPressed()) {
        if (this._touchCount === 0 || this._touchCount >= 15) {
          var x = $gameMap.canvasToMapPX(TouchInput.x);
          var y = $gameMap.canvasToMapPY(TouchInput.y);
          if (!QMovement.offGrid) {
            var ox  = x % QMovement.tileSize;
            var oy  = y % QMovement.tileSize;
            x += QMovement.tileSize / 2 - ox;
            y += QMovement.tileSize / 2 - oy;
          }
          if (!TouchInput.isMousePressed()) {
            $gameTemp.setIsMapTouched(true);
          }
          $gameTemp.setPixelDestination(x, y);
          $gamePlayer.requestMouseMove();
        }
        this._touchCount++;
      } else {
        this._touchCount = 0;
        $gameTemp.setIsMapTouched(false);
      }
    }
  };
})();

//-----------------------------------------------------------------------------
// Sprite_Collider

function Sprite_Collider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_Collider.prototype = Object.create(Sprite.prototype);
  Sprite_Collider.prototype.constructor = Sprite_Collider;

  Sprite_Collider.prototype.initialize = function(collider, duration) {
    Sprite.prototype.initialize.call(this);
    this.z = 7;
    this._duration = duration || 0;
    this._color = collider.color || '#ff0000';
    this.setupCollider(collider);
    this.checkChanges();
  };

  Sprite_Collider.prototype._setupCollider = function(collider) {
    this._collider = collider;
    this.bitmap = new Bitmap(collider.width, collider.height);
    this.drawCollider();
  };

  Sprite_Collider.prototype.setupCollider = function(collider) {
    this._collider = collider;
    var isNew = false;
    if (!this._colliderSprite) {
      this._colliderSprite = new PIXI.Graphics();
      isNew = true;
    }
    this.drawCollider();
    if (isNew) {
      this.addChild(this._colliderSprite);
    }
  };

  Sprite_Collider.prototype.drawCollider = function() {
    var collider = this._collider;
    this._colliderSprite.clear();
    var color = this._color.replace('#', '');
    color = parseInt(color, 16);
    this._colliderSprite.beginFill(color);
    if (collider.isCircle()) {
      var radiusX = collider.radiusX;
      var radiusY = collider.radiusY;
      this._colliderSprite.drawEllipse(0, 0, radiusX, radiusY);
      this._colliderSprite.rotation = collider._radian;
    } else {
      this._colliderSprite.drawPolygon(collider._baseVertices);
    }
    this._colliderSprite.endFill();
  };

  Sprite_Collider.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.checkChanges();
    if (this._duration > 0 || this._collider.kill) {
      this.updateDecay();
    }
  };

  Sprite_Collider.prototype.checkChanges = function() {
    this.alpha = this._collider._isHidden ? 0 : 1;
    this.x = this._collider.x + this._collider.ox;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._collider.y + this._collider.oy;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
    if (this._cachedw !== this._collider.width ||
        this._cachedh !== this._collider.height) {
      this._cachedw = this._collider.width;
      this._cachedh = this._collider.height;
      this.drawCollider();
    }
    this._colliderSprite.z = this.z;
    this._colliderSprite.alpha = this.alpha;
  };

  Sprite_Collider.prototype.updateDecay = function() {
    this._duration--;
    if (this._duration <= 0 || this._collider.kill) {
      ColliderManager.removeSprite(this);
      this._collider = null;
    }
  };
})();

//-----------------------------------------------------------------------------
// Sprite_Destination
//
// The sprite for displaying the destination place of the touch input.

(function() {
  Sprite_Destination.prototype.updatePosition = function() {
    var tileWidth = $gameMap.tileWidth();
    var tileHeight = $gameMap.tileHeight();
    var x = $gameTemp.destinationPX();
    var y = $gameTemp.destinationPY();
    this.x = $gameMap.adjustPX(x);
    this.y = $gameMap.adjustPY(y);
  };
})();

//-----------------------------------------------------------------------------
// Spriteset_Map

(function() {
  var Alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    Alias_Spriteset_Map_createLowerLayer.call(this);
    if ($gameTemp.isPlaytest()) {
      this.createColliders();
    }
  };

  Spriteset_Map.prototype.createColliders = function() {
    this.addChild(ColliderManager.container);
    // also get collision map here
  };
})();

