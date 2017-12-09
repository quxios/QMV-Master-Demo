//=============================================================================
// QParams
//=============================================================================

var Imported = Imported || {};

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.6.0')) {
  alert('Error: QParams requires QPlus 1.6.0 or newer to work.');
  throw new Error('Error: QParams requires QPlus 1.6.0 or newer to work.');
}

Imported.QParams = '1.1.0';

//=============================================================================
/*:
 * @plugindesc <QParams>
 * Custom parameters and improvements
 * @version 1.1.0
 * @author Quxios  | Version 1.1.0
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 * 
 * @requires QPlus
 * 
 * @param Use JSON
 * @desc Should this load a JSON file for QParams?
 * JSON file should be located in 'data/QParams.json'
 * @type boolean
 * @default false
 *
 * @param Custom Params
 * @desc User defined parameters
 * @default []
 * @type Struct<Parameter>[]
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin adds a few new parameters and lets you create custom parameters.
 * ============================================================================
 * ## New Parameters
 * ============================================================================
 * Here is a list of new parameters that are added:
 * - (HRT) Hp Regeneration tick     
 *  * Works similar to Hp Regeneration (Ex-Parameter) except they are a constant
 * - (MRT) Mp Regeneration tick     
 *  * Works similar to Mp Regeneration (Ex-Parameter) except they are a constant
 * - (TRT) Tp Regeneration tick     
 *  * Works similar to Tp Regeneration (Ex-Parameter) except they are a constant
 * - (MCC) Mp Cost Constant         
 *  * Works similar to Mp Cost Rate (Sp-Parameter) except they are a constant
 * - (TCC) Tp Charge Constant       
 *  * Works similar to Tp Charge Rate (Sp-Parameter) except they are a constant
 * - (PDC) Physical Damage Constant 
 *  * Works similar to Physical Damage (Sp-Parameter) except they are a constant
 * - (MDC) Magical Damage Constant  
 *  * Works similar to Magical Damage (Sp-Parameter) except they are a constant
 * - (FDC) Floor Damage Constant    
 *  * Works similar to Floor Damage (Sp-Parameter) except they are a constant
 * - (EXC) Experience Constant      
 *  * Works similar to Expericence (Sp-Parameter) except they are a constant
 * ============================================================================
 * ## Creating custom Parameters
 * ============================================================================
 * To create a your own parameter, you just need to set them up in the plugin
 * manager. If you prefer to set them up as a JSON file then the format is:
 * ~~~json
 * [
 *   {
 *     "abr": "abbreviation A", 
 *     "name": "param A name", 
 *     "default": value, 
 *     "min": value, 
 *     "max": value
 *   },
 *   ...
 *   {
 *     "abr": "abbreviation Z",
 *     "name": "param Z name",
 *     "default": value,
 *     "min": value,
 *     "max": value
 *   }
 * ]
 * ~~~
 * This JSON file should be located in the data folder and should be 
 * called 'QParams.json'
 * ============================================================================
 * ## Notetags
 * ============================================================================
 * We can modify all parameters (mv built in and custom ones) with some notetags
 * inside the Actor, Class, Equipment, Weapons, Enemies and State databases.
 * ----------------------------------------------------------------------------
 * **Params**
 * ----------------------------------------------------------------------------
 * Use this to add a value to a parameter(s). The format is:
 * ~~~
 * <params>
 * PARAM: VALUE
 * </params>
 * ~~~
 * - PARAM: The abbreviation of the parameter to modify. It can be:
 *  * MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK or any of the custom parameters you
 *  created
 * - VALUE: Can be a number or a formula similar to skill formulas. With the formula 
 * you can use, `a` and `v[X]` but not `b`! You can also use `current` and it'll
 * return the current parameter value.
 * 
 * You can add as many params as you need, each param needs to be on their own line.
 * ----------------------------------------------------------------------------
 * **Rates**
 * ----------------------------------------------------------------------------
 * You can use this notetag to easily convert a X amount of points from a 
 * parameter to a % of an Ex or Sp Parameter.
 * ~~~
 * <rates>
 * X PARAM to XSPARAM
 * </rates>
 * ~~~
 * - X: A number, if negative it will have a negative gain in the rate
 * - PARAM: The abbreviation of which parameter to use, can be:
 *  * MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK or any of the custom parameters you
 *  created
 * - XSPARAM: The abbreviation of an Ex or Sp Parameter, can be:
 *  * hit, eva, cri, cev, mev, mrf, cnt, hrg, mrg, trg
 *  * tgr, grd, rec, pha, mcr, tcr, pdr, mdr, fdr, exr
 * ----------------------------------------------------------------------------
 * **RatesFormula**
 * ----------------------------------------------------------------------------
 * Similar to the <rates></rates> except you create the formula your self.
 * ~~~
 * <ratsFormula>
 * XSPARAM: VALUE
 * </ratesFormula>
 * ~~~
 * - XSPARAM: The abbreviation of an Ex or Sp Parameter, can be:
 *  * hit, eva, cri, cev, mev, mrf, cnt, hrg, mrg, trg
 *  * tgr, grd, rec, pha, mcr, tcr, pdr, mdr, fdr, exr
 * - VALUE: Can be a number or a formula similar to skill formulas. With the formula
 * you can use, `a` and `v[X]` but not `b`! You can also use `current` and it'll
 * return the current parameter value. Remember since it's a rate a return
 * value of 1 is 100%, 0.5 is 50% and 0 is 0%
 * ============================================================================
 * ## Examples
 * ============================================================================
 * Here's a few examples of the notetags
 * ----------------------------------------------------------------------------
 * **Params**
 * ----------------------------------------------------------------------------
 * ~~~
 * <params>
 * MHP: 100
 * ATK: 20
 * HRT: 5
 * </params>
 * ~~~
 * This would result in having 100 more hp, 20 more atk and an HRT of 5. HRT is
 * a new built in parameter that works similar to hp regeneration except it's a
 * fixed number.
 * ----------------------------------------------------------------------------
 * **Rates and RatesFormula**
 * ----------------------------------------------------------------------------
 * ~~~
 * <rates>
 * 5 agi to cri
 * 5 agi to hit
 * </rates>
 * ~~~
 * This would result in converting 5 agi to 1% of cri and hit. So if an actor has
 * 20agi, he would have a bonus 4% cri and hit because of this tag.
 * 
 * To achieve this using the <ratesFormula> it would be:
 * ~~~
 * <ratesFormula>
 * cri: (a.agi / 5) / 100
 * hit: (a.agi / 5) / 100
 * </ratesFormula>
 * ~~~
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QParams
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
 * @tags
 */
/*~struct~Parameter:
 * @param abr
 * @text Abbreviation
 * @desc Set to the abbreviation to use for this parameter
 * @default
 * 
 * @param name
 * @text Name
 * @desc Set to the full name of the parameter
 * @default
 * 
 * @param default
 * @text Default
 * @desc Set the default value of this parameter
 * @type Number
 * @default 0
 * 
 * @param min
 * @text Minimum Value
 * @desc Set to the mimimum value this parameter can be
 * Leave blank for no minimum
 * @default 
 * 
 * @param max
 * @text Maximum Value
 * @desc Set to the maximum value this parameter can be
 * Leave blank for no maximum
 * @default
 */
//=============================================================================

//=============================================================================
// QParams Static Class

function QParams() {
  throw new Error('This is a static class');
}

//=============================================================================
// QParams

(function() {
  var _PARAMS = QPlus.getParams('<QParams>', {
    'Use JSON': false,
    'Custom Params': []
  });

  QParams._injected = false;
  QParams._custom = _PARAMS['Custom Params']; // incase if needed outside of plugin
  QParams._states = {};
  QParams._equips = {
    weps: {},
    armor: {}
  }; // [weps, armors]
  QParams._charas = {
    actor: {},
    class: {},
    enemy: {}
  }; // [actors, classes, enemies]
  QParams._rates = {
    actor: {},
    class: {},
    enemy: {}
  };

  QParams._id = {
    'mhp': 0, 'mmp': 1, 'atk': 2, 'def': 3,
    'mat': 4, 'mdf': 5, 'agi': 6, 'luk': 7,
    'hrt': 8, 'mrt': 9, 'trt': 10, 'mcc': 11,
    'tcc': 12, 'pdc': 13, 'mdc': 14, 'fdc': 15,
    'exc': 16
  };
  QParams._xid = {
    'hit': 0, 'eva': 1, 'cri': 2, 'cev': 3,
    'mev': 4, 'mrf': 5, 'cnt': 6, 'hrg': 7,
    'mrg': 8, 'trg': 9
  };
  QParams._sid = {
    'trg': 0, 'grd': 1, 'rec': 2, 'pha': 3,
    'mcr': 4, 'tcr': 5, 'pdr': 6, 'mdr': 7,
    'fdr': 8, 'exr': 9
  };

  QParams.stateParamsPlus = function(id) {
    return this._states[id] || {};
  };

  QParams.equipParamsPlus = function(equip) {
    var data = !equip.atypeId ? this._equips.weps : this._equips.armor;
    var id = equip.baseItemId || equip.id;
    return data[id] || {};
  };

  QParams.charaParamsPlus = function(id, type) {
    return this._charas[type][id] || {};
  };

  QParams.rateParamsPlus = function(id, type) {
    return this._rates[type][id] || {};
  };

  QParams.findParamIdOf = function(abr) {
    if (this._id.hasOwnProperty(abr)) {
      return this._id[abr];
    }
    var qParams = _PARAMS['Custom Params'];
    for (var i = 0; i < qParams.length; i++) {
      if (qParams[i].abr === abr) {
        return 17 + i; // 17 is starting index for QParams
      }
    }
    return -1; // not found;
  };

  QParams.findXSParamIdOf = function(abr) {
    if (this._xid.hasOwnProperty(abr)) {
      return this._xid[abr];
    }
    if (this._sid.hasOwnProperty(abr)) {
      return this._sid[abr] + 10; // sParam ids start at 10
    }
    return -1;
  };

  QParams.stringToParamsObj = function(string) {
    var lines = string.split('\n');
    var obj = {};
    lines.forEach(function(line) {
      var match = /^(.*):(.*)/.exec(line);
      if (match) {
        var id = QParams.findParamIdOf(match[1].toLowerCase().trim());
        if (id !== -1) {
          obj[id] = match[2];
        }
      }
    })
    return obj;
  };

  QParams.stringToRatesObj = function(string) {
    var lines = string.split('\n');
    var obj = {};
    lines.forEach(function(line) {
      var match = /(-?[0-9]*)\s+([a-z]*)\s+to\s+([a-z]*)/i.exec(line);
      if (match) {
        var id = QParams.findXSParamIdOf(match[3].toLowerCase());
        if (id !== -1) {
          var stat = match[2].toLowerCase();
          var value = Number(match[1]) || 0;
          obj[id] = '(a.' + stat + ' / ' + value + ') / 100';
        }
      }
    })
    return obj;
  };

  QParams.stringToRatesForumlaObj = function(string) {
    var lines = string.split('\n');
    var obj = {};
    lines.forEach(function(line) {
      var match = /^(.*):(.*)/.exec(e);
      if (match) {
        var id = QParams.findXSParamIdOf(match[1].toLowerCase());
        if (id !== -1) {
          obj[id] = match[2];
        }
      }
    })
    return obj;
  };

  // Private func
  function injectParams() {
    QParams._custom.forEach(function(param, index) {
      if (Game_BattlerBase.prototype[param.abr]) {
        alert('Can not use the abbreviation ' + param.abr + '. Its already in use.');
      } else {
        var newProperty = {};
        newProperty[param.abr] = {
          get: function() {
            return this.cParam(index);
          },
          configurable: true
        }
        Object.defineProperties(Game_BattlerBase.prototype, newProperty);
      }
    })
    QParams._injected = true;
  }

  if (_PARAMS['Use JSON']) {
    QPlus.request('data/QParams.json')
      .onSuccess(function(json) {
        json.forEach(function(param) {
          var obj = Object.assign({
            abr: '', name: '',
            default: 0,
            min: '', max: ''
          }, param)
          // TODO: check if abr is already assigned?
          QParams._custom.push(obj);
        })
        injectParams();
      })
      .onError(function() {
        alert('Failed to load ' + this.url);
        injectParams();
      })
  } else {
    injectParams();
  }

  //-----------------------------------------------------------------------------
  // DataManager

  var Alias_DataManager_extractQData = DataManager.extractQData;
  DataManager.extractQData = function(data, object) {
    Alias_DataManager_extractQData.call(this, data);
    if (data.qmeta['params']) {
      var value = QParams.stringToParamsObj(data.qmeta['params']);
      if (object === $dataStates) {
        QParams._states[data.id] = value;
      } else if (object === $dataWeapons) {
        QParams._equips.wep[data.id] = value;
      } else if (object === $dataArmors) {
        QParams._equips.armor[data.id] = value;
      } else if (object === $dataActors) {
        QParams._charas.actor[data.id] = value;
      } else if (object === $dataClasses) {
        QParams._charas.class[data.id] = value;
      } else if (object === $dataEnemies) {
        QParams._charas.enemy[data.id] = value;
      }
    }
    if (data.qmeta['rates']) {
      var value = QParams.stringToRatesObj(data.qmeta['rates']);
      if (object === $dataActors) {
        QParams._rates.actor[data.id] = value;
      } else if (object === $dataClasses) {
        QParams._rates.class[data.id] = value;
      } else if (object === $dataEnemies) {
        QParams._rates.enemy[data.id] = value;
      }
    }
    if (data.qmeta['ratesFormula']) {
      var value = QParams.stringToRatesForumlaObj(data.qmeta['ratesFormula']);
      var prop;
      if (object === $dataActors) {
        prop = 'actor';
      } else if (object === $dataClasses) {
        prop = 'class';
      } else if (object === $dataEnemies) {
        prop = 'enemy';
      }
      var curr = QParams._rates[prop] || {};
      QParams._rates[prop] = Object.assign(curr, value);
    }
  };

  var Alias_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
  DataManager.isDatabaseLoaded = function() {
    var loaded = Alias_DataManager_isDatabaseLoaded.call(this);
    return loaded && QParams._injected;
  };

  //-----------------------------------------------------------------------------
  // Game_BattlerBase

  Object.defineProperties(Game_BattlerBase.prototype, {
    // Hp Regeneration tick
    hrt: { get: function() { return this.qParam(0); }, configurable: true },
    // Mp Regeneration tick
    mrt: { get: function() { return this.qParam(1); }, configurable: true },
    // Tp Regeneration tick
    trt: { get: function() { return this.qParam(2); }, configurable: true },
    // Mp Cost Constant
    mcc: { get: function() { return this.qParam(3); }, configurable: true },
    // Tp Charge Constant
    tcc: { get: function() { return this.qParam(4); }, configurable: true },
    // Physical Damage Constant
    pdc: { get: function() { return this.qParam(5); }, configurable: true },
    // Magical Damage Constant
    mdc: { get: function() { return this.qParam(6); }, configurable: true },
    // Floor Damage Constant
    fdc: { get: function() { return this.qParam(7); }, configurable: true },
    // EXperience Constant
    exc: { get: function() { return this.qParam(8); }, configurable: true }
  });

  var Alias_Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
  Game_BattlerBase.prototype.initMembers = function() {
    Alias_Game_BattlerBase_initMembers.call(this);
    this._cParamPlus = {};
    QParams._custom.forEach(function(param, index) {
      this._cParamPlus[index] = Number(param.default) || 0;
    }.bind(this))
  };

  var Alias_Game_BattlerBase_param = Game_BattlerBase.prototype.param;
  Game_BattlerBase.prototype.param = function(paramId) {
    var value = Alias_Game_BattlerBase_param.call(this, paramId);
    var currentValue = value;
    value += this.stateParamPlus(paramId, currentValue);
    value += this.equipParamPlus(paramId, currentValue);
    value += this.getCharaParamPlus(paramId, currentValue);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
  };

  var Alias_Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
  Game_BattlerBase.prototype.xparam = function(xparamId) {
    var value = Alias_Game_BattlerBase_xparam.call(this, xparamId);
    value += this.getRateParamPlus(xparamId, 'xParam');
    return value;
  };

  var Alias_Game_BattlerBase_sparam = Game_BattlerBase.prototype.sparam;
  Game_BattlerBase.prototype.sparam = function(sparamId) {
    var value = Alias_Game_BattlerBase_sparam.call(this, sparamId);
    value += this.getRateParamPlus(sparamId, 'sParam');
    return value;
  };

  Game_BattlerBase.prototype.evalParamFormula = function(string, currentValue) {
    var v = $gameVariables._data;
    var a = this;
    var formula = string.replace('current', currentValue || 0);
    return eval(formula);
  };

  Game_BattlerBase.prototype.stateParamPlus = function(paramId, currentValue) {
    var value = 0;
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
      var params = QParams.stateParamsPlus(states[i].id);
      if (params[paramId]) {
        value += this.evalParamFormula(params[paramId], currentValue);
      }
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.equipParamPlus = function(paramId, currentValue) {
    return 0;
  };

  Game_BattlerBase.prototype.getCharaParamPlus = function(paramId, currentValue) {
    var value = 0;
    if (this.isActor()) {
      value += this.charaParamPlus(paramId, this.actorId(), 'actor', currentValue);
      value += this.charaParamPlus(paramId, this._classId, 'class', currentValue);
    } else if (this.isEnemy()) {
      value += this.charaParamPlus(paramId, this.enemyId(), 'enemy', currentValue);
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.charaParamPlus = function(paramId, id, type, currentValue) {
    var value = 0;
    var params = QParams.charaParamsPlus(id, type);
    if (params[paramId]) {
      value += this.evalParamFormula(params[paramId], currentValue);
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.getRateParamPlus = function(paramId, pType) {
    var value = 0;
    if (this.isActor()) {
      value += this.rateParamPlus(paramId, this.actorId(), 'actor', pType);
      value += this.rateParamPlus(paramId, this._classId, 'class', pType);
    } else if (this.isEnemy()) {
      value += this.rateParamPlus(paramId, this.enemyId(), 'enemy', pType);
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.rateParamPlus = function(paramId, charaId, type, pType) {
    var value = 0;
    var params = QParams.rateParamsPlus(charaId, type);
    if (pType === 'sParam') {
      paramId += 10;
    }
    if (params[paramId]) {
      var a = this;
      value += eval(params[paramId]);
    }
    return Number(value) || 0;
  };

  Game_BattlerBase.prototype.qParam = function(qParamId) {
    var currentValue = 0;
    if (qParamId > 8) {
      // is a custom param, so we grab it's current set value
      currentValue = this._cParamPlus[qParamId - 9];
    }
    // add 8 because first 8 are mv built in params (mhp, mmp, str, ect)
    var value = this.stateParamPlus(qParamId + 8, currentValue);
    value += this.equipParamPlus(qParamId + 8, currentValue);
    value += this.getCharaParamPlus(qParamId + 8, currentValue);
    value += currentValue;
    return value || 0;
  };

  Game_BattlerBase.prototype.cParam = function(cParamId) {
    var value = this.qParam(cParamId + 9);
    var min = QParams._custom[cParamId].min !== '' ? Number(QParams._custom[cParamId].min) : value;
    if (isNaN(min)) {
      min = value;
    }
    var max = QParams._custom[cParamId].max !== '' ? Number(QParams._custom[cParamId].max) : value;
    if (isNaN(max)) {
      max = value;
    }
    return value.clamp(min, max);
  };

  Game_BattlerBase.prototype.addCParam = function(paramId, value) {
    this._cParamPlus[paramId] += value;
    this.refresh();
  };

  Game_BattlerBase.prototype.setCParam = function(paramId, value) {
    this._cParamPlus[paramId] = value;
    this.refresh();
  };

  var Alias_Game_BattlerBase_skillMpCost = Game_BattlerBase.prototype.skillMpCost;
  Game_BattlerBase.prototype.skillMpCost = function(skill) {
    var value = Alias_Game_BattlerBase_skillMpCost.call(this, skill);
    return Math.floor(value + this.mcc);
  };

  //-----------------------------------------------------------------------------
  // Game_Battler

  Game_Battler.prototype.regenerateHp = function() {
    var value = Math.floor(this.mhp * this.hrg + this.hrt);
    value = Math.max(value, -this.maxSlipDamage());
    if (value !== 0) {
      this.gainHp(value);
    }
  };

  Game_Battler.prototype.regenerateMp = function() {
    var value = Math.floor(this.mmp * this.mrg + this.mrt);
    if (value !== 0) {
      this.gainMp(value);
    }
  };

  Game_Battler.prototype.regenerateTp = function() {
    var value = Math.floor(100 * this.trg + this.trt);
    this.gainSilentTp(value);
  };

  Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    var value = Math.floor(50 * damageRate * this.tcr + this.tcc);
    this.gainSilentTp(value);
  };

  //-----------------------------------------------------------------------------
  // Game_Actor

  Game_Actor.prototype.equipParamPlus = function(paramId, currentValue) {
    var value = 0;
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
      if (!equips[i]) continue;
      var params = QParams.equipParamsPlus(equips[i]);
      if (params[paramId]) {
        value += this.evalParamFormula(params[paramId], currentValue);
      }
    }
    return Number(value) || 0;
  };

  var Alias_Game_Actor_basicFloorDamage = Game_Actor.prototype.basicFloorDamage;
  Game_Actor.prototype.basicFloorDamage = function() {
    var value = Alias_Game_Actor_basicFloorDamage.call(this);
    return value + this.fdc;
  };

  var Alias_Game_Actor_finalExpRate = Game_Actor.prototype.finalExpRate;
  Game_Actor.prototype.finalExpRate = function() {
    var value = Alias_Game_Actor_finalExpRate.call(this);
    return value + this.exc;
  };

  //-----------------------------------------------------------------------------
  // Game_Action

  if (Imported.YEP_DamageCore) {
    var Alias_Game_Action_applyPhysicalRate = Game_Action.prototype.applyPhysicalRate;
    Game_Action.prototype.applyPhysicalRate = function(value, baseDamage, target) {
      value = Alias_Game_Action_applyPhysicalRate.call(this, value, baseDamage, target);
      return value + target.pdc;
    };

    var Alias_Game_Action_applyMagicalRate = Game_Action.prototype.applyMagicalRate;
    Game_Action.prototype.applyMagicalRate = function(value, baseDamage, target) {
      value = Alias_Game_Action_applyMagicalRate.call(this, value, baseDamage, target);
      return value + target.mdc;
    };

  } else {
    Game_Action.prototype.makeDamageValue = function(target, critical) {
      var item = this.item();
      var baseValue = this.evalDamageFormula(target);
      var value = baseValue * this.calcElementRate(target);
      if (this.isPhysical()) {
        value *= target.pdr;
        value += target.pdc;
      }
      if (this.isMagical()) {
        value *= target.mdr;
        value += target.mdc;
      }
      if (baseValue < 0) {
        value *= target.rec;
      }
      if (critical) {
        value = this.applyCritical(value);
      }
      value = this.applyVariance(value, item.damage.variance);
      value = this.applyGuard(value, target);
      value = Math.round(value);
      return value;
    };
  };

  var Alias_Game_Action_applyItemUserEffect = Game_Action.prototype.applyItemUserEffect;
  Game_Action.prototype.applyItemUserEffect = function(target) {
    Alias_Game_Action_applyItemUserEffect.call(this, target);
    var value = Math.floor(this.subject().tcc);
    this.subject().gainSilentTp(value);
  };

})();
