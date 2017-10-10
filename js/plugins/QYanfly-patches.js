//=============================================================================
// QYanfly-patches
//=============================================================================

var Imported = Imported || {};
Imported.QYanflyPatches = '1.0.2';

//=============================================================================
 /*:
 * @plugindesc <QYanfly-patches>
 * Patches for Yanfly plugins and QPlugins
 * @author Quxios  | Version 1.0.2
 *
 * @help
 * This plugin should be below Yanfly and QPlugins
 *
 * Patches for QMovement:
 * - YEP_RegionRestrictions
 * - YEP_SlipperyTiles
 */
//=============================================================================

//=============================================================================
// QYanfly-patches for QMovement

(function() {
  //---------------------------------------------------------------------------
  // Yanfly patches for QMovement

  if (Imported.QMovement) {
    //-------------------------------------------------------------------------
    // YEP_RegionRestrictions Patches

    if (Imported.YEP_RegionRestrictions) {
      var Alias_Game_CharacterBase_collidesWithAnyTile = Game_CharacterBase.prototype.collidesWithAnyTile;
      Game_CharacterBase.prototype.collidesWithAnyTile = function(type) {
        var collider = this.collider(type);
        var x = Math.floor(collider.center.x  / QMovement.tileSize);
        var y = Math.floor(collider.center.y  / QMovement.tileSize);
        if (this.isEventRegionForbid(x, y)) return true;
        if (this.isPlayerRegionForbid(x, y)) return true;
        if (this.isEventRegionAllow(x, y)) return false;
        if (this.isPlayerRegionAllow(x, y)) return false;
        return Alias_Game_CharacterBase_collidesWithAnyTile.call(this, type);
      };

      var Alias_Game_CharacterBase_collidedWithTile = Game_CharacterBase.prototype.collidedWithTile;
      Game_CharacterBase.prototype.collidedWithTile = function(type, collider) {
        if (collider.regionId) {
          if (this.isPlayer()) {
            if ($gameMap.allowEventRegions().contains(collider.regionId)) return false;
          } else if (this.isEvent()) {
            if ($gameMap.allowPlayerRegions().contains(collider.regionId)) return false;
          }
        }
        return Alias_Game_CharacterBase_collidedWithTile.call(this, type, collider);
      };
    }

    //-------------------------------------------------------------------------
    // YEP_SlipperyTiles Patches

    if (Imported.YEP_SlipperyTiles) {
      Game_CharacterBase.prototype.onSlipperyFloor = function() {
        return $gameMap.isSlippery(this.x, this.y);
      };

      Game_Player.prototype.updateSlippery = function() {
          if ($gameMap.isEventRunning()) return;
          if (this.onSlipperyFloor() && !this.startedMoving()) {
            $gameTemp.clearDestination();
      			this.moveRadian(this._radian);
          }
      };
    }
  }

})()
