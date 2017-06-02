//=============================================================================
// QM RegionColliders
//=============================================================================

var Imported = Imported || {};
Imported.QMRegionColliders = '1.0.0';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.1.5')) {
  alert('Error: QM+RegionColliders requires QPlus 1.1.5 or newer to work.');
  throw new Error('Error: QM+RegionColliders requires QPlus 1.1.5 or newer to work.');
} else if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.1.0')) {
  alert('Error: QM+RegionColliders requires QMovement 1.1.0 or newer to work.');
  throw new Error('Error: QM+RegionColliders requires QMovement 1.1.0 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QMRegionColliders>
 * QMovement Addon: Allows you to add colliders on regions
 * @author Quxios  | Version 1.0.0
 *
 * @requires QMovement
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
 * region collider ontop of it.
 * ============================================================================
 * ## How to use
 * ============================================================================
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
// QM RegionColliders

(function() {

  QPlus.request('data/RegionColliders.json')
    .onSuccess(function(json) {
      QMovement.regionColliders = json;
    })
    .onError(function() {
      QMovement.regionColliders = {};
      alert('Failed to load ' + this.url);
    })
})()
