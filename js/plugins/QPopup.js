//=============================================================================
// QPopup
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.2.2')) {
  alert('Error: QPopup requires QPlus 1.2.2 or newer to work.');
  throw new Error('Error: QPopup requires QPlus 1.2.2 or newer to work.');
}

Imported.QPopup = '1.1.1';

//=============================================================================
 /*:
 * @plugindesc <QPopup>
 * Lets you create popups in the map or on screen
 * @author Quxios  | Version 1.1.1
 *
 * @requires QPlus
 *
 * @param Presets
 * @desc List of Popup presets
 * @type Struct<PopupPreset>[]
 * @default []
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin lets you play a random popups at a set interval over an event.
 * It also lets you create your own popups that you can place where you want.
 * ============================================================================
 * ## Presets
 * ============================================================================
 * Presets can be created in the plugin parameters or with plugin commands.
 * Presets have predefined rules for a popups style and transitions.
 * ============================================================================
 * ## Event Popups
 * ============================================================================
 * This feature will create popup(s) at an event every X frames.
 *
 * To use this, you need configure these into the event's page as a comment:
 * ----------------------------------------------------------------------------
 * **qPopupSettings**
 * ----------------------------------------------------------------------------
 * REQUIRED
 * ~~~
 *  <qPopupSettings>
 *  OPTIONS
 *  </qPopupSettings>
 * ~~~
 * *Every option should be on a different line*
 * - Possible Options:
 *  - "interval: X": Set X to the number of frames between popups
 *  - "preset: X": Set X to the preset to use. Presets are creating with plugin
 *  commands. *Preset needs to be configured before this events page starts, or
 *  it won't be applied*
 *  - "ox: X": Set X to the offset x position of this popup. Can be negative
 *  - "oy: Y": Set Y to the offset y position of this popup. Can be negative
 *  - "duration: X": Set X to the duration of the popup
 *
 * qPopupSettings Example
 * ~~~
 *  <qPopupSettings>
 *  interval: 120
 *  duration: 60
 *  oy: -48
 *  </qPopupSettings>
 * ~~~
  * ----------------------------------------------------------------------------
 * **qPopupStyle**
  * ----------------------------------------------------------------------------
 * OPTIONAL
 * ~~~
 *  <qPopupStyle>
 *  OPTIONS
 *  </qPopupStyle>
 * ~~~
 * *Every option should be on a different line*
 * - Possible Options:
 *  - "fontFace: X": Set X to the name of the font to use
 *  - "fontSize: X": Set X to size of the font
 *  - "color: X": Set X to the hex color to use
 *  - "padding: X": Set X to the padding in pixels
 *  - "windowed: X": Set X to true or false
 *
 * qPopupStyle Example
 * ~~~
 *  <qPopupStyle>
 *  fontSize: 18
 *  windowed: true
 *  color: #FF0000
 *  </qPopupStyle>
 * ~~~
 * ----------------------------------------------------------------------------
 * **qPopupTransitions**
 * ----------------------------------------------------------------------------
 * OPTIONAL
 * ~~~
 *  <qPopupTransitions>
 *  TRANSITIONS
 *  </qPopupTransitions>
 * ~~~
 * *Every transition should be on a different line*
 * - See transition section for details.
 * ----------------------------------------------------------------------------
 * **qPopup**
 * ----------------------------------------------------------------------------
 * REQUIRED
 * ~~~
 * <qPopup>
 * STRING
 * </qPopup>
 * ~~~
 * - STRING: The text to use in the popup. You can use some escape codes
 * from message box
 *
 * You can add as many `<qPopups></qPopups>` as you would like. A random one will
 * be choosen at every interval.
 * ============================================================================
 * ## Transitions
 * ============================================================================
 * Transition format:
 * ~~~
 *  STARTFRAME DURATION TYPE PARAM1
 * ~~~
 * - STARTFRAME: The frame to start this transition. In frames
 * - DURATION: The length of this transition. In frames
 * - TYPE: The type of transition, can be: slideUp, slideDown, fadeIn, fadeOut
 * - PARAM1: If type is slideUp or slideDown, this is the distance in pixels
 * to slide.
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Start**
 * ----------------------------------------------------------------------------
 * ~~~
 *  qPopup start "STRING" [OPTIONS]
 * ~~~
 * - STRING: What you want the popup to say. You can use some escape codes
 * from message box. To add a new line, use \n
 * - List of Options:
 *   - idX: Set X to the id for this popup
 *   - presetX: Set X to which styling preset id to use. Presets are configured
 *   with other plugin commands
 *   - xX: Set X to the x position of this popup. This is ignored if bindToX is
 *   used
 *   - yX: Set X to the y position of this popup. This is ignored if bindToX is
 *   used
 *   - oxX: Set X to the offset x position of this popup. Can be negative
 *   - oyY: Set X to the offset x position of this popup. Can be negative
 *   - bindToX: Set X to the charaId to bind to. When bind, the popup will follow
 *   that character.
 *   - durationX: Set X to the duration of the popup
 * ----------------------------------------------------------------------------
 * **configStyle**
 * ----------------------------------------------------------------------------
 * ~~~
 *  qPopup configStyle ID [OPTIONS]
 * ~~~
 * - ID: The preset ID to apply this to. This is used for the presetX option
 * in the start command.
 * - List of Options:
 *   - fontX: Set X to the name of the font to use. If font name has spaces
 *   wrap the option in "". Ex "fontThis is the fontname"
 *   - sizeX: Set X to the size of the font
 *   - colorX: Set X to the hex color to use. Ex color#FF0000 is red font color.
 *   - paddingX: Set X to the padding
 *   - windowed: Include this and the popup will use the windowskin
 *
 * *Note: If the ID was previously setup, it will be replaced with the new config*
 * ----------------------------------------------------------------------------
 * **configTransition**
 * ----------------------------------------------------------------------------
 * ~~~
 *  qPopup configTransition ID [TRANSITION]
 * ~~~
 * - ID: The preset ID to apply this to. This is used for the presetX option
 * in the start command.
 * - TRANSITION: A transition to add to this preset. See transition section
 * for info.
 *
 * *Note: If the ID was previously setup the transition will be added to it*
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QPopup
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
 * @tags map, popup
 */
 /*~struct~PopupPreset:
 * @param ID
 * @desc The ID of this preset, needs to be unique!
 * @default
 *
 * @param Style
 *
 * @param Font Face
 * @parent Style
 * @desc Set to the name of the font to use
 * @default GameFont
 *
 * @param Font Size
 * @parent Style
 * @desc Set to size of the font
 * @default 28
 *
 * @param Font Color
 * @parent Style
 * @desc Set to hex color of the font
 * @default #ffffff
 *
 * @param Padding
 * @parent Style
 * @desc Set to the padding size
 * @type Number
 * @min 0
 * @default 0
 *
 * @param Windowed
 * @parent Style
 * @desc If true, the window skin will be used
 * @type Boolean
 * @default false
 *
 * @param Transitions
 * @desc List of transitions to play.
 * See transitions section in the help for info.
 * @type String[]
 * @default []
 */
//=============================================================================

//=============================================================================
// QPopup Static Class

function QPopup() {
  throw new Error('This is a static class');
}

//=============================================================================
// New Classes

function Window_QPopup() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QPopup

(function() {
  var _PARAMS = QPlus.getParams('<QPopup>', {
    'Presets': []
  });
  var _PRESETS = {};
  _PARAMS.Presets.forEach(function(preset) {
    _PRESETS[preset.ID] = {
      style: {
        fontFace: preset['Font Face'],
        fontSize: preset['Font Size'],
        color: preset['Font Color'],
        padding: preset['Padding'],
        windowed: preset['Windowed']
      },
      transitions: preset.Transitions
    }
  });

  //-----------------------------------------------------------------------------
  // QPopup

  QPopup._popups = {};
  QPopup._mapId = -1;
  QPopup._defaultOptions = {
    id: '*',
    string: '',
    x: 0, y: 0, ox: 0, oy: 0,
    bindTo: null,
    duration: 120,
    isNotification: false
  }
  QPopup._defaultTransitions = [];
  QPopup._defaultStyle = {
    fontFace: 'GameFont',
    fontSize: 28,
    color: '#ffffff',
    padding: 18,
    windowed: false
  }

  QPopup.start = function(options) {
    options = Object.assign({}, this._defaultOptions, options);
    options.transitions = options.transitions || QPopup._defaultTransitions;
    options.style = Object.assign({}, this._defaultStyle, options.style);
    if (options.id === '*') {
      options.id = this.getUniqueQPopupId();
    }
    var popup = new Window_QPopup(options);
    this.add(popup);
    return popup;
  };

  QPopup.getUniqueQPopupId = function() {
    var id = '*0';
    var counter = 0;
    var newId = false;
    while (!newId) {
      id = '*' + counter;
      var newId = true;
      for (var ids in this._popups) {
        if (!this._popups.hasOwnProperty(ids)) continue;
        if (ids === id) {
          newId = false;
          break;
        }
      }
      counter++;
    }
    return id;
  };

  QPopup.add = function(popup) {
    if (popup.constructor !== Window_QPopup) return;
    if (this._popups[popup.id]) this.remove(this._popups[popup.id]);
    this._popups[popup.id] = popup;
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) {
      scene.addChild(popup);
    } else {
      scene._spriteset._tilemap.addChild(popup);
    }
    popup.update();
  };

  QPopup.remove = function(popup) {
    if (typeof popup === 'string') {
      popup = this._popups[popup];
      if (popup === null) return;
    }
    if (popup.constructor !== Window_QPopup) return;
    var scene = SceneManager._scene;
    delete this._popups[popup.id];
    if (scene.constructor !== Scene_Map) {
      scene.removeChild(popup);
    } else {
      scene._spriteset._tilemap.removeChild(popup);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_System

  var Alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Alias_Game_System_initialize.call(this);
    this._qPopupPresets = JSON.parse(JSON.stringify(_PRESETS));
  };

  Game_System.prototype.qPopupPreset = function(id) {
    if (!this._qPopupPresets[id]) {
      this._qPopupPresets[id] = {
        style: Object.assign({}, QPopup._defaultStyle),
        transitions: null
      }
    }
    return this._qPopupPresets[id];
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qpopup') {
      return this.qPopupCommand(args);
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPopupCommand = function(args) {
    args = QPlus.makeArgs(args.join(' '));
    var cmd = args.shift().toLowerCase();
    switch (cmd) {
      case 'configstyle': {
        var id = args.shift();
        var fontFace = QPlus.getArg(args, /^font(.+)/i);
        var fontSize = Number(QPlus.getArg(args, /^size(\d+)/i));
        var color = QPlus.getArg(args, /^color(.+)/i);
        var padding = QPlus.getArg(args, /^padding(\d+)/i);
        var windowed = !!QPlus.getArg(args, /^windowed$/i);
        var style = {};
        if (fontFace) style.fontFace = fontFace;
        if (fontSize) style.fontSize = fontSize;
        if (color) style.color = color;
        if (padding) style.padding = Number(padding);
        style.windowed = windowed;
        var presetStyle = $gameSystem.qPopupPreset(id).style;
        Object.assign(presetStyle, style);
        break;
      }
      case 'configtransition': {
        var id = args.shift();
        if (!$gameSystem.qPopupPreset(id).transitions) {
          $gameSystem.qPopupPreset(id).transitions = [];
        }
        $gameSystem.qPopupPreset(id).transitions.push(args.join(' '));
      }
      case 'start': {
        var str = args.shift();
        var id = QPlus.getArg(args, /^id(.+)/i);
        var preset = QPlus.getArg(args, /^preset(.+)/i);
        var x = QPlus.getArg(args, /^x(-?\d+)/i);
        var y = QPlus.getArg(args, /^y(-?\d+)/i);
        var ox = QPlus.getArg(args, /^ox(-?\d+)/i);
        var oy = QPlus.getArg(args, /^oy(-?\d+)/i);
        var bindTo = QPlus.getArg(args, /^bindTo(.+)/i);
        var duration = QPlus.getArg(args, /^duration(\d+)/i);
        if (preset) preset = $gameSystem.qPopupPreset(preset);
        var options = Object.assign({}, preset);
        if (id !== null) options.id = id;
        if (x !== null) options.x = Number(x);
        if (y !== null) options.y = Number(y);
        if (ox !== null) options.ox = Number(ox);
        if (oy !== null) options.oy = Number(oy);
        if (bindTo !== null) options.bindTo = bindTo;
        if (duration !== null) options.duration = Number(duration);
        options.string = str.replace(/\\n/g, '\n');
        QPopup.start(options);
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    if (mapId !== QPopup._mapId) {
      QPopup._mapId = mapId;
      QPopup._popups = [];
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_setupPage = Game_Event.prototype.setupPage;
  Game_Event.prototype.setupPage = function() {
    this._qPopups = null;
    Alias_Game_Event_setupPage.call(this);
  };

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    this.setupQPopups();
  };

  Game_Event.prototype.setupQPopups = function() {
    var notes = this.notes(true);
    var settings = /<qPopupSettings>([\s\S]*)<\/qPopupSettings>/i.exec(notes);
    if (!settings) return;
    var style = /<qPopupStyle>([\s\S]*)<\/qPopupStyle>/i.exec(notes);
    var transitions = /<qPopupTransitions>([\s\S]*)<\/qPopupTransitions>/i.exec(notes);
    var popupsRegex = /<qPopup>([\s\S]*?)<\/qPopup>/ig;
    var popups = [];
    while (true) {
      var match = popupsRegex.exec(notes);
      if (match) {
        popups.push(match[1].trim());
      } else {
        break;
      }
    }
    settings = QPlus.stringToObj(settings[1]);
    settings.bindTo = this.charaId();
    style = style ? QPlus.stringToObj(style[1]) : null;
    transitions = transitions ? transitions.split('\n') : null;
    if (settings.preset) {
      var preset = $gameSystem.qPopupPreset(settings.preset);
      style = Object.assign(style || {}, preset.style);
      transitions = (transitions || []).concat(preset.transitions || []);
    }
    this._qPopups = {
      settings: settings,
      transitions: transitions,
      style: style,
      popups: popups,
      ticker: Math.randomIntBetween(0, settings.interval)
    }
  };

  var Alias_Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function() {
    Alias_Game_Event_update.call(this);
    if (this._qPopups && !this._locked) {
      this.updateQPopups();
    }
  };

  Game_Event.prototype.updateQPopups = function() {
    if (this._qPopups.ticker >= this._qPopups.settings.interval) {
      var i = Math.randomInt(this._qPopups.popups.length);
      var popup = QPopup.start(Object.assign({},
        this._qPopups.settings,
        {
          string: this._qPopups.popups[i],
          style: this._qPopups.style,
          transitions: this._qPopups.transitions
        }
      ))
      this._qPopups.ticker = -popup._duration || 0;
    } else {
      this._qPopups.ticker++;
    }
  };

  //-----------------------------------------------------------------------------
  // Window_QPopup

  Window_QPopup.prototype = Object.create(Window_Base.prototype);
  Window_QPopup.prototype.constructor = Window_QPopup;

  Window_QPopup.prototype.initialize = function(options) {
    this.id = options.id;
    this._style = options.style;
    this._transitions = options.transitions;
    Window_Base.prototype.initialize.call(this, 0, 0, 0, 0);
    this.realX = options.x;
    this.realY = options.y;
    this.z = 9;
    this._ox = options.ox;
    this._oy = options.oy;
    this._timeline = {};
    this._bindTo = options.bindTo;
    this._duration = options.duration;
    this._tick = 0;
    this._isNotification = options.isNotification;
    this.x = this.realX;
    this.y = this.realY;
    this.formatString(options.string);
    this.formatTransitions();
  };

  Object.defineProperty(Window_QPopup.prototype, 'realX', {
    get: function() {
      return this._realX + this._ox;
    },
    set: function(value) {
      this._realX = value;
    },
    configurable: true
  });

  Object.defineProperty(Window_QPopup.prototype, 'realY', {
    get: function() {
      return this._realY + this._oy;
    },
    set: function(value) {
      this._realY = value;
    },
    configurable: true
  });

  Window_QPopup.prototype.normalColor = function() {
    return this._style.color;
  };

  Window_QPopup.prototype.standardFontFace = function() {
    return this._style.fontFace;
  };

  Window_QPopup.prototype.standardFontSize = function() {
    return this._style.fontSize;
  };

  Window_QPopup.prototype.standardPadding = function() {
    return this._style.padding;
  };

  Window_QPopup.prototype.formatString = function(string) {
    this.resetFontSettings();
    this.updatePadding();
    if (!this._style.windowed) {
      this.opacity = 0;
    }
    var lines = string.split(/\n|\r/);
    var largestW = 0;
    for (var i = 0; i < lines.length; i++) {
      var line = this.convertEscapeCharacters(lines[i]);
      line = line.replace(/\x1b.+?\[.+?\]/, '');
      var w = this.contents.measureTextWidth(line);
      var icons = /\\I\[(\d+?)\]/g;
      while (true) {
        var match = icons.exec(lines[i]);
        if (match) {
          w += Window_Base._iconWidth + 4;
        } else {
          break;
        }
      }
      if (w > largestW) largestW = w;
    }
    this.width = largestW + this.standardPadding() * 2;
    this.height = this.calcTextHeight({
      text: string,
      index: 0
    }, true) + this.standardPadding() * 2;
    this.createContents();
    this.drawTextEx(string, 0, 0);
    this._ox -= this.width / 2;
    this._oy -= this.height;
  };

  Window_QPopup.prototype.formatTransitions = function() {
    var transitions = this._transitions;
    for (var i = 0; i < transitions.length; i++) {
      var params = transitions[i].split(' ');
      var transition = params[2] + ' ' + params[1] +  ' ';
      var j;
      for (j = 3; j < params.length; j++) {
        transition += params[j];
        if (j !== params.length - 1) {
          transition += ' ';
        }
      }
      var startTime = Number(params[0]);
      var totalTime = Number(params[1]);
      for (j = 0; j < totalTime; j++) {
        if (!this._timeline[startTime + j]) {
          this._timeline[startTime + j] = [];
        }
        this._timeline[startTime + j].push(transition);
      }
    }
  };

  Window_QPopup.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._bindTo !== null) {
      var chara = QPlus.getCharacter(this._bindTo);
      if (chara) {
        if (Imported.QMovement) {
          var x = chara.cx();
          var y = chara.cy();
        } else {
          var x = chara.x * $gameMap.tileWidth() + $gameMap.tileWidth() / 2;
          var y = chara.y * $gameMap.tileHeight();
        }
        this.realX = x;
        this.realY = y;
      }
    }
    if (!this._isNotification) {
      this.x = this.realX;
      this.x -= $gameMap.displayX() * $gameMap.tileWidth();
      this.y = this.realY;
      this.y -= $gameMap.displayY() * $gameMap.tileHeight();
    }
    this.updateTransition();
    if (this.isPlaying()) {
      this._tick++;
    } else {
      QPopup.remove(this);
    }
  };

  Window_QPopup.prototype.updateTransition = function() {
    var currentFrame = this._timeline[this._tick];
    if (currentFrame) {
      for (var i = 0; i < currentFrame.length; i++) {
        this.processAction(currentFrame[i].split(' '));
      }
    }
  };

  Window_QPopup.prototype.processAction = function(action) {
    switch (action[0].toLowerCase()) {
      case 'slideup':
        this.slideup(action);
        break;
      case 'slidedown':
        this.slidedown(action);
        break;
      case 'fadein':
        this.fadein(action);
        break;
      case 'fadeout':
        this.fadeout(action);
        break;
    }
  };

  Window_QPopup.prototype.slideup = function(action) {
    var duration = Number(action[1]);
    var distance = Number(action[2]);
    var speed = distance / duration;
    this.pivot.y += speed;
  };

  Window_QPopup.prototype.slidedown = function(action) {
    var duration = Number(action[1]);
    var distance = Number(action[2]);
    var speed = distance / duration;
    this.pivot.y -= speed;
  };

  Window_QPopup.prototype.fadeout = function(action) {
    var duration = Number(action[1]);
    var speed = 1 / duration;
    if (this.alpha > 0) {
      this.alpha -= speed;
    }
  };

  Window_QPopup.prototype.fadein = function(action) {
    var duration = Number(action[1]);
    var speed = 1 / duration;
    if (this.alpha < 1) {
      this.alpha += speed;
    }
  };

  Window_QPopup.prototype.isPlaying = function() {
    if (this._duration === -1) return true;
    return this._tick < this._duration;
  };

  Window_QPopup.prototype.isMouseInside = function() {
    // return false, this window needs to act more like a sprite
    return false;
  };
})()
