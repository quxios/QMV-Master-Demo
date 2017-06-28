//=============================================================================
// QPlus
//=============================================================================

var Imported = Imported || {};
Imported.QPlus = '1.4.2';

//=============================================================================
 /*:
 * @plugindesc <QPlus> (Should go above all Q Plugins)
 * Some small changes to MV for easier plugin development.
 * @author Quxios  | Version 1.4.2
 *
 * @param Quick Test
 * @desc Enable quick testing.
 * Set to true or false
 * @type Boolean
 * @default true
 *
 * @param Default Enabled Switches
 * @desc Turns on a list of switches on new game
 * @type switch[]
 * @default []
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin is the core for most of the QPlugins. It also adds a few new
 * functionality to RPG Maker MV to improve it.
 *
 * ============================================================================
 * ## Notetags / Comments
 * ============================================================================
 * **Event retain direction**
 * ----------------------------------------------------------------------------
 * Adding the following to the notes or in a comment will make that event retain
 * its direction when changing pages.
 * ~~~
 *  <retainDir>
 * ~~~
 * This will be ignored if the next page has direction fix enabled
 *
 * ----------------------------------------------------------------------------
 * **No tilemap**
 * ----------------------------------------------------------------------------
 * You can disable the tile map by adding this note to a map
 * ~~~
 *  <noTilemap>
 * ~~~
 * This will replace the tilemap with a simple light weight sprite container.
 * Using this may increase performance. So if you have a map that doesn't use
 * any tiles and is all parallax, then you should considering using this.
 *
 * *Note, there's a chance this may break some plugins if they call functions in
 * the original tilemap class.*
 *
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Random wait between X Y**
 * ----------------------------------------------------------------------------
 * This plugin command will insert a random wait between x and y frames.
 * ~~~
 *  wait X Y
 * ~~~
 * If Y is left empty, it will make a random wait between 0 - X
 *
 * ----------------------------------------------------------------------------
 * **Global Lock**
 * ----------------------------------------------------------------------------
 * This plugin command will 'lock' all characters or certain characters. By
 * locking I mean you can lock their movement, or movement and character
 * animation.
 * ~~~
 *  globalLock LEVEL [CHARACTERS] [options]
 * ~~~
 * - LEVEL: The level of global lock
 *  - 0: clears the global lock
 *  - 1: locks the characters movement
 *  - 2: locks the characters movement and animation
 * - [CHARACTERS] - optional, list of `Character Ids` to apply to or ignore.
 * Seperated by a space.
 *  * CHARAID: The character identifier.
 *   - For player: 0, p, or player
 *   - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *   (replace EVENTID with a number)
 *
 * Possible options:
 *  - only: Will only apply to the characters listed
 *
 * ----------------------------------------------------------------------------
 * **Global lock Examples**
 * ----------------------------------------------------------------------------
 * ~~~
 *  globalLock 2
 * ~~~
 * Will lock all characters movement and animations.
 *
 * ~~~
 *  globalLock 1 0 1 4
 *  globalLock 1 p e1 e4
 *  globalLock 1 player event1 event4
 * ~~~
 * (Note: All 3 are the same, just using a different character id method)
 *
 * Will Lock the movements for all characters except:
 * Player, event 1 and event 4
 *
 * ~~~
 *  globalLock 1 0 1 4 only
 *  globalLock 1 p e1 e4 only
 *  globalLock 1 player event1 event4 only
 * ~~~
 * Will Lock the movements for only these characters:
 * Player, event 1 and event 4
 *
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
 * @tags core, character
 */
//=============================================================================

//=============================================================================
// QPlus Static Class

function QPlus() {
 throw new Error('This is a static class');
}

(function() {
  QPlus._regex = {
    isBoolean: /^(true|false)$/i,
    isString: /^"(.*?)"$/,
    isNumber: /^-?\d+$/,
    isFloat: /^-?\d+\.?\d*$/,
    isPoint: /^\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)$/,
    isArray: /^\[(.*?)\]$/,
    isObj: /^\{(.*?)\}$/
  }

  QPlus.getParams = function(id, convert) {
    var plugin = $plugins.filter(function(p) {
      return p.description.contains(id) && p.status
    });
    var hasDefaults = convert.constructor === Object;
    if (!plugin[0]) hasDefaults ? convert : {};
    var params = Object.assign({}, plugin[0].parameters);
    if (convert) {
      for (var param in params) {
        params[param] = this.stringToType(params[param]);
        if (hasDefaults && convert[param] !== undefined) {
          if (convert[param].constructor !== params[param].constructor) {
            var err = 'Plugin Parameter value error. ' + id + ', Parameter: ' + param;
            err += '\nDefault value will be used.'
            console.warn(err);
            params[param] = convert[param];
          }
        }
      }
    }
    return params;
  };

  QPlus.versionCheck = function(version, targetVersion) {
    version = version.split('.').map(Number);
    targetVersion = targetVersion.split('.').map(Number);
    if (version[0] < targetVersion[0]) {
      return false;
    } else if (version[0] === targetVersion[0] && version[1] < targetVersion[1]) {
      return false;
    } else if (version[1] === targetVersion[1] && version[2] < targetVersion[2]) {
      return false;
    }
    return true;
  };

  /**
   * @static QPlus.makeArgs
   *  Splits a string every space. If words are wrapped in ""s or ''s they
   *  are kept grouped.
   * @param  {String} string
   * @return {Array}
   */
  QPlus.makeArgs = function(string) {
    var args = [];
    var regex = /("?|'?)(.+?)\1(?:\s|$)/g;
    while (true) {
      var match = regex.exec(string);
      if (match) {
        args.push(match[2]);
      } else {
        break;
      }
    }
    return args;
  };

  QPlus.getArg = function(args, regex) {
    var arg = null;
    for (var i = 0; i < args.length; i++) {
      var match = regex.exec(args[i]);
      if (match) {
        if (match.length === 1) {
          arg = true;
        } else {
          arg = match[match.length - 1];
        }
        break;
      }
    }
    return arg;
  };

  QPlus.getMeta = function(string) {
    var meta = {};
    var inlineRegex = /<([^<>:\/]+)(?::?)([^>]*)>/g;
    var blockRegex = /<([^<>:\/]+)>([\s\S]*?)<\/\1>/g;
    for (;;) {
      var match = inlineRegex.exec(string);
      if (match) {
        if (match[2] === '') {
          meta[match[1]] = true;
        } else {
          meta[match[1]] = match[2];
        }
      } else {
        break;
      }
    }
    for (;;) {
      var match = blockRegex.exec(string);
      if (match) {
        meta[match[1]] = match[2];
      } else {
        break;
      }
    }
    return meta;
  };

  QPlus.getCharacter = function(string) {
    string = String(string).toLowerCase();
    if (/^[0-9]+$/.test(string)) {
      var id = Number(string);
      return id === 0 ? $gamePlayer : $gameMap.event(id);
    } else if (/^(player|p)$/.test(string)) {
      return $gamePlayer;
    } else {
      var isEvent = /^(event|e)([0-9]+)$/.exec(string);
      if (isEvent) {
        var eventId = Number(isEvent[2]);
        return eventId > 0 ? $gameMap.event(eventId) : null;
      }
      return null;
    }
  };

  /**
   * @static QPlus.request
   *  Creates an XHR request
   * @param  {String}   filePath
   *         path to the file to load
   * @param  {Function} callback
   *         callback on load, response value is passed as 1st argument
   * @param  {Function} err
   *         callback on error
   * @return {XMLHttpRequest}
   */
  QPlus.request = function(filePath, callback, err) {
    var xhr = new XMLHttpRequest();
    xhr.url = filePath;
    xhr.open('GET', filePath, true);
    var type = filePath.split('.').pop().toLowerCase();
    if (type === 'txt') {
      xhr.overrideMimeType('text/plain');
    } else if (type === 'json') {
      xhr.overrideMimeType('application/json');
    }
    xhr.onload = function() {
      if (this.status < 400) {
        var val = this.responseText;
        if (type === 'json') val = JSON.parse(val);
        this._onSuccess(val);
      }
    }
    xhr.onError = function(func) {
      this.onerror = func;
      return this;
    }
    xhr.onSuccess = function(func) {
      this._onSuccess = func;
      return this;
    }
    xhr._onSuccess = callback || function() {};
    xhr.onerror = err || function() {
      console.error('Error:' + this.url + ' not found');
    }
    xhr.send();
    return xhr;
  };

  QPlus._waitListeners = [];
  /**
   * @static QPlus.wait
   *  Calls callback once duration reachs 0
   * @param  {Number}   duration
   *         duration in frames to wait
   * @param  {Function} callback
   *         callback to call after wait is complete
   * @return {Waiter}
   *         Wait object that was created. Used to remove from listeners.
   *         Can also be used to use the .then function to add a callback
   *         instead of passing the callback in the parameter
   */
  QPlus.wait = function(duration, callback) {
    var waiter = {
      duration: duration || 0,
      callback: callback,
      then: function(callback) {
        this.callback = callback;
        return this;
      }
    }
    this._waitListeners.push(waiter);
    return waiter;
  };

  QPlus.removeWaitListener = function(waiter) {
    var i = this._waitListeners.indexOf(waiter);
    if (i === -1) return;
    this._waitListeners.splice(i, 1);
  };

  QPlus.clearWaitListeners = function() {
    this._waitListeners = [];
  };

  QPlus.mixin = function(to, what) {
    Object.getOwnPropertyNames(what).forEach(function(prop) {
      if (prop !== 'constructor') {
        Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(what, prop));
      }
    })
  };

  QPlus.mixinWait = function(into) {
    this.mixin(into, {
      wait: this.wait,
      removeWaitListener: this.removeWaitListener,
      clearWaitListeners: this.clearWaitListeners,
      updateWaiters: this.updateWaiters
    })
    if (into.update) {
      into.update_BEFOREWAIT = into.update;
      into.update = function() {
        this.update_BEFOREWAIT.apply(this, arguments);
        this.updateWaiters();
      }
    }
  };

  /**
   * @static QPlus.stringToObj
   *   Converts a string into an object
   * @param  {String} string
   *         string in the format:
   *         key: value
   *         key2: value2
   * @return {Object}
   */
  QPlus.stringToObj = function(string) {
    var lines = string.split('\n');
    var obj = {};
    lines.forEach(function(value) {
      var match = /^(.*):(.*)/.exec(value);
      if (match) {
        var key, newKey = match[1].trim();
        if (obj.hasOwnProperty(key)) {
          var i = 1;
          while (obj.hasOwnProperty(newKey)) {
            newKey = key + String(i);
            i++;
          }
        }
        var arr = QPlus.stringToAry(match[2].trim());
        if (arr.length === 1) arr = arr[0];
        obj[newKey] =  arr || '';
      }
    })
    return obj;
  };

  /**
   * @static QPlus.stringToAry
   *  Converts a string into an array. And auto converts to
   *  Number, Point, true, false or null
   * @param  {String} string
   *         Separate values with a comma
   * @return {Array}
   */
  QPlus.stringToAry = function(string) {
    // couldn't get this to work with split so went with regex
    var regex = /\s*(\(.*?\))|([^,]+)/g;
    var arr = [];
    while (true) {
      var match = regex.exec(string);
      if (match) {
        arr.push(match[0]);
      } else {
        break;
      }
    }
    return arr.map(this.stringToType);
  };

  QPlus.stringToType = function(string) {
    string = string.trim();
    var rx = QPlus._regex;
    if (rx.isString.test(string)) {
      string = string.slice(1, -1);
    }
    if (rx.isBoolean.test(string)) {
      return string.toLowerCase() === 'true';
    }
    if (rx.isFloat.test(string)) {
      return Number(string);
    }
    var isPoint = rx.isPoint.exec(string);
    if (isPoint) {
      return new Point(Number(isPoint[1]), Number(isPoint[2]));
    }
    if (rx.isArray.test(string)) {
      try {
        return JSON.parse(string).map(QPlus.stringToType);
      } catch (e) {
        return string;
      }
    }
    if (rx.isObj.test(string)) {
      try {
        var obj = JSON.parse(string);
        for (var key in obj) {
          obj[key] = QPlus.stringToType(obj[key]);
        }
        return obj;
      } catch (e) {
        return string;
      }
    }
    return string;
  };

  /**
   * @static QPlus.pointToIndex
   *  Converts a point to an index
   * @param  {Point} point
   * @param  {Int}   maxCols
   * @param  {Int}   maxRows
   * @return {Int} index value
   */
  QPlus.pointToIndex = function(point, maxCols, maxRows) {
    if (point.x >= maxCols) return -1;
    if (maxRows && point.y >= maxRows) return -1;
    return point.x + point.y * (maxCols)
  };

  /**
   * @static QPlus.indexToPoint
   * Converts an index to a Point
   * @param  {Int} index
   * @param  {Int} maxCols
   * @param  {Int} maxRows
   * @return {Point}
   */
  QPlus.indexToPoint = function(index, maxCols, maxRows) {
    if (index < 0) return new Point(-1, -1);
    var x = index % maxCols;
    var y = Math.floor(index / maxCols);
    return new Point(x, y);
  };

  /**
   * @static QPlus.adjustRadian
   * Keeps the radian between 0 and MAth.PI * 2
   * @param  {Int} radian
   * @return {Int}
   */
  QPlus.adjustRadian = function(radian) {
    while (radian < 0) {
      radian += Math.PI * 2;
    }
    while (radian > Math.PI * 2) {
      radian -= Math.PI * 2;
    }
    return radian;
  };

  QPlus.update = function() {
    this.updateWaiters();
  };

  QPlus.updateWaiters = function() {
    var waiters = this._waitListeners;
    for (var i = waiters.length - 1; i >= 0; i--) {
      if (!waiters[i]) {
        waiters.splice(i, 1);
        continue;
      }
      if (waiters[i].duration <= 0) {
        if (typeof waiters[i].callback === 'function') {
          try {
            waiters[i].callback();
          } catch (e) {
            console.error(e);
          }
        }
        waiters.splice(i, 1);
      } else {
        waiters[i].duration--;
      }
    }
  };
})();

//-----------------------------------------------------------------------------
// SimpleTilemap

function SimpleTilemap() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QPlus edits to existing classes

(function() {
  //-----------------------------------------------------------------------------
  // Get QPlus params

  var _PARAMS = QPlus.getParams('<QPlus>', {
    'Quick Test': false,
    'Default Enabled Switches': []
  });

  //-----------------------------------------------------------------------------
  // Document body

  document.body.ondrop = function(e) {
    e.preventDefault();
    return false;
  };

  document.body.ondragover = function(e) {
    e.preventDefault();
    return false;
  };

  //-----------------------------------------------------------------------------
  // Math

  Math.randomIntBetween = function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  Math.randomBetween = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  //-----------------------------------------------------------------------------
  // Graphics

  var Alias_Graphics__makeErrorHtml = Graphics._makeErrorHtml;
  Graphics._makeErrorHtml = function(name, message) {
    var msg = Alias_Graphics__makeErrorHtml.call(this, name, message);
    var extraMsg = '';
    if (Utils.isNwjs()) {
      var consoleKey = 'F8';
      if (Imported.QInput) {
        consoleKey = QInput.remapped.console[0].toUpperCase();
      }
      extraMsg = `<br /><font color="white">For more information, push ${consoleKey}</font>`;
    }
    return msg + extraMsg;
  };

  //-----------------------------------------------------------------------------
  // Input

  Input.stopPropagation = function() {
    var key = this._latestButton;
    this._currentState[key] = false;
    this._latestButton = null;
    for (var i = 0; i < this._gamepadStates.length; i++) {
      if (!this._gamepadStates[i]) continue;
      for (var j = 0; j < this._gamepadStates[i].length; j++) {
        var button = Imported.QInput ? this.gamepadKeys[j] : this.gamepadMapper[j];
        if (button === key) {
          this._gamepadStates[i][j] = false;
          break;
        }
      }
    }
    if (Imported.QInput) {
      this._ranPress = false;
      this._lastPressed = null;
      this._lastTriggered = null;
      this._lastGamepadTriggered = null;
    }
  };

  //-----------------------------------------------------------------------------
  // TouchInput

  TouchInput._onMouseMove = function(event) {
    var x = Graphics.pageToCanvasX(event.pageX);
    var y = Graphics.pageToCanvasY(event.pageY);
    this._onMove(x, y);
  };

  TouchInput.stopPropagation = function() {
    this._screenPressed = false;
    this._triggered = false;
    this._cancelled = false;
    this._released = false;
  };

  //-----------------------------------------------------------------------------
  // SceneManager

  var Alias_SceneManager_updateScene = SceneManager.updateScene;
  SceneManager.updateScene = function() {
    Alias_SceneManager_updateScene.call(this);
    QPlus.update();
  };

  //-----------------------------------------------------------------------------
  // DataManager

  var Alias_DataManager_setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function() {
    Alias_DataManager_setupNewGame.call(this);
    for (var i = 0; i <  _PARAMS['Default Enabled Switches'].length; i++) {
      $gameSwitches.setValue( _PARAMS['Default Enabled Switches'][i], true);
    }
  };

  var Alias_DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function(data) {
    Alias_DataManager_extractMetadata.call(this, data);
    var blockRegex = /<([^<>:\/]+)>([\s\S]*?)<\/\1>/g;
    data.qmeta = Object.assign({}, data.meta);
    while (true) {
      var match = blockRegex.exec(data.note);
      if (match) {
        data.qmeta[match[1]] = match[2];
      } else {
        break;
      }
    }
    this.extractQData(data);
  };

  DataManager.extractQData = function(data) {
    // to be aliased by plugins
  };

  //-----------------------------------------------------------------------------
  // Scene_Base

  var Alias_Scene_Base_initialize = Scene_Base.prototype.initialize;
  Scene_Base.prototype.initialize = function() {
    Alias_Scene_Base_initialize.call(this);
    this._waitListeners = [];
    QPlus.mixinWait(this);
  };

  //-----------------------------------------------------------------------------
  // Scene_Boot

  var Alias_Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    if (DataManager.isBattleTest() || DataManager.isEventTest()) {
      Alias_Scene_Boot_start.call(this);
    } else if (_PARAMS['Quick Test'] && Utils.isOptionValid('test')) {
      Scene_Base.prototype.start.call(this);
      SoundManager.preloadImportantSounds();
      this.checkPlayerLocation();
      DataManager.setupNewGame();
      SceneManager.goto(Scene_Map);
      this.updateDocumentTitle();
    } else {
      Alias_Scene_Boot_start.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Map

  var Alias_Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    if (TouchInput.isMoved()) this.updateMouseInsideWindow();
    Alias_Scene_Map_update.call(this);
  };

  Scene_Map.prototype.updateMouseInsideWindow = function() {
    var inside = false;
    var windows = this._windowLayer.children;
    for (var i = 0; i < windows.length; i++) {
      if (windows[i].visible && windows[i].isOpen() && windows[i].isMouseInside()) {
        inside = true;
        break;
      }
    }
    TouchInput.insideWindow = inside;
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'wait') {
      var min  = Number(args[0]);
      var max  = Number(args[1]);
      if (!max) {
        max = min;
        min = 0;
      }
      var wait = Math.randomIntBetween(min, max);
      this.wait(wait);
      return;
    }
    if (command.toLowerCase() === 'globallock') {
      var level  = Number(args[0]);
      var args2  = args.slice(1);
      var only = args2.indexOf('only');
      if (only !== -1) args2.splice(only, 1);
      var charas = args2.map(QPlus.getCharacter);
      var mode = only !== -1 ? 1 : 0;
      $gameMap.globalLock(charas, mode, level);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  /**
   * @param  {arr} charas
   *               array of characters
   * @param  {int} mode
   *               0 - ignore characters in charas arr
   *               1 - only apply to charas in charas arr
   * @param  {int} level
   *               0 - clear lock
   *               1 - lock movement
   *               2 - lock movement and character animation
   */
  Game_Map.prototype.globalLock = function(charas, mode, level) {
    charas = charas || [];
    mode   = mode  === undefined ? 0 : mode;
    level  = level === undefined ? 1 : level;
    if (mode === 0) {
      $gamePlayer._globalLocked = !charas.contains($gamePlayer) ? level : 0;
      var events = this.events();
      for (var i = 0; i < events.length; i++) {
        if (charas.contains(events[i])) continue;
        events[i]._globalLocked = level;
      }
    } else {
      for (var i = 0; i < charas.length; i++) {
        if (charas[i]) {
          charas[i]._globalLocked = level;
        }
      }
    }
  };

  // kept for backwars compatibility
  Game_Map.prototype.globalUnlock = function(charas) {
    this.globalLock(charas, 0, 0);
  };

  Game_Map.prototype.noTilemap = function() {
    return !!$dataMap.meta.noTilemap;
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._globalLocked = 0;
    this._comments = '';
    this._waitListeners = [];
    QPlus.mixinWait(this);
  };

  Game_CharacterBase.prototype.charaId = function() {
    return -1;
  };

  Game_CharacterBase.prototype.notes = function() {
    return '';
  };

  Game_CharacterBase.prototype.canMove = function() {
    return this._globalLocked === 0;
  };

  /**
   * east is 0, north is 270, west is 180 and south is 90
   */
  Game_CharacterBase.prototype.directionToRadian = function(dir) {
    dir = dir || this._direction;
    if (dir === 2) return Math.PI / 2;
    if (dir === 4) return Math.PI;
    if (dir === 6) return 0;
    if (dir === 8) return Math.PI * 3 / 2;
    if (dir === 1) return Math.PI * 3 / 4;
    if (dir === 3) return Math.PI / 4;
    if (dir === 7) return Math.PI * 5 / 4;
    if (dir === 9) return Math.PI * 7 / 4;
    return 0;
  };

  Game_CharacterBase.prototype.radianToDirection = function(radian, useDiag) {
    radian = QPlus.adjustRadian(radian);
    if (useDiag) {
      // use degrees for diagonals
      // since I don't know clean PI numbers for these degrees
      var deg = radian * 180 / Math.PI;
      if (deg >= 22.5  && deg <= 67.5) {
        return 3;
      } else if (deg >= 112.5 && deg <= 157.5) {
        return 1;
      } else if (deg >= 202.5 && deg <= 247.5) {
        return 7;
      } else if (deg >= 292.5 && deg <= 337.5) {
        return 9;
      }
    }
    if (radian >= 0 && radian < Math.PI / 4) {
      return 6;
    } else if (radian >= Math.PI / 4 && radian < 3 * Math.PI / 4) {
      return 2;
    } else if (radian >= Math.PI * 3 / 4 && radian < Math.PI * 5 / 4) {
      return 4;
    } else if (radian >= Math.PI * 5 / 4 && radian < Math.PI * 7 / 4) {
      return 8;
    } else if (radian >= Math.PI * 7 / 4) {
      return 6;
    }
  };

  Game_CharacterBase.prototype.setSelfSwitch = function() {
    return;
  };

  var Alias_Game_CharacterBase_updateAnimation = Game_CharacterBase.prototype.updateAnimation;
  Game_CharacterBase.prototype.updateAnimation = function() {
    if (this._globalLocked >= 2) {
      return;
    }
    Alias_Game_CharacterBase_updateAnimation.call(this);
  };

  var Alias_Game_CharacterBase_updateMove = Game_CharacterBase.prototype.updateMove;
  Game_CharacterBase.prototype.updateMove = function() {
    if (this._globalLocked >= 1) {
      return;
    }
    Alias_Game_CharacterBase_updateMove.call(this);
  };

  var Alias_Game_Character_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
  Game_Character.prototype.updateRoutineMove = function() {
    if (this._globalLocked >= 1) {
      return;
    }
    Alias_Game_Character_updateRoutineMove.call(this);
  };


  //-----------------------------------------------------------------------------
  // Game_Player

  var Alias_Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    return Alias_Game_Player_canMove.call(this) &&
      Game_Character.prototype.canMove.call(this);
  };

  Game_Player.prototype.canClick = function() {
    return !TouchInput.insideWindow;
  };

  Game_Player.prototype.charaId = function() {
    return 0;
  };

  Game_Player.prototype.actor = function() {
    return $gameParty.leader();
  };

  Game_Player.prototype.notes = function() {
    return this.actor() ? this.actor().actor().note : '';
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_initMembers = Game_Event.prototype.initMembers;
  Game_Event.prototype.initMembers = function() {
    Alias_Game_Event_initMembers.call(this);
    this._comments = null;
    this._prevDir  = null;
  };

  Game_Event.prototype.charaId = function() {
    return this.eventId();
  };

  Game_Event.prototype.notes = function(withComments) {
    var notes = this.event() ? this.event().note : '';
    return notes + (withComments ? this.comments() : '');
  };

  Game_Event.prototype.comments = function(withNotes) {
    var notes = '';
    if (this.event()) {
      notes = this.event().note;
    }
    return this._comments + (withNotes ? notes : '');
  };

  Game_Event.prototype.setupComments = function() {
    this._comments = '';
    if (this.page() && this.list()) {
      this._comments = this.list().filter(function(list) {
        return list.code === 108 || list.code === 408;
      }).map(function(list) {
        return list.parameters;
      }).join('\n')
    }
  };

  var Alias_Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    var firstTime = this._prevDir === null;
    this._prevDir = this.direction();
    Alias_Game_Event_setupPage.call(this);
    var retainDir = /<retainDir>/i.test(this.comments(true));
    if (!firstTime && retainDir) {
      this.setDirection(this._prevDir);
    }
  };

  var Alias_Game_Event_clearPageSettings = Game_Event.prototype.clearPageSettings;
  Game_Event.prototype.clearPageSettings = function() {
    Alias_Game_Event_clearPageSettings.call(this);
    this._comments = '';
  };

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this.setupComments();
  };

  Game_Event.prototype.setSelfSwitch = function(selfSwitch, bool) {
    var mapId = this._mapId;
    var eventId = this._eventId;
    if (!mapId || !eventId) return;
    var key = [mapId, eventId, selfSwitch];
    $gameSelfSwitches.setValue(key, bool);
  };

  var Alias_Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
  Game_Event.prototype.updateSelfMovement = function() {
    if (!this.canMove()) return;
    Alias_Game_Event_updateSelfMovement.call(this);
  };

  //-----------------------------------------------------------------------------
  // Window_Base

  Window_Base.prototype.isMouseInside = function() {
    var x = TouchInput.x - this.x;
    var y = TouchInput.y - this.y;
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character

  var Alias_Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
  Sprite_Character.prototype.updatePosition = function() {
    var prevY = this.y;
    var prevZ = this.z;
    Alias_Sprite_Character_updatePosition.call(this);
    if (this.y !== prevY || this.z !== prevZ) {
      if ($gameMap.noTilemap && this.parent && this.parent.requestSort) {
        this.parent.requestSort();
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map

  var Alias_Spriteset_Map_createTilemap = Spriteset_Map.prototype.createTilemap;
  Spriteset_Map.prototype.createTilemap = function() {
    if ($gameMap.noTilemap()) {
      this._tilemap = new SimpleTilemap();
      this._baseSprite.addChild(this._tilemap);
    } else {
      Alias_Spriteset_Map_createTilemap.call(this);
    }
  };

  var Alias_Spriteset_Map_loadTileset = Spriteset_Map.prototype.loadTileset;
  Spriteset_Map.prototype.loadTileset = function() {
    if (!$gameMap.noTilemap()) {
      Alias_Spriteset_Map_loadTileset.call(this);
    }
  };

  var Alias_Spriteset_Map_updateTilemap = Spriteset_Map.prototype.updateTilemap;
  Spriteset_Map.prototype.updateTilemap = function() {
    if (!$gameMap.noTilemap()) {
      Alias_Spriteset_Map_updateTilemap.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // SimpleTilemap

  SimpleTilemap.prototype = Object.create(Sprite.prototype);
  SimpleTilemap.prototype.constructor = SimpleTilemap;

  SimpleTilemap.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._requestSort = false;
  };

  SimpleTilemap.prototype.requestSort = function() {
    this._requestSort = true;
  };

  SimpleTilemap.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._requestSort) {
      this._sortChildren();
    }
  };

  SimpleTilemap.prototype._sortChildren = function() {
    this.children.sort(this._compareChildOrder.bind(this));
  };

  SimpleTilemap.prototype._compareChildOrder = function(a, b) {
    if (a.z !== b.z) {
      return a.z - b.z;
    } else if (a.y !== b.y) {
      return a.y - b.y;
    } else {
      return (a.spriteId - b.spriteId) || 0;
    }
  };
})()
