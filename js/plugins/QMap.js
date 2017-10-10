//=============================================================================
// QMap
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.1.5')) {
  alert('Error: QMap requires QPlus 1.1.5 or newer to work.');
  throw new Error('Error: QMap requires QPlus 1.1.5 or newer to work.');
} else if (Imported.QMovement && !QPlus.versionCheck(Imported.QMovement, '1.2.1')) {
  alert('Error: QMap requires QMovement 1.2.1 or newer to work.');
  throw new Error('Error: QMap requires QMovement 1.2.1 or newer to work.');
}

Imported.QMap = '1.5.1';

//=============================================================================
 /*:
 * @plugindesc <QMap>
 * Creates maps made with QMap Editor
 * @author Quxios  | Version 1.5.1
 *
 * @requires QPlus
 *
 * @video https://www.youtube.com/watch?v=x7vcK96aW28
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * Similar to a parallax plugin. This plugin creates maps you created using
 * QMap Editor.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Create a map using the [QMap Editor](https://github.com/quxios/QMapEditor).
 * And that's it, no setup required.
 * ============================================================================
 * ## QMap Editor Notes
 * ============================================================================
 * These are notes you can include in your map objects:
 * ----------------------------------------------------------------------------
 * **Collider**
 * ----------------------------------------------------------------------------
 * Lets you add a collider to your map object for additional features.
 * There's two different methods for setting up a collider.
 *
 * First:
 * ~~~
 *  <collider:SHAPE,WIDTH,HEIGHT,OX,OY>
 * ~~~
 * - SHAPE: Set to box, circle or poly (only box works unless QMovement is installed)
 *   - If poly read next section on poly shape
 * - WIDTH: The width of the collider, in pixels
 * - HEIGHT: The height of the collider, in pixels
 * - OX: The X Offset of the collider, in pixels
 * - OY: The Y Offset of the collider, in pixels
 *
 * This will set the default collider to these settings.
 *
 * Second:
 * ~~~
 *  <colliders>
 *  TYPE: SHAPE,WIDTH,HEIGHT,OX,OY
 *  TYPE: SHAPE,WIDTH,HEIGHT,OX,OY
 *  TYPE: SHAPE,WIDTH,HEIGHT,OX,OY
 *  </colliders>
 * ~~~
 * You can include as many different colliders as you want, as long as TYPE
 * is different on each line.
 *
 * - TYPE: When this collider will be used. Set to default when you want that
 *  collider to be used when ever the type isn't found. Set to collision, for
 *  that collider to be used as a collision. Set to other values if needed
 *  for example, if a certain type is needed for a plugin feature.
 * - SHAPE: Set to box, circle or poly (only box works unless QMovement is installed)
 *   - If poly read next section on poly shape
 * - WIDTH: The width of the collider, in pixels
 * - HEIGHT: The height of the collider, in pixels
 * - OX: The X Offset of the collider, in pixels
 * - OY: The Y Offset of the collider, in pixels
 * ----------------------------------------------------------------------------
 * **Poly Colliders**
 * ----------------------------------------------------------------------------
 * To create a polygon collider, set the shape to poly. After that the rest
 * of the line should be a list of points separated with a comma. Points are
 * written as "(X,Y)". An example polygon would be:
 * ~~~
 *  poly,(24,0),(48,24),(24,48),(0,24)
 * ~~~
 * Would create a diamond shaped polygon.
 * ----------------------------------------------------------------------------
 * **OnPlayer**
 * ----------------------------------------------------------------------------
 * Experimental feature, might be changed / renamed
 *
 * At the moment, this note will change this map objects alpha to 0.5 when
 * the player is behind it. This feature requires a default or interaction
 * collider.
 * ~~~
 *  <onPlayer>
 * ~~~
 * Just add that note to the map object to have this feature, then include
 * a collider.
 * ----------------------------------------------------------------------------
 * **Breath**
 * ----------------------------------------------------------------------------
 * Adds a breathing effect to the map object. A breathing effect is where the
 * the sprites scale is increased and decreased in a sin wave.
 * ~~~
 *  <breath:OFFSET,DURATION,INITIALTIME?>
 * ~~~
 * - OFFSET: How much to scale. 1 is 100%, 0.5 is 50%. So 0.5 means its
 *  scale will go between 0.5 and 1.5;
 * - DURATION: How long it takes for 1 cycle, in frames. 60 frames = 1 second
 * - INITIALTIME: (Optional, Default: 0) Which frame should it start at. Ex;
 *  if DURATION was 60 and this is set at 30, it'll start in the middle of the
 *  cycle.
 * ----------------------------------------------------------------------------
 * **Tint**
 * ----------------------------------------------------------------------------
 * Change the tint of the map object. Similar to the Tint Screen event command.
 * ~~~
 *  <tint:RED,GREEN,BLUE,GRAY>
 * ~~~
 * - RED: Red value of tint, set between -255 to 255. Default: 0
 * - GREEN: Red value of tint, set between -255 to 255. Default: 0
 * - BLUE: Red value of tint, set between -255 to 255. Default: 0
 * - GRAY: Red value of tint, set between -255 to 255. Default: 0
 * ============================================================================
 * ## Videos
 * ============================================================================
 * Example of a map made with QMap
 * https://www.youtube.com/watch?v=n6aF6mnHEAk
 *
 * Example of the full QMap process, from the editor to mv
 * https://www.youtube.com/watch?v=XMWluxVErKo
 * If you have a video you'd like to have listed here, feel free to send me a
 * link in the RPGMakerWebs thread! (link below)
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QMap
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
 * @tags sprite, map, parallax
 */
//=============================================================================

//=============================================================================
// New Classes

function Game_MapObj() {
  this.initialize.apply(this, arguments);
}

function Sprite_MapObject() {
  this.initialize.apply(this, arguments);
}

var $dataQMap = null;

//=============================================================================
// QMap

(function() {

  QPlus.request('data/QMap.json')
    .onSuccess(function(json) {
      $dataQMap = json;
      DataManager.onLoad($dataQMap);
    })
    .onError(function() {
      throw new Error("Failed to load 'data/QMap.json'");
    })

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qmap') {
      this.qMapCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qMapCommand = function(args) {
    var cmd = args.shift();
    if (cmd.toLowerCase() === 'free') {
      // freeing image cache, seems like its  not doing anything
      // does remove it from image cache, but memory usage doesn't
      // change
      if (!args[0]) return;
      var id = Number(args[0]);
      var mapObjs = $dataQMap[id];
      if (mapObjs) {
        var files = [];
        for (var i = 0; i < mapObjs.length; i++) {
          var img = mapObjs[i].filePath;
          img = encodeURIComponent(img);
          img = img.replace(/%5C/g, '/');
          if (files.indexOf(img) === -1) {
            files.push(img);
          }
        }
        QPlus.freeImgCache(files);
      }
    }
  };

  //-----------------------------------------------------------------------------
  // DataManager

  var Alias_DataManager_isMapLoaded = DataManager.isMapLoaded;
  DataManager.isMapLoaded = function() {
    return Alias_DataManager_isMapLoaded.call(this) && !!$dataQMap;
  };

  var Alias_DataManager_onLoad = DataManager.onLoad;
  DataManager.onLoad = function(object) {
    if (object === $dataQMap) {
      for (var i = 0; i < object.length; i++) {
        if (!Array.isArray(object[i])) continue;
        for (var j = 0; j < object[i].length; j++) {
          var data = object[i][j];
          if (data.note === undefined && data.notes !== undefined) {
            // older version the property was name notes, should
            // have been just note
            data.note = data.notes;
          }
          if (data && data.note !== undefined) {
            this.extractMetadata(data);
          }
        }
      }
    } else {
      Alias_DataManager_onLoad.call(this, object);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_initialize = Game_Map.prototype.initialize;
  Game_Map.prototype.initialize = function() {
    Alias_Game_Map_initialize.call(this);
    this._mapObjs = [];
  };

  var Alias_Game_Map_setupEvents = Game_Map.prototype.setupEvents;
  Game_Map.prototype.setupEvents = function() {
    Alias_Game_Map_setupEvents.call(this);
    this.setupMapObjs();
  };

  if (Imported.QMovement) {
    var Alias_Game_Map_reloadColliders = Game_Map.prototype.reloadColliders;
    Game_Map.prototype.reloadColliders = function() {
      Alias_Game_Map_reloadColliders.call(this);
      var i, j;
      for (i = 0, j = this._mapObjs.length; i < j; i++) {
        this._mapObjs[i].reloadColliders();
      }
    };

    var Alias_Game_Map_clearColliders = Game_Map.prototype.clearColliders;
    Game_Map.prototype.clearColliders = function() {
      Alias_Game_Map_clearColliders.call(this);
      var i, j;
      for (i = 0, j = this._mapObjs.length; i < j; i++) {
        this._mapObjs[i].removeColliders();
      }
    };
  }

  Game_Map.prototype.setupMapObjs = function() {
    this._mapObjs = [];
    this._mapObjsWithColliders = [];
    var data = $dataQMap[this._mapId] || [];
    for (var i = 0; i < data.length; i++) {
      if (data[i]) {
        var objData = JSON.parse(JSON.stringify(data[i]));
        var mapObj = new Game_MapObj(this._mapId, objData);
        this._mapObjs.push(mapObj);
        if (mapObj.collider('collision')) {
          this._mapObjsWithColliders.push(mapObj);
        }
      }
    }
  };

  var Alias_Game_Map_updateEvents = Game_Map.prototype.updateEvents;
  Game_Map.prototype.updateEvents = function() {
    Alias_Game_Map_updateEvents.call(this);
    this.updateMapObjs();
  };

  Game_Map.prototype.updateMapObjs = function() {
    var mapObjs = this._mapObjs;
    for (var i = 0; i < mapObjs.length; i++) {
      if (mapObjs[i]) mapObjs[i].update();
    }
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  if (!Imported.QMovement) {
    var Alias_Game_CharacterBase_isCollidedWithCharacters = Game_CharacterBase.prototype.isCollidedWithCharacters;
    Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
      return Alias_Game_CharacterBase_isCollidedWithCharacters.call(this, x, y) || this.isCollidedWithMapObj(x, y);
    };

    Game_CharacterBase.prototype.isCollidedWithMapObj = function(x, y) {
      var mapObjs = $gameMap._mapObjsWithColliders;
      return mapObjs.some(function(mapObj) {
        return mapObj.intersectsWithSimple('collision', x, y);
      });
    };
  }


  //-----------------------------------------------------------------------------
  // Game_MapObj

  Game_MapObj.prototype.initialize = function(mapId, objData) {
    /**
     * objData Properties
     *  @param name [string]
     *  @param x [int]
     *  @param y [int]
     *  @param z [int]
     *  @param filePath [string]
     *  @param type [string]
     *  @param cols [int]
     *  @param rows [int]
     *  @param index [int]
     *  @param speed [int]
     *  @param width [int]
     *  @param height [int]
     *  @param anchorX [int]
     *  @param anchorY [int]
     *  @param scaleX [int]
     *  @param scaleY [int]
     *  @param angle [int]
     *  @param conditions [object[]]
     *  @param note [string]
     *  @param meta [object]
     *  @param isQSprite [string]
     *  @param pose [string]
     */
    for (var prop in objData) {
      var propName = String(prop);
      var value = objData[prop];
      if (propName === 'notes' || propName === 'meta') {
        continue;
      }
      if (propName === 'conditions') {
        value = value.map(function(v) {
          v.value = QPlus.stringToType(JSON.stringify(v.value));
          return v;
        });
      }
      if (propName === 'x') {
        propName = 'px';
      }
      if (propName === 'y') {
        propName = 'py';
      }
      this[propName] = value;
    }
    if (!this.conditions) {
      this.conditions = [];
    }
    this.meta = this.qmeta || {};
    if (Imported.QSprite && this.isQSprite) {
      this.convertQSprite();
    }
    this.initMembers();
  };

  Game_MapObj.prototype.convertQSprite = function() {
    var config = QSprite.json[this.isQSprite];
    if (!config) return;
    this.anchorX = config.anchorX;
    this.anchorY = config.anchorY;
    this.cols = config.cols;
    this.rows = config.rows;
    this.type = 'QSprite';
    this._qSprite = config.poses[this.pose];
  };

  Game_MapObj.prototype.initMembers = function() {
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    this.x = this.px / tw;
    this.y = this.py / th;
    this.alpha = 1;
    this.scale = new Point(this.scaleX, this.scaleY);
    this.rotation = this.angle * (Math.PI / 180);
    this.visible = true;
    this.setupBreath();
    this.setupTone();
  };

  Game_MapObj.prototype.setupBreath = function() {
    if (!this.meta.breath) return;
    var args = this.meta.breath.split(',').map(Number);
    this._breathS = args[0] === undefined ? 1 : args[0] / 100;
    this._breathT = args[1] === undefined ? 60 : args[1];
    this._breathOT = args[2] === undefined ? 0 : args[2];
    this._breathTick = this._breathOT;
  };

  Game_MapObj.prototype.setupTone = function() {
    this.tone = [0, 0, 0, 0];
    if (!this.meta.tint) return;
    this.tone = this.meta.tint.split(',').map(Number);
    this.tone[0] = this.tone[0] || 0;
    this.tone[1] = this.tone[1] || 0;
    this.tone[2] = this.tone[2] || 0;
    this.tone[3] = this.tone[3] || 0;
  };

  Game_MapObj.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    var x = $gameMap.adjustX(this.x);
    return Math.round(x * tw);
  };

  Game_MapObj.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    var y = $gameMap.adjustY(this.y);
    return Math.round(y * th);
  };

  Game_MapObj.prototype.charaId = function() {
    return 'MAPOBJ-' + this.name;
  };

  Game_MapObj.prototype.isThrough = function() {
    return !this.visible;
  };

  Game_MapObj.prototype.isNormalPriority = function() {
    return true;
  };

  Game_MapObj.prototype.notes = function() {
    return this.note;
  };

  Game_MapObj.prototype.update = function() {
    this.updateConditions();
    if (!this.visible) return;
    var playerX = $gamePlayer._realX;
    var playerY = $gamePlayer._realY;
    if (this._playerX !== playerX || this._playerY !== playerY) {
      var dx = this._playerX - playerX;
      var dy = this._playerY - playerY;
      this.updatePlayerMoved(dx, dy);
      this._playerX = playerX;
      this._playerY = playerY;
    }
    if (this.meta.breath) this.updateBreath();
  };

  Game_MapObj.prototype.updateConditions = function() {
    var isOk = true;
    for (var i = 0; i < this.conditions.length; i++) {
      var cond = this.conditions[i];
      if (cond.type === "switch") {
        isOk = $gameSwitches.value(cond.value[0]) === cond.value[1];
      }
      if (cond.type === "var") {
        isOk = $gameVariables.value(cond.value[0]) === cond.value[1];
      }
      if (cond.type === "js") {
        isOk = !!(eval(value[0]));
      }
      if (!isOk) break;
    }
    this.visible = isOk;
  };

  Game_MapObj.prototype.updatePlayerMoved = function(dx, dy) {
    if (this.meta.onPlayer) this.updateOnPlayer();
    // add more functions that are based off player here
  };

  Game_MapObj.prototype.updateOnPlayer = function() {
    this.alpha = 1;
    if ($gamePlayer.screenY() < this.screenY()) {
      if (this.intersectsWith('interaction', $gamePlayer)) {
        this.alpha = 0.5;
      }
    }
  };

  Game_MapObj.prototype.updateBreath = function() {
    var rt = (this._breathTick % this._breathT) / this._breathT;
    var s = Math.sin(rt * Math.PI * 2) * this._breathS;
    this.scale = new Point(1 + s, 1 + s);
    this._breathTick = (this._breathTick + 1) % this._breathT;
  };

  Game_MapObj.prototype.intersectsWith = function(type, chara) {
    if (!this.visible) {
      return false;
    }
    if (!Imported.QMovement) {
      return this.intersectsWithSimple(type, chara._realX, chara._realY);
    } else {
      return this.collider(type).intersects(chara.collider('collision'));
    }
  };

  Game_MapObj.prototype.intersectsWithSimple = function(type, x1, y1) {
    var bounds = this.getTileBounds(type);
    var x2 = x1 + 0.9;
    var y2 = y1 + 0.9;
    var insideX1 = (x1 >= bounds.x1 && x1 <= bounds.x2) || (x2 >= bounds.x1 && x2 <= bounds.x2);
    var insideY1 = (y1 >= bounds.y1 && y1 <= bounds.y2) || (y2 >= bounds.y1 && y2 <= bounds.y2);
    var insideX2 = (bounds.x1 >= x1 && bounds.x1 <= x2) || (bounds.x2 >= x1 && bounds.x2 <= x2);
    var insideY2 = (bounds.y1 >= y1 && bounds.y1 <= y2) || (bounds.y2 >= x1 && bounds.y2 <= y2);
    return (insideX1 || insideX2) && (insideY1 || insideY2);
  };

  Game_MapObj.prototype.collider = function(type) {
    if (!$dataMap) return;
    if (!this.meta.collider && !this.meta.colliders) return null;
    if (!this._colliders) this.setupColliders();
    return this._colliders[type] || this._colliders.default;
  };

  Game_MapObj.prototype.reloadColliders = function() {
    this.removeColliders();
    this.setupColliders();
  };

  Game_MapObj.prototype.removeColliders = function() {
    for (var collider in this._colliders) {
      if (!this._colliders.hasOwnProperty(collider)) continue;
      if (Imported.QMovement) {
        ColliderManager.remove(this._colliders[collider]);
      }
      this._colliders[collider] = null;
    }
  };

  Game_MapObj.prototype.setupColliders = function() {
    if (!$dataMap) return;
    var configs = {};
    this._colliders = {};
    if (this.meta.colliders) {
      configs = QPlus.stringToObj(this.meta.colliders);
    }
    if (this.meta.collider) {
      configs.default = QPlus.stringToAry(this.meta.collider);
    }
    for (var collider in configs) {
      if (!configs.hasOwnProperty(collider)) continue;
      this._colliders[collider] = this.convertToCollider(configs[collider], collider);
    }
    if (this.collider('collision')) {
      Game_CharacterBase.prototype.makeBounds.call(this);
    }
  };

  Game_MapObj.prototype.convertToCollider = function(arr, ctype) {
    if (!Imported.QMovement) {
      return this.toSimpleCollider(arr);
    }
    var collider = ColliderManager.convertToCollider(arr);
    collider.note = this.note;
    collider.isMapObj = true;
    collider.type = ctype;
    var x1 = this.px + (this.width * -this.anchorX);
    var y1 = this.py + (this.height * -this.anchorY);
    collider.moveTo(x1, y1);
    ColliderManager.addCollider(collider, -1, true);
    return collider;
  };

  Game_MapObj.prototype.toSimpleCollider = function(arr) {
    if (arr[0] !== 'box') return null;
    return {
      isSimple: true,
      width: arr[1] || 0,
      height: arr[2] || 0,
      ox: arr[3] || 0,
      oy: arr[4] || 0
    }
  };

  Game_MapObj.prototype.getTileBounds = function(type) {
    if (this.collider(type)) {
      return this.getSimpleColliderBounds(type);
    }
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var x1 = this.x;
    var y1 = this.y;
    var x2 = x1 + (this.width / tw);
    var y2 = y1 + (this.height / th);
    return {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    }
  };

  Game_MapObj.prototype.getSimpleColliderBounds = function(type) {
    var collider = this.collider(type);
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var x1 = this.x + (this.width * -this.anchorX / tw) + (collider.ox / tw);
    var y1 = this.y + (this.height * -this.anchorY / th) + (collider.oy / th);
    var x2 = x1 + (collider.width / tw);
    var y2 = y1 + (collider.height / th);
    return {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_MapObject

  Sprite_MapObject.prototype = Object.create(Sprite_Base.prototype);
  Sprite_MapObject.prototype.constructor = Sprite_MapObject;

  Sprite_MapObject.prototype.initialize = function(mapObj) {
    Sprite_Base.prototype.initialize.call(this);
    this._mapObj = mapObj;
    this._tick = 0;
    this._lastFrameI = null;
    this._frameI = this._mapObj.index || 0;
    this._patternI = 0;
    this._maxFrames = this._mapObj.cols * this._mapObj.rows;
    this.z = 0;
  };

  Sprite_MapObject.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (this._mapObj.type === 'animated') {
      this.updateAnimation();
    }
    if (this._mapObj.type === 'QSprite') {
      this.updateQSprite();
    }
    this.updateBitmap();
    this.updateFrame();
    this.updatePosition();
    this.updateOther();
  };

  Sprite_MapObject.prototype.updateAnimation = function() {
    if (this._tick % this._mapObj.speed === 0) {
      this._frameI = (this._frameI + 1) % this._maxFrames;
    }
    this._tick = (this._tick + 1) % this._mapObj.speed;
  };

  Sprite_MapObject.prototype.updateQSprite = function() {
    var speed = this._mapObj._qSprite.speed;
    if (this._tick % speed === 0) {
      var pattern = this._mapObj._qSprite.pattern;
      this._patternI = (this._patternI + 1) % pattern.length;
      this._frameI = pattern[this._patternI];
    }
    this._tick = (this._tick + 1) % speed;
  };

  Sprite_MapObject.prototype.updateBitmap = function() {
    if (this._filePath !== this._mapObj.filePath) {
      this._filePath = this._mapObj.filePath;
      var path = this._filePath.split(/\/|\\/);
      var fileName = path.pop().split('.');
      var ext = fileName.pop();
      path.push(encodeURIComponent(fileName.join('.')) + '.' + ext);
      path = path.join('/');
      this.bitmap = ImageManager.loadNormalBitmap(path, 0);
      this.bitmap.smooth = this._mapObj.meta.smooth;
      this._lastFrameI = null;
      this.bitmap.addLoadListener(function() {
        this._lastFrameI = null;
      }.bind(this))
    }
  };

  Sprite_MapObject.prototype.updateFrame = function() {
    if (this._lastFrameI !== null) {
      if (this._lastFrameI === this._frameI) return;
    }
    if (this._mapObj.type !== 'full') {
      var i = this._frameI;
      var cols = this._mapObj.cols;
      var rows = this._mapObj.rows;
      var pw = this.bitmap.width / cols;
      var ph = this.bitmap.height / rows;
      var point = QPlus.indexToPoint(i, cols, rows);
      var sx = point.x * pw;
      var sy = point.y * ph;
      this.setFrame(sx, sy, pw, ph);
      this._lastFrameI = i;
    }
  };

  Sprite_MapObject.prototype.updatePosition = function() {
    this.x = this._mapObj.screenX();
    this.y = this._mapObj.screenY();
    this.z = this._mapObj.z;
    this.anchor.x = this._mapObj.anchorX;
    this.anchor.y = this._mapObj.anchorY;
  };

  Sprite_MapObject.prototype.updateOther = function() {
    this.alpha = this._mapObj.alpha;
    this.scale.x = this._mapObj.scale.x;
    this.scale.y = this._mapObj.scale.y;
    this.rotation = this._mapObj.rotation;
    this.visible = this._mapObj.visible;
    this.setColorTone(this._mapObj.tone);
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map

  var Alias_Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
  Spriteset_Map.prototype.createCharacters = function() {
    Alias_Spriteset_Map_createCharacters.call(this);
    this.createMapObjs();
  };

  Spriteset_Map.prototype.createMapObjs = function() {
    this._mapObjs = [];
    var mapObjs = $gameMap._mapObjs;
    var i;
    for (i = 0; i < mapObjs.length; i++) {
      if (!mapObjs[i] || !mapObjs[i].filePath) continue;
      this._mapObjs.push(new Sprite_MapObject(mapObjs[i]));
    }
    for (i = 0; i < this._mapObjs.length; i++) {
      this._tilemap.addChild(this._mapObjs[i]);
    }
  };
})()
