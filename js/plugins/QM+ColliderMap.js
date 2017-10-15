//=============================================================================
// QM ColliderMap
//=============================================================================

var Imported = Imported || {};

if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.2.0')) {
  alert('Error: QM+ColliderMap requires QMovement 1.2.0 or newer to work.');
  throw new Error('Error: QM+ColliderMap requires QMovement 1.2.0 or newer to work.');
}

Imported.QMColliderMap = '1.0.0';

//=============================================================================
 /*:
 * @plugindesc <QMColliderMap>
 * QMovement Addon: Allows you to load colliders to a map from json
 * @author Quxios  | Version 1.0.0
 *
 * @requires QMovement
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This is an addon to QMovement plugin. This addon adds a feature that lets
 * you create a json file that contains a list of colliders for each map.
 * This is not to be confused with CollisionMap addon. CollisionMap lets you
 * use a picture for collisions, while ColliderMap lets you create colliders
 * that are placed on the map.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Create a json file called `ColliderMap.json` inside the data folder.
 * Once that file is made you'll need to set up the file
 * ----------------------------------------------------------------------------
 * **Setting up**
 * ----------------------------------------------------------------------------
 * The json format is an array of maps, the first index of the array should be
 * null since MV map id's start on 1 not 0. Each array element is an array of
 * objects containning collider info.
 *
 * Quick example:
 * ~~~
 * [
 *   null,
 *   [
 *     {}
 *   ]
 * ]
 * ~~~
 * ----------------------------------------------------------------------------
 * **Collider object**
 * ----------------------------------------------------------------------------
 * The collider object has the following properties:
 * - type[STRING]: box, circle or polygon
 * - x[INT]: x position of the collider (optional, default: 0)
 * - y[INT]: y position of the collider (optional, default: 0)
 * - ox[INT]: x offset of the collider. Not used for poly type (optional, default: 0)
 * - oy[INT]: y offset of the collider. Not used for poly type (optional, default: 0)
 * - width[INT]: The width of the box/circle. Not used for poly type.
 * - height[INT]: The height of the box/circle. Not used for poly type.
 * - points[ARRAY]: For poly type only. An array of points, needs 3 or more points.
 *  Points are object with x and y properties.
 *
 * Optional extra properties:
 * - note[STRING]: To add notetags
 * - isTile[BOOL]: set to true or false
 *
 * If isTile, these can also be used
 * - terrain[int]: set to terrain id
 * - color[STRING]: color of the collider
 * - isWater1[BOOL]: set to true or false
 * - isWater2[BOOL]: set to true or false
 * - isLadder[BOOL]: set to true or false
 * - isCounter[BOOL]: set to true or false
 * - isBush[BOOL]: set to true or false
 * - isDamage[BOOL]: set to true or false
 * ----------------------------------------------------------------------------
 * **Example**
 * ----------------------------------------------------------------------------
 * ~~~
 * [
 *   null,
 *   [
 *     {
 *       "type": "poly",
 *       "points": [{"x": 0,"y": 0}, {"x": 48,"y": 48}, {"x": 0,"y": 96}, {"x": -48,"y": 48}],
 *       "x": 48,
 *       "y": 0
 *     }
 *   ]
 * ]
 * ~~~
 * Creates a diamond polygon on map 1 at 48,0.
 *
 * ~~~
 * [
 *   null,
 *   [
 *     {
 *       "type": "poly",
 *       "points": [{"x": 0,"y": 0}, {"x": 48,"y": 48}, {"x": 0,"y": 96}, {"x": -48,"y": 48}],
 *       "x": 48,
 *       "y": 0
 *     },
 *     {
 *       "type": "box",
 *       "width": 480,
 *       "height": 24,
 *       "x": 0,
 *       "y": 240
 *     },
 *     {
 *       "type": "circle",
 *       "width": 48,
 *       "height": 48,
 *       "x": 96,
 *       "y": 48
 *     }
 *   ]
 * ]
 * ~~~
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QM+ColliderMap
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
 * @tags QM-Addon, collision
 */
//=============================================================================

//=============================================================================
// QM ColliderMap

(function() {
  var _PROPS = [
    'note',
    'isTile', 'terrain', 'color',
    'isWater1', 'isWater2',
    'isLadder', 'isBush', 'isCounter', 'isDamage'
  ]

  QPlus.request('data/ColliderMap.json')
    .onSuccess(function(json) {
      QMovement.colliderMap = json;
    })
    .onError(function() {
      QMovement.colliderMap = {};
      alert('Failed to load "data/ColliderMap.json"');
    })

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_reloadTileMap = Game_Map.prototype.reloadTileMap;
  Game_Map.prototype.reloadTileMap = function() {
    Alias_Game_Map_reloadTileMap.call(this);
    this.setupColliderMap();
  };

  Game_Map.prototype.setupColliderMap = function() {
    var colliders = QMovement.colliderMap[this._mapId];
    if (!colliders) return;
    for (var i = 0; i < colliders.length; i++) {
      var data = colliders[i];
      if (!data) continue;
      var collider;
      var w = data.width;
      var h = data.height;
      var points = data.points;
      var ox = data.ox || 0;
      var oy = data.oy || 0;
      var x = data.x || 0;
      var y = data.y || 0;
      var type = data.type;
      if (type === 'circle' || type === 'box') {
        if (w === undefined || h === undefined) continue;
        if (w === 0 || h === 0) continue;
        if (type === 'circle') {
          collider = new Circle_Collider(w, h, ox, oy);
        } else {
          collider = new Box_Collider(w, h, ox, oy);
        }
        collider.moveTo(x, y);
      } else if (type === 'poly') {
        if (points === undefined || points.length < 3) continue;
        collider = new Polygon_Collider(points, x, y);
      } else {
        continue;
      }
      for (var j = 0; j < _PROPS.length; j++) {
        var prop = data[_PROPS[j]];
        if (prop !== undefined) {
          collider[_PROPS[j]] = prop;
        }
      }
      ColliderManager.addCollider(collider, -1);
    }
  };
})()
