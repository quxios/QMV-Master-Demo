//=============================================================================
// QCamera
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.0')) {
  alert('Error: QCamera requires QPlus 1.4.0 or newer to work.');
  throw new Error('Error: QCamera requires QPlus 1.4.0 or newer to work.');
}

Imported.QCamera = '1.1.3';

//=============================================================================
 /*:
 * @plugindesc <QCamera>
 * Better Camera control
 * @author Quxios  | Version 1.1.3
 *
 * @requires QPlus
 *
 * @param Offset
 * @desc Set the max distance the camera should be from the moving target.
 * Note: Offset gets modified by the characters speed
 * @type Number
 * @decimals 2
 * @min 0
 * @default 0.5
 *
 * @param Shift Y
 * @desc Shifts the center of the camera up or down by a set pixel amount
 * Set to a negative value for up, positive value for down
 * @type Number
 * @min -100
 * @default 0
 *
 * @param Shift X
 * @desc Shifts the center of the camera left or right by a set pixel amount
 * Set to a negative value for left, positive value for right
 * @type Number
 * @min -100
 * @default 0
 *
 * @video https://www.youtube.com/watch?v=MbdXrReYwFw
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * Improved camera control for RPG Maker MV. Lets you scroll diagonally,
 * towards a character, set the time it takes to scroll in frames, change who
 * the camera is following and smooth scrolling which makes the camera 'lag'
 * behind the player or target.
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Scroll**
 * ----------------------------------------------------------------------------
 * Similar to the Event command "Scroll Map". Except you can scroll horz and
 * vert directions are same time, for diagonal scrolls.
 * ~~~
 *  qCamera scroll [List of options]
 * ~~~
 * Possible options:
 *
 * - xX: Set X to the distance, in grid tiles, to travel in x direction
 * - yY: Set Y to the distance, in grid tiles, to travel in y direction
 * - speedX: Set X to the camera speed value. Default: 4
 * - framesX: Set X to the amount of time, in frames, it takes to reach the
 *  scroll. Ignores speedX if frames is set.
 * ----------------------------------------------------------------------------
 * **Scroll to**
 * ----------------------------------------------------------------------------
 * Scroll directly to an event.
 * ~~~
 *  qCamera scrollTo [CHARAID] [List of options]
 * ~~~
 * - CHARAID - The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 *
 * Possible options:
 * - speedX: Set X to the camera speed value. Default: 4
 * - framesX: Set X to the amount of time, in frames, it takes to reach the
 *  scroll. Ignores speedX if frames is set.
 * ----------------------------------------------------------------------------
 * **Focus**
 * ----------------------------------------------------------------------------
 * Set which character the camera should follow.
 * ~~~
 *  qCamera focus [CHARAID] [List of options]
 * ~~~
 * - CHARAID - The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 *
 * Possible options:
 * - speedX: Set X to the camera speed value. (Default is 4)
 * - framesX: Set X to the amount of time, in frames, it takes to reach the
 *  scroll. Ignores speedX if frames is set. Default: 15
 * ----------------------------------------------------------------------------
 * **Bars**
 * ----------------------------------------------------------------------------
 * Draws 2 bars on top and bottom of screen to create a cinematic effect.
 * ~~~
 *  qCamera bars [List of options]
 * ~~~
 *
 * Possible options:
 * - heightX: Set X to the height of the bars in pixels. Default: 0
 * - framesX: Set X to the amount of time, in frames, it takes to reach the
 *  scroll.
 * ============================================================================
 * ## Links
 * ============================================================================
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
 * @tags camera
 */
//=============================================================================

//=============================================================================
// New Classes

function Sprite_Bars() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QCamera

(function() {
  var _PARAMS = QPlus.getParams('<QCamera>', true);
  var _OFFSET = _PARAMS['Offset'];
  var _CAMERAOX = _PARAMS['Shift X'];
  var _CAMERAOY = _PARAMS['Shift Y'];

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qcamera') {
      return this.qCameraCommand(args);
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qCameraCommand = function(args) {
    var cmd = args[0].toLowerCase();
    var args2 = args.slice(1);
    if (cmd === 'scroll') {
      var x = Number(QPlus.getArg(args2, /^x(-?\d+)/i)) || 0;
      var y = Number(QPlus.getArg(args2, /^y(-?\d+)/i)) || 0;
      var speed  = Number(QPlus.getArg(args2, /^speed(\d+)/i)) || 4;
      var frames = QPlus.getArg(args2, /^frames(\d+)/i) || null;
      if (!$gameMap.isScrolling()) {
        this.setWaitMode('scroll');
      }
      $gameMap.startQScroll(x, y, speed, frames);
    }
    if (cmd === 'scrollto') {
      var chara;
      if (args2[0].toLowerCase() === 'this') {
        chara = this.character(0);
      } else {
        chara  = QPlus.getCharacter(args2[0]);
      }
      var speed  = Number(QPlus.getArg(args2, /^speed(\d+)/i)) || 4;
      var frames = Number(QPlus.getArg(args2, /^frames(\d+)/i)) || null;
      if (chara) {
        if (!$gameMap.isScrolling()) {
          this.setWaitMode('scroll');
        }
        $gameMap.scrollTo(chara, speed, frames);
      }
    }
    if (cmd === 'focus') {
      var chara;
      if (args2[0].toLowerCase() === 'this') {
        chara = this.character(0);
      } else {
        chara  = QPlus.getCharacter(args2[0]);
      }
      var speed  = Number(QPlus.getArg(args2, /^speed(\d+)/i)) || null;
      var frames = Number(QPlus.getArg(args2, /^frames(\d+)/i)) || 15;
      if (chara) {
        $gameMap.focusOn(chara, speed, frames);
      }
    }
    if (cmd === 'bars') {
      var height = Number(QPlus.getArg(args2, /^height(\d+)/i));
      var frames = Number(QPlus.getArg(args2, /^frames(\d+)/i));
      $gameMap.requestBars(height, frames);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  Game_Map.prototype.requestBars = function(height, frames) {
    this._requestingBars = {
      height: height || 0,
      frames: frames || 1
    }
  };

  var Alias_Game_Map_setupScroll = Game_Map.prototype.setupScroll;
  Game_Map.prototype.setupScroll = function() {
    Alias_Game_Map_setupScroll.call(this);
    this._scrollTarget = $gamePlayer.charaId();
    this._scrollFrames = null;
    this._scrollRadian = null;
  };

  var Alias_Game_Map_startScroll = Game_Map.prototype.startScroll;
  Game_Map.prototype.startScroll = function(direction, distance, speed) {
    Alias_Game_Map_startScroll.call(this, direction, distance, speed);
    this._scrollFrames = null;
    this._scrollRadian = null;
  };

  Game_Map.prototype.startQScroll = function(distanceX, distanceY, speed, frames) {
    if (Math.abs(distanceX * this.tileWidth()) < 1) distanceX = 0;
    if (Math.abs(distanceY * this.tileHeight()) < 1) distanceY = 0;
    var directionX = distanceX > 0 ? 6 : distanceX < 0 ? 4 : 0;
    var directionY = distanceY > 0 ? 2 : distanceY < 0 ? 8 : 0;
    this._scrollDirection = [directionX, directionY];
    this._scrollRest      = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    this._scrollDistance  = this._scrollRest;
    this._scrollSpeed     = speed || null;
    this._scrollFrames    = frames || null;
    this._scrollRadian    = Math.atan2(distanceY, distanceX);
  };

  Game_Map.prototype.scrollTo = function(chara, speed, frames) {
    var centerX = this.displayCenterX();
    var centerY = this.displayCenterY();
    var distanceX = (chara._realX + 0.5) - centerX;
    var distanceY = (chara._realY + 0.5) - centerY;
    distanceX = Math.floor(distanceX * this.tileWidth()) / this.tileWidth();
    distanceY = Math.floor(distanceY * this.tileHeight()) / this.tileHeight();
    if (Math.abs(distanceX) >= this.width() - 1) {
      distanceX -= this.width() * Math.sign(distanceX);
    }
    if (Math.abs(distanceY) >= this.height() - 1) {
      distanceY -= this.height() * Math.sign(distanceY);
    }
    this.startQScroll(distanceX, distanceY, speed, frames);
  };

  Game_Map.prototype.focusOn = function(target, speed, frames) {
    this.scrollTo(target, speed, frames || 15);
    this._scrollTarget = target.charaId();
  };

  var Alias_Game_Map_scrollDistance = Game_Map.prototype.scrollDistance;
  Game_Map.prototype.scrollDistance = function() {
    if (this._scrollFrames !== null) {
      return Math.abs(this._scrollDistance / this._scrollFrames);
    }
    return Alias_Game_Map_scrollDistance.call(this);
  }

  Game_Map.prototype.scrollDistanceX = function() {
    return Math.abs(this.scrollDistance() * Math.cos(this._scrollRadian));
  };

  Game_Map.prototype.scrollDistanceY = function() {
    return Math.abs(this.scrollDistance() * Math.sin(this._scrollRadian));
  };

  var Alias_Game_Map_displayX = Game_Map.prototype.displayX;
  Game_Map.prototype.displayX = function() {
    var x = Alias_Game_Map_displayX.call(this);
    x += _CAMERAOX / this.tileWidth();
    return Math.round(x * this.tileWidth()) / this.tileWidth();
  };

  var Alias_Game_Map_displayY = Game_Map.prototype.displayY;
  Game_Map.prototype.displayY = function() {
    var y = Alias_Game_Map_displayY.call(this);
    y += _CAMERAOY / this.tileHeight();
    return Math.round(y * this.tileHeight()) / this.tileHeight();
  };

  Game_Map.prototype.displayCenterX = function() {
    var half = this.screenTileX() / 2;
    var x = this.displayX() + half;
    x -= _CAMERAOX / this.tileWidth()
    x = this.roundX(x);
    return Math.round(x * this.tileWidth()) / this.tileWidth();
  };

  Game_Map.prototype.displayCenterY = function() {
    var half = this.screenTileY() / 2;
    var y = this.displayY() + half;
    y -= _CAMERAOY / this.tileHeight()
    y = this.roundY(y);
    return Math.round(y * this.tileHeight()) / this.tileHeight();
  };

  var Alias_Game_Map_parallaxOx = Game_Map.prototype.parallaxOx;
  Game_Map.prototype.parallaxOx = function() {
    var ox = Alias_Game_Map_parallaxOy.call(this);
    return ox + _CAMERAOX;
  };

  var Alias_Game_Map_parallaxOy = Game_Map.prototype.parallaxOy;
  Game_Map.prototype.parallaxOy = function() {
    var oy = Alias_Game_Map_parallaxOy.call(this);
    return oy + _CAMERAOY;
  };

  Game_Map.prototype._setDisplayPos = function(x, y) {
    // leaving this here, since i need to fix this function
  };

  Game_Map.prototype.adjustX = function(x) {
    if (this.isLoopHorizontal() && x < this.displayX() -
    (this.width() - this.screenTileX()) / 2) {
      return x - this.displayX() + $dataMap.width;
    } else {
      return x - this.displayX();
    }
  };

  Game_Map.prototype.adjustY = function(y) {
    if (this.isLoopVertical() && y < this.displayY() -
    (this.height() - this.screenTileY()) / 2) {
      return y - this.displayY() + $dataMap.height;
    } else {
      return y - this.displayY();
    }
  };

  Game_Map.prototype.canvasToMapX = function(x) {
    var tileWidth = this.tileWidth();
    var originX = this.displayX() * tileWidth;
    var mapX = Math.floor((originX + x) / tileWidth);
    return this.roundX(mapX);
  };

  Game_Map.prototype.canvasToMapY = function(y) {
    var tileHeight = this.tileHeight();
    var originY = this.displayY() * tileHeight;
    var mapY = Math.floor((originY + y) / tileHeight);
    return this.roundY(mapY);
  };

  var Alias_Game_Map_doScroll = Game_Map.prototype.doScroll;
  Game_Map.prototype.doScroll = function(direction, distance) {
    if (direction.constructor === Array) {
      if (direction[0] === 4) {
        this.scrollLeft(this.scrollDistanceX());
      } else if (direction[0] === 6) {
        this.scrollRight(this.scrollDistanceX());
      }
      if (direction[1] === 2) {
        this.scrollDown(this.scrollDistanceY());
      } else if (direction[1] === 8) {
        this.scrollUp(this.scrollDistanceY());
      }
    } else {
      Alias_Game_Map_doScroll.call(this, direction, distance);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Character

  var Alias_Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    Alias_Game_CharacterBase_setPosition.call(this, x, y);
    this._lastX = this._realX;
    this._lastY = this._realY;
  };

  var Alias_Game_CharacterBase_copyPosition = Game_CharacterBase.prototype.copyPosition;
  Game_CharacterBase.prototype.copyPosition = function(character) {
    Alias_Game_CharacterBase_copyPosition.call(this, character);
    this._lastX = this._realX;
    this._lastY = this._realY;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    Alias_Game_CharacterBase_update.call(this);
    if ($gameMap._scrollTarget === this.charaId()) {
      if (_OFFSET === 0) {
        this.updateNormalScroll(lastScrolledX, lastScrolledY);
      } else {
        this.updateQScroll();
      }
    }
  };

  Game_CharacterBase.prototype.updateQScroll = function() {
    if ($gameMap.isScrolling()) return;
    var x1 = this._lastX;
    var y1 = this._lastY;
    var x2 = this._realX;
    var y2 = this._realY;
    var dx = $gameMap.deltaX(x2, x1);
    var dy = $gameMap.deltaY(y2, y1);
    if (dx !== 0 || dy !== 0) {
      this._lastX = x2;
      this._lastY = y2;
      var frames = _OFFSET / 0.0625; // 0.0625 is the distance per frame at speed 4
      $gameMap.scrollTo(this, null, Math.round(frames) || 1);
    }
  };

  Game_CharacterBase.prototype.updateNormalScroll = function(lastScrolledX, lastScrolledY) {
    var x1 = lastScrolledX;
    var y1 = lastScrolledY;
    var x2 = this.scrolledX();
    var y2 = this.scrolledY();
    // old updateScroll
    if (y2 > y1 && y2 > this.centerY()) {
      $gameMap.scrollDown(y2 - y1);
    }
    if (x2 < x1 && x2 < this.centerX()) {
      $gameMap.scrollLeft(x1 - x2);
    }
    if (x2 > x1 && x2 > this.centerX()) {
      $gameMap.scrollRight(x2 - x1);
    }
    if (y2 < y1 && y2 < this.centerY()) {
      $gameMap.scrollUp(y1 - y2);
    }
  };

  Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    // removed
  };

  Game_Player.prototype.center = function(x, y) {
    return $gameMap.scrollTo(this, null, 1);
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map

  var Alias_Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
  Spriteset_Map.prototype.createUpperLayer = function() {
    this.createBars();
    Alias_Spriteset_Map_createUpperLayer.call(this);
  };

  Spriteset_Map.prototype.createBars = function() {
    this._bars = new Sprite_Bars();
    this.addChild(this._bars);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Bars

  Sprite_Bars.prototype = Object.create(Sprite.prototype);
  Sprite_Bars.prototype.constructor = Sprite_Base;

  Sprite_Bars.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(Graphics.width, Graphics.height);
    this.x = Graphics.width / 2;
    this.y = Graphics.height / 2;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._barHeight = 0;
    this._newBarHeight = 0;
    this._barSpeed = 0;
  };

  Sprite_Bars.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if ($gameMap._requestingBars) {
      this.startBar();
    }
    if (this._barHeight !== this._newBarHeight) {
      if (this._newBarHeight > this._barHeight) {
        this._barHeight = Math.min(this._barHeight + this._barSpeed, this._newBarHeight);
      } else if (this._newBarHeight < this._barHeight) {
        this._barHeight = Math.max(this._barHeight - this._barSpeed, this._newBarHeight);
      }
      this.drawBar();
    }
  };

  Sprite_Bars.prototype.startBar = function() {
    this._newBarHeight = $gameMap._requestingBars.height;
    var dh = Math.abs(this._newBarHeight - this._barHeight);
    this._barSpeed = dh / $gameMap._requestingBars.frames;
    $gameMap._requestingBars = null;
  };

  Sprite_Bars.prototype.drawBar = function() {
    this.bitmap.clear();
    this.bitmap.fillRect(0, 0, Graphics.width, this._barHeight, '#000000');
    var y = Graphics.height - this._barHeight;
    this.bitmap.fillRect(0, y, Graphics.width, this._barHeight, '#000000');
  };

})()
