//=============================================================================
// QMFollowers
//=============================================================================

var Imported = Imported || {};

if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.2.2')) {
  alert('Error: QM+Followers requires QMovement 1.2.2 or newer to work.');
  throw new Error('Error: QM+Followers requires QMovement 1.2.2 or newer to work.');
}

Imported.QMFollowers = '1.0.2';

//=============================================================================
 /*:
 * @plugindesc <QMFollowers>
 * QMovement Addon: Adds follower support
 * @author Quxios  | Version 1.0.2
 *
 * @requires QMovement
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This adds support for followers when using QMovement.
 *
 * *Note:* I won't be continuing working on this plugin. I personally dislike
 * followers and rather not do anything with them. So if you have issues with this
 * plugin you will need to try to fix it your self or find another plugin dev
 * to fix it for you. Sorry!
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QM+Followers
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
 * @tags QM-Addon, followers
 */
//=============================================================================


//=============================================================================
// QMFollowers

(function() {

  //-----------------------------------------------------------------------------
  // Game_Player

  var Alias_Game_Player_onPositionChange = Game_Player.prototype.onPositionChange;
  Game_Player.prototype.onPositionChange = function() {
    Alias_Game_Player_onPositionChange.call(this);
    var dir = this.radianToDirection(this._radian, QMovement.diagonal);
    this._followers.addMove(this._px, this._py, this.realMoveSpeed(), dir);
  };

  //-----------------------------------------------------------------------------
  // Game_Follower

  var Alias_Game_Follower_initialize = Game_Follower.prototype.initialize;
  Game_Follower.prototype.initialize = function(memberIndex) {
    Alias_Game_Follower_initialize.call(this, memberIndex);
    this._moveList = [];
  };

  Game_Follower.prototype.addMove = function(x, y, speed, dir) {
    this._moveList.push([x, y, speed, dir]);
  };

  Game_Follower.prototype.clearList = function() {
    this._moveList = [];
  };

  Game_Follower.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    this.setTransparent($gamePlayer.isTransparent());
  };

  Game_Follower.prototype.updateMoveList = function(preceding, gathering) {
    if (this._moveList.length === 0 || this.startedMoving()) return;
    if (this._moveList.length <= this._memberIndex) return;
    var move = this._moveList.shift();
    if (!gathering) {
      var collided = this.collideWithPreceding(preceding, move[0], move[1], move[3]);
      if (collided) {
        this._moveList.unshift(move);
        return;
      }
    }
    this.setMoveSpeed(move[2]);
    this.setDirection(move[3]);
    this._realPX = this._px;
    this._realPY = this._py;
    this._px = move[0];
    this._py = move[1];
    this._moveCount++;
  };

  Game_Follower.prototype.collideWithPreceding = function(preceding, x, y, dir) {
    if (!this.isVisible()) return false;
    this.collider('collision').moveTo(x, y);
    if (this.collider('collision').intersects(preceding.collider('collision'))) {
      if (this._direction === preceding._direction) {
        this.collider('collision').moveTo(this._px, this._py);
        return true;
      }
    }
    this.collider('collision').moveTo(this._px, this._py);
    return false;
  };

  Game_Follower.prototype.defaultColliderConfig = function() {
    return QMovement.playerCollider;
  };

  //-----------------------------------------------------------------------------
  // Game_Follower

  Game_Followers.prototype.update = function() {
    for (var i = 0; i < this._data.length; i++) {
      var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
      this._data[i].update();
      this._data[i].updateMoveList(precedingCharacter, this._gathering);
    }
  };

  Game_Followers.prototype.addMove = function(x, y, speed, dir) {
    for (var i = 0; i < this._data.length; i++) {
      this._data[i].addMove(x, y, speed, dir);
    }
  };

  Game_Followers.prototype.synchronize = function(x, y, dir) {
    var chara = $gamePlayer;
    this.forEach(function(follower) {
      follower.copyPosition(chara);
      follower.straighten();
      follower.setDirection(chara.direction());
      follower.clearList();
    }, this);
  };

  Game_Followers.prototype.areGathering = function() {
    if (this.areGathered() && this._gathering) {
      this._gathering = false;
      return true;
    }
    return false;
  };

  Game_Followers.prototype.areGathered = function() {
    return this.visibleFollowers().every(function(follower) {
      return follower.cx() === $gamePlayer.cx() && follower.cy() === $gamePlayer.cy();
    }, this);
  };
})()
