//=============================================================================
// QNameInput
//=============================================================================

var Imported = Imported || {};
Imported.QNameInput = '2.0.0';

if (!Imported.QInput) {
  var msg = 'Error: QNameInput requires QInput to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QNameInput>
 * Quasi Input addon: Adds Keyboard Input to Name Input Scene
 * @author Quxios  | Version 2.0.0
 *
 * @requires QInput
 *
 * @param Show Window with Keys
 * @desc Set to true or false to display the old input window.
 * Default: true
 * @default true
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
 *   http://forums.rpgmakerweb.com/index.php?/topic/73023-qplugins/
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
  var _params = $plugins.filter(function(p) {
    return p.description.contains('<QNameInput>') && p.status
  })[0].parameters;
  var _show  = _params["Show Window with Keys"] === "true";
  var _width = Number(_params["Window Width"]) || 480;

  //-----------------------------------------------------------------------------
  // Scene_Name

  Scene_Name.prototype.createEditWindow = function() {
    this._editWindow = new Window_NameEditInput(this._actor, this._maxLength);
    this.addWindow(this._editWindow);
  };

  var Alias_Scene_Name_createInputWindow = Scene_Name.prototype.createInputWindow;
  Scene_Name.prototype.createInputWindow = function() {
    Alias_Scene_Name_createInputWindow .call(this);
    if (!_show) {
      this._inputWindow.hide();
      this._inputWindow.deactivate();
      this._editWindow.setHandler('#enter', this.onInputOk.bind(this));
    }
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
    if (!_show) {
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
    return _width;
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
        Input.clear();
        this.processOk();
      }
    }
  };

  Window_NameInput.prototype.isOkTriggered = function() {
    return Input.isRepeated('#enter');
  };

  Window_NameInput.prototype.isCancelTriggered = function() {
    return Input.isRepeated('#esc');
  };

  var Alias_Window_NameInput_processCusorMove = Window_NameInput.prototype.processCursorMove;
  Window_NameInput.prototype.processCursorMove = function() {
    // Force to use real down, up, left, right, pageup, pagedown keys
    if (Input.anyTriggered("num2, num4, num6, num8, 2, 4, 6, 8, q, w")) {
      return;
    }
    return Alias_Window_NameInput_processCusorMove.call(this);
  };
})();
