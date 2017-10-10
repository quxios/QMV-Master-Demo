//=============================================================================
// QYScale
//=============================================================================

var Imported = Imported || {};
Imported.QYScale = '1.1.0';

if (!Imported.QPlus) {
  alert('Error: QYScale requires QPlus to work.');
  throw new Error('Error: QYScale requires QPlus to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QYScale>
 * Change characters scale based off their Y value
 * @author Quxios  | Version 1.1.0
 *
 * @requires QPlus
 *
 * @video https://youtu.be/3zAB1WYA1kc
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin will zoom in/out character sprites based on their y position
 * on the map.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * **Map Notetag**
 * ----------------------------------------------------------------------------
 * To make a map have a YScale, you need to give it a note tag in the format:
 * ~~~
 *  <scale:MIN,MAX>
 * ~~~
 * - Min: The zoom value at the top of the map (0 Y position)
 * - Max: The zoom value at the bottom of the map
 * ============================================================================
 * ## Notetags / Comments
 * ============================================================================
 * **Have an event ignore YScale**
 * ----------------------------------------------------------------------------
 * Adding the following to the notes or in a comment will make that event ignore
 * YScaling.
 * ~~~
 *  <noYScale>
 * ~~~
 * When its in the notes, it applies to all pages. When its in the comments
 * it applies only to that page.
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QYScale
 *
 * RPGMakerWebs:
 *
 *   http://forums.rpgmakerweb.com/index.php?threads/qplugins.73023/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * Like my plugins? Support me on Patreon!
 *
 *  https://www.patreon.com/quxios
 *
 * @tags character, sprite, scale
 */
//=============================================================================

//=============================================================================
// QYScale Static Class

function QYScale() {
  throw new Error('This is a static class');
}

//=============================================================================
// QYScale

(function() {
  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    if ($dataMap) {
      QYScale.setup($dataMap.meta);
    }
    Alias_Game_Map_setup.call(this, mapId);
  };

  //-----------------------------------------------------------------------------
  // QYScale

  QYScale.setup = function(meta) {
    this._height = $dataMap.height;
    this._yScale = null;
    if (!$dataMap.meta) return;
    var scale = $dataMap.meta.scale;
    if (scale) {
      var settings = scale.split(',').map(Number);
      this._yScale = {
        min: settings[0] || 1,
        max: settings[1] || 1
      }
    }
  };

  QYScale.at = function(y) {
    if (!this.enabled()) return 1;
    var min = this._yScale.min;
    var max = this._yScale.max;
    var yMax = this._height - 1;
    var ds = max - min;
    var ry = (yMax - y) / yMax;
    return max - ry * ds;
  };

  QYScale.enabled = function() {
    return !!this._yScale;
  };

  if (Imported.QMovement) {
    var Alias_Polygon_Collider_moveTo = Polygon_Collider.prototype.moveTo;
    Polygon_Collider.prototype.moveTo = function(x, y) {
      var oldY = this.y;
      Alias_Polygon_Collider_moveTo.call(this, x, y);
      if (QYScale.enabled() && !this.isTile && oldY !== y) {
        var scale = QYScale.at(y / QMovement.tileSize);
        this.setScale(scale, scale);
      }
    };
  }

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._yScale = null;
  };

  var Alias_Game_CharacterBase_setPosition = Game_CharacterBase.prototype.setPosition;
  Game_CharacterBase.prototype.setPosition = function(x, y) {
    Alias_Game_CharacterBase_setPosition.call(this, x, y);
    this._yScale = null;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var oldY = this._realY;
    Alias_Game_CharacterBase_update.call(this);
    if (!QYScale.enabled() || !this.hasYScale()) {
      this._yScale = 1;
    } else if (QYScale.enabled() && (this._realY !== oldY || this._yScale === null)) {
      this.updateYScale();
    }
  };

  Game_CharacterBase.prototype.hasYScale = function() {
    // TODO cache this?
    var notes = this.notes(true);
    return !/<noYScale>/i.test(notes);
  };

  Game_CharacterBase.prototype.updateYScale = function() {
    this._yScale = QYScale.at(this._realY);
  };

  var Alias_Game_CharacterBase_distancePerFrame = Game_CharacterBase.prototype.distancePerFrame;
  Game_CharacterBase.prototype.distancePerFrame = function() {
    var spd = Alias_Game_CharacterBase_distancePerFrame.call(this);
    return spd * (this._yScale || 1);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character

  var Alias_Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    Alias_Sprite_Character_update.call(this);
    if (QYScale.enabled()) {
      this.updateYScale();
    }
  };

  Sprite_Character.prototype.updateYScale = function() {
    if (this._yScale !== this._character._yScale) {
      this.scale.x = this._character._yScale;
      this.scale.y = this._character._yScale;
      this._yScale = this._character._yScale;
    };
  };
})()
