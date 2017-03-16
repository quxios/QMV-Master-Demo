//=============================================================================
// QPlus
//=============================================================================

var Imported = Imported || {};
Imported.QPlus = '1.1.4';

//=============================================================================
 /*:
 * @plugindesc <QPlus> (Should go above all Q Plugins)
 * Some small changes to MV for easier plugin development.
 * @author Quxios  | Version 1.1.4
 *
 * @param Quick Test
 * @desc Enable quick testing.
 * Set to true or false
 * @default true
 *
 * @param Default Enabled Switches
 * @desc Turns on a list of switches on by default
 * Each switch should be seperated by a comma.
 * @default
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
 *   <retainDir>
 * ~~~
 * This will be ignored if the next page has direction fix enabled
 *
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Random wait between X Y**
 * ----------------------------------------------------------------------------
 * This plugin command will insert a random wait between x and y frames.
 * ~~~
 *   wait X Y
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
 * LEVEL - The level of global lock
 *
 *  - 0 - clears the global lock
 *  - 1 - locks the characters movement
 *  - 2 - locks the characters movement and animation
 *
 * [CHARACTERS] - optional, list of `Character Ids` to apply to or ignore.
 * seperated by a space.
 *
 * Character Ids
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID or eventEVENTID
 * (replace EVENTID with a number)
 *
 * Possible options:
 *
 *  - only  - Will only apply to the characters listed
 *
 * ----------------------------------------------------------------------------
 * **Examples**
 * ----------------------------------------------------------------------------
 * ~~~
 *   globalLock 2
 * ~~~
 * Will lock all characters movement and animations.
 *
 * ~~~
 *   globalLock 1 0 1 4
 *   globalLock 1 p e1 e4
 *   globalLock 1 player event1 event4
 * ~~~
 * (Note: All 3 are the same, just using a different character id method)
 *
 * Will Lock the movements for all characters except:
 * Player, event 1 and event 4
 *
 * ~~~
 *   globalLock 1 0 1 4 only
 *   globalLock 1 p e1 e4 only
 *   globalLock 1 player event1 event4 only
 * ~~~
 * Will Lock the movements for only these characters:
 * Player, event 1 and event 4
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
 * @tags core, character
 */
//=============================================================================

//=============================================================================
// QPlus Static Class

function QPlus() {
 throw new Error('This is a static class');
}

QPlus._params  = {};

QPlus.getParams = function(id) {
  if (!this._params[id]) {
    this._params[id] = $plugins.filter(function(p) {
      return p.description.contains(id) && p.status
    })[0].parameters;
  }
  return this._params[id];
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

QPlus.makeArgs = function(string) {
  var inital = string.split(' ');
  var final  = [];
  var merging = false;
  var j = 0;
  for (var i = 0; i < inital.length; i++) {
    var arg = inital[i];
    if (merging) {
      if (arg.contains('"')) {
        final[j] += ' ' + arg.replace('"', '');
        merging = false;
        j++;
      } else {
        final[j] += ' ' + arg;
      }
    } else {
      if (arg.contains('"')) {
        final[j] = arg.replace('"', '');
        merging = true;
      } else {
        final[j] = arg;
        j++
      }
    }
  }
  return final;
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
 * @param  {String} filePath
 *         path to the file to load
 * @param  {Function} callback
 *         callback on load, response value is passed as 1st argument
 * @param  {Function} err
 *         callback on error
 */
QPlus.request = function(filePath, callback, err) {
  var xhr = new XMLHttpRequest();
  var url = filePath;
  xhr.open('GET', url, true);
  var type = filePath.split('.').pop().toLowerCase();
  if (type === 'txt') {
    xhr.overrideMimeType('text/plain');
  } else if (type === 'json') {
    xhr.overrideMimeType('application/json');
  }
  xhr.onload = function() {
    if (xhr.status < 400) {
      var val = xhr.responseText;
      if (type === 'json') val = JSON.parse(val);
      callback(val);
    }
  }
  xhr.onerror = err || function() {
    console.error('Error:' + filePath + ' not found');
  }
  xhr.send();
};

/**
 * @static QPlus.stringToObj
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
 * @param  {String} string
 *         Separate values with a comma
 * @return {Array}
 *         Values will be trimmed, and auto converted to
 *         Number, true, false or null
 */
QPlus.stringToAry = function(string) {
  return string.split(',').map(function(s) {
    s = s.trim();
    if (/^-?\d+\.?\d*$/.test(s)) return Number(s);
    if (s === 'true') return true;
    if (s === 'false') return false;
    if (s === 'null' || s === '') return null;
    return s;
  })
};

/**
 * @static QPlus.pointToIndex
 * Converts a point to a 1D point (an index)
 * @param  {Point} point
 * @param  {Int} maxCols
 * @param  {Int} maxRows
 * @return {Int} index value
 */
QPlus.pointToIndex = function(point, maxCols, maxRows) {
  if (point.x >= maxCols) return -1;
  if (maxRows && point.y >= maxRows) return -1;
  if (!maxRows) maxRows = 0;
  if (!point.z) point.z = 0;
  var index = (point.x + point.y * (maxCols));
  return index + ((maxCols * maxRows) * point.z);
};

/**
 * @static QPlus.indexToPoint
 * Converts a 1D point (an index) to a 2D or 3D point
 * @param  {Int} index
 * @param  {Int} maxCols
 * @param  {Int} maxRows
 * @return {Point}
 *         2D point if index is within maxCols * maxRows
 *         3D point if index is out of maxCols * maxRows
 */
QPlus.indexToPoint = function(index, maxCols, maxRows) {
  if (index < 0) return new Point(-1, -1);
  var x = index % maxCols;
  var y = Math.floor(index / maxCols);
  var z = 0;
  if (maxRows && index >= maxCols * maxRows) {
    z = Math.floor(index / (maxCols * maxRows));
    y -= maxRows * z;
  }
  return new Point(x, y, z);
};

/**
 * @static QPlus.freeImgCache
 * @param  {String or Array} files
 *         List of files to remove from cache
 *         If a string, separate with commas
 *         Is case sensative, but only checking if any file
 *         contains string(s) passed. Not checking if it's equal
 *         So passing img/ will free all images, since they all begin
 *         with img/
 */
QPlus.freeImgCache = function(files) {
  if (typeof files === 'string') {
    files = files.split(',').map(function(s) { return s.trim() });
  }
  for (var key in ImageManager.cache._inner) {
    if (!ImageManager.cache._inner.hasOwnProperty(key)) continue;
    var found = files.some(function(file) {
      return key.contains(file);
    })
    if (found) {
      ImageManager.cache._inner[key].free();
    }
  }
};

//=============================================================================
// QPlus edits to existing classes

(function() {
  //-----------------------------------------------------------------------------
  // Get QPlus params

  var _params    = QPlus.getParams('<QPlus>');
  var _quickTest = _params['Quick Test'].toLowerCase() == 'true';
  var _switches  = _params['Default Enabled Switches'].split(',').map(Number);

  //-----------------------------------------------------------------------------
  // Graphics

  var Alias_Graphics__makeErrorHtml = Graphics._makeErrorHtml;
  Graphics._makeErrorHtml = function(name, message) {
    var msg = Alias_Graphics__makeErrorHtml.call(this, name, message);
    var extraMsg = '';
    if (Utils.isNwjs()) {
      var consoleKey = 'F8';
      if (Imported.QInput) {
        consoleKey = QInput.remapped.console.toUpperCase();
      }
      extraMsg = `<br /><font color="white">For more information, push ${consoleKey}</font>`;
    }
    return msg + extraMsg;
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
  // Point

  Point.prototype.initialize = function(x, y, z) {
    PIXI.Point.call(this, x, y);
    this.z = z || 0;
  };

  Point.prototype.clone = function() {
    return new Point(this.x, this.y, this.z);
  };

  Point.prototype.copy = function(p) {
    this.set(p.x, p.y, p.z);
  };

  Point.prototype.equals = function(p) {
    return (p.x === this.x) && (p.y === this.y) && (p.z === this.z);
  }

  Point.prototype.set = function(x, y, z) {
    this.x = x || 0;
    this.y = y || ((y !== 0) ? this.x : 0);
    this.z = z || 0;
  }

  //-----------------------------------------------------------------------------
  // Scene_Boot

  var Alias_Scene_Boot_start = Scene_Boot.prototype.start;
  Scene_Boot.prototype.start = function() {
    if (DataManager.isBattleTest() || DataManager.isEventTest()) {
      Alias_Scene_Boot_start.call(this);
    } else if (_quickTest && Utils.isOptionValid('test')) {
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
  // DataManager

  var Alias_DataManager_setupNewGame = DataManager.setupNewGame;
  DataManager.setupNewGame = function() {
    Alias_DataManager_setupNewGame.call(this);
    for (var i = 0; i < _switches.length; i++) {
      $gameSwitches.setValue(_switches[i], true);
    }
  };

  var Alias_DataManager_extractMetadata = DataManager.extractMetadata;
  DataManager.extractMetadata = function(data) {
    Alias_DataManager_extractMetadata.call(this, data);
    var blockRegex = /<([^<>:\/]+)>([\s\S]*?)<\/\1>/g;
    data.qmeta = data.meta;
    for (;;) {
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
  // Game_Interpreter
  //
  // The interpreter for running event commands.

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
      var charas = args2.map(QPlus.getCharacter);
      var only = args2.contains('only');
      var mode = only ? 1 : 0;
      $gameMap.globalLock(charas, mode, level);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  //-----------------------------------------------------------------------------
  // Game_Map
  //
  // The game object class for a map. It contains scrolling and passage
  // determination functions.

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
      this.events().forEach(function(event) {
        if (charas.contains(event)) return;
        event._globalLocked = level;
      })
    } else {
      charas.forEach(function(chara) {
        if (chara) {
          chara._globalLocked = level;
        }
      })
    }
  };

  // kept for backwars compatibility
  Game_Map.prototype.globalUnlock = function(charas) {
    this.globalLock(charas, 0, 0);
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._globalLocked = 0;
    this._comments = '';
  };

  Game_CharacterBase.prototype.charaId = function() {
    return -1;
  };

  Game_CharacterBase.prototype.notes = function() {
    return '';
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
    if (useDiag) {
      if (radian >= Math.PI / 6 && radian < Math.PI / 3) {
        return 3;
      } else if (radian >= Math.PI * 2 / 3 && radian < Math.PI * 5 / 6) {
        return 1;
      } else if (radian >= Math.PI * 7 / 6 && radian < Math.PI * 4 / 3) {
        return 7;
      } else if (radian >= Math.PI * 5 / 3 && radian < Math.PI * 11 / 6) {
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
    return Alias_Game_Player_canMove.call(this) && this._globalLocked === 0;
  };

  Game_Player.prototype.canClick = function() {
    return true;
  }

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
    if (!this.page() || !this.list()) {
      this._comments = '';
    } else {
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
})()
