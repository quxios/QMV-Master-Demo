//=============================================================================
// QEventSave
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.4')) {
  alert('Error: QEventSave requires QPlus 1.4.4 or newer to work.');
  throw new Error('Error: QEventSave requires QPlus 1.4.4 or newer to work.');
}

Imported.QEventSave = '1.0.1';

//=============================================================================
/*:
* @plugindesc <QEventSave>
* Save Events position on Map change
* @author Quxios  | Version 1.0.1
* 
* @requires QPlus
*
* @help
* ============================================================================
* ## About
* ============================================================================
* This plugin allows you to save events position and move route when switching
* maps.
* ============================================================================
* ## How to use
* ============================================================================
* **Plugin Commands**
* ----------------------------------------------------------------------------
* To enable for all events on the map, add the following notetag to the map:
* ~~~
*  <saveEvents>
* ~~~
*
* To enable this for a specific event, add the following notetag to the event:
* ~~~
*  <save>
* ~~~
* ============================================================================
* ## Links
* ============================================================================
* Formated Help:
*
*  https://quxios.github.io/#/plugins/QEventSave
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
* @tags events, save
*/
//=============================================================================

//=============================================================================
// QEventSave Class

function QEventSave() {
  throw new Error('This is a static class');
}

(function() {
  //-----------------------------------------------------------------------------
  // QEventSave

  QEventSave.getKey = function(event) {
    var mapId = event._mapId;
    var eventId = event._eventId;
    return 'M' + mapId + ':E' + eventId;
  };

  QEventSave.getInfo = function(event) {
    var info = {
      _x: event._x,
      _y: event._y,
      _direction: event.direction(),
      _moveRoute: event._moveRoute,
      _moveRouteIndex: event._moveRouteIndex
    }
    if (Imported.QMovement) {
      info._radian = event._radian;
      info._forwardRadian = event._forwardRadian;
      info._currentRad = event._currentRad;
      info._targetRad = event._targetRad;
      info._pivotX = event._pivotX;
      info._pivotY = event._pivotY;
      info._radiusL = event._radiusL;
      info._angularSpeed = event._angularSpeed;
    }
    return info;
  };

  QEventSave.setInfo = function(event, info) {
    Object.assign(event, info);
    event.setPosition(info._x, info._y);
    event.setDirection(event._direction);
    if (Imported.QMovement) {
      event.setRadian(info._radian);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_System

  var Alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Alias_Game_System_initialize.call(this);
    this._savedEvents = {};
  };

  Game_System.prototype.saveEvent = function(event) {
    var key = QEventSave.getKey(event);
    this._savedEvents[key] = QEventSave.getInfo(event);
  };

  Game_System.prototype.loadEvent = function(event) {
    var key = QEventSave.getKey(event);
    if (!this._savedEvents[key]) {
      return;
    }
    QEventSave.setInfo(event, this._savedEvents[key]);
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    this.forEachSaveEvent($gameSystem.loadEvent.bind($gameSystem));
  };

  Game_Map.prototype.forEachSaveEvent = function(callback) {
    if (!$dataMap) return;
    var saveAll = !!$dataMap.meta.saveEvents;
    for (var i = 0; i < this._events.length; i++) {
      var event = this._events[i];
      if (!event) continue;
      var notes = event.notes();
      if (saveAll || /<save>/i.test(notes)) {
        callback(event);
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Map

  var Alias_Scene_Map_create = Scene_Map.prototype.create;
  Scene_Map.prototype.create = function() {
    if ($gamePlayer.isTransferring()) {
      $gameMap.forEachSaveEvent($gameSystem.saveEvent.bind($gameSystem));
    }
    Alias_Scene_Map_create.call(this);
  };
})();
