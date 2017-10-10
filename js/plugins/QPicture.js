//=============================================================================
// QPicture
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.4')) {
  alert('Error: QPicture requires QPlus 1.4.4 or newer to work.');
  throw new Error('Error: QPicture requires QPlus 1.4.4 or newer to work.');
}

Imported.QPicture = '1.1.0';

//=============================================================================
 /*:
 * @plugindesc <QPicture>
 * Adds additional features to Pictures
 * @author Quxios  | Version 1.1.0
 *
 * @requires QPlus
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * Adds additional features to Pictures. You can easily apply mouse events (
 * onClick, onRightClick, onMouseEnter, onMouseExit, onMouseOver, onMouseOut)
 * to pictures and have a common event run or change a value of a switch. You
 * can also apply easing effects to a pictures movement, scaling or opacity
 * change.
 * ============================================================================
 * ## Plugin commands
 * ============================================================================
 * **Mouse Events**
 * ----------------------------------------------------------------------------
 * ~~~
 *  qPicture [PICID] [MOUSEEVENT] [HANDLER] [ARG1]
 * ~~~
 * PICID - The ID (Picture Number) of the picture to apply this to
 *
 * MOUSEEVENT - The mouse event to add to this picture, can be:
 *  - onClick: Runs when the picture is left clicked
 *  - onRightClick: Runs when the picture is right clicked
 *  - onMouseEnter: Runs when the mouse enters the picture
 *  - onMouseExit: Runs when the mouse moves off the picture
 *  - onMouseOver: Runs when the mouse is over the picture (for performance reasons
 *  may be best to use onMouseEnter instead)
 *  - onMouseOut: Runs when the mouse isn't over the picture (for performance reasons
 *  may be best to use onMouseExit instead)
 *
 * HANDLER - What to do when the mouse event runs, can be:
 *  - switchX: Where X is the switch ID, changes a switchs value to what is set
 *  on ARG1
 *  - ceX: Where X is the common event ID, runs a common event
 *  - clear: Removes the handler that assigned to this picture
 *
 * ARG1 - Only used when handler is `switchX`, set this to:
 *  - true: Makes the switch true whenever this mouse event runs
 *  - false: Makes the switch false whenever this mouse event runs
 *  - toggle: Toggles the switch value whenever this mouse event runs
 *
 * ----------------------------------------------------------------------------
 * **Click Through Alpha**
 * ----------------------------------------------------------------------------
 * Some of your pictures may have alpha (transparent) areas and you don't want
 * those areas to be able to trigger mouse events. So you can disable the alpha
 * areas per picture. Note that enabling this can impact performance!
 * ~~~
 *  qPicture [PICID] alpha [TRUE or FALSE]
 * ~~~
  * PICID - The ID (Picture Number) of the picture to apply this to
  *
  * TRUE or FALSE - Set to true to click through alpha, set to false to
  *  go back to default behavior.
 * ----------------------------------------------------------------------------
 * **Ease**
 * ----------------------------------------------------------------------------
 * ~~~
 *  qPicture [PICID] ease [TYPE] [MODE]
 * ~~~
 * PICID - The ID (Picture Number) of the picture to apply this to
 *
 * TYPE - What to apply this easing to, can be:
 *  - move
 *  - scale
 *  - opacity
 *
 * MODE - The easing mode (Default: linear)
 *  - linear
 *  - easeIn
 *  - easeOut
 *  - easeInOut
 * ============================================================================
 * ## Examples
 * ============================================================================
 * ~~~
 *  qPicture 1 onClick ce1
 * ~~~
 * Runs common event 1 whenever you click on picture 1
 *
 * ~~~
 *  qPicture 1 alpha true
 * ~~~
 * Will ignore the transparent areas in picture 1
 *
 * ~~~
 *  qPicture 2 onMouseEnter switch1 true
 *  qPicture 2 onMouseExit switch1 false
 * ~~~
 * Sets switch 1 to true when the mouse is over the picture, and sets the switch
 * to false when it isn't.
 * Note: You can also use `onMouseOver` and `onMouseOut` here but `Enter` and `Exit`
 * perform better as they only run once when the mouse first enters or exits while
 * `Over` and `Out` run continuously.
 *
 * ~~~
 *  qPicture 1 ease move easeInOut
 * ~~~
 * Picture 1 will `easeInOut` whenever you move it now
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QPicture
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
 * @tags
 */
//=============================================================================

//=============================================================================
// QButton "Fake" class
// contains functions that will be passed into real classes

var QButton = {};
var QEase;

//=============================================================================
// QPicture

(function() {
  //-----------------------------------------------------------------------------
  // QButton

  QButton.initializeButton = function() {
    this._throughAlpha = false;
    this._overTick = 0;
    this._doubleClickTimer = 0;
    this._clickHandler = null;
    this._doubleClickHandler = null;
    this._rightClickHandler = null;
    this._mouseEnterHandler = null;
    this._mouseExitHandler = null;
    this._mouseOverHandler = null;
    this._mouseOutHandler = null;
  };

  QButton.setClick = function(method) {
    this._clickHandler = method;
  };

  QButton.setRightClick = function(method) {
    this._rightClickHandler = method;
  };

  QButton.setMouseEnter = function(method) {
    this._mouseEnterHandler = method;
  };

  QButton.setMouseExit = function(method) {
    this._mouseExitHandler = method;
  };

  QButton.setMouseOver = function(method) {
    this._mouseOverHandler = method;
  };

  QButton.setMouseOut = function(method) {
    this._mouseOutHandler = method;
  };

  QButton.callClickHandler = function() {
    if (this._clickHandler) {
      this._clickHandler();
    }
  };

  QButton.callRightClickHandler = function() {
    if (this._rightClickHandler) {
      this._rightClickHandler();
    }
  };

  QButton.callMouseEnterHandler = function() {
    if (this._mouseEnterHandler) {
      this._mouseEnterHandler();
    }
  };

  QButton.callMouseExitHandler = function() {
    if (this._mouseExitHandler) {
      this._mouseExitHandler();
    }
  };

  QButton.callMouseOverHandler = function() {
    if (this._mouseOverHandler) {
      this._mouseOverHandler();
    }
  };

  QButton.callMouseOutHandler = function() {
    if (this._mouseOutHandler) {
      this._mouseOutHandler();
    }
  };

  QButton.isButton = function() {
    return true;
  };

  QButton.updateButton = function() {
    if (!this.isButton()) return;
    this.processTouch();
  };

  QButton.processTouch = function() {
    if (this.isActive()) {
      if (this.isTouched()) {
        if (this._overTick === 0) {
          this.callMouseEnterHandler();
        } else {
          this.callMouseOverHandler();
        }
        if (TouchInput.isTriggered()) {
          this.callClickHandler();
        }
        if (TouchInput.isCancelled()) {
          this.callRightClickHandler();
        }
        this._overTick++;
      } else {
        if (this._overTick !== 0) {
          this.callMouseExitHandler();
        } else {
          this.callMouseOutHandler();
        }
        this._overTick = 0;
      }
    }
  };

  QButton.isActive = Sprite_Button.prototype.isActive;

  QButton.isTouched = function() {
    var w = this.width * this.scale.x;
    var h = this.width * this.scale.y;
    var x1 = TouchInput.x;
    var y1 = TouchInput.y;
    var x2 = this.x - w * this.anchor.x;
    var y2 = this.y - h * this.anchor.y;
    var insideRect = x1 >= x2 && y1 >= y2 && x1 < x2 + w && y1 < y2 + h;
    if (this._throughAlpha) {
      if (!insideRect || !this.bitmap) {
        return false;
      }
      var x3 = (x1 - x2) / this.scale.x;
      var y3 = (y1 - y2) / this.scale.y;
      return this.bitmap.getAlphaPixel(x3, y3) != 0;
    }
    return insideRect;
  };

  //-----------------------------------------------------------------------------
  // QEase

  QEase = function(mode, start, delta, currentTime, duration) {
    var dt = currentTime / duration;
    switch (mode) {
      case 'easeIn': {
        return start + delta * dt * dt;
      }
      case 'easeOut': {
        return start + -delta * dt * (dt - 2);
      }
      case 'easeInOut': {
        currentTime /= duration / 2;
        if (currentTime < 1) {
          return start + delta / 2 * currentTime * currentTime;
        } else {
          currentTime -= 1;
          return start + -delta / 2 * (currentTime * (currentTime - 2) - 1);
        }
      }
      case 'linear':
      default: {
        return start + delta * dt;
      }
    }
    return end;
  }

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qpicture') {
      this.qPictureCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPictureCommand = function(args) {
    var picId = args.shift();
    var pic = $gameScreen.picture(Number(picId));
    if (!pic) return;
    var cmd = args.shift().toLowerCase();
    if (/^on/.test(cmd)) {
      if (args[0].toLowerCase() === 'clear') {
        pic.setMouseHandler(cmd, null);
        return;
      }
      var switchId = /^switch(\d+)/.exec(args[0]);
      var ceId = /^ce(\d+)/.exec(args[0]);
      if (switchId) {
        pic.setMouseHandler(cmd, function(id, value) {
          if (value === 'toggle') {
            var curr = $gameSwitches.value(id);
            $gameSwitches.setValue(id, !curr);
          } else {
            $gameSwitches.setValue(id, value === 'true');
          }
        }.bind(pic, Number(switchId[1]), args[1].toLowerCase()));
      } else if (ceId) {
        pic.setMouseHandler(cmd, function(id) {
          $gameTemp.reserveCommonEvent(id);
        }.bind(pic, Number(ceId[1])));
      }
      return;
    }
    if (cmd === 'ease') {
      var type = args[0].toLowerCase();
      var mode = args[1].toLowerCase();
      pic.setEase(type, mode);
    }
    if (cmd === 'alpha') {
      pic.setThroughAlpha(args[0].toLowerCase() === 'true');
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Picture

  var Alias_Game_Picture_initialize = Game_Picture.prototype.initialize;
  Game_Picture.prototype.initialize = function() {
    Alias_Game_Picture_initialize.call(this);
    this._ease = {
      move: 'linear',
      scale: 'linear',
      opacity: 'linear'
    }
    this._throughAlpha = false;
  };

  Game_Picture.prototype.setMouseHandler = function(type, handler) {
    switch (type.toLowerCase()) {
      case 'onclick': {
        this._clickHandler = handler;
        break;
      }
      case 'onrightclick': {
        this._rightClickHandler = handler;
        break;
      }
      case 'onmouseenter': {
        this._mouseEnterHandler = handler;
        break;
      }
      case 'onmouseexit': {
        this._mouseExitHandler = handler;
        break;
      }
      case 'onmouseover': {
        this._mouseOverHandler = handler;
        break;
      }
      case 'onmouseout': {
        this._mouseOutHandler = handler;
        break;
      }
    }
  };

  Game_Picture.prototype.setEase = function(type, easeMode) {
    this._ease[type] = easeMode;
  };

  Game_Picture.prototype.setThroughAlpha = function(bool) {
    this._throughAlpha = bool;
  };

  var Alias_Game_Picture_move = Game_Picture.prototype.move;
  Game_Picture.prototype.move = function() {
    Alias_Game_Picture_move.apply(this, arguments);
    this._initialX = this._x;
    this._initialY = this._y;
    this._initialScaleX = this._scaleX;
    this._initialScaleY = this._scaleY;
    this._initialOpacity = this._opacity;
    this._durationT = arguments[7];
  };

  Game_Picture.prototype.updateMove = function() {
    if (this._duration > 0) {
      var d = this._duration;
      var currT = this._durationT - this._duration + 1;
      var dx = this._targetX - this._initialX;
      var dy = this._targetY - this._initialY;
      this._x = QEase(this._ease.move, this._initialX, dx, currT, this._durationT);
      this._y = QEase(this._ease.move, this._initialY, dy, currT, this._durationT);
      var dsx = this._targetScaleX - this._initialScaleX;
      var dsy = this._targetScaleY - this._initialScaleY;
      this._scaleX  = QEase(this._ease.scale, this._initialScaleX, dsx, currT, this._durationT);
      this._scaleY  = QEase(this._ease.scale, this._initialScaleY, dsy, currT, this._durationT);
      var da = this._targetOpacity - this._initialOpacity;
      this._opacity = QEase(this._ease.opacity, this._initialOpacity, da, currT, this._durationT);
      this._duration--;
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_Picture

  QPlus.mixin(Sprite_Picture.prototype, QButton);

  var Alias_Sprite_Picture_initialize = Sprite_Picture.prototype.initialize;
  Sprite_Picture.prototype.initialize = function(pictureId) {
    Alias_Sprite_Picture_initialize.call(this, pictureId);
    this.initializeButton();
  };

  var Alias_Sprite_Picture_updateOther = Sprite_Picture.prototype.updateOther;
  Sprite_Picture.prototype.updateOther = function() {
    Alias_Sprite_Picture_updateOther.call(this);
    this.updateQPicture();
    this.updateButton();
  };

  Sprite_Picture.prototype.updateQPicture = function() {
    var picture = this.picture();
    this._throughAlpha = picture._throughAlpha;
    this.setClick(picture._clickHandler);
    this.setRightClick(picture._rightClickHandler);
    this.setMouseEnter(picture._mouseEnterHandler);
    this.setMouseExit(picture._mouseExitHandler);
    this.setMouseOver(picture._mouseOverHandler);
    this.setMouseOut(picture._mouseOutHandler);
  };

  //-----------------------------------------------------------------------------
  // Scene_Map

  var Alias_Scene_Map_updateMouseInsideWindow = Scene_Map.prototype.updateMouseInsideWindow;
  Scene_Map.prototype.updateMouseInsideWindow = function() {
    Alias_Scene_Map_updateMouseInsideWindow.call(this);
    if (TouchInput.insideWindow) return;
    var inside = false;
    var sprites = this._spriteset._pictureContainer.children;
    for (var i = 0; i < sprites.length; i++) {
      if (sprites[i].visible && sprites[i].isTouched()) {
        inside = true;
        break;
      }
    }
    TouchInput.insideWindow = inside;
  };
})()
