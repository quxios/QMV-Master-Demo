//=============================================================================
// QTouch
//=============================================================================

var Imported = Imported || {};
Imported.QTouch = '1.1.2';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.0')) {
  alert('Error: QTouch requires QPlus 1.4.0 or newer to work.');
  throw new Error('Error: QTouch requires QPlus 1.4.0 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QTouch>
 * Better mouse handling for MV
 * @author Quxios  | Version 1.1.2
 *
 * @video https://youtu.be/2UrazG-XRxw
 *
 * @param Mouse Decay
 * @desc Set the duration until mouse cursor is hidden while its not moving.
 * Set to 0 to disable      Value is in frames
 * @type Number
 * @min 0
 * @default 60
 *
 * @param Default Cursor
 * @desc Set the filepath to the image to use for the default cursor.
 * Leave blank to use default cursor.
 * @default
 *
 * @param Pointer Cursor
 * @desc Set the filepath to the image to use for the pointer cursor.
 * Leave blank to use pointer cursor.
 * @default
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin extands the mouse features of MV to make it feel more natural.
 * You are able to change the image used for the cursor. Cursor will change
 * to pointing cursor when hovering over a selectable item. You can make
 * the cursor hide when it's inactive for X frames. Window choices will
 * get selected / highlighted when the mouse is over them. And clicking on
 * them once will run that choice.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Just install this plugin and configure the plugin parameters.
 *
 * The filepath is from the base directory. So if your cursor is in the system
 * folder your path should be something like:
 * ~~~
 *  img/system/myCursor.png
 * ~~~
 * ============================================================================
 * ## Plugin commands
 * ============================================================================
 * To change the cursors image:
 * ~~~
 *  qTouch change TYPE FILE
 * ~~~
 * - TYPE: Set to 'default' or 'pointer'
 * - FILE: The file path to the cursor from the base directory
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QTouch
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
 * @tags touch
 */
//=============================================================================

//-----------------------------------------------------------------------------
// New Classes

function Sprite_QButton() {
  this.initialize.apply(this, arguments);
}

//-----------------------------------------------------------------------------
// QTouch

(function() {
  var _PARAMS = QPlus.getParams('<QTouch>', true);
  var _MOUSEDECAY = _PARAMS['Mouse Decay'];
  var _CURSORIMGS = {
    default: _PARAMS['Default Cursor'],
    pointer: _PARAMS['Pointer Cursor']
  }

  //-----------------------------------------------------------------------------
  // Game_Temp

  var Alias_Game_Temp_initialize = Game_Temp.prototype.initialize;
  Game_Temp.prototype.initialize = function() {
    Alias_Game_Temp_initialize.call(this);
    this._CURSOROVERRIDES = {};
  };

  //-----------------------------------------------------------------------------
  // TouchInput

  var Alias_TouchInput_clear = TouchInput.clear;
  TouchInput.clear = function() {
    Alias_TouchInput_clear.call(this);
    this._cursor = 'default';
    this._cursorDecay = _MOUSEDECAY;
    this._cursorHidden = false;
    this.setCursor();
  };

  var Alias_TouchInput_update = TouchInput.update;
  TouchInput.update = function() {
    Alias_TouchInput_update.call(this);
    if (_MOUSEDECAY > 0) this.updateCursorDecay();
  };

  TouchInput.updateCursorDecay = function() {
    if (this._cursorDecay > 0) {
      if (this._cursorHidden) {
        this.showCursor();
      }
      this._cursorDecay--;
    } else if (!this._cursorHidden) {
      this.hideCursor();
    }
  };

  var Alias_TouchInput__onMouseMove = TouchInput._onMouseMove;
  TouchInput._onMouseMove = function(event) {
    Alias_TouchInput__onMouseMove.call(this, event);
    this._cursorDecay = _MOUSEDECAY;
  };

  TouchInput.hideCursor = function() {
    this._cursorHidden = true;
    document.body.style.cursor = 'none';
  };

  TouchInput.showCursor = function() {
    this._cursorHidden = false;
    this.setCursor();
  };

  TouchInput.setCursor = function(cursor) {
    if (this._cursor === cursor) return;
    this._cursor = cursor || this._cursor;
    var overrides = $gameTemp ? $gameTemp._CURSOROVERRIDES : {};
    var cursorImg = overrides[this._cursor] || _CURSORIMGS[this._cursor];
    if (cursorImg) {
      document.body.style.cursor = `url('${cursorImg}'), ${this._cursor}`;
    } else {
      document.body.style.cursor = this._cursor;
    }
  };

  TouchInput.changeCursorImg = function(cursor, img) {
    if (!$gameTemp) return;
    $gameTemp._CURSOROVERRIDES[cursor] = img;
    this.setCursor();
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qtouch') {
      return this.qTouchCommand(args);
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qTouchCommand = function(args) {
    var cmd = args.shift().toLowerCase();
    if (cmd === 'change') {
      var type = args.shift().toLowerCase();
      var img = args.join(' ');
      TouchInput.changeCursorImg(type, img);
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Base

  var Alias_Scene_Base_update = Scene_Base.prototype.update;
  Scene_Base.prototype.update = function() {
    Alias_Scene_Base_update.call(this);
    if (this.mouseMoved()) {
      this.updateMouseCursor();
    }
  };

  Scene_Base.prototype.updateMouseCursor = function() {
    var isPointing = false;
    if (this._windowLayer) {
      var windows = this._windowLayer.children;
      for (var i = 0; i < windows.length; i++) {
        if (typeof windows[i].isPointing === 'function' && windows[i].isPointing()) {
          isPointing = true;
          break;
        }
      }
    }
    for (var i = 0; i < this.children.length; i++) {
      if (typeof this.children[i].isPointing === 'function' && this.children[i].isPointing()) {
        isPointing = true;
        break;
      }
    }
    if (isPointing) {
      TouchInput.setCursor('pointer');
    } else {
      TouchInput.setCursor('default');
    }
  };

  Scene_Base.prototype.mouseMoved = function() {
    if (this._oldTouchX !== TouchInput.x || this._oldTouchY !== TouchInput.y) {
      this._oldTouchX = TouchInput.x;
      this._oldTouchY = TouchInput.y;
      return true;
    }
    return false;
  };

  //-----------------------------------------------------------------------------
  // Window_Selectable

  var Alias_Window_Selectable_initialize = Window_Selectable.prototype.initialize;
  Window_Selectable.prototype.initialize = function(x, y, width, height) {
    Alias_Window_Selectable_initialize.call(this, x, y, width, height);
    this._oldTouchX = TouchInput.x;
    this._oldTouchY = TouchInput.y;
    this._isPointing = false;
  };

  Window_Selectable.prototype.isPointing = function() {
    return this.active && this.isTouchedInsideFrame() && this._isPointing;
  };

  Window_Selectable.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
      if (this.isTouchedInsideFrame()) {
        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var hitIndex = this.hitTest(x, y);
        if (hitIndex >= 0 && this.isCursorMovable() && this.mouseMoved()) {
          this._isPointing = true;
          var lastIndex = this.index();
          this.select(hitIndex);
          if (this.index() !== lastIndex) {
            SoundManager.playCursor();
          }
        } else if (hitIndex < 0) {
          if (y < this.padding) {
            this._isPointing = true;
          } else if (y >= this.height - this.padding) {
            this._isPointing = true;
          } else {
            this._isPointing = false;
          }
        }
        if (TouchInput.isTriggered()) {
          if (hitIndex >= 0) {
            if (hitIndex === this.index() && this.isTouchOkEnabled()) {
              this.processOk();
            }
          } else {
            if (y < this.padding) {
              this.cursorUp();
            } else if (y >= this.height - this.padding) {
              this.cursorDown();
            }
          }
        }
      }
      if (TouchInput.isCancelled()) {
        if (this.isCancelEnabled()) {
          this.processCancel();
        }
      }
    }
  };

  Window_Selectable.prototype.mouseMoved = function() {
    if (this._oldTouchX !== TouchInput.x || this._oldTouchY !== TouchInput.y) {
      this._oldTouchX = TouchInput.x;
      this._oldTouchY = TouchInput.y;
      return true;
    }
    return false;
  };

  //-----------------------------------------------------------------------------
  // Sprite_Button

  Sprite_Button.prototype.isPointing = function() {
    return this.isActive() && this.isButtonTouched();
  };
}());
