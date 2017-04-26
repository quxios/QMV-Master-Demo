//=============================================================================
// QImport
//=============================================================================

var Imported = Imported || {};
Imported.QImport = '1.0.1';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.1.5')) {
  alert('Error: QImport requires QPlus 1.1.5 or newer to work.');
  throw new Error('Error: QImport requires QPlus 1.1.5 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QImport>
 * Lets you import text from other game objects or txt files
 * @author Quxios  | Version 1.0.1
 *
 * @requires QPlus
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin is used to help ease development of configurations by letting
 * you import from different sources. If you have a note tag that is going to
 * be used in multiple game objects, you can configure just one of them and have
 * the rest import the notes from that "master" object. Then whenever you edit
 * the "master" all the ones that are importing from it will also get the change.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * **Notetags for database items**
 * ----------------------------------------------------------------------------
 * ~~~
 *  <import: TYPE, FROM, FROM2>
 * ~~~
 * - TYPE: set to text or note
 * - FROM:
 *  - if TYPE is text, set this to the path of the text file
 *  - if TYPE is note, set to the database to read; actor, class, skill, item, weapon, armor, enemy, or state
 * - FROM2:
 *  - if TYPE is text ignore this
 *  - if TYPE is note, set this to the id from that database
 *
 * Example:
 * ~~~
 *  <import:text,text/file.txt>
 * ~~~
 * Will import the text from the file located in text/file.txt
 *
 * ~~~
 *  <import:note,actor,2>
 * ~~~
 * Will import the notes from actor 2
 * ----------------------------------------------------------------------------
 * **Notetags for events**
 * ----------------------------------------------------------------------------
 * ~~~
 *  <importing>
 * ~~~
 * Marks that event as "needs importing". Required if an <import> tags is used
 * in that events pages.
 *
 * ~~~
 *  <import: TYPE, FROM, FROM2>
 * ~~~
 * - TYPE: set to text, note or event
 * - FROM:
 *   - if TYPE is text, set this to the path of the text file
 *   - if TYPE is note, set to the database to read; actor, class, skill, item, weapon, armor, enemy, or state
 *   - if TYPE is event, set to the mapId the event is located
 * - FROM2:
 *   - if TYPE is text ignore this
 *   - if TYPE is note, set this to the id from that database
 *   - if TYPE is event, set to the event id
 *
 * Examples:
 * ~~~
 *  <import:event,1,2>
 * ~~~
 * Will replace the event with that note with event 2 from map 1
 *
 * ~~~
 *  <import:text,text/file.txt>
 * ~~~
 * Will import the text from the file located in text/file.txt
 * ----------------------------------------------------------------------------
 * **Importing inside event pages**
 * ----------------------------------------------------------------------------
 * To use <import> inside an event page, you need to use the <importing>
 * notetag first.
 *
 * There's two types of possible imports you can do inside an event page.
 *
 * First: Import text into a "Show Text", "Comment" or "Script" event command.
 * ~~~
 *  <Import:PATH>
 * ~~~
 * - PATH: the path of the text file to import
 *
 *
 * Second: Import events into the map from other maps. Can only be used inside
 * the "Comment" event command.
 * ~~~
 *  <Import:event,MAPID,EVENTID,X,Y>
 * ~~~
 * - MAPID: The mapId of the event you want to import
 * - EVENTID: The event id of the event you want to import from MAPID
 * - X: The x position to place this imported event
 * - Y: The y position to place this imported event
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
 * @tags import, txt
 */
//=============================================================================

//=============================================================================
// QImport

function QImport() {
  throw new Error('This is a static class');
}

(function() {
  QImport._queue = [];
  QImport._scanQueue = [];
  QImport._request = [];
  QImport._cache = {};
  QImport._wait = false;

  QImport.empty = function() {
    return this._queue.length === 0 && this._scanQueue.length === 0 && this._request.length === 0;
  };

  QImport.update = function() {
    if (this._wait) return;
    this.updateQueue();
    this.updateScan();
    if (this.empty()) {
      QImport._cache = {};
    }
  };

  QImport.updateQueue = function() {
    var q = this._queue;
    for (var i = q.length - 1; i >= 0; i--) {
      if (this._wait) break;
      var data = q.pop();
      var regex = /<import:(.*)?>/ig;
      var notes = data.note;
      while (true) {
        var match = regex.exec(notes);
        if (match) {
          this.import(data, 'note', match);
          if (this._wait) {
            q.push(data);
            break;
          }
        } else {
          break;
        }
      }
      DataManager.extractMetadata(data);
    }
  };

  QImport.updateScan = function() {
    var q = this._scanQueue;
    for (var i = q.length - 1; i >= 0; i--) {
      if (this._wait) break;
      var data = q.pop();
      if (this.isEvent(data)) {
        for (var j = 0; j < data.pages.length; j++) {
          this.scan(data.pages[j]);
          if (this._wait) {
            q.push(data);
            break;
          }
        }
      }
    }
  };

  QImport.scan = function(page) {
    var codes = [
      401, // show text
      108, // comment line 1
      408, // comment line 2
      355, // script line 1
      655  // script line 2
    ]
    for (var i = 0; i < page.list.length; i++) {
      if (this._wait) break;
      var cmd = page.list[i];
      if (!codes.contains(cmd.code)) continue;
      var regex = /<import:(.*)?>/ig;
      while (true) {
        var match = regex.exec(cmd.parameters[0]);
        if (match) {
          if (cmd.code === 108 || cmd.code === 408) {
            if (/^event\,/i.test(match[1])) {
              var args = match[1].split(',');
              args.shift();
              var newEvent = {
                id: $dataMap.events.length,
                name: 'IMPORTED_EVENT',
                note: '',
                pages: [],
                x: Number(args[2]) || 0,
                y: Number(args[3]) || 0
              }
              $dataMap.events.push(newEvent);
              this.importEvent(newEvent, 'note', '', args);
              cmd.parameters[0] = cmd.parameters[0].replace(match[0], '');
              if (this._wait) break;
              continue;
            }
          }
          match[1] = 'text,' + match[1];
          this.import(cmd.parameters, 0, match);
          if (this._wait) break;
        } else {
          break;
        }
      }
    }
  };

  QImport.import = function(data, prop, match) {
    var args = match[1].split(',').map(function(s) {
      return s.trim().toLowerCase();
    })
    var type = args.shift();
    switch (type) {
      case 'note': {
        this.importNote(data, prop, match[0], args);
        break;
      }
      case 'text':{
        this.importText(data, prop, match[0], args);
        break;
      }
      case 'event': {
        if (this.isEvent(data)) {
          this.importEvent(data, prop, match[0], args);
        } else {
          data[prop] = data[prop].replace(match, '');
        }
        break;
      }
    }
  };

  QImport.importNote = function(data, prop, match, args) {
    var type = args.shift();
    var obj;
    switch (type) {
      case 'actor': {
        obj = $dataActors[Number(args[0])];
        break;
      }
      case 'class': {
        obj = $dataClasses[Number(args[0])];
        break;
      }
      case 'skill': {
        obj = $dataSkills[Number(args[0])];
        break;
      }
      case 'item': {
        obj = $dataItems[Number(args[0])];
        break;
      }
      case 'weapon': {
        obj = $dataWeapons[Number(args[0])];
        break;
      }
      case 'armor': {
        obj = $dataArmors[Number(args[0])];
        break;
      }
      case 'enemy': {
        obj = $dataEnemies[Number(args[0])];
        break;
      }
      case 'state': {
        obj = $dataStates[Number(args[0])];
        break;
      }
    }
    var val = '';
    if (obj) {
      val = obj.note || '';
    }
    data[prop] = data[prop].replace(match, val);
  };

  QImport.importText = function(data, prop, match, args) {
    var val = '<REQUESTING' + args[0] + '>';
    if (this._cache[args[0]]) {
      val = this._cache[args[0]];
    } else {
      this._wait = true;
      this._request.push(data);
      QPlus.request(args[0])
        .onSuccess(function(response) {
          QImport._wait = false;
          QImport._cache[args[0]] = response;
          data[prop] = data[prop].replace(val, response);
          DataManager.extractMetadata(data);
          var i = QImport._request.indexOf(data);
          QImport._request.splice(i, 1);
          data = null;
          args = null;
          match = null;
        })
    }
    data[prop] = data[prop].replace(match, val);
  };

  QImport.importEvent = function(data, prop, match, args) {
    var mapId = Number(args[0]);
    var eventId = Number(args[1]);
    var key = 'map' + mapId ;
    if (this._cache[key]) {
      for (var props in data) {
        if (props === 'x' || props === 'y') {
          continue;
        }
        data[props] = this._cache[key].events[eventId][props];
      }
      DataManager.extractMetadata(data);
    } else {
      var mapPath = 'data/Map%1.json'.format(mapId.padZero(3));
      this._wait = true;
      this._request.push(data);
      QPlus.request(mapPath)
        .onSuccess(function(response) {
          if (response.events && response.events[eventId]) {
            QImport._cache[key] = response;
            for (var props in data) {
              if (props === 'x' || props === 'y') {
                continue;
              }
              data[props] = response.events[eventId][props];
            }
            DataManager.extractMetadata(data);
          }
          QImport._wait = false;
          var i = QImport._request.indexOf(data);
          QImport._request.splice(i, 1);
          data = null;
          args = null;
          match = null;
        })
      var val = '<REQUESTING' + key + '>';
      data[prop] = data[prop].replace(match, val);
    }
  };

  QImport.isEvent = function(data) {
    if (!data) return false;
    if (data.x === undefined && data.y === undefined) return false;
    if (!data.pages || data.pages.constructor !== Array) return false;
    return true;
  };
})();

(function() {
  //-----------------------------------------------------------------------------
  // DataManager

  var Alias_DataManager_extractQData = DataManager.extractQData;
  DataManager.extractQData = function(data) {
    Alias_DataManager_extractQData.call(this, data);
    if (data.meta.import) {
      QImport._queue.push(data);
    } else if (data.meta.importing) {
      QImport._scanQueue.push(data);
    }
  };

  var Alias_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function() {
    var loaded = Alias_DataManager_isDatabaseLoaded.call(this);
    if (loaded) {
      QImport.update();
    }
    return loaded && QImport.empty();
  };

  var Alias_DataManager_isMapLoaded = DataManager.isMapLoaded;
  DataManager.isMapLoaded = function() {
    var loaded = Alias_DataManager_isMapLoaded.call(this);
    if (loaded) {
      QImport.update();
    }
    return loaded && QImport.empty();
  };
})();
