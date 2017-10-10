//=============================================================================
// QABS Gauges
//=============================================================================

var Imported = Imported || {};

if (!Imported.QABS || !QPlus.versionCheck(Imported.QABS, '1.0.0')) {
  alert('Error: QABS+Gauges requires QABS 1.0.0 or newer to work.');
  throw new Error('Error: QABS+Gauges requires QABS 1.0.0 or newer to work.');
}

Imported.QABS_Gauges = '1.0.1';

//=============================================================================
 /*:
 * @plugindesc <QABSGauges>
 * QABS Addon: Adds hp gauges to enemies
 * @author Quxios  | Version 1.0.1
 *
 * @requires QABS
 *
 * @param Gauge Configs
 *
 * @param Gauge Width
 * @parent Gauge Configs
 * @desc Set the width of the gauge.
 * Default: 48
 * @type Number
 * @min 1
 * @default 48
 *
 * @param Gauge Height
 * @parent Gauge Configs
 * @desc Set the height of the gauge.
 * Default: 4
 * @type Number
 * @min 1
 * @default 4
 *
 * @param Boss Gauge Width
 * @parent Gauge Configs
 * @desc Set the width of the boss gauge.
 * Default: 480
 * @type Number
 * @min 1
 * @default 480
 *
 * @param Boss Gauge Height
 * @parent Gauge Configs
 * @desc Set the height of the boss gauge.
 * Default: 16
 * @type Number
 * @min 1
 * @default 16
 *
 * @param Gauge Default OX
 * @parent Gauge Configs
 * @desc Set the default gauges X offset, can be negative
 * Default: 0
 * @type Number
 * @min -9999
 * @default 0
 *
 * @param Gauge Default OY
 * @parent Gauge Configs
 * @desc Set the default gauges Y offset, can be negative
 * Default: -48
 * @type Number
 * @min -9999
 * @default -48
 *
 * @param Boss Gauge Default OX
 * @parent Gauge Configs
 * @desc Set the default boss gauges X offset, can be negative
 * Default: 0
 * @type Number
 * @min -9999
 * @default 0
 *
 * @param Boss Gauge Default OY
 * @parent Gauge Configs
 * @desc Set the default boss gauges Y offset, can be negative
 * Default: 24
 * @type Number
 * @min -9999
 * @default 24
 *
 * @param Gauge Colors
 *
 * @param Gauge Background Color
 * @parent Gauge Colors
 * @desc  The hex color behind the gauge.
 * Default: #202040
 * @default #202040
 *
 * @param Gauge Inbetween Color
 * @parent Gauge Colors
 * @desc  The hex color between background and gradient
 * Default: #ffffff
 * @default #ffffff
 *
 * @param Gauge HP Color 1
 * @parent Gauge Colors
 * @desc  The hex color for first color of the gradient
 * Default: #e08040
 * @default #e08040
 *
 * @param Gauge HP Color 2
 * @parent Gauge Colors
 * @desc  The hex color for second color of the gradient
 * Default: #f0c040
 * @default #f0c040
 *
 * @param Gauge Text
 *
 * @param Text Font
 * @parent Gauge Text
 * @desc The font to use for the enemy name.
 * Default: GameFont
 * @default GameFont
 *
 * @param Font Size
 * @parent Gauge Text
 * @desc The font size to use for the enemy name.
 * Default: 14
 * @type Number
 * @min 1
 * @default 14
 *
 * @param Font Color
 * @parent Gauge Text
 * @desc The font color to use for the enemy name.
 * Default: #ffffff
 * @default #ffffff
 *
 * @param Boss Text Font
 * @parent Gauge Text
 * @desc The font to use for the enemy name.
 * Default: GameFont
 * @default GameFont
 *
 * @param Boss Font Size
 * @parent Gauge Text
 * @desc The font size to use for the enemy name.
 * Default: 18
 * @type Number
 * @min 1
 * @default 18
 *
 * @param Boss Font Color
 * @parent Gauge Text
 * @desc The font color to use for the enemy name.
 * Default: #ffffff
 * @default #ffffff
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This is an addon to QABS plugin. This plugin adds a hp gauges to enemies.
 * These gauges are only visible if that enemy is in combat.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Install this plugin somewhere below QABS.
 * ============================================================================
 * ## Notetags
 * ============================================================================
 * **Disable HP Bar**
 * ----------------------------------------------------------------------------
 * If you don't want an enemy to have an hp bar, add the notetag:
 * ~~~
 *  <noHpBar>
 * ~~~
 * ----------------------------------------------------------------------------
 * **Boss HP Bar**
 * ----------------------------------------------------------------------------
 * To use a boss hp bar instead use the notetag:
 * ~~~
 *  <bossHpBar>
 * ~~~
 * ----------------------------------------------------------------------------
 * **Offset HP Bar**
 * ----------------------------------------------------------------------------
 * To offset the hp bar use the notetag:
 * ~~~
 *  <hpBarOX:X>
 *  or
 *  <hpBarOY:X>
 * ~~~
 * Set X to the value to offset the bar by. Can be negative.
 *
 * *These tags go inside the note field of the enemy in the database.*
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QABS+Gauges
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
 * @tags QABS-Addon, gauges
 */
//=============================================================================

function Sprite_Gauge() {
  this.initialize.apply(this, arguments);
}

function Sprite_BossGauge() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QABS Gauges

(function() {
  var _PARAMS = QPlus.getParams('<QABSGauges>', true);

  var _WIDTH = _PARAMS['Gauge Width'];
  var _HEIGHT = _PARAMS['Gauge Height'];
  var _BOSS_WIDTH = _PARAMS['Boss Gauge Width'];
  var _BOSS_HEIGHT = _PARAMS['Boss Gauge Height'];
  var _OX = _PARAMS['Gauge Default OX'];
  var _OY = _PARAMS['Gauge Default OY'];
  var _BOSS_OX = _PARAMS['Boss Gauge Default OX'];
  var _BOSS_OY = _PARAMS['Boss Gauge Default OY'];

  var _BG_COLOR = parseInt(_PARAMS['Gauge Background Color'].replace('#', ''), 16);
  var _INNER_COLOR = parseInt(_PARAMS['Gauge Inbetween Color'].replace('#', ''), 16);
  var _COLOR1 = _PARAMS['Gauge HP Color 1'];
  var _COLOR2 = _PARAMS['Gauge HP Color 2'];

  var _FONT_FACE = _PARAMS['Text Font'];
  var _FONT_SIZE = _PARAMS['Font Size'];
  var _TEXT_COLOR = _PARAMS['Font Color'];
  var _BOSS_FONT_FACE = _PARAMS['Boss Text Font'];
  var _BOSS_FONT_SIZE = _PARAMS['Boss Font Size'];
  var _BOSS_TEXT_COLOR = _PARAMS['Boss Font Color'];

  //-----------------------------------------------------------------------------
  // Game_Enemy

  var Alias_Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function(enemyId, x, y) {
    Alias_Game_Enemy_setup.call(this, enemyId, x, y);
    var meta = this.enemy().qmeta;
    this._hideHpBar = meta.noHpBar;
    this._bossHpBar = meta.bossHpBar;
    this._hpBarOX = Number(meta.hpBarOX || _OX) || 0;
    this._hpBarOY = Number(meta.hpBarOY || _OY) || 0;
    this._bossHpBarOX = Number(meta.bossHpBarOX || _BOSS_OX) || 0;
    this._bossHpBarOY = Number(meta.bossHpBarOY || _BOSS_OY) || 0;
  };

  //-----------------------------------------------------------------------------
  // Game_CharacterBase

  Game_CharacterBase.prototype.showGauge = function() {
    return this.inCombat();
  };

  //-----------------------------------------------------------------------------
  // Game_Event

  Game_Event.prototype.showGauge = function() {
    return this.inCombat() && !this.battler()._hideHpBar;
  };

  //-----------------------------------------------------------------------------
  // Sprite_Character

  var Alias_Sprite_Character_setBattler = Sprite_Character.prototype.setBattler;
  Sprite_Character.prototype.setBattler = function(battler) {
    Alias_Sprite_Character_setBattler.call(this, battler);
    if (!battler || this._character === $gamePlayer) return;
    if (!this._gaugeSprite) {
      this._gaugeSprite = new Sprite_Gauge();
      this.addChild(this._gaugeSprite);
    }
    this._gaugeSprite.setup(this._character, battler);
    if (battler._bossHpBar) {
      if (!this._bossGauge) {
        this._bossGauge = new Sprite_BossGauge();
        this.parent.addChild(this._bossGauge);
      }
      this._bossGauge.setup(this._character, this._battler);
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_Gauge

  Sprite_Gauge.prototype = Object.create(Sprite.prototype);
  Sprite_Gauge.prototype.constructor = Sprite_Gauge;

  Sprite_Gauge.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._width = _WIDTH;
    this._height = _HEIGHT;
    this.setupGauges();
    this._character = null;
    this._battler = null;
    this.anchor.x = 0.5;
    this.z = 8
  };

  Sprite_Gauge.prototype.setupGauges = function() {
    this.bitmap = new Bitmap(this._width, this._height);
    // Background
    this._background = new PIXI.Graphics();
    this._background.beginFill(_BG_COLOR);
    this._background.drawRect(0, 0, this._width, this._height);
    this._background.endFill();
    this._background.x = -this._width / 2;
    this.addChild(this._background);
    // Between
    this._between = new PIXI.Graphics();
    this._between.beginFill(_INNER_COLOR);
    this._between.drawRect(0, 0, this._width, this._height);
    this._between.endFill();
    this._between.x -= this._width / 2;
    this._currentW = this._width;
    this.addChild(this._between);
    // Top (Gradient)
    this._top = new Sprite();
    this._top.bitmap = new Bitmap(this._width, this._height);
    this._top.anchor.x = 0.5;
    this.addChild(this._top);
    // Name
    this._name = new Sprite();
    var font = this.getFontSettings();
    this._name.bitmap = new Bitmap(this._width, font.size + 4);
    this._name.bitmap.fontFace = font.face;
    this._name.bitmap.fontSize = font.size;
    this._name.bitmap.textColor = font.color;
    this._name.x = -this._width / 2;
    this._name.y = this._height - 1;
    this._name.anchor.y = 1;
    this.addChild(this._name);
  };

  Sprite_Gauge.prototype.getFontSettings = function() {
    return {
      face: _FONT_FACE,
      size: _FONT_SIZE,
      color: _TEXT_COLOR
    }
  };

  Sprite_Gauge.prototype.setup = function(character, battler) {
    this._character = character;
    this._battler = battler;
    this.refresh();
  };

  Sprite_Gauge.prototype.refresh = function() {
    this.clear();
    if (!this._battler || !this.showGauge()) return;
    this.drawGauge();
    this.drawName();
    this._targetW = Math.floor(this._width * this._hpRate);
    this._speed = Math.abs(this._currentW - this._targetW) / 30;
  };

  Sprite_Gauge.prototype.drawGauge = function() {
    this._hpRate = this._battler.hpRate();
    var fillW = Math.floor(this._width * this._hpRate);
    this._top.bitmap.gradientFillRect(0, 0, fillW, this._height, _COLOR1, _COLOR2);
  };

  Sprite_Gauge.prototype.drawName = function() {
    var name = this._battler.enemy().name;
    var h = this._name.bitmap.height;
    this._name.bitmap.drawText(name, 2, 2, this._width, h);
  };

  Sprite_Gauge.prototype.showGauge = function() {
    return this._character.showGauge();
  };

  Sprite_Gauge.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this._battler || !this.showGauge()) {
      return this.hideHud();
    } else {
      this.showHud();
    }
    this.updatePosition();
    if (this._hpRate !== this._battler.hpRate()) {
      this.refresh();
    }
    if (this._currentW !== this._targetW) {
      this.updateInbetween();
    }
  };

  Sprite_Gauge.prototype.updatePosition = function() {
    this.x = this._battler._hpBarOX;
    this.y = this._battler._hpBarOY;
  };

  Sprite_Gauge.prototype.updateInbetween = function() {
    if (this._currentW < this._targetW) {
      this._currentW  = Math.min(this._currentW + this._speed, this._targetW);
    }
    if (this._currentW > this._targetW) {
      this._currentW  = Math.max(this._currentW - this._speed, this._targetW);
    }
    this._between.width = this._currentW;
  };

  Sprite_Gauge.prototype.showHud = function() {
    if (!this.visible) {
      this.refresh();
      this.visible = true;
    }
  };

  Sprite_Gauge.prototype.hideHud = function() {
    if (this.visible) {
      this.clear();
      this.visible = false;
    }
  };

  Sprite_Gauge.prototype.clear = function() {
    this._top.bitmap.clear();
    this._name.bitmap.clear();
  };

  //-----------------------------------------------------------------------------
  // Sprite_BossGauge

  Sprite_BossGauge.prototype = Object.create(Sprite_Gauge.prototype);
  Sprite_BossGauge.prototype.constructor = Sprite_BossGauge;

  Sprite_BossGauge.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._width = _BOSS_WIDTH;
    this._height = _BOSS_HEIGHT;
    this.setupGauges();
    this._character = null;
    this._battler = null;
    this.anchor.x = 0.5;
    this.z = 8;
  };

  Sprite_BossGauge.prototype.updatePosition = function() {
    this.x = Graphics.boxWidth / 2 + this._battler._bossHpBarOX;
    this.y = this._battler._bossHpBarOY;
  };

  Sprite_BossGauge.prototype.showGauge = function() {
    return this._character.inCombat();
  };

  Sprite_BossGauge.prototype.getFontSettings = function() {
    return {
      face: _BOSS_FONT_FACE,
      size: _BOSS_FONT_SIZE,
      color: _BOSS_TEXT_COLOR
    }
  };
})();
