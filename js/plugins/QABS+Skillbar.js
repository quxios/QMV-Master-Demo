//=============================================================================
// QABS Skillbar
//=============================================================================

var Imported = Imported || {};

if (!Imported.QABS || !QPlus.versionCheck(Imported.QABS, '1.4.0')) {
  alert('Error: QABS+Skillbar requires QABS 1.4.0 or newer to work.');
  throw new Error('Error: QABS+Skillbar requires QABS 1.4.0 or newer to work.');
}

Imported.QABS_Skillbar = '2.0.0';

//=============================================================================
/*:
 * @plugindesc <QABSSkillbar>
 * QABS Addon: Adds a skillbar
 * @version 2.0.0
 * @author Quxios  | Version 2.0.0
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 * 
 * @requires QABS
 *
 * @param Show Unassigned Keys
 * @desc Shows Keys even if they have nothing assigned to them
 * @type boolean
 * @on Show
 * @off Hide
 * @default false
 *
 * @param Default visibility
 * @desc Is the skillbar visible by default
 * @type boolean
 * @on Visible
 * @off Hidden
 * @default true
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This is an addon to QABS plugin. This plugin adds a skill bar to QABS.
 * ============================================================================
 * ## How to use
 * ============================================================================
 * Install this plugin somewhere below QABS.
 * ============================================================================
 * ## Toggling hud
 * ============================================================================
 * To turn on the skillbar use the plugin command:
 * ~~~
 * QABS skillbar show
 * ~~~
 * 
 * To hide the skillbar, use:
 * ~~~
 * QABS skillbar hide
 * ~~~
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QABS+Skillbar
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
 * @tags QABS-Addon, hud
 */
//=============================================================================

function QABSSkillbar() {
  throw new Error('This is a static class');
}

function Sprite_Skillbar() {
  this.initialize.apply(this, arguments);
}

function Sprite_SkillButton() {
  this.initialize.apply(this, arguments);
}

function Sprite_SkillInfo() {
  this.initialize.apply(this, arguments);
}

//=============================================================================
// QABS Skillbar

(function() {
  QABSSkillbar.over = false;
  QABSSkillbar.requestRefresh = true;

  var _PARAMS = QPlus.getParams('<QABSSkillbar>', true);

  var _SHOW_UNASSIGNED = _PARAMS['Show Unassigned Keys'];
  var _VISIBLE = _PARAMS['Default visibility'];

  //-----------------------------------------------------------------------------
  // Game_Interpreter

  var Alias_Game_Interpreter_qABSCommand = Game_Interpreter.prototype.qABSCommand;
  Game_Interpreter.prototype.qABSCommand = function(args) {
    var cmd = args[0].toLowerCase();
    if (cmd === 'skillbar') {
      var val = args[1].toLowerCase();
      if (val === 'show') {
        $gameSystem.showSkillbar();
      } else if (val === 'hide') {
        $gameSystem.hideSkillbar();
      }
      return;
    }
    Alias_Game_Interpreter_qABSCommand.call(this, args);
  };

  //-----------------------------------------------------------------------------
  // Game_System

  var Alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Alias_Game_System_initialize.call(this);
    this._showSkillbar = _VISIBLE;
  };

  Game_System.prototype.showSkillbar = function() {
    this._showSkillbar = true;
  };

  Game_System.prototype.hideSkillbar = function() {
    this._showSkillbar = false;
  };

  var Alias_Game_System_resetABSKeys = Game_System.prototype.resetABSKeys;
  Game_System.prototype.resetABSKeys = function() {
    Alias_Game_System_resetABSKeys.call(this);
    QABSSkillbar.requestRefresh = true;
  };

  //-----------------------------------------------------------------------------
  // Game_Actor

  var Alias_Game_Actor_learnSkill = Game_Actor.prototype.learnSkill;
  Game_Actor.prototype.learnSkill = function(skillId) {
    Alias_Game_Actor_learnSkill.call(this, skillId);
    QABSSkillbar.requestRefresh = true;
  };

  var Alias_Game_Actor_forgetSkill = Game_Actor.prototype.forgetSkill;
  Game_Actor.prototype.forgetSkill = function(skillId) {
    Alias_Game_Actor_forgetSkill.call(this, skillId);
    QABSSkillbar.requestRefresh = true;
  };

  var Alias_Game_Actor_changeClass = Game_Actor.prototype.changeClass;
  Game_Actor.prototype.changeClass = function(classId, keepExp) {
    Alias_Game_Actor_changeClass.call(this, classId, keepExp);
    QABSSkillbar.requestRefresh = true;
  };

  //-----------------------------------------------------------------------------
  // Game_Player

  var Alias_Game_Player_canClick = Game_Player.prototype.canClick;
  Game_Player.prototype.canClick = function() {
    if (QABSSkillbar.over) return false;
    return Alias_Game_Player_canClick.call(this);
  };

  //-----------------------------------------------------------------------------
  // Sprite_Skillbar

  Sprite_Skillbar.prototype = Object.create(Sprite_Base.prototype);
  Sprite_Skillbar.prototype.constructor = Sprite_Skillbar;

  Sprite_Skillbar.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this.y = Graphics.height - 36;
    this._over = 0;
    this._actorId = $gameParty.leader()._actorId;
    this.requestPositionUpdate = true;
    this.createKeys();
  };

  Sprite_Skillbar.prototype.createKeys = function() {
    this._buttons = [];
    for (var key in $gameSystem.absKeys()) {
      var button = new Sprite_SkillButton(key);
      if (this._buttons.length !== 0) {
        button.prev = this._buttons[this._buttons.length - 1]
      }
      this._buttons.push(button);
      this.addChild(button);
    }
  };

  Sprite_Skillbar.prototype.update = function() {
    if (!$gameSystem._showSkillbar) {
      QABSSkillbar.over = false;
      this.visible = false;
      return;
    }
    this.visible = true;
    QABSSkillbar.over = false;
    if (this._actorId !== $gameParty.leader()._actorId) {
      this._actorId = $gameParty.leader()._actorId;
      QABSSkillbar.requestRefresh = true;
    }
    Sprite_Base.prototype.update.call(this);
    QABSSkillbar.requestRefresh = false;
    if (this.requestPositionUpdate) {
      var width = 0;
      this.requestPositionUpdate = false;
      for (var i = 0; i < this._buttons.length; i++) {
        this._buttons[i].updatePosition();
        if (this._buttons[i].visible) width += 36;
      }
      this.x = (Graphics.width - width) / 2;
    }
  };

  //-----------------------------------------------------------------------------
  // Sprite_SkillButton

  Sprite_SkillButton.prototype = Object.create(Sprite_Button.prototype);
  Sprite_SkillButton.prototype.constructor = Sprite_SkillButton;

  Sprite_SkillButton.prototype.initialize = function(key) {
    Sprite_Button.prototype.initialize.call(this);
    this._key = key;
    this._skillId = 0;
    this._skill = null;
    this._skillSettings = null;
    this._preferGamePad = false;
    this._count = 0;
    this.width = 34;
    this.height = 34;
    this.setup();
  };

  Sprite_SkillButton.prototype.setSkillId = function(id) {
    this._skillId = id;
    this._skill = $dataSkills[id] || null;
    this._skillSettings = this._skill ? QABS.getSkillSettings(this._skill) : null;
  };

  Sprite_SkillButton.prototype.setup = function() {
    this.createFrame();
    this.createIcon();
    this.createOverlayFrame();
    this.createHover();
    this.createInput();
    this.createInfo();
  };

  Sprite_SkillButton.prototype.createFrame = function() {
    // Black bg for the button
    this._spriteFrame = new Sprite();
    this._spriteFrame.bitmap = new Bitmap(34, 34);
    this._spriteFrame.bitmap.fillAll('#000000');
    this._spriteFrame.alpha = 0.3;
    this.addChild(this._spriteFrame);
  };

  Sprite_SkillButton.prototype.createIcon = function() {
    this._spriteIcon = new Sprite_Icon(0);
    this.addChild(this._spriteIcon);
  };

  Sprite_SkillButton.prototype.createOverlayFrame = function() {
    // Black bg used for cooldown
    this._spriteCooldown = new Sprite();
    this._spriteCooldown.bitmap = new Bitmap(34, 34);
    this._spriteCooldown.bitmap.fillAll('#000000');
    this._spriteCooldown.alpha = 0.5;
    this._spriteCooldown.height = 0;
    this._spriteCooldown.visible = false;
    this.addChild(this._spriteCooldown);
  };

  Sprite_SkillButton.prototype.createHover = function() {
    // sprite when hovering over button
    this._spriteHoverFrame = new Sprite();
    this._spriteHoverFrame.bitmap = new Bitmap(34, 34);
    var color1 = 'rgba(255, 255, 255, 0.9)';
    var color2 = 'rgba(255, 255, 255, 0)';
    this._spriteHoverFrame.bitmap.gradientFillRect(0, 0, 8, 34, color1, color2);
    this._spriteHoverFrame.bitmap.gradientFillRect(26, 0, 8, 34, color2, color1);
    this._spriteHoverFrame.bitmap.gradientFillRect(0, 0, 34, 8, color1, color2, true);
    this._spriteHoverFrame.bitmap.gradientFillRect(0, 26, 34, 8, color2, color1, true);
    this._spriteHoverFrame.visible = false;
    this.addChild(this._spriteHoverFrame);
  };

  Sprite_SkillButton.prototype.createInput = function() {
    this._spriteInput = new Sprite();
    this._spriteInput.bitmap = new Bitmap(34, 34);
    this._spriteInput.bitmap.fontSize = 14;
    this.addChild(this._spriteInput);
  };

  Sprite_SkillButton.prototype.createInfo = function() {
    this._spriteInfo = new Sprite_SkillInfo();
    this._spriteInfo.visible = false;
    this.addChild(this._spriteInfo);
  };

  Sprite_SkillButton.prototype.callClickHandler = function() {
    if (!this._skillId) {
      return;
    }
    $gamePlayer.useSkill(this._skillId);
  };

  Sprite_SkillButton.prototype.update = function() {
    Sprite_Button.prototype.update.call(this);
    if (!_SHOW_UNASSIGNED) {
      this.updateVisiblity();
    }
    if (!this.visible) {
      return;
    }
    if (this.needsRefresh()) {
      this.refresh();
    }
    if (Imported.QInput && this._preferGamePad !== Input.preferGamepad()) {
      this._preferGamePad = Input.preferGamepad();
      this.refreshInput();
    }
    if (this.isButtonTouched()) {
      this.updateHover();
    } else {
      this.updateOff();
    }
    this.updateCooldown();
  };

  Sprite_SkillButton.prototype.updateVisiblity = function() {
    var id = $gameSystem.absKeys()[this._key].skillId;
    var oldVisible = this.visible;
    this.visible = !!id;
    if (oldVisible !== this.visible) {
      this.parent.requestPositionUpdate = true;
    }
  };

  Sprite_SkillButton.prototype.updatePosition = function() {
    var key = Number(this._key) - 1;
    var prev = this.prev;
    while (prev) {
      if (!prev.visible) key--;
      prev = prev.prev;
    }
    this.x = key * 36;
  };

  Sprite_SkillButton.prototype.updateHover = function() {
    QABSSkillbar.over = true;
    this._count++;
    var twoAmp = 1;
    var count = this._count * 0.02;
    var newAlpha = 0.9 - Math.abs(count % twoAmp - (twoAmp / 2));
    this._spriteHoverFrame.alpha = newAlpha;
    this._spriteHoverFrame.visible = true;
    this._spriteInfo.visible = true;
  };

  Sprite_SkillButton.prototype.updateOff = function() {
    this._count = 0;
    this._spriteHoverFrame.visible = false;
    this._spriteInfo.visible = false;
  };

  Sprite_SkillButton.prototype.updateCooldown = function() {
    if (!this._skillId) {
      return;
    }
    var cd = $gamePlayer._skillCooldowns[this._skillId];
    if (cd) {
      var newH = cd / this._skillSettings.cooldown;
      this._spriteCooldown.visible = true;
      this._spriteCooldown.height = 34 * newH;
    } else {
      this._spriteCooldown.visible = false;
      this._spriteCooldown.height = 0;
    }
  };

  Sprite_SkillButton.prototype.needsRefresh = function() {
    if (QABSSkillbar.requestRefresh) {
      return this._skillId !== $gameSystem.absKeys()[this._key];
    }
    return false;
  };

  Sprite_SkillButton.prototype.needsPosRefresh = function() {
    if (QABSSkillbar.requestRefresh) {

    }
    return false;
  };

  Sprite_SkillButton.prototype.refresh = function() {
    var absKey = $gameSystem.absKeys()[this._key];
    this.setSkillId(absKey.skillId);
    this.refreshIcon();
    this.refreshInput();
    this.refreshInfo();
  };

  Sprite_SkillButton.prototype.refreshIcon = function() {
    this._spriteIcon._iconIndex = this._skill ? this._skill.iconIndex : 0;
    this._spriteIcon.setBitmap();
    if (!this._skill || (!$gameParty.leader().isLearnedSkill(this._skill.id) &&
      !$gameParty.leader().addedSkills().contains(this._skill.id))) {
      this._spriteIcon.alpha = 0.5;
    } else {
      this._spriteIcon.alpha = 1;
    }
  };

  Sprite_SkillButton.prototype.refreshInput = function() {
    var absKey = $gameSystem.absKeys()[this._key];
    var input = absKey.input[0] || '';
    if (Imported.QInput) {
      var inputs = absKey.input;
      for (var i = 0; i < inputs.length; i++) {
        var isGamepad = /^\$/.test(inputs[i]);
        if (Input.preferGamepad() && isGamepad) {
          input = inputs[i];
          break;
        } else if (!Input.preferGamepad() && !isGamepad) {
          input = inputs[i];
          break;
        }
      }
    }
    input = input.replace('#', '');
    input = input.replace('$', '');
    input = input.replace('mouse', 'M');
    this._spriteInput.bitmap.clear();
    this._spriteInput.bitmap.drawText(input, 0, 8, 34, 34, 'center');
  };

  Sprite_SkillButton.prototype.refreshInfo = function() {
    this._spriteInfo.set(this._skillId);
  };

  //-----------------------------------------------------------------------------
  // Sprite_SkillInfo

  Sprite_SkillInfo.prototype = Object.create(Sprite_Base.prototype);
  Sprite_SkillInfo.prototype.constructor = Sprite_SkillInfo;

  Sprite_SkillInfo.prototype.initialize = function(skillId) {
    Sprite_Base.prototype.initialize.call(this);
    this.width = 200;
    this.height = 250;
    this.y = -this.height;
    this._skillId = skillId;
    this._skill = $dataSkills[skillId];
    this.drawInfo();
  };

  Sprite_SkillInfo.prototype.set = function(skillId) {
    if (this._skillId === skillId) return;
    this._skillId = skillId;
    this._skill = $dataSkills[skillId];
    this.drawInfo();
  };

  Sprite_SkillInfo.prototype.createBackground = function() {
    this.bitmap = new Bitmap(this.width, this.height);
    this.bitmap.fillAll('rgba(0, 0, 0, 0.8)');
  };

  Sprite_SkillInfo.prototype.drawInfo = function() {
    this.createBackground();
    if (!this._skill) return;
    this._realHeight = 4;
    // Draw the details
    this.drawName(0, 0);
    this.drawIcon(2, 36);
    this.drawAbsSettings(40, 36);
    this.drawDescription(4, this._realHeight);
    this.drawLine(this._realHeight + 2);
    this.drawData(4, this._realHeight);
    // Resize to fit height
    this.height = this._realHeight + 4;
    this.y = -this.height;
  };

  Sprite_SkillInfo.prototype.drawName = function(x, y) {
    this.bitmap.fontSize = 28;
    this.bitmap.textColor = '#ffffa0';
    this.bitmap.drawText(this._skill.name, x, y, this.width, 36, 'center');
    this._realHeight = Math.max(y + 28, this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawIcon = function(x, y) {
    var iconIndex = this._skill.iconIndex;
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.bitmap.blt(bitmap, sx, sy, pw, ph, x, y);
    this._realHeight = Math.max(y + 32, this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawAbsSettings = function(x, y) {
    var abs = QABS.getSkillSettings(this._skill);
    var w = this.width - x - 4; // 4 is padding
    this.bitmap.fontSize = 14;
    var cooldown = abs.cooldown / 60;
    var range = abs.range;
    var mpCost = this._skill.mpCost;
    var tpCost = this._skill.tpCost;
    var i = 0;
    var l = 18; // line height
    if (cooldown !== 0) {
      this.bitmap.textColor = '#ffffa0';
      var w2 = this.bitmap.measureTextWidth(cooldown);
      this.bitmap.drawText('Cooldown: ', x - w2, y + l * i, w, l, 'right');
      this.bitmap.textColor = '#ffffff';
      this.bitmap.drawText(cooldown, x, y + l * i, w, l, 'right');
      i++;
    }
    if (range !== 0) {
      this.bitmap.textColor = '#ffffa0';
      var w2 = this.bitmap.measureTextWidth(range);
      this.bitmap.drawText('Range: ', x - w2, y + l * i, w, l, 'right');
      this.bitmap.textColor = '#ffffff';
      this.bitmap.drawText(range, x, y + l * i, w, l, 'right');
      i++;
    }
    if (mpCost !== 0) {
      this.bitmap.textColor = '#ffffa0';
      var w2 = this.bitmap.measureTextWidth(mpCost);
      this.bitmap.drawText(TextManager.mpA + ' Cost: ', x - w2, y + l * i, w, l, 'right');
      this.bitmap.textColor = '#ffffff';
      this.bitmap.drawText(mpCost, x, y + l * i, w, l, 'right');
      i++;
    }
    if (tpCost !== 0) {
      this.bitmap.textColor = '#ffffa0';
      var w2 = this.bitmap.measureTextWidth(tpCost);
      this.bitmap.drawText(TextManager.tpA + ' Cost: ', x - w2, y + l * i, w, l, 'right');
      this.bitmap.textColor = '#ffffff';
      this.bitmap.drawText(tpCost, x, y + l * i, w, l, 'right');
      i++;
    }
    this._realHeight = Math.max(y + (i * l), this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawDescription = function(x, y) {
    this.bitmap.fontSize = 14;
    this.bitmap.textColor = '#ffffa0';
    this.bitmap.drawText('Desc:', x, y, this.width, 18, 'left');
    var desc = '         ' + this._skill.description;
    var settings = {
      fontName: 'GameFont',
      fontSize: 14,
      fill: '#ffffff',
      stroke: 'rgba(0, 0, 0, 0.5)',
      strokeThickness: 4,
      wordWrap: true,
      wordWrapWidth: this.width - 4,
      lineHeight: 18
    }
    this._desc = new PIXI.Text(desc, settings);
    this._desc.x = x;
    this._desc.y = y - 1;
    this.addChild(this._desc);
    this._realHeight = Math.max(y + this._desc.height, this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawLine = function(y) {
    this.bitmap.fillRect(2, y, this.width - 4, 2, 'rgba(255, 255, 255, 0.8)');
    this._realHeight = Math.max(y + 4, this._realHeight);
  };

  Sprite_SkillInfo.prototype.drawData = function(x, y) {
    var w = this.width - x - 4; // 4 is padding
    this.bitmap.fontSize = 18;
    var formula = this._skill.damage.formula;
    formula = formula.replace(/b.(\w+)/g, '0');
    var a = $gamePlayer.actor();
    var v = $gameVariables._data;
    var dmg = eval(formula);
    var i = 0;
    var l = 18; // line height
    if (dmg !== 0 && this._skill.damage.type !== 0) {
      this.bitmap.textColor = '#ffffa0';
      var title;
      if (this._skill.damage.type === 1) {
        title = 'Damage: ';
      } else if (this._skill.damage.type === 2) {
        title = 'MP Damage: ';
      } else if (this._skill.damage.type === 3) {
        title = 'Recover: ';
      } else if (this._skill.damage.type === 4) {
        title = 'MP Recover: ';
      }
      this.bitmap.drawText(title, x, y + l * i, w, l, 'left');
      this.bitmap.textColor = '#ffffff';
      var w2 = this.bitmap.measureTextWidth(title);
      this.bitmap.drawText(dmg, x + w2, y + l * i, w, l, 'left');
      i++;
    }
    // Write the effects:
    this._realHeight = Math.max(y + (i * l), this._realHeight);
  };

  //-----------------------------------------------------------------------------
  // Scene_Map

  var Alias_Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function() {
    Alias_Scene_Map_createAllWindows.call(this);
    this.createABSKeys();
  };

  Scene_Map.prototype.createABSKeys = function() {
    this._absSkillBar = new Sprite_Skillbar();
    this.addChild(this._absSkillBar);
  };
})();
