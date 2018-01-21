//=============================================================================
// QEvent
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.5.0')) {
  alert('Error: QEvent requires QPlus 1.5.0 or newer to work.');
  throw new Error('Error: QEvent requires QPlus 1.5.0 or newer to work.');
}

Imported.QEvent = '1.0.1';

//=============================================================================
/*:
 * @plugindesc <QEvent>
 * Extends Common Event functionality
 * @version 1.0.1
 * @author Quxios  | Version 1.0.1
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 * 
 * @requires QPlus
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin adds some extra functionality to common events to make them
 * more powerful for advanced users.
 * ============================================================================
 * ## QEvent
 * ============================================================================
 * A QEvent is a new type of common event. You can run a QEvent multiple times
 * in a single frame compared to a common event which you can only run 1
 * common event per frame (unless it's a parallel trigger).
 * 
 * QEvents also pass in some extra info about where / who called the event. You
 * can grab that info with some script calls.
 * 
 * To make a common event as a QEvent, you need to add a comment with the following:
 * ~~~
 *  <QEvent>
 * ~~~
 * ----------------------------------------------------------------------------
 * **Extra into**
 * ----------------------------------------------------------------------------
 * The extra info is stored inside an Object which can be accessed with the
 * script call:
 * ~~~
 *  this.q
 * ~~~
 * 
 * What is contained in the object depends on what calls it. By default they will
 * all contain a `type` property which returns a string based on where it was
 * called from.
 * ============================================================================
 * ## Triggers
 * ============================================================================
 * I've added a few extra common event triggers:
 * - move: Will run the common event when anything moves
 * - eventMove: Will run the common event when any event moves
 * - playerMove: Will run the common event when the player moves
 * 
 * To set the trigger you need to add a comment in the common event with the format:
 * ~~~
 * <trigger:TYPE>
 * ~~~
 * Where TYPE can be; move, eventMove, or playerMove
 * 
 * All these common events will run as a QEvent even if they aren't maked as a
 * QEvent. For the extra info they will pass the following properties:
 * ~~~
 * this.q.type // returns 'CHARA'
 * this.q.chara // returns the character object
 * this.q.charaId // returns the charaId, event id for events
 * this.q.x // returns the grid x position
 * this.q.y // returns the grid y position
 * this.q.region // returns the regions the character is currently on
 * ~~~
 * ============================================================================
 * ## Cooldowns
 * ============================================================================
 * You can add a cooldown to a QEvent, if you try to run the QEvent while it's
 * on cooldown, it will not run.
 * 
 * To add a cooldown, add the a comment in the common event with the format:
 * ~~~
 * <cooldown:TICK>
 * ~~~
 * - TICK: the time until it can run again, in frames (60 frames = 1 second)
 * 
 * If the QEvent was called fom a CHARA type then the cooldown is unique per character
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QEvent
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
 * @tags
 */
//=============================================================================

//=============================================================================
// QEventManager Static Class

function QEventManager() {
  throw new Error('This is a static class');
}


//=============================================================================
// New Classes

function Game_QEvent() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QEvent

(function() {
  //-----------------------------------------------------------------------------
  // QEventManager

  QEventManager._ceMeta = [];
  QEventManager._qTriggers = {
    onAnyMove: [],
    onEventMove: [],
    onPlayerMove: [],
    // TODO: add more triggers
  }
  QEventManager._qEventIds = {};
  QEventManager._running = [];
  QEventManager._cooldowns = {};

  QEventManager.initQEvents = function() {
    for (var i = 1; i < $dataCommonEvents.length; i++) {
      var list = $dataCommonEvents[i].list;
      var id = $dataCommonEvents[i].id;
      var comments = '';
      for (var j = 0; j < list.length; j++) {
        if (list[j].code !== 108 && list[j].code !== 408) {
          continue;
        }
        comments += list[j].parameters[0];
      }
      var meta = QPlus.getMeta(comments);
      this._ceMeta[id] = meta;
      this.setupEvent(id);
    }
  };

  QEventManager.setupEvent = function(id) {
    var meta = this._ceMeta[id];
    if (meta.QEvent) {
      this._qEventIds[id] = true;
    }
    if (meta.trigger) {
      if (meta.trigger.toLowerCase() === 'move') {
        this._qTriggers.onAnyMove.push(id);
      }
      if (meta.trigger.toLowerCase() === 'eventmove') {
        this._qTriggers.onEventMove.push(id);
      }
      if (meta.trigger.toLowerCase() === 'playermove') {
        this._qTriggers.onPlayerMove.push(id);
      }
    }

  };

  QEventManager.isQ = function(id) {
    return this._qEventIds[id];
  };

  QEventManager.run = function(id, payload) {
    var cd = Number(this._ceMeta[id].cooldown);
    var onCd = false;
    if (cd && cd > 0) {
      if (!this._cooldowns[id]) {
        this._cooldowns[id] = {};
      }
      var currentCd = this._cooldowns[id];
      if (payload.type === 'CHARA') {
        onCd = currentCd[payload.charaId] > 0;
        if (!onCd) {
          currentCd[payload.charaId] = cd;
        }
      } else {
        onCd = currentCd.t > 0;
        if (!onCd) {
          currentCd.t = cd;
        }
      }
    }
    if (!onCd) {
      this._running.push(new Game_QEvent(id, payload));
    }
  };

  QEventManager.remove = function(qevent) {
    this._running.splice(qevent._index, 1);
  };

  QEventManager.clear = function() {
    this._running = [];
    this._cooldowns = {};
  };

  QEventManager.update = function() {
    for (var i = this._running.length - 1; i >= 0; i--) {
      var qevent = this._running[i];
      if (qevent._remove) {
        this.remove(qevent);
      } else {
        qevent.update();
      }
    }
    for (var id in this._cooldowns) {
      for (var j in this._cooldowns[id]) {
        this._cooldowns[id][j]--;
        if (this._cooldowns[id][j] === 0) {
          delete this._cooldowns[id][j];
        }
      }
    }
  };

  QEventManager.payload = function(type, from) {
    switch (type.toUpperCase()) {
      case 'CHARA': {
        return {
          type: 'CHARA',
          chara: from,
          charaId: from.charaId(),
          x: from._x,
          y: from._y,
          region: $gameMap.regionId(from.x, from.y)
        }
      }
      default: {
        return {
          type: type
        }
      }
    }
  };

  //-----------------------------------------------------------------------------
  // DataManager

  var Alias_DataManager_createGameObjects = DataManager.createGameObjects;
  DataManager.createGameObjects = function() {
    Alias_DataManager_createGameObjects.call(this);
    QEventManager.initQEvents();
  };

  //-----------------------------------------------------------------------------
  // Game_Temp

  var Alias_Game_Temp_reserveCommonEvent = Game_Temp.prototype.reserveCommonEvent;
  Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
    if (QEventManager.isQ(commonEventId)) {
      return QEventManager.run(commonEventId, QEventManager.payload('TEMP'));
    }
    Alias_Game_Temp_reserveCommonEvent.call(this, commonEventId);
  };

  //-----------------------------------------------------------------------------
  // Game_QEvent

  Game_QEvent.prototype = Object.create(Game_CommonEvent.prototype);
  Game_QEvent.prototype.constructor = Game_QEvent;

  Game_QEvent.prototype.initialize = function(commonEventId, variables) {
    this._variables = variables || {};
    Game_CommonEvent.prototype.initialize.call(this, commonEventId);
  };

  Game_QEvent.prototype.refresh = function() {
    this._interpreter = new Game_Interpreter();
    this._interpreter.q = {};
    for (var key in this._variables) {
      if (!this._variables.hasOwnProperty(key)) continue;
      this._interpreter.q[key] = this._variables[key];
    }
    this._interpreter.setup(this.list());
  };

  Game_QEvent.prototype.update = function() {
    if (!this._interpreter.isRunning()) {
      this._remove = true;
      return;
    }
    this._interpreter.update();
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    QEventManager.clear();
    Alias_Game_Map_setup.call(this, mapId);
  };

  var Alias_Game_Map_updateEvents = Game_Map.prototype.updateEvents;
  Game_Map.prototype.updateEvents = function() {
    Alias_Game_Map_updateEvents.call(this);
    QEventManager.update();
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var oldX = this._x;
    var oldY = this._y;
    Alias_Game_CharacterBase_update.call(this);
    if (this._x !== oldX || this._y !== oldY) {
      this.runQEventMoveTriggers();
    }
  };

  Game_CharacterBase.prototype.runQEventMoveTriggers = function() {
    var events = QEventManager._qTriggers.onAnyMove;
    for (var i = 0; i < events.length; i++) {
      QEventManager.run(events[i], QEventManager.payload('CHARA', this));
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  Game_Event.prototype.runQEventMoveTriggers = function() {
    Game_CharacterBase.prototype.runQEventMoveTriggers.call(this);
    var events = QEventManager._qTriggers.onEventMove;
    for (var i = 0; i < events.length; i++) {
      QEventManager.run(events[i], QEventManager.payload('CHARA', this));
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Player

  Game_Player.prototype.runQEventMoveTriggers = function() {
    Game_CharacterBase.prototype.runQEventMoveTriggers.call(this);
    var events = QEventManager._qTriggers.onPlayerMove;
    for (var i = 0; i < events.length; i++) {
      QEventManager.run(events[i], QEventManager.payload('CHARA', this));
    }
  };
})()
