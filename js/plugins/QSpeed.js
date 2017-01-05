//=============================================================================
// QSpeed
//=============================================================================

var Imported = Imported || {};
Imported.QSpeed = '1.0.0';

if (!Imported.QPlus) {
  var msg = 'Error: QSpeed requires QPlus to work.';
  alert(msg);
  throw new Error(msg);
}

//=============================================================================
 /*:
 * @plugindesc <QSpeed>
 * Allows for custom Move speeds and an acceleration effect
 * @author Quxios  | Version 1.0.0
 *
 * @requires QPlus
 *
 * @param Acceleration
 * @desc Set this to true to enable acceleration by default.
 * Set to false to disable by default.
 * @default true
 *
 * @param Duration
 * @desc Set this to value for the default time (in frames) it takes
 * a character to reach new speeds.   Default: 30
 * @default 30
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin lets you set custom move speeds for your characters. It also
 * adds an acceleration / deceleration effect when that characters move speed
 * is changing. This can be enabled / disabled.
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Setting custom move speed**
 * ----------------------------------------------------------------------------
 * ~~~
 *   qSpeed [CHARAID] set [MOVESPEED] [list of options]
 * ~~~
 * CHARAID   - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID or eventEVENTID
 *  (replace EVENTID with a number)
 *
 * MOVESPEED - The speed to set the character too. Can be a float; ex: 3.5
 *
 * Possible options:
 *
 *  - accel - Character needs to accelerate / decelerate to this new speed.
 *
 * ----------------------------------------------------------------------------
 * **Enabling Acceleration**
 * ----------------------------------------------------------------------------
 * ~~~
 *   qSpeed [CHARAID] enableAccel
 * ~~~
 * CHARAID   - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID or eventEVENTID
 *  (replace EVENTID with a number)
 * ----------------------------------------------------------------------------
 * **Disabling Acceleration**
 * ----------------------------------------------------------------------------
 * ~~~
 *   qSpeed [CHARAID] disableAccel
 * ~~~
 * CHARAID   - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID or eventEVENTID
 *  (replace EVENTID with a number)
 * ----------------------------------------------------------------------------
 * **Setting Acceleration time**
 * ----------------------------------------------------------------------------
 * ~~~
 *   qSpeed [CHARAID] duration [TIME]
 * ~~~
 * CHARAID   - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID or eventEVENTID
 *  (replace EVENTID with a number)
 *
 * TIME      - The time in frames it takes the character to reach new speeds.
 * ----------------------------------------------------------------------------
 * **Examples**
 * ----------------------------------------------------------------------------
 * ~~~
 *   qSpeed 1 set 3.65
 *   qSpeed e1 set 3.65
 *   qSpeed event1 set 3.65
 * ~~~
 * (Note: All 3 are the same, just using a different character id method)
 *
 * Event 1 will have it's move speed set to 3.65. Since there's no accel option
 * he won't accel to the new speed, it will be applied instantly.
 *
 * ~~~
 *   qSpeed 1 set 3.5 accel
 *   qSpeed e1 set 3.5 accel
 *   qSpeed event1 set 3.5 accel
 * ~~~
 * (Note: All 3 are the same, just using a different character id method)
 *
 * Event 1 will have it's move speed set to 4.5. Since there's a accel option
 * he will accel to the new speed.
 *
 * ~~~
 *   qSpeed 0 duration 60
 *   qSpeed p1 duration 60
 *   qSpeed player duration 60
 * ~~~
 * (Note: All 3 are the same, just using a different character id method)
 *
 * The player's accel duration will be set to 60. This means it will take him
 * 60 frames to reach his new speed. Unless his acceleration is disabled.
 * ============================================================================
 * ## Notes
 * ============================================================================
 * **Setting default custom move speed**
 * ----------------------------------------------------------------------------
 * Adding the following to the notes or in a comment will make that event use
 * this custom speed by default
 * ~~~
 *   <speed:X>
 * ~~~
 * X  - The speed to set the character too. Can be a float; ex: 3.5
 * ============================================================================
 * ## Links
 * ============================================================================
 * RPGMakerWebs:
 *
 *   http://forums.rpgmakerweb.com/index.php?/topic/73023-qplugins/
 *
 * Terms of use:
 *
 *   https://github.com/quxios/QMV-Master-Demo/blob/master/readme.md
 *
 * @tags character
 */
//=============================================================================

//=============================================================================
// QSpeed

(function() {
  var _params = QPlus.getParams('<QSpeed>');
  var _defaultAccel = _params['Acceleration'] === 'true';
  var _defaultDur = Number(_params['Duration']) || 1;
  if (_defaultDur < 1) _defaultDur = 1;

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qspeed') {
      this.qPluginCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qPluginCommand = function(args) {
    var chara = QPlus.getCharacter(args[0]);
    var cmd = args[1].toLowerCase();
    var args2 = args.slice(2);
    if (cmd === 'enableaccel') {
      chara._useAccel = true;
    }
    if (cmd === 'disableaccel') {
      chara._useAccel = false;
    }
    if (cmd === 'duration') {
      chara._moveSpeedDuration = Number(args2[0]) || 1;
    }
    if (cmd === 'set') {
      var spd = Number(args2[0]);
      var accel = args2[1] === 'accel';
      chara.setMoveSpeed(spd, accel);
    }
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._realMoveSpeed = 4;
    this._moveSpeedDuration = _defaultDur;
    this._moveSpeedSpd  = 0;
    this._useAccel   = true;
    this._wasDashing = false;
  };

  var Alias_Game_CharacterBase_setMoveSpeed = Game_CharacterBase.prototype.setMoveSpeed;
  Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
    Alias_Game_CharacterBase_setMoveSpeed.call(this, moveSpeed);
    var duration = this._moveSpeedDuration;
    if (!this._useAccel) {
      this._moveSpeedSpd = moveSpeed;
      return;
    }
    this._moveSpeedSpd = Math.abs(this._realMoveSpeed - moveSpeed) / duration;
  };

  Game_CharacterBase.prototype.realMoveSpeed = function() {
    return this._realMoveSpeed;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    Alias_Game_CharacterBase_update.call(this);
    this.updateMoveSpeed();
  };

  Game_CharacterBase.prototype.updateMoveSpeed = function() {
    if (this._realMoveSpeed < this._moveSpeed) {
      this._realMoveSpeed = Math.min(this._realMoveSpeed + this._moveSpeedSpd, this._moveSpeed);
    } else if (this._realMoveSpeed > this._moveSpeed) {
      this._realMoveSpeed = Math.max(this._realMoveSpeed - this._moveSpeedSpd, this._moveSpeed);
    }
    var isDashing = this.isDashing();
    if (!this._wasDashing && isDashing) {
      this.setMoveSpeed(this._moveSpeed + 1);
    }
    if (this._wasDashing && !isDashing) {
      this.setMoveSpeed(this._moveSpeed - 1);
    }
    this._wasDashing = isDashing;
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    var match = /<speed:\s*(\d+\.?\d*?)>/i.exec(this.comments());
    if (match) {
      this.setMoveSpeed(Number(match[1]) || 4);
    }
  };
})()
