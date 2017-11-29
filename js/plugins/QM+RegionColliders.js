//=============================================================================
// QM RegionColliders
//=============================================================================

var Imported = Imported || {};

if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.1.0')) {
  alert('Error: QM+RegionColliders requires QMovement 1.1.0 or newer to work.');
  throw new Error('Error: QM+RegionColliders requires QMovement 1.1.0 or newer to work.');
}

Imported.QMRegionColliders = '1.1.0';

//=============================================================================
/*:
 * @plugindesc <QMRegionColliders>
 * QMovement Addon: Allows you to add colliders on regions
 * @version 1.1.0
 * @author Quxios  | Version 1.1.0
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 *
 * @requires QMovement
 * 
 * @param json
 * @text Use Json
 * @desc (Legacy) Set this to true to use a Json file for
 * creating region colliders
 * @default false
 * @type boolean
 * 
 * @param regionColliders
 * @text Region Colliders
 * @desc Apply a collider to a region
 * These region colliders will override tile colliders
 * @default []
 * @type Struct<RegionCollider>[]
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This is an addon to QMovement plugin. This addon adds a feature that lets
 * you add colliders to regions. In QuasiMovement this was known as
 * RegionBoxes.
 *
 * Region Colliders take priority over tiles. So if there's a region over a
 * tile, it will use the region collider instead of that tiles collider. With
 * this you can make certain impassable tiles passable by adding a passable
 * region collider (width 0 and height 0) ontop of it.
 * ============================================================================
 * ## How to use JSON
 * ============================================================================
 * If you still prefer the old way by using a json file you still can as long
 * as you enable the "Use Json" plugin parameter. You can use both a json
 * and the "Region Colliders" parameter, they will be merged together.
 * 
 * Create a json file called `RegionColliders.json` inside the data folder.
 * Once that file is made you'll need to set up the file
 * ----------------------------------------------------------------------------
 * **Setting up**
 * ----------------------------------------------------------------------------
 * Json template:
 * ~~~
 * {
 *   "REGIONID": [COLLIDER1, COLLIDER2, ..., COLLIDER N],
 *   "REGIONID2": [COLLIDER1, COLLIDER2, ..., COLLIDER N]
 * }
 * ~~~
 * * Note that at the end of the 3rd line there's no comma!
 *
 * COLLIDER N are objects in this format:
 * ~~~
 * {"type": type, "width": W, "height", H, "ox": ox, "oy": oy, "note": string}
 * ~~~
 * - Set type to the type of collider ("box" or "circle", default is "box")
 * - Set W to the width of the collider
 * - Set H to the height of the collider
 * - Set ox to the x offset of the collider
 * - Set oy to the y offset of the collider
 * - Set note to a string (wrapped in "")
 * ----------------------------------------------------------------------------
 * **Examples**
 * ----------------------------------------------------------------------------
 * Here's an example of having a collider on region 1 that has only 1 collider
 * that is a 48x48 box
 * ~~~
 * {
 *   "1": [{"width": 48, "height": 48}]
 * }
 * ~~~
 * *Note that I left out some of the stuff in the COLLIDER obj. This is because
 * we didn't need to use ox/oy since we're leaving it at 0. And the default type
 * is box, which is what we want.&
 *
 * Here's an example of having colliders on region 1 and 2 with one of them
 * having 2 colliders.
 * ~~~
 * {
 *   "1": [{"width": 0, "height": 0}],
 *   "2": [{"width": 48, "height": 4, "type": "box"}, {"width": 32, "height": 32, "ox": 8, "oy": 8, "type": "circle"}]
 * }
 * ~~~
 * *Note if the width and/or height are set to 0, that region will be marked as
 * passable.*
 *
 * When play testing and if you feel like it's not work, push F8. If the json
 * file isn't configured correct you will have an error in the console.
 *
 * If you need help, feel free to ask in the RMW thread.
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QM+RegionColliders
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
/*~struct~RegionCollider:
 * @param id
 * @text Region Id
 * @desc Set to the region ID to apply this collider to
 * @type Number
 * @default 0
 * 
 * @param type
 * @text Type
 * @desc Set to box or circle
 * @type select
 * @option Box
 * @value box
 * @option Circle
 * @value circle
 * @default box
 *
 * @param width
 * @text Width
 * @desc Set to the width of the collider.
 * @type Number
 * @default 0
 *
 * @param height
 * @text Height
 * @desc Set to the height of the collider.
 * @type Number
 * @default 0
 *
 * @param ox
 * @text Offset X
 * @desc Set to the x offset of the collider.
 * @type Number
 * @default 0
 *
 * @param oy
 * @text Offset Y
 * @desc Set to the y offset of the collider.
 * @type Number
 * @default 0
 * 
 * @param note
 * @text Note
 * @desc Add notetags for this collider
 * @type note
 * @default 
 */
//=============================================================================

//=============================================================================
// QM RegionColliders

(function() {
  var _PARAMS = QPlus.getParams('<QMRegionColliders>', {
    json: false,
    regionColliders: []
  })

  _PARAMS.regionColliders.forEach(function(collider) {
    var id = collider.id;
    if (!QMovement.regionColliders[id]) {
      QMovement.regionColliders[id] = [];
    }
    QMovement.regionColliders[id].push(collider);
  })

  if (_PARAMS.json) {
    QPlus.request('data/RegionColliders.json')
      .onSuccess(function(json) {
        for (var id in json) {
          if (!QMovement.regionColliders[id]) {
            QMovement.regionColliders[id] = [];
          }
          QMovement.regionColliders[id] = QMovement.regionColliders[id].concat(json[id]);
        }
      })
      .onError(function() {
        alert('Failed to load ' + this.url);
      })
  }
})()
