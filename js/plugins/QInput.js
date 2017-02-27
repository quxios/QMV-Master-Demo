//=============================================================================
// QInput
//=============================================================================

var Imported = Imported || {};
Imported.QInput = '2.1.1';

//=============================================================================
 /*:
 * @plugindesc <QInput>
 * Adds additional keys to Input class, and allows remapping keys.
 * @author Quxios  | Version 2.1.1
 *
 * @param Threshold
 * @desc The threshold for gamepad analog sticks to send input
 * MV Default: 0.5,   value should be between 0.1 to 1.0
 * @default 0.5
 *
 * @param ========
 * @desc spacer
 * @default
 *
 * @param Ok
 * @desc Which buttons will trigger the ok input
 * MV Default: #enter, #space, #z, $A
 * @default #enter, #space, #z, $A
 *
 * @param Escape / Cancel
 * @desc Which buttons will trigger the escape / cancel input
 * MV Default: #esc, #insert, #x, #num0, $B
 * @default #esc, #insert, #x, #num0, $B
 *
 * @param Menu
 * @desc Which buttons will trigger the menu input
 * MV Default: $Y
 * @default $Y
 *
 * @param Shift
 * @desc Which buttons will trigger the shift input
 * MV Default: #shift, #cancel, $X
 * @default #shift, #cancel, $X
 *
 * @param Control
 * @desc Which buttons will trigger the control input
 * MV Default: #ctrl, #alt
 * @default #ctrl, #alt
 *
 * @param Tab
 * @desc Which buttons will trigger the tab input
 * MV Default: #tab
 * @default #tab
 *
 * @param Pageup
 * @desc Which buttons will trigger the pageup input
 * MV Default: #pageup, #q, $L1
 * @default #pageup, #q, $L1
 *
 * @param Pagedown
 * @desc Which buttons will trigger the pagedown input
 * MV Default: #pagedown, #w, $R1
 * @default #pagedown, #w, $R1
 *
 * @param Left
 * @desc Which buttons will trigger the left input
 * MV Default: #left, #num4, $LEFT
 * @default #left, #num4, $LEFT
 *
 * @param Right
 * @desc Which buttons will trigger the right input
 * MV Default: #right, #num6, $RIGHT
 * @default #right, #num6, $RIGHT
 *
 * @param Up
 * @desc Which buttons will trigger the up input
 * MV Default: #up, #num8, $UP
 * @default #up, #num8, $UP
 *
 * @param Down
 * @desc Which buttons will trigger the down input
 * MV Default: #down, #num2, $DOWN
 * @default #down, #num2, $DOWN
 *
 * @param Debug
 * @desc Which buttons will trigger the debug input
 * MV Default: #f9
 * @default #f9
 *
 * @param ===========
 * @desc spacer
 * @default
 *
 * @param FPS
 * @desc Which button will open fps
 * MV Default: f2
 * @default f2
 *
 * @param Streched
 * @desc Which button will strech Screen
 * MV Default: f3
 * @default f3
 *
 * @param FullScreen
 * @desc Which button will trigger fullscreen
 * MV Default: f4
 * @default f4
 *
 * @param Restart
 * @desc Which button will restart the game
 * MV Default: f5
 * @default f5
 *
 * @param Console
 * @desc Which button will open console during testing
 * MV Default: f8
 * @default f8
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin enables full keyboard support as well as letting you set the
 * default keyboard keys for mv inputs.
 * ============================================================================
 * ## Remap Default Keys
 * ============================================================================
 * This allows you to change what keys input calls are related to.
 * You can set them to multiple keys by seperating each key with a comma.
 * You must use a QKey (Available keys listed below)
 * Keys are case sensative!!! Means #C is not the same as #c !!IMPORTANT!!
 *
 * ----------------------------------------------------------------------------
 *  **Example of changing to wasd format**
 * ----------------------------------------------------------------------------
 * Set the parameter for left to: `#a`
 *
 * Set the parameter for right to: `#d`
 *
 * Set the parameter for up to: `#w`
 *
 * Set the parameter for down to: `#s`
 *
 * Set the parameter for pagedown to: (page down uses w, so we'll change to e)
 *   `#pagedown, #e`
 *
 * Optional: Use f key instead of z in enter input
 *   `#enter, #space, #f`
 *
 * For FPS, Streched, FullScreen, Restart, Console you can only put 1 key!
 * Do not use the # idetifier.
 *
 * If you want to disable one of those, set it to 0E, if you put in an
 * incorrect key, it will use default MV key
 * ============================================================================
 * ## QKeys List
 * ============================================================================
 * ** Modifier keys**
 * ----------------------------------------------------------------------------
 *   #backspace    #tab      #enter      #shift      #ctrl
 *   #alt          #esc      #space      #pageup     #pagedown
 *   #left         #up       #right      #down       #escape
 * ----------------------------------------------------------------------------
 * **Numbers (Above letters**
 * ----------------------------------------------------------------------------
 *   #0   #1   #2   #3   #4   #5   #6   #7   #8   #9
 * ----------------------------------------------------------------------------
 * **Numpad**
 * ----------------------------------------------------------------------------
 *   #num0    #num1      #num2     #num3      #num4
 *   #num5    #num6      #num7     #num8      #num9
 * ----------------------------------------------------------------------------
 * **Letters**
 * ----------------------------------------------------------------------------
 *   #a #b #c ... #z
 *
 * (All letters between a-z US keyboard, just add a # infront)
 * ----------------------------------------------------------------------------
 * **F Keys**
 * ----------------------------------------------------------------------------
 *   #f1  #f2  #f3  #f4  #f5  #f6  #f7  #f8  #f9  #f10  #f11  #f12
 * ----------------------------------------------------------------------------
 * **Special Characters**
 * ----------------------------------------------------------------------------
 *   #semicolon     #equal      #comma         #minus        #period
 *   #slash         #grave      #openbracket   #backslash    #closedbracket
 *   #singlequote
 * ============================================================================
 * ## Using QKeys
 * ============================================================================
 * If you haven't noticed by now, Qkeys have a # identifier. So if you want
 * to run a trigger check for left key you will run:
 * ~~~
 *  Input.isTriggered("#left");
 * ~~~
 * If you didn't use the # and put
 * ~~~
 *  Input.isTriggered("left");
 * ~~~
 * This will check for the keys you set for parameter left, so by default this
 * will let numberpad 4 to trigger this as well.
 *
 * I also added an extra input check
 * ~~~
 *  Input.anyTriggered(keylist);
 * ~~~
 * Keylist is a string with keys seperated by commas.
 * You can also set it to a-z, a-z0-9 or sym.
 * If keylist is left empty it will return true when any key is pressed
 * ============================================================================
 * ## Gamepad Keys
 * ============================================================================
 * Gamepad keys begin with $ and are in all caps. Here's the list of gamepad keys:
 *
 * - Buttons: $A, $B, $X, $Y, $SELECT, $START
 * - Triggers: $L1, $L2, $L3, $R1, $R2, $R3
 * - DPad: $UP, $DOWN, $LEFT, $RIGHT
 * =============================================================================
 * ## Advanced Users: Using Window_TextInput
 * =============================================================================
 * This new window will allow for a keyboard input.
 * If you want to see how it is used please look at the code or look at
 * QNameInput.js as they both use Window_TextInput
 *
 * There are also 2 new functions in game input which might be useful:
 * ~~~
 * Input.preferKeyboard()
 * ~~~
 * Will return true if the last input was sent with the keyboard.
 *
 * ~~~
 * Input.preferGamepad()
 * ~~~
 * Will return true if the last input was sent with the gamepad.
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
 * @tags input, keyboard
 */
//=============================================================================

//=============================================================================
// New Classes

function Window_TextInput() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QInput Static Class

function QInput() {
 throw new Error('This is a static class');
}

QInput.stringToAry = function(string) {
  var ary = string.split(',');
  ary = ary.map(function(s) {
    return s.trim();
  });
  return ary;
};

//=============================================================================
// QInput

(function() {
  var _params = $plugins.filter(function(p) {
    return p.description.contains('<QInput>') && p.status;
  })[0].parameters;
  var _threshold = Number(_params['Threshold']) || 0.1;

  QInput.remapped = {};
  QInput.remapped['ok']       = QInput.stringToAry(_params['Ok']);
  QInput.remapped['escape']   = QInput.stringToAry(_params['Escape / Cancel']);
  QInput.remapped['menu']     = QInput.stringToAry(_params['Menu']);
  QInput.remapped['shift']    = QInput.stringToAry(_params['Shift']);
  QInput.remapped['control']  = QInput.stringToAry(_params['Control']);
  QInput.remapped['tab']      = QInput.stringToAry(_params['Tab']);
  QInput.remapped['pageup']   = QInput.stringToAry(_params['Pageup']);
  QInput.remapped['pagedown'] = QInput.stringToAry(_params['Pagedown']);
  QInput.remapped['left']     = QInput.stringToAry(_params['Left']);
  QInput.remapped['right']    = QInput.stringToAry(_params['Right']);
  QInput.remapped['up']       = QInput.stringToAry(_params['Up']);
  QInput.remapped['down']     = QInput.stringToAry(_params['Down']);
  QInput.remapped['debug']    = QInput.stringToAry(_params['Debug']);
  QInput.remapped['fps']        = _params['FPS'];
  QInput.remapped['streched']   = _params['Streched'];
  QInput.remapped['fullscreen'] = _params['FullScreen'];
  QInput.remapped['restart']    = _params['Restart'];
  QInput.remapped['console']    = _params['Console'];

  // Key codes from
  // https://msdn.microsoft.com/en-us/library/dd375731(v=VS.85).aspx
  QInput.keys = {
    14: "0E",
    8: "backspace", 9: "tab", 13: "enter", 16: "shift", 17: "ctrl", 18: "alt",
    27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 37: "left",
    38: "up",  39: "right", 40: "down", 45: "escape",
    48: "0",  49: "1",  50: "2",  51: "3",  52: "4",  53: "5",  54: "6",
    55: "7",  56: "8",  57: "9",
    96: "num0",   97: "num1",   98: "num2",   99: "num3",  100: "num4",
    101: "num5", 102: "num6",  103: "num7",  104: "num8",  105: "num9",
    65: "a",  66: "b",  67: "c",  68: "d",  69: "e",  70: "f",  71: "g",
    72: "h",  73: "i",  74: "j",  75: "k",  76: "l",  77: "m",  78: "n",
    79: "o",  80: "p",  81: "q",  82: "r",  83: "s",  84: "t",  85: "u",
    86: "v",  87: "w",  88: "x",  89: "y",  90: "z",
    112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6",
    118: "f7", 119: "f8", 120: "f9", 121: "f10", 122: "f11", 123: "f12",
    186: "semicolon",  187: "equal", 188: "comma", 189: "minus", 190: "period",
    191: "slash", 192: "grave", 219: "openbracket", 220: "backslash",
    221: "closedbracket", 222: "singlequote"
  };

  // returns key code based off the key name
  QInput.keyAt = function(obj, val) {
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      if (obj[key] === val) return key;
    }
  };

  // you can create custom remap keys by aliasing this function
  // using "QInput.remap" without the public. Just add a similar if statement
  // or switch. You will need to initialize your custom key by doing something like:
  //   ConfigManager.keys["custom"] = "f1";
  //   QInput.remapped["custom"] = "f1";
  //
  // ConfigManager.keys is real remap key while QInput.remapped is the default
  // values, which is needed if you are using an in game key remapper so it knows
  // what value to set it when setting all the keys back to default.
  QInput.remap = function(key) {
    switch(key) {
      case 'tab':
        return ConfigManager.keys['tab'];
        break;
      case 'ok':
        return ConfigManager.keys['ok'];
        break;
      case 'shift':
        return ConfigManager.keys['shift'];
        break;
      case 'control':
        return ConfigManager.keys['control'];
        break;
      case 'menu':
        return ConfigManager.keys['menu'];
        break;
      case 'escape':
      case 'cancel':
        return ConfigManager.keys['escape'];
        break;
      case 'pageup':
        return ConfigManager.keys['pageup'];
        break;
      case 'pagedown':
        return ConfigManager.keys['pagedown'];
        break;
      case 'left':
        return ConfigManager.keys['left'];
        break;
      case 'right':
        return ConfigManager.keys['right'];
        break;
      case 'up':
        return ConfigManager.keys['up'];
        break;
      case 'down':
        return ConfigManager.keys['down'];
        break;
      case 'debug':
        return ConfigManager.keys['debug'];
        break;
      case 'fps':
        return Number(this.keyAt(ConfigManager.keys['fps'])) || 113;
        break;
      case 'streched':
        return Number(this.keyAt(ConfigManager.keys['streched'])) || 114;
        break;
      case 'fullscreen':
        return Number(this.keyAt(ConfigManager.keys['fullscreen']))  || 115;
        break;
      case 'restart':
        return Number(this.keyAt(ConfigManager.keys['restart'])) || 116;
        break;
      case 'console':
        return Number(this.keyAt(ConfigManager.keys['console'])) || 119;
        break;
    }
  };

  // Gamepad button index to input action
  // shouldn't be used, left just incase
  Input.gamepadMapper = {
    0: '$ok',        // A
    1: '$cancel',    // B
    2: '$shift',     // X
    3: '$menu',      // Y
    4: '$pageup',    // L1
    5: '$pagedown',  // R1
    6: '', // L2
    7: '', // R2
    8: '', // Select
    9: '', // Start
    10: '', // L3
    11: '', // R3
    12: '$up',       // D-pad up
    13: '$down',     // D-pad down
    14: '$left',     // D-pad left
    15: '$right',    // D-pad right
  };

  // Gamepad button index to button name
  Input.gamepadKeys = {
    0: '$A', 1: '$B', 2: '$X', 3: '$Y',
    4: '$L1', 5: '$R1', 6: '$L2', 7: '$R2', 10: '$L3', 11: '$R3',
    8: '$SELECT', 9: '$START',
    12: '$UP', 13: '$DOWN', 14: '$LEFT', 15: '$RIGHT'
  };

  var Alias_Input_clear = Input.clear;
  Input.clear = function() {
    Alias_Input_clear.call(this);
    this._lastUsed = 'keyboard';
    this._ranPress = false;
    this._lastPressed = null;
    this._lastTriggered = null;
    this._lastGamepadDown = null;
    this._dirAxesA = new Point(0, 0);
    this._dirAxesB = new Point(0, 0);
  };

  // Checks if any press is pressed with .onkeydown()
  Input.anyTriggered = function(keys) {
    var any = [];
    var start, i, j;
    if (keys === 'sym') {
      start = 186
      for (i = 0; i < 11; i++) {
        if (i > 6) {
          start = 212;
        }
        any.push(QInput.keys[start + i]);
      }
    }
    if (keys === '0-9' || keys === 'a-z0-9') {
      start = 48;
      for (i = 0; i < 20; i++) {
        if (i > 9) {
          start = 86; // 10 less then 96 since I will be at 10
        }
        any.push(QInput.keys[start + i]);
      }
    }
    if (keys === 'a-z' || keys === 'a-z0-9') {
      start = 65;
      for (i = 0; i < 26; i++) {
        any.push(QInput.keys[start + i]);
      }
    }
    if (!keys) {
      for (var key in QInput.keys) {
        if (!QInput.keys.hasOwnProperty(key)) continue;
        any.push(QInput.keys[key]);
      }
    }
    if (any.length === 0) {
      any = keys.split(',');
      any = any.map(function(s) {
        s =  s.replace(/\s+|#/g, '');
        return s;
      });
    }
    for (i = 0, j = any.length; i < j; i++) {
      if (this.isTriggered('#' + any[i])) {
        this._lastTriggered = any[i];
        return true;
      }
    }
  };

  // Checks if any press is pressed with .onkeypress()
  Input.anyPressed = function(keys) {
    if (this._ranPress) {
      // should filter the input here based of the keys argument
      // the key that was pressed can be grabbed with this._lastPressed
      this._ranPress = false;
      return true;
    }
    return false;
  };

  Input.remap = function(keyName, alias) {
    var newKey = QInput.remap(keyName);
    if (!newKey) return alias.call(this, keyName);
    if (newKey.constructor === Array) {
      var i, pressed;
      for (i = 0; i < newKey.length; i++) {
        var key = newKey[i];
        if (/^\$/.test(newKey[i])) {
          //key = QInput.keyAt(this.gamepadKeys, key);
        }
        if (alias.call(this, key)) {
          pressed = true;
          break;
        }
      }
      return pressed;
    }
    if (/^\$/.test(newKey)) {
      //newKey = QInput.keyAt(this.gamepadKeys, newKey);
    }
    return alias.call(this, newKey);
  };

  var Alias_Input_isPressed = Input.isPressed;
  Input.isPressed = function(keyName) {
    if (!/^#/.test(keyName)) {
      return this.remap(keyName, Alias_Input_isPressed);
    }
    return Alias_Input_isPressed.call(this, keyName);
  };

  var Alias_Input_isTriggered = Input.isTriggered;
  Input.isTriggered = function(keyName) {
    if (!/^#/.test(keyName)) {
      return this.remap(keyName, Alias_Input_isTriggered);
    }
    return Alias_Input_isTriggered.call(this, keyName);
  };

  var Alias_Input_isRepeated = Input.isRepeated;
  Input.isRepeated = function(keyName) {
    if (!/^#/.test(keyName)) {
      return this.remap(keyName, Alias_Input_isRepeated);
    }
    return Alias_Input_isRepeated.call(this, keyName);
  };

  var Alias_Input_isLongPressed = Input.isLongPressed;
  Input.isLongPressed = function(keyName) {
    if (!/^#/.test(keyName)) {
      return this.remap(keyName, Alias_Input_isLongPressed);
    }
    return Alias_Input_isLongPressed.call(this, keyName);
  };

  // Added keypress listener to check for caps lock.
  var Alias_Input__setupEventHandlers = Input._setupEventHandlers;
  Input._setupEventHandlers = function() {
    document.addEventListener('keypress', this._onKeyPress.bind(this));
    Alias_Input__setupEventHandlers.call(this);
  };

  Input._onKeyDown = function(event) {
    this._lastUsed = 'keyboard';
    if (this._shouldPreventDefault(event.keyCode)) {
      event.preventDefault();
    }
    if (event.keyCode === 144) {    // Numlock
      this.clear();
    }
    var buttonName = QInput.keys[event.keyCode];
    this._lastTriggered = buttonName;
    if (buttonName) {
      this._currentState["#" + buttonName] = true;
    } else {
      buttonName = Input.keyMapper[event.keyCode];
      if (buttonName) {
        this._currentState[buttonName] = true;
      }
    }
  };

  Input._onKeyUp = function(event) {
    var buttonName = QInput.keys[event.keyCode];
    if (buttonName) {
      this._currentState["#" + buttonName] = false;
    } else {
      buttonName = Input.keyMapper[event.keyCode];
      if (buttonName) {
        this._currentState[buttonName] = false;
      }
    }
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
      this.clear();
    }
  };

  Input._onKeyPress = function(event) {
    this._lastUsed = 'keyboard';
    this._lastPressed = String.fromCharCode(event.charCode);
    this._ranPress = true;
    this._setCapsLock(event);
  };

  // Based off
  // http://www.codeproject.com/Articles/17180/Detect-Caps-Lock-with-Javascript
  Input._setCapsLock = function(event) {
    var key   = event.keyCode;
    var shift = event.shiftKey ? event.shiftKey : key === 16;
    if ((key >= 65 && key <= 90 && !shift) || (key >= 97 && key <= 122 && shift)) {
      this.capsLock = true;
    } else {
      this.capsLock = false;
    }
  };

  Input._updateGamepadState = function(gamepad) {
    var lastState = this._gamepadStates[gamepad.index] || [];
    var newState = [];
    var buttons = gamepad.buttons;
    var axes = gamepad.axes;
    this._usingGamepad = false;
    this._lastGamepadDown = null;
    this._dirAxesA.x = 0;
    this._dirAxesA.y = 0;
    this._dirAxesB.x = 0;
    this._dirAxesB.y = 0;
    newState[12] = false;
    newState[13] = false;
    newState[14] = false;
    newState[15] = false;
    for (var i = 0; i < buttons.length; i++) {
      newState[i] = buttons[i].pressed;
    }
    // dpad
    if (newState[12]) {
      this._dirAxesA.y = -1;
    }
    if (newState[13]) {
      this._dirAxesA.y = 1;
    }
    if (newState[14]) {
      this._dirAxesA.x = -1;
    }
    if (newState[15]) {
      this._dirAxesA.x = 1;
    }
    // left stick
    if (axes[0] < -_threshold) {
      this._dirAxesA.x = axes[0];
      newState[14] = true;    // left
      this._lastUsed = 'gamepad';
    } else if (axes[0] > _threshold) {
      this._dirAxesA.x = axes[0];
      newState[15] = true;    // right
      this._lastUsed = 'gamepad';
    }
    if (axes[1] < -_threshold) {
      this._dirAxesA.y = axes[1];
      newState[12] = true;    // up
      this._lastUsed = 'gamepad';
    } else if (axes[1] > _threshold) {
      this._dirAxesA.y = axes[1];
      newState[13] = true;    // down
      this._lastUsed = 'gamepad';
    }
    // right stick
    if (Math.abs(axes[2]) > _threshold) {
      this._dirAxesB.x = axes[2];
      this._lastUsed = 'gamepad';
    }
    if (Math.abs(axes[3]) > _threshold) {
      this._dirAxesB.y = axes[3];
      this._lastUsed = 'gamepad';
    }
    for (var j = 0; j < newState.length; j++) {
      if (newState[j] !== lastState[j]) {
        var buttonName = this.gamepadKeys[j];
        if (buttonName) {
          this._lastUsed = 'gamepad';
          this._lastGamepadDown = this.gamepadKeys[j];
          this._currentState[buttonName] = newState[j];
        }
      }
    }
    this._gamepadStates[gamepad.index] = newState;
  };

  Input.anyGamepadTriggered = function() {
    var states = this._gamepadStates;
    for (var i = 0; i < states.length; i++) {
      if (states[i]) {
        return this.gamepadKeys[i];
      }
    }
    return false;
  };

  Input.preferKeyboard = function() {
    return this._lastUsed === 'keyboard';
  };

  Input.preferGamepad = function() {
    return this._lastUsed === 'gamepad';
  };

  //-----------------------------------------------------------------------------
  // Graphics

  Graphics._onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
      switch (event.keyCode) {
      case QInput.remap('fps'):
        event.preventDefault();
        this._switchFPSMeter();
        break;
      case QInput.remap('stretch'):
        event.preventDefault();
        this._switchStretchMode();
        break;
      case QInput.remap('fullscreen'):
        event.preventDefault();
        this._switchFullScreen();
        break;
      }
    }
  };

  //-----------------------------------------------------------------------------
  // SceneManager
  //
  // The static class that manages scene transitions.

  SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
      switch (event.keyCode) {
      case QInput.remap('restart'):
        if (Utils.isNwjs()) {
          location.reload();
        }
        break;
      case QInput.remap('console'):
        if (Utils.isNwjs() && Utils.isOptionValid('test')) {
          if (Imported.QElectron) {
            require('electron').ipcRenderer.send('open-DevTools');
          } else {
            require('nw.gui').Window.get().showDevTools();
          }
        }
        break;
      }
    }
  };

  //-----------------------------------------------------------------------------
  // ConfigManager

  ConfigManager.keys = JSON.parse(JSON.stringify(QInput.remapped));

  //-----------------------------------------------------------------------------
  // Window_TextInput

  Window_TextInput.prototype = Object.create(Window_Base.prototype);
  Window_TextInput.prototype.constructor = Window_TextInput;

  Window_TextInput.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x || 0, y || 0, width || this.windowWidth(), height || this.windowHeight());
    this._text = "";
    this._title = "";
    this._index = 0;
    this._maxLength = 1;
    this._mode = "a-z0-9"; // mode currently does nothing
    this._handlers = {};
    this._default = {name: "", mode: "a-z0-9"};
    Input.clear();
    this.deactivate();
    this.refresh();
  };


  Window_TextInput.prototype.windowWidth = function() {
    return 480;
  };

  Window_TextInput.prototype.windowHeight = function() {
    return this.fittingHeight(2);
  };

  Window_TextInput.prototype.center = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
  };

  Window_TextInput.prototype.update = function() {
    var wasOpenAndActive = this.isOpenAndActive();
    Window_Base.prototype.update.call(this);
    if (!wasOpenAndActive && this.isOpenAndActive()) {
      Input.clear();
    }
    this.processHandling();
  };

  Window_TextInput.prototype.processHandling = function() {
    if (this.isOpenAndActive()) {
      for (var handler in this._handlers) {
        if (!this._handlers.hasOwnProperty(handler)) continue;
        if (Input.isTriggered(handler)) {
          Input.clear();
          this.callHandler(handler);
          return;
        }
      }
      if (Input.isRepeated('#backspace')) {
        if (this.back()) {
          Input.clear();
          SoundManager.playCancel();
          return;
        }
      }
      if (Input.isTriggered('#esc')) {
        return this.callHandler('#esc');
      }
      if (Input.anyPressed(this._mode)) {
        this.add(Input._lastPressed);
      }
    }
  };

  Window_TextInput.prototype.isOpenAndActive = function() {
    return this.isOpen() && this.active;
  };

  Window_TextInput.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
  };

  Window_TextInput.prototype.isHandled = function(symbol) {
    return !!this._handlers[symbol];
  };

  Window_TextInput.prototype.callHandler = function(symbol) {
    if (this.isHandled(symbol)) {
      this._handlers[symbol]();
    }
  };

  Window_TextInput.prototype.setTitle = function(title) {
    this._title = title;
    this.refresh();
  };

  Window_TextInput.prototype.text = function() {
    return this._text;
  };

  Window_TextInput.prototype.setHandler = function(symbol, method) {
    this._handlers[symbol] = method;
  };

  Window_TextInput.prototype.setDefault = function(name, max, mode) {
    this._default.name = String(name || '');
    this._default.max = max;
    this._default.mode = mode || '~a-z0-9';
    return this.restoreDefault();
  };

  Window_TextInput.prototype.restoreDefault = function() {
    this._text      = this._default.name;
    this._index     = this._default.name.length;
    this._mode      = this._default.mode;
    this._maxLength = this._default.max;
    this.refresh();
    return this._text.length > 0;
  };

  Window_TextInput.prototype.add = function(ch) {
    if (this._index < this._maxLength) {
      this._text += ch;
      this._index++;
      this.refresh();
      return true;
    } else {
      return false;
    }
  };

  Window_TextInput.prototype.back = function() {
    if (this._index > 0) {
      this._index--;
      this._text = this._text.slice(0, this._index);
      this.refresh();
      return true;
    } else {
      return false;
    }
  };

  Window_TextInput.prototype.charWidth = function() {
    var text = $gameSystem.isJapanese() ? '\uff21' : 'A';
    return this.textWidth(text);
  };

  Window_TextInput.prototype.left = function() {
    var nameCenter = this.contentsWidth() / 2;
    var nameWidth = (this._maxLength + 1) * this.charWidth();
    return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
  };

  Window_TextInput.prototype.itemRect = function(index) {
    return {
      x: this.left() + index * this.charWidth(),
      y: this.lineHeight(),
      width: this.charWidth(),
      height: this.lineHeight()
    };
  };

  Window_TextInput.prototype.underlineRect = function(index) {
    var rect = this.itemRect(index);
    rect.x++;
    rect.y += rect.height - 4;
    rect.width -= 2;
    rect.height = 2;
    return rect;
  };

  Window_TextInput.prototype.underlineColor = function() {
    return this.normalColor();
  };

  Window_TextInput.prototype.drawUnderline = function(index) {
    var rect = this.underlineRect(index);
    var color = this.underlineColor();
    this.contents.paintOpacity = 48;
    this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
    this.contents.paintOpacity = 255;
  };

  Window_TextInput.prototype.drawChar = function(index) {
    var rect = this.itemRect(index);
    this.resetTextColor();
    this.drawText(this._text[index] || '', rect.x, rect.y);
  };

  Window_TextInput.prototype.refresh = function() {
    this.contents.clear();
    for (var i = 0; i < this._maxLength; i++) {
      this.drawUnderline(i);
    }
    for (var j = 0; j < this._text.length; j++) {
      this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
  };
})()
