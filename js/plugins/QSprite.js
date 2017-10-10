//=============================================================================
// QSprite
//=============================================================================

var Imported = Imported || {};
Imported.QSprite = '2.1.7';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.4.0')) {
  alert('Error: QSprite requires QPlus 1.4.0 or newer to work.');
  throw new Error('Error: QSprite requires QPlus 1.4.0 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QSprite>
 * Lets you configure Spritesheets
 * @author Quxios  | Version 2.1.7
 *
 * @requires QPlus
 *
 * @param File Name Identifier
 * @desc Set the file name identifier for QSprites
 * Default: %{config}-
 * @default %{config}-
 *
 * @param Random Idle Interval
 * @desc Set the time interval between random Idles (in frames)
 * @type Struct<Range>
 *
 * @param Use New Adjust
 * @desc Use new pose speed adjust?
 * @type Boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin lets you use sprites that are set up with QSprite Editor
 *
 * https://github.com/quxios/QSpriteEditor
 *
 * ============================================================================
 * ## How to use
 * ============================================================================
 * First configure your sprite with the QSprite Editor. Then you can use your
 * sprites by identifying it as a QSprite. To do so, just name your sprite file
 * by using the File Name Identifier format. By default this is:
 * ~~~
 *  %{config}-
 * ~~~
 * You would replace {config} with the config you made inside the QSprite
 * Editor. For example, if I made a config named: `Hero` then I would name
 * the file something like: `%Hero-Example.png`
 * ============================================================================
 * ## Built-in Poses
 * ============================================================================
 * This plugin adds a few built in poses:
 * - moveX
 * - dashX
 * - idleX
 * - idle[A-Z]X ( more info for this below )
 * - default
 *
 * Where X is the direction:
 * - 2: down
 * - 4: left
 * - 6: right
 * - 8: up
 * - 1: lower left
 * - 3: lower right
 * - 7: upper left
 * - 9: upper right
 *
 * *(Diagonals only work if you are using this with QMovement)*
 *
 * Default pose is used when and idleX or moveX is not found. Note that default
 * does not have an X at the end, it's just default. Has no directions tied to
 * it.
 *
 * ----------------------------------------------------------------------------
 * **idle[A-Z]X**
 * ----------------------------------------------------------------------------
 * This is a random idle that will play a random `idle[A-Z]` every X frames.
 * The random wait depends on the `Random Idle Interval` parameter. To clarify
 * you won't be naming this pose `idle[A-Z]2` (for example for the down direction)
 * you would name it `idleA2` or `idleB2` or `idleC2`, ect.
 *
 * You can also add in a multipier if you want one of the idles to appear more
 * often then others by adding: `Tx` Where T is the multipler.
 *
 * For example:
 *
 * Lets say I want 4 `idle[A-Z]` poses, and I want one of them to have a 4 times
 * better chance of appearing then the rest. My idle names would be:
 *
 * - idleA2
 * - idleB2
 * - idleC2
 * - idleD4x2
 *
 * *Note: all their directions are 2(down)*
 * ============================================================================
 * ## Notetags / Comments
 * ============================================================================
 * **Set default direction**
 * ----------------------------------------------------------------------------
 * With spritesheets being large, it may be hard to pick that events starting
 * direction. To fix that, you can add a comment in that event that will set
 * it's default direction.
 * ~~~
 *  <direction:X>
 * ~~~
 * Set X to direction. 2 for down, 4 left, 6 right, 8 up.
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Playing a Pose**
 * ----------------------------------------------------------------------------
 * Play a pose.
 * ~~~
 *  qSprite [CHARAID] play [POSE] [list of options]
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 * - POSE: The pose to play (Don’t add the direction! ex: atk, not atk2)
 *
 * Possible options:
 * - lock: Disable character movement while pose is playing
 * - pause: Pause the pose on the last frame
 * - breakable: If character moves, the pose will end
 * - wait: Next Event Command runs once pose is complete
 *
 * ----------------------------------------------------------------------------
 * **Looping a Pose**
 * ----------------------------------------------------------------------------
 * Loop a pose until it's cleared, broken out of or played over.
 * ~~~
 *  qSprite [CHARAID] loop [POSE] [list of options]
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 * - POSE: The pose to play (Don’t add the direction! ex: atk, not atk2)
 *
 * Possible options:
 * - lock: Disable character movement while pose is playing
 * - breakable: If character moves, the loop will end
 * - wait: Next Event Command runs once first loop has is complete
 * ----------------------------------------------------------------------------
 * **Clearing**
 * ----------------------------------------------------------------------------
 * Clear current playing/looping pose.
 * ~~~
 *  qSprite [CHARAID] clear
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 * ----------------------------------------------------------------------------
 * **Add / Remove an idle[A-Z]**
 * ----------------------------------------------------------------------------
 * Maybe you only want to play an idle[A-Z] during certain scenes. So you can
 * add and remove them whenever you want!
 * ~~~
 *  qSprite [CHARAID] addIdleAZ [POSE]
 *
 *  qSprite [CHARAID] removeIdleAZ [POSE]
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 * - POSE: The idle[A-Z] to add (Don’t add the direction! ex: idleA not idleA2)
 * ----------------------------------------------------------------------------
 * **Change idle pose**
 * ----------------------------------------------------------------------------
 * Maybe you want to have a different idle for certain parts of the game. I
 * would recommend just using a different spritesheet, but I added a plugin
 * command to let you change your idle!
 * ~~~
 *  qSprite [CHARAID] changeIdle [POSE]
 * ~~~
 * - CHARAID: The character identifier.
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 * - POSE: The new pose to use when idle (Don’t add the direction! ex: idleA not idleA2)
 * ----------------------------------------------------------------------------
 * **Examples**
 * ----------------------------------------------------------------------------
 * ~~~
 *  qSprite 0 play confused pause breakable
 *  qSprite p play confused pause breakable
 *  qSprite player play confused pause breakable
 * ~~~
 * *Note: All 3 are the same, just using a different character id method*
 *
 * The player will run the `confused` pose. The pose will stop on the last frame.
 * Once the player moves, the pose will end. The player can move during this pose
 * and the next event command will run immediatly after this command with no
 * wait.
 *
 * ~~~
 *  qSprite 1 play hug wait
 *  qSprite e1 play hug wait
 *  qSprite event1 play hug wait
 * ~~~
 * Event 1 will run the hug pose. The event can't move until the pose is
 * complete, and the next event command will run once the pose is complete.
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QSprite
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
 * @tags character, sprite, animation
 */
 /*~struct~Range:
 * @param Min
 * @desc Set to the min value
 * @type Number
 * @default 60
 *
 * @param Max
 * @desc Set to max value
 * @type Number
 * @default 300
 */
//=============================================================================

//=============================================================================
// QSprite Static Class

function QSprite() {
 throw new Error('This is a static class');
}

QSprite.json = null;

//=============================================================================
// QSprite

(function() {
  var _PARAMS = QPlus.getParams('<QSprite>', true);
  var _IDENTIFIER = _PARAMS['File Name Identifier'] || '%{config}-';
  _IDENTIFIER = _IDENTIFIER.replace('{config}', '(.+?)');
  _IDENTIFIER = new RegExp(_IDENTIFIER);
  var _IDLEINTERVAL = [
    _PARAMS['Random Idle Interval'].Min,
    _PARAMS['Random Idle Interval'].Max
  ]
  if (_IDLEINTERVAL[1] < _IDLEINTERVAL[0]) {
    _IDLEINTERVAL[1] = _IDLEINTERVAL[0];
  }
  var _USENEWADJUST = _PARAMS['Use New Adjust'];
  var _HASQMOVEMENT = Imported.Quasi_Movement || Imported.QMovement;

  QPlus.request('data/QSprite.json')
    .onSuccess(function(data) {
      QSprite.json = data;
    })
    .onError(function() {
      alert('Error:' + this.url + ' not found.');
      QSprite.json = {};
    })

  var Alias_Scene_Base_isReady = Scene_Base.prototype.isReady;
  Scene_Base.prototype.isReady = function() {
    return Alias_Scene_Base_isReady.call(this) && QSprite.json;
  };

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'quasi') {
      this.qSpriteCommandOld(args);
    }
    if (command.toLowerCase() === 'qsprite') {
      this.qSpriteCommand(args);
      return;
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qSpriteCommand = function(args) {
    var chara;
    if (args[0].toLowerCase() === 'this') {
      chara = this.character(0);
    } else {
      chara = QPlus.getCharacter(args[0]);
    }
    if (!chara) return;
    var cmd = args[1].toLowerCase();
    var args2 = args.slice(2);
    if (cmd === 'play') {
      var pose = args2.shift();
      var locked   = !!QPlus.getArg(args2, /^lock$/i);
      var pause    = !!QPlus.getArg(args2, /^pause$/i);
      var canBreak = !!QPlus.getArg(args2, /^breakable$/i);
      var wait     = !!QPlus.getArg(args2, /^wait$/i);
      chara.playPose(pose, locked, pause, false, canBreak);
      if (wait) {
        this.wait(chara.calcPoseWait());
      }
    }
    if (cmd === 'loop') {
      var pose = args2.shift();
      var locked   = !!QPlus.getArg(args2, /^lock$/i);
      var canBreak = !!QPlus.getArg(args2, /^breakable$/i);
      var wait     = !!QPlus.getArg(args2, /^wait$/i);
      chara.loopPose(pose, locked, canBreak);
      if (wait) {
        this.wait(chara.calcPoseWait());
      }
    }
    if (cmd === 'clear') {
      chara.clearPose();
    }
    if (cmd === 'addidleaz') {
      chara.addRandIdle(args2[0]);
    }
    if (cmd === 'removeidleaz') {
      chara.removeRandIdle(args2[0]);
    }
    if (cmd === 'changeidle') {
      chara.changeIdle(args2[0]);
    }
  };

  Game_Interpreter.prototype.qSpriteCommandOld = function(args) { // backwards compatibility
    if (args[0].toLowerCase() === "playpose") {
      var charaId = Number(args[1]);
      var chara = charaId === 0 ? $gamePlayer : $gameMap.event(charaId);
      var pose = args[2];
      var locked = args[3] === "true";
      var pause = args[4] === "true";
      chara.playPose(pose, locked, pause);
      return;
    }
    if (args[0].toLowerCase() === "looppose") {
      var charaId = Number(args[1]);
      var chara = charaId === 0 ? $gamePlayer : $gameMap.event(charaId);
      var pose = args[2];
      var locked = args[3] === "true";
      chara.loopPose(pose, locked);
      return;
    }
    if (args[0].toLowerCase() === "clearpose") {
      var charaId = Number(args[1]);
      var chara = charaId === 0 ? $gamePlayer : $gameMap.event(charaId);
      chara.clearPose();
      return;
    }
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  var Alias_Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
  Game_CharacterBase.prototype.initMembers = function() {
    Alias_Game_CharacterBase_initMembers.call(this);
    this._pose = '';
    this._idlePose = 'idle';
    this._availableIdlePoses = [];
    this._idleTimer = 0;
    this._idleIntervalWait = Math.randomIntBetween(_IDLEINTERVAL[0], _IDLEINTERVAL[1]);
  };

  Game_CharacterBase.prototype.moveSpeedMultiplier = function() {
    var ds = 4 - this.realMoveSpeed();
    return Math.pow(2, ds);
  };

  var Alias_Game_CharacterBase_animationWait = Game_CharacterBase.prototype.animationWait;
  Game_CharacterBase.prototype.animationWait = function() {
    if (this.qSprite() && this.qSprite().poses[this._pose]) {
      var pose = this.qSprite().poses[this._pose];
      if (pose.adjust) {
        if (_USENEWADJUST) {
          return pose.speed / this.moveSpeedMultiplier();
        } else {
          return (pose.speed - this.realMoveSpeed()) * 3;
        }
      }
      return pose.speed;
    }
    return Alias_Game_CharacterBase_animationWait.call(this);
  };

  Game_CharacterBase.prototype.calcPoseWait = function() {
    if (!this.qSprite()) return 0;
    var frameWait = this.animationWait();
    var frames = this.qSprite().poses[this._pose].pattern.length;
    return Math.ceil(frameWait * frames);
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    var wasMoving = this.isMoving();
    Alias_Game_CharacterBase_update.call(this);
    if (this.qSprite()) {
      this.updatePose(wasMoving);
    } else {
      this._pose = '';
    }
  };

  Game_CharacterBase.prototype.updatePose = function(wasMoving) {
    var isMoving = wasMoving || this.isMoving();
    if (this._posePlaying) {
      if (!this._posePlaying.canBreak) return;
      if (!isMoving) return;
      this.clearPose();
    }
    var dir = this._direction;
    if (_HASQMOVEMENT && this.isDiagonal()) {
      var diag = this.isDiagonal();
    }
    if (!isMoving && this.hasPose(this._idlePose + dir)) {
      this.updateIdlePose(dir, diag);
    } else {
      this.updateSteppingPose(isMoving, wasMoving);
      if (this._posePlaying) return;
      this.updateMovingPose(dir, diag, isMoving);
    }
    if (this._pose === '') this._pose = 'default';
  };

  Game_CharacterBase.prototype.updateIdlePose = function(dir, diag) {
    if (diag && this.hasPose(this._idlePose + diag)) {
      dir = diag;
    }
    if (this._pose !== this._idlePose + dir) {
      this._pattern = 0;
      this._animationCount = 0;
      this._isIdle = true;
    }
    this._pose = this._idlePose + dir;
    this.updateIdleInterval();
  };

  Game_CharacterBase.prototype.updateSteppingPose = function(isMoving, wasMoving) {
    this._isIdle = !isMoving;
    if (this._isIdle && wasMoving) {
      this._pattern = 0;
    } else if (this._isIdle) {
      if (!this.hasStepAnime()) {
        this._pattern = 0;
      }
      this.updateIdleInterval();
    } else if (!this._isIdle) {
      this._idleTimer = 0;
      this._idleIntervalWait = Math.randomIntBetween(_IDLEINTERVAL[0], _IDLEINTERVAL[1])
    }
  };

  Game_CharacterBase.prototype.updateIdleInterval = function() {
    this._idleTimer++;
    if (this._availableIdlePoses.length > 0) {
      if (this._idleTimer >= this._idleIntervalWait) {
        var i = Math.randomInt(this._availableIdlePoses.length);
        var pose = this._availableIdlePoses[i];
        this.playPose(pose, false, false, false, true);
        this._idleIntervalWait = Math.randomIntBetween(_IDLEINTERVAL[0], _IDLEINTERVAL[1])
        this._idleTimer = 0;
      }
    }
  };

  Game_CharacterBase.prototype.updateDashingPose = function(dir, diag) {
    if (diag && this.hasPose('dash' + diag)) {
      dir = diag;
    }
    if (this.hasPose('dash' + dir)) {
      this._pose = 'dash' + dir;
      return true;
    }
    return false;
  };

  Game_CharacterBase.prototype.updateMovingPose = function(dir, diag, isMoving) {
    if (this.isDashing() && isMoving) {
      if (this.updateDashingPose(dir, diag)) {
        return;
      }
    }
    if (diag && this.hasPose('move' + diag)) {
      dir = diag;
    }
    if (this.hasPose('move' + dir)) {
      this._pose = 'move' + dir;
    }
  };

  var Alias_Game_CharacterBase_updateAnimationCount = Game_CharacterBase.prototype.updateAnimationCount;
  Game_CharacterBase.prototype.updateAnimationCount = function() {
    if (this._isIdle || this._posePlaying) {
      this._animationCount++;
      return;
    }
    Alias_Game_CharacterBase_updateAnimationCount.call(this);
  };

  var Alias_Game_CharacterBase_updatePattern = Game_CharacterBase.prototype.updatePattern;
  Game_CharacterBase.prototype.updatePattern = function() {
    if (this._isIdle || this._posePlaying || this.qSprite()) {
      this._pattern++;
      if (this._pattern >= this.maxPattern()) {
        if (this._posePlaying) {
          if (this._posePlaying.pause) {
            this._pattern--;
            return;
          }
          if (!this._posePlaying.loop) {
            this.clearPose();
            return;
          }
        }
        this.resetPattern();
      }
      return;
    }
    return Alias_Game_CharacterBase_updatePattern.call(this);
  };

  var Alias_Game_CharacterBase_maxPattern = Game_CharacterBase.prototype.maxPattern;
  Game_CharacterBase.prototype.maxPattern = function() {
    if (this.qSprite()) {
      var pose = this.qSprite().poses[this._pose];
      return pose ? pose.pattern.length : 0;
    }
    return Alias_Game_CharacterBase_maxPattern.call(this);
  };

  Game_CharacterBase.prototype.resetPattern = function() {
    this.qSprite() ? this.setPattern(0) : this.setPattern(1);
  };

  var Alias_Game_CharacterBase_straighten = Game_CharacterBase.prototype.straighten;
  Game_CharacterBase.prototype.straighten = function() {
    var oldAnimCount = this._animationCount;
    var oldPattern = this._pattern;
    Alias_Game_CharacterBase_straighten.call(this);
    if (this.qSprite() && (this.hasWalkAnime() || this.hasStepAnime())) {
      this._pattern = 0;
    }
    if (this.qSprite() && this._posePlaying) {
      this._animationCount = oldAnimCount;
      this._pattern = oldPattern;
    }
  };

  Game_CharacterBase.prototype.hasPose = function(pose) {
    if (this.qSprite()) {
      return this.qSprite().poses.hasOwnProperty(pose);
    }
    return false;
  };

  var Alias_Game_CharacterBase_setImage = Game_CharacterBase.prototype.setImage;
  Game_CharacterBase.prototype.setImage = function(characterName, characterIndex) {
    var wasPosePlaying = this._posePlaying;
    Alias_Game_CharacterBase_setImage.call(this, characterName, characterIndex);
    this._isQChara = undefined;
    this._isIdle = null;
    this._posePlaying = null;
    this.getAvailableIdlePoses();
    if (this.isQCharacter()) {
      this._posePlaying = wasPosePlaying;
    }
  };

  Game_CharacterBase.prototype.getAvailableIdlePoses = function() {
    this._availableIdlePoses = [];
    if (this.isQCharacter()) {
      var poses = this.qSprite().poses;
      for (var pose in poses) {
        var match = /^idle[a-zA-Z]([0-9]+x)?[12346789]$/.exec(pose);
        if (match) {
          var name = pose.slice(0, -1);
          if (!this._availableIdlePoses.contains(name)) {
            var x = 1;
            if (match[1]) {
              x = Number(match[1].slice(0, -1));
            }
            for (var i = 0; i < x; i++) {
              this._availableIdlePoses.push(name);
            }
          }
        }
      }
    }
  };

  Game_CharacterBase.prototype.addRandIdle = function(pose) {
    var match = /^(.*)[a-zA-Z]([0-9]+x)?$/.exec(pose);
    if (match) {
      if (!this._availableIdlePoses.contains(pose)) {
        var x = 1;
        if (match[2]) {
          x = Number(match[2].slice(0, -1));
        }
        for (var i = 0; i < x; i++) {
          this._availableIdlePoses.push(pose);
        }
      }
    }
  };

  Game_CharacterBase.prototype.removeRandIdle = function(pose) {
    for (var i = this._availableIdlePoses.length - 1; i >= 0; i--) {
      if (this._availableIdlePoses[i] === pose) {
        this._availableIdlePoses.splice(i, 1);
      }
    }
  };

  Game_CharacterBase.prototype.changeIdle = function(pose) {
    this._idlePose = pose;
  };

  Game_CharacterBase.prototype.playPose = function(pose, lock, pause, looping, canBreak) {
    if (!this.qSprite()) return;
    var dir = this._direction;
    if (_HASQMOVEMENT && this.isDiagonal()) {
      var diag = this.isDiagonal();
      if (this.hasPose(pose + diag)) {
        dir = diag;
      }
    }
    if (this.hasPose(pose + dir)) {
      pose += dir;
    } else if (!this.hasPose(pose)) {
      return;
    }
    this._pose = pose;
    this._posePlaying = {
      lock: lock,
      pause: pause,
      loop: looping,
      canBreak: canBreak
    }
    this._animationCount = 0;
    this._pattern = 0;
  };

  Game_CharacterBase.prototype.loopPose = function(pose, lock, canBreak) {
    // function kept for backwards compatibility
    return this.playPose(pose, lock, false, true, canBreak);
  };

  Game_CharacterBase.prototype.clearPose = function() {
    this._pose = '';
    this._posePlaying = null;
    this._locked = false;
    this._animationCount = 0;
    this._pattern = 0;
    this.updatePose(false);
  };

  Game_CharacterBase.prototype.isQCharacter = function() {
    if (this._isQChara === undefined) {
      this._isQChara = this._characterName.match(_IDENTIFIER);
    }
    return this._isQChara ? this._isQChara[1] : false;
  };

  Game_CharacterBase.prototype.qSprite = function() {
    return this.isQCharacter() ? QSprite.json[this.isQCharacter()] : null;
  };

  //-----------------------------------------------------------------------------
  // Game_Player

  var Alias_Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if (this._posePlaying && this._posePlaying.lock) return false;
    return Alias_Game_Player_canMove.call(this);
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  var Alias_Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
  Game_Event.prototype.setupPageSettings = function() {
    Alias_Game_Event_setupPageSettings.call(this);
    var match = /<direction:(\d+?)>/i.exec(this.comments());
    if (match) {
      this.setDirection(Number(match[1]));
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character

  Sprite_Character.prototype.qSprite = function() {
    return this._character.isQCharacter() ? this._character.qSprite() : null;
  };

  var Alias_Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
  Sprite_Character.prototype.updateBitmap = function() {
    if (this.isImageChanged()) {
      Alias_Sprite_Character_updateBitmap.call(this);
      var qSprite = this.qSprite();
      if (qSprite) {
        this.anchor.x = qSprite.anchorX || 0.5;
        this.anchor.y = qSprite.anchorY || 1;
      }
    }
  };

  Sprite_Character.prototype.updateCharacterFrame = function() {
    var pw = this.patternWidth();
    var ph = this.patternHeight();
    var sx = (this.characterBlockX() + this.characterPatternX()) * pw;
    var sy = (this.characterBlockY() + this.characterPatternY()) * ph;
    this.updateHalfBodySprites();
    if (this._bushDepth > 0) {
      var offsetA = Math.round(ph - ph * this.anchor.y);
      var d = this._bushDepth + offsetA;
      this._upperBody.setFrame(sx, sy, pw, ph - d);
      this._lowerBody.setFrame(sx, sy + ph - d, pw, d);
      this.setFrame(sx, sy, 0, ph);
    } else {
      this.setFrame(sx, sy, pw, ph);
    }
  };

  var Alias_Sprite_Character_updateHalfBodySprites = Sprite_Character.prototype.updateHalfBodySprites;
  Sprite_Character.prototype.updateHalfBodySprites = function() {
    Alias_Sprite_Character_updateHalfBodySprites.call(this);
    if (this._bushDepth > 0) {
      var ph = this.patternHeight();
      var offsetA = Math.round(ph - ph * this.anchor.y);
      var offsetB = ph - offsetA;
      this._upperBody.y = -offsetB;
      this._lowerBody.y = -this._bushDepth;
    }
  };

  var Alias_Sprite_Character_createHalfBodySprites = Sprite_Character.prototype.createHalfBodySprites;
  Sprite_Character.prototype.createHalfBodySprites = function() {
    var upper = this._upperBody;
    var lower = this._lowerBody;
    Alias_Sprite_Character_createHalfBodySprites.call(this);
      if (!upper) {
        this._upperBody.anchor.x = this.anchor.x;
        this._upperBody.anchor.y = 0;
      }
      if (!lower) {
        this._lowerBody.anchor.x = this.anchor.x;
        this._lowerBody.anchor.y = 0;
        this._lowerBody.opacity = 128;
      }
  };
  var Alias_Sprite_Character_characterBlockX = Sprite_Character.prototype.characterBlockX;

  var Alias_Sprite_Character_characterBlockX = Sprite_Character.prototype.characterBlockX;
  Sprite_Character.prototype.characterBlockX = function() {
    if (this.qSprite()) return 0;
    return Alias_Sprite_Character_characterBlockX.call(this);
  };

  var Alias_Sprite_Character_characterBlockY = Sprite_Character.prototype.characterBlockY;
  Sprite_Character.prototype.characterBlockY = function() {
    if (this.qSprite()) return 0;
    return Alias_Sprite_Character_characterBlockY.call(this);
  };

  var Alias_Sprite_Character_characterPatternX = Sprite_Character.prototype.characterPatternX;
  Sprite_Character.prototype.characterPatternX = function() {
    var qSprite = this.qSprite();
    if (qSprite) {
      var pose = qSprite.poses[this._character._pose];
      if (!pose) return 0;
      var pattern = pose.pattern;
      var i = pattern[this._character._pattern];
      var x = i % qSprite.cols;
      return x;
    }
    return Alias_Sprite_Character_characterPatternX.call(this);
  };

  var Alias_Sprite_Character_characterPatternY = Sprite_Character.prototype.characterPatternY;
  Sprite_Character.prototype.characterPatternY = function() {
    var qSprite = this.qSprite();
    if (qSprite) {
      var pose = qSprite.poses[this._character._pose];
      if (!pose) return 0;
      var pattern = pose.pattern;
      var i = pattern[this._character._pattern];
      var x = i % qSprite.cols;
      var y = (i - x) / qSprite.cols;
      return y;
    }
    return Alias_Sprite_Character_characterPatternY.call(this);
  };

  var Alias_Sprite_Character_patternWidth = Sprite_Character.prototype.patternWidth;
  Sprite_Character.prototype.patternWidth = function() {
    var qSprite = this.qSprite();
    if (qSprite) {
      return this.bitmap.width / qSprite.cols;
    }
    return Alias_Sprite_Character_patternWidth.call(this);
  };

  var Alias_Sprite_Character_patternHeight = Sprite_Character.prototype.patternHeight;
  Sprite_Character.prototype.patternHeight = function() {
    var qSprite = this.qSprite();
    if (qSprite) {
      return this.bitmap.height / qSprite.rows;
    }
    return Alias_Sprite_Character_patternHeight.call(this);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Actor

  Sprite_Actor.prototype.isQCharacter = function() {
    if (this._isQChara === undefined) {
      this._isQChara = this._battlerName.match(_IDENTIFIER);
    }
    return this._isQChara ? this._isQChara[1] : false;
  };

  var Alias_Sprite_Actor_startMotion = Sprite_Actor.prototype.startMotion;
  Sprite_Actor.prototype.startMotion = function(motionType) {
    if (this.isQCharacter()) {
      var pose = motionType;
      var motion = this._qSprite.poses[pose];
      if (motion) {
        this._pose = pose;
        this._pattern = 0;
        this._motionCount = 0;
      }
    } else {
      Alias_Sprite_Actor_startMotion.call(this, motionType);
    }
  };


  var Alias_Sprite_Actor_updateBitmap = Sprite_Actor.prototype.updateBitmap;
  Sprite_Actor.prototype.updateBitmap = function() {
    var oldBattlerName = this._battlerName;
    Alias_Sprite_Actor_updateBitmap.call(this);
    if (oldBattlerName !== this._battlerName) {
      this._isQChara = undefined;
      if (this.isQCharacter()) {
        this._qSprite = QSprite.json[this.isQCharacter()];
      }
    }
  };

  var Alias_Sprite_Actor_updateFrame = Sprite_Actor.prototype.updateFrame;
  Sprite_Actor.prototype.updateFrame = function() {
    if (this.isQCharacter()) {
      Sprite_Battler.prototype.updateFrame.call(this);
      var bitmap = this._mainSprite.bitmap;
      if (bitmap) {
        var motion = this._qSprite.poses[this._pose];
        if (!motion) {
          this._mainSprite.visible = false;
          return;
        }
        this._mainSprite.visible = true;
        var pattern = motion.pattern;
        var i = pattern[this._pattern];
        var cw = bitmap.width / this._qSprite.cols;
        var ch = bitmap.height / this._qSprite.rows;
        var cx = i % this._qSprite.cols;
        var cy = (i - cx) / this._qSprite.cols;
        this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
      }
    } else {
      Alias_Sprite_Actor_updateFrame.call(this);
    }
  };

  var Alias_Sprite_Actor_updateMotionCount = Sprite_Actor.prototype.updateMotionCount;
  Sprite_Actor.prototype.updateMotionCount = function() {
    if (this.isQCharacter()) {
      var motion = this._qSprite.poses[this._pose];
      if (!motion) return;
      var poseWait = motion.speed;
      if (++this._motionCount >= poseWait) {
        this._pattern++;
        var maxPattern = motion.pattern.length;
        if (this._pattern === maxPattern) {
          this.refreshMotion();
        }
        this._motionCount = 0;
      }
    } else {
      Alias_Sprite_Actor_updateMotionCount.call(this);
    }
  };

  var Alias_Sprite_Actor_refreshMotion = Sprite_Actor.prototype.refreshMotion;
  Sprite_Actor.prototype.refreshMotion = function() {
    if (this.isQCharacter()) {
      var actor = this._actor;
      if (actor) {
        var stateMotion = actor.stateMotionIndex();
        if (actor.isInputting()) {
          this.startMotion('idle2');
        } else if (actor.isActing()) {
          this.startMotion('walk');
        } else if (stateMotion === 3) {
          this.startMotion('dead');
        } else if (stateMotion === 2) {
          this.startMotion('sleep');
        } else if (actor.isChanting()) {
          this.startMotion('chant');
        } else if (actor.isGuard() || actor.isGuardWaiting()) {
          this.startMotion('guard');
        } else if (stateMotion === 1) {
          this.startMotion('abnormal');
        } else if (actor.isDying()) {
          this.startMotion('dying');
        } else if (actor.isUndecided()) {
          this.startMotion('idle1');
        } else {
          this.startMotion('idle2');
        }
      }
    } else {
      Alias_Sprite_Actor_refreshMotion.call(this);
    }
  };

  if (Imported.YEP_BattleEngineCore) {
    var Alias_Sprite_Actor_forceMotion = Sprite_Actor.prototype.forceMotion;
    Sprite_Actor.prototype.forceMotion = function(motionType) {
      if (this.isQCharacter()) {
        var pose = motionType;
        var motion = this._qSprite.poses[pose];
        if (motion) {
          this._pose = pose;
          this._pattern = 0;
          this._motionCount = 0;
        }
      } else {
        Alias_Sprite_Actor_forceMotion.call(this, motionType);
      }
    };
  }

  if (Imported.YEP_X_ActSeqPack2) {
    var Alias_BattleManager_processActionSequence = BattleManager.processActionSequence;
    BattleManager.processActionSequence = function(actionName, actionArgs) {
      if (actionName.match(/qmotion[ ](.*)/i)) {
        return this.actionQMotionTarget(String(RegExp.$1), actionArgs);
      }
      return Alias_BattleManager_processActionSequence.call(this, actionName, actionArgs);
    };

    BattleManager.actionQMotionTarget = function(name, actionArgs) {
      var movers = this.makeActionTargets(actionArgs[0]);
      if (movers.length < 1) return true;
      var motion = name.toLowerCase();
      movers.forEach(function(mover) {
        mover.forceMotion(motion);
      });
      return false;
    };
  }

  //-----------------------------------------------------------------------------
  // Game_Actor

  var Alias_Game_Actor_performAction = Game_Actor.prototype.performAction;
  Game_Actor.prototype.performAction = function(action) {
    Alias_Game_Actor_performAction.call(this, action);
    if (action._item._dataClass === 'skill') {
      var id = action._item._itemId;
      var skill = $dataSkills[id];
      var motion = skill.meta.motion;
      if (motion) {
        this.requestMotion(motion);
      }
    }
  };
})()
