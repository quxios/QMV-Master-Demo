//=============================================================================
// QNameInput
//=============================================================================

var Imported = Imported || {};
Imported.QNameInput = '2.0.2';

if (!Imported.QInput) {
  alert('Error: QNameInput requires QInput to work.');
  throw new Error('Error: QNameInput requires QInput to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QNameInput>
 * Quasi Input addon: Adds Keyboard Input to Name Input Scene
 * @author Quxios  | Version 2.0.2
 *
 * @requires QInput
 *
 * @param Show Window with Keys
 * @desc Set to true or false to display the old input window.
 * Default: false    MV Default: true
 * @default false
 *
 * @param Window Width
 * @desc Set the width of the window
 * MV Default: 480
 * @default 480
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * Adds Keyboard support to the Name Input Scene.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Place somewhere below QInput plugin.
 *
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *   http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * @tags input
 */
//=============================================================================

//=============================================================================
// QNameInput

(function() {
  var _PARAMS = $plugins.filter(function(p) {
    return p.description.contains('<QNameInput>') && p.status
  })[0].parameters;
  var _SHOW  = _PARAMS["Show Window with Keys"] === 'true';
  var _WIDTH = Number(_PARAMS["Window Width"]) || 480;

  //-----------------------------------------------------------------------------
  // Scene_Name

  Scene_Name.prototype.createEditWindow = function() {
    this._editWindow = new Window_NameEditInput(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
  };

  var Alias_Scene_Name_createInputWindow = Scene_Name.prototype.createInputWindow;
  Scene_Name.prototype.createInputWindow = function() {
    Alias_Scene_Name_createInputWindow .call(this);
    if (!_SHOW) {
      this._inputWindow.hide();
      this._inputWindow.deactivate();
      this._editWindow.setHandler('#enter', this.onInputOk.bind(this));
    } else {
      this._editWindow.setHandler('#enter', this._inputWindow.processOk.bind(this._inputWindow));
    }
    this._editWindow._inputWindow = this._inputWindow;
    this._inputWindow._last = 'here';
  };

  //-----------------------------------------------------------------------------
  // Window_NameEditInput

  function Window_NameEditInput() {
    this.initialize.apply(this, arguments);
  }

  Window_NameEditInput.prototype = Object.create(Window_TextInput.prototype);
  Window_NameEditInput.prototype.constructor = Window_NameEditInput;

  Window_NameEditInput.prototype.initialize = function(actor, max) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    var x = (Graphics.boxWidth - width) / 2;
    if (!_SHOW) {
      var y = (Graphics.boxHeight - height) / 2;
    } else {
      var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
    }
    this._actor = actor;
    Window_TextInput.prototype.initialize.call(this, x, y, width, height);
    this.setDefault(this._actor.name(), max);
    ImageManager.loadFace(actor.faceName());
    this.activate();
  };

  Window_NameEditInput.prototype.windowWidth = function() {
    return _WIDTH;
  };

  Window_NameEditInput.prototype.windowHeight = function() {
    return this.fittingHeight(4);
  };

  Window_NameEditInput.prototype.name = function() {
    return this._text;
  };

  Window_NameEditInput.prototype.faceWidth = function() {
    return 144;
  };

  Window_NameEditInput.prototype.left = function() {
    var nameCenter = (this.contentsWidth() + this.faceWidth()) / 2;
    var nameWidth = (this._maxLength + 1) * this.charWidth();
    return Math.min(nameCenter - nameWidth / 2, this.contentsWidth() - nameWidth);
  };

  Window_NameEditInput.prototype.itemRect = function(index) {
    return {
      x: this.left() + index * this.charWidth(),
      y: 54,
      width: this.charWidth(),
      height: this.lineHeight()
    };
  };

  Window_NameEditInput.prototype.refresh = function() {
    this.contents.clear();
    this.drawActorFace(this._actor, 0, 0);
    for (var i = 0; i < this._maxLength; i++) {
      this.drawUnderline(i);
    }
    for (var j = 0; j < this._text.length; j++) {
      this.drawChar(j);
    }
    var rect = this.itemRect(this._index);
    this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
  };

  Window_NameEditInput.prototype.add = function(ch) {
    this._inputWindow._last = 'keyboard';
    return Window_TextInput.prototype.add.call(this, ch);
  };

  //-----------------------------------------------------------------------------
  // Window_NameInput
  //
  // The window for selecting text characters on the name input screen.

  Window_NameInput.prototype.processHandling = function() {
    if (this.isOpen() && this.active) {
      if (this.isCancelTriggered()) {
        this.processBack();
      }
      if (this.isOkTriggered()) {
        this.processOk();
      }
    }
  };

  var _gamepadOk = QInput.remapped['ok'].filter(function(k) {
    return /^\$/.test(k)
  })[0];

  var _gamepadCancel = QInput.remapped['escape'].filter(function(k) {
    return /^\$/.test(k)
  })[0];

  Window_NameInput.prototype.isOkTriggered = function() {
    return Input.isRepeated('#enter') || Input.isRepeated(_gamepadOk);
  };

  Window_NameInput.prototype.isCancelTriggered = function() {
    return Input.isRepeated('#esc') || Input.isRepeated(_gamepadCancel);
  };

  Window_NameInput.prototype.processOk = function() {
    var last = this._last
    if (this._last === 'here' && this.character()) {
      this.onNameAdd();
      this._last = last;
    } else if (this._last === 'here' && this.isPageChange()) {
      SoundManager.playOk();
      this.cursorPagedown();
    } else if (this._last === 'keyboard' || this.isOk()) {
      this.onNameOk();
    }
  };

  var Alias_Window_NameInput_processCusorMove = Window_NameInput.prototype.processCursorMove;
  Window_NameInput.prototype.processCursorMove = function() {
    var lastPage = this._page;
    if (this.isCursorMovable()) {
      var lastIndex = this.index();
      if (Input.isRepeated('#down') || Input.isRepeated('$DOWN')) {
        this.cursorDown(Input.isTriggered('#down') || Input.isTriggered('$DOWN'));
      }
      if (Input.isRepeated('#up') || Input.isRepeated('$UP')) {
        this.cursorUp(Input.isTriggered('#up') || Input.isTriggered('$UP'));
      }
      if (Input.isRepeated('#right') || Input.isRepeated('$RIGHT')) {
        this.cursorRight(Input.isTriggered('#right') || Input.isTriggered('$RIGHT'));
      }
      if (Input.isRepeated('#left') || Input.isRepeated('$LEFT')) {
        this.cursorLeft(Input.isTriggered('#left') || Input.isTriggered('$LEFT'));
      }
      if (!this.isHandled('pagedown') && Input.isTriggered('#pagedown')) {
        this.cursorPagedown();
      }
      if (!this.isHandled('pageup') && Input.isTriggered('#pageup')) {
        this.cursorPageup();
      }
      if (this.index() !== lastIndex) {
        this._last = 'here';
        SoundManager.playCursor();
      }
    }
    this.updateCursor();
    if (this._page !== lastPage) {
      this._last = 'here';
      SoundManager.playCursor();
    }
  };
})();
