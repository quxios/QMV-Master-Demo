//=============================================================================
// QEventSave
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.4')) {
  alert('Error: QEventSave requires QPlus 1.4.4 or newer to work.');
  throw new Error('Error: QEventSave requires QPlus 1.4.4 or newer to work.');
}

Imported.QEventSave = '1.1.0';

//=============================================================================
/*:
 * @plugindesc <QEventSave>
 * Save Events position on Map change
 * @version 1.1.0
 * @author Quxios  | Version 1.1.0
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
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
 * **Notetags**
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
 * ----------------------------------------------------------------------------
 * **Plugin Commands**
 * ----------------------------------------------------------------------------
 * You can mark an event as savable or not with a plugin command
 * ~~~
 *  qEventSave save CHARAID
 * ~~~
 * or to unsave
 * ~~~
 *  qEventSave save CHARAID
 * ~~~
 * - CHARAID: The character identifier. Can only be an event!
 *  * For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
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
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qeventsave') {
      return this.qEventSaveCommand(QPlus.makeArgs(args));
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qEventSaveCommand = function(args) {
    //var args2 = args.slice(2);
    //QPlus.getCharacter(args[0]);
    //QPlus.getArg(args2, /lock/i)
    var cmd = args[0].toLowerCase();
    var chara = QPlus.getCharacter(args[1]);
    if (chara.charaId() <= 0) return;
    if (cmd === 'save') {
      chara._saveable = true;
      $gameSystem.saveEvent(chara);
    } else if (cmd === 'unsave') {
      chara._saveable = false;
      $gameSystem.unsaveEvent(chara);
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
    var mapId = event._mapId;
    var eventId = event._eventId;
    if (!this._savedEvents[mapId]) {
      this._savedEvents[mapId] = {};
    }
    this._savedEvents[mapId][eventId] = QEventSave.getInfo(event);
  };

  Game_System.prototype.unsaveEvent = function(event) {
    var mapId = event._mapId;
    var eventId = event._eventId;
    if (!this._savedEvents[mapId]) {
      this._savedEvents[mapId] = {};
    }
    delete this._savedEvents[mapId][eventId];
  };

  Game_System.prototype.loadEvent = function(event) {
    var mapId = event._mapId;
    var eventId = event._eventId;
    if (!this._savedEvents[mapId]) {
      this._savedEvents[mapId] = {};
    }
    if (!this._savedEvents[mapId][eventId]) {
      return;
    }
    QEventSave.setInfo(event, this._savedEvents[mapId][eventId]);
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  Game_Map.prototype.forEachSaveEvent = function(callback) {
    if (!$dataMap) return;
    var saveableEvents = $gameSystem._savedEvents[this._mapId];
    if (!saveableEvents) return;
    for (var eventId in saveableEvents) {
      var event = this._events[eventId];
      if (event) {
        callback(event);
      }
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_initialize = Game_Event.prototype.initialize;
  Game_Event.prototype.initialize = function(mapId, eventId) {
    Alias_Game_Event_initialize.call(this, mapId, eventId);
    this.initSaveable();
  };

  Game_Event.prototype.initSaveable = function() {
    $gameSystem.loadEvent(this);
    this._saveable = /<save>/i.test(this.notes()) || $dataMap.meta.saveEvents;
    if (this._saveable) {
      $gameSystem.saveEvent(this);
    }
  };

  Game_Event.prototype.saveable = function() {
    return this._saveable;
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
