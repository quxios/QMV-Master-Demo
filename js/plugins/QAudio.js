//=============================================================================
// QAudio
//=============================================================================

var Imported = Imported || {};
Imported.QAudio = '2.2.2';

if (!Imported.QPlus || !QPlus.versionCheck(Imported.QPlus, '1.0.1')) {
  alert('Error: QAudio requires QPlus 1.0.1 or newer to work.');
  throw new Error('Error: QAudio requires QPlus 1.0.1 or newer to work.');
}

//=============================================================================
 /*:
 * @plugindesc <QAudio>
 * Few new audio features
 * @author Quxios  | Version 2.2.2
 *
 * @requires QPlus
 *
 * @param Default Radius
 * @desc Default radius in tiles
 * @default 5
 *
 * @param Default Max Volume
 * @desc Default max volume
 * @default 100
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * This plugin allows you to play an audio (bgm, bgs, me or se) at a fixed
 * position. The volume and panning will be dynamically updated based off of
 * the players distance from that audios location.
 * ============================================================================
 * ## Plugin Commands
 * ============================================================================
 * **Playing / Looping**
 * ----------------------------------------------------------------------------
 * ~~~
 *   qAudio start [AUDIONAME] [list of options]
 * ~~~
 * AUDIONAME - The name of the audio you want to play. If file has spaces in it
 * wrap the name with "". Ex. If audio name was: Some File, then use "Some File"
 *
 * Possible options:
 *
 *  - loop    - this audio will loop
 *  - noPan   - this audio will not update its pan
 *  - idX     - where X the ID for the audio (needed for stopping)
 *  - type    - bgm, bgs, me, or se (Default: bgm)
 *  - maxV    - where V is the max volume for this audio, between 0-100
 *  - fadeinT - where T is the time to fade in, in seconds
 *  - xX      - where X is the x position for the audio
 *  - yY      - where Y is the y position for the audio
 *  - radiusR - where R is the max radius for the audio
 *  - bindToCHARAID - where CHARAID is the character to bind to
 *
 * CHARAID - The character identifier.
 *
 *  - For player: 0, p, or player
 *  - For events: EVENTID, eEVENTID, eventEVENTID or this for the event that called this
 *  (replace EVENTID with a number)
 *
 * (Note: If no x, y or bindTo are set, it will play at players position)
 * ----------------------------------------------------------------------------
 * **Examples 1**
 * ----------------------------------------------------------------------------
 * ~~~
 *   qAudio start Battle1
 * ~~~
 * Will play bgm Battle1 at the players location. Recommended not to do it this
 * way, best to set options.
 *
 * ~~~
 *   qAudio start City bgs idCITY max80 radius10 x5 y5
 * ~~~
 * Will play bgs City at position (5, 5) with a radius of 10 and max volume of
 * 80. It's id is CITY
 *
 * ~~~
 *   qAudio start City bgs idCITY radius5 bindTo1 loop
 *   qAudio start City bgs idCITY radius5 bindToE1 loop
 *   qAudio start City bgs idCITY radius5 bindToEvent1 loop
 * ~~~
 * (Note: All 3 are the same, just using a different character id method)
 *
 * Will play bgs City at event 1s position and move with that event. It also has
 * a radius of 5 and it will keep looping. It's id is CITY
 * ----------------------------------------------------------------------------
 * **Stoping a QAudio**
 * ----------------------------------------------------------------------------
 * ~~~
 *  qAudio stop ID [list of options]
 * ~~~
 * ID - the ID you set for the audio
 *
 * Possible options:
 *
 *  - fadeoutT - where T is the time to fade out, in seconds
 *
 * To stop all qAudios
 * ~~~
 *  qAudio clear
 * ~~~
 * ----------------------------------------------------------------------------
 * **Examples 2**
 * ----------------------------------------------------------------------------
 * First make a qAudio with an Id like:
 * ~~~
 *  qAudio start Battle1 bgm idAb1
 * ~~~
 *
 * Then when you want to clear it:
 * ~~~
 *  qAudio stop Ab1
 * ~~~
 *
 * Or clear it with a fadeout
 * ~~~
 *  qAudio stop Ab1 fadeOut2
 * ~~~
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
 * @tags audio, character, proximity
 */
//=============================================================================

//=============================================================================
// QAudio

(function() {
  var _params = QPlus.getParams('<QAudio>');
  var _defaultRadius = Number(_params['Default Radius']) || 1;
  var _defaultVolume = Number(_params['Default Max Volume']) || 100;

  //-----------------------------------------------------------------------------
  // Game_Interpreter
  //
  // The interpreter for running event commands.

  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qaudio') {
      return this.qAudioCommand(args);
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qAudioCommand = function(args) {
    args = QPlus.makeArgs(args.join(' '));
    var cmd = args[0].toLowerCase();
    if (cmd === 'loop' || cmd === 'play') {
      this.qAudioCommandOld(cmd, args)
    }
    if (cmd === 'start') {
      var name  = args[1];
      var args2 = args.slice(2);
      var loop     = !!QPlus.getArg(args2, /^loop$/i);
      var dontPan  = !!QPlus.getArg(args2, /^noPan$/i);
      var id = QPlus.getArg(args2, /^id(.+)/i) || '*';
      id = !id || id === '*' ? this.getUniqueQAudioId() : id;
      var type = QPlus.getArg(args2, /^(bgm|bgs|me|se)$/i) || 'bgm';
      type = type.toLowerCase();
      var max = QPlus.getArg(args2, /^max(\d+)/i);
      if (max === null) {
        max = _defaultVolume;
      }
      max /= 100;
      var radius = QPlus.getArg(args2, /^radius(\d+)/i) ;
      if (radius === null) {
        radius = _defaultRadius;
      }
      var bindTo = QPlus.getArg(args2, /^bindTo(.+)/i);
      if (bindTo) {
        if (bindTo.toLowerCase() === 'this') {
          bindTo = this.character(0).charaId();
        }
      }
      var x = QPlus.getArg(args2, /^x(\d+)/i);
      if (x === null) {
        x = $gamePlayer.x;
      }
      var y = QPlus.getArg(args2, /^y(\d+)/i);
      if (y === null) {
        y = $gamePlayer.y;
      }
      var fadein = QPlus.getArg(args2, /^fadein(\d+)/i);
      var audio = {
        name: name,
        volume: 100,
        pitch: 0,
        pan: 0
      }
      AudioManager.playQAudio(id, audio, {
        type: type,
        loop: loop,
        maxVolume: Number(max),
        radius: Number(radius),
        x: Number(x),
        y: Number(y),
        bindTo: bindTo,
        doPan: !dontPan,
        fadeIn: Number(fadein) || 0
      })
    }
    if (cmd === 'stop') {
      var id = args[1];
      var fadeOut = Number(QPlus.getArg(args, /^fadeout(\d+)/i));
      if (fadeOut) {
        AudioManager.fadeOutQAudio(id, fadeOut);
      } else {
        AudioManager.stopQAudio(id);
      }
    }
    if (cmd === 'clear') {
      AudioManager.stopAllQAudio();
    }
  };

  Game_Interpreter.prototype.qAudioCommandOld = function(cmd, args) {
    var loop = cmd === 'loop';
    var id = args[1];
    id = id === '*' ? this.getUniqueQAudioId() : id;
    var type = args[2].toLowerCase();
    var audio = {
      name: args[3],
      volume: 100,
      pitch: 0,
      pan: 0
    }
    var max = Number(args[4]) / 100;
    var r = Number(args[5]);
    var x = Number(args[6]);
    var y = Number(args[7]);
    var bindTo = null;
    if (!y && y !== 0) {
      if (x === 0) {
        bindTo = 0;
      } else {
        bindTo = $gameMap.event(x).charaId();
      }
      x = null;
      y = null;
    }
    AudioManager.playQAudio(id, audio,  {
      type: type,
      loop: loop,
      maxVolume: max,
      radius: radius,
      x: x,
      y: y,
      bindTo: bindTo
    });
  };

  Game_Interpreter.prototype.getUniqueQAudioId = function() {
    var id = '*0';
    var counter = 0;
    var newId = false;
    while(!newId) {
      if (AudioManager._QAudioBuffers.length === 0) {
        newId = true;
        break;
      }
      counter++;
      id = '*' + counter;
      var j = 0;
      for (var i = 0; i < AudioManager._QAudioBuffers.length; i++) {
        if (AudioManager._QAudioBuffers[i].uid !== id) {
          j++;
        }
      }
      newId = j === i;
    }
    return id;
  };

  //-----------------------------------------------------------------------------
  // AudioManager

  AudioManager._QAudioBuffers = [];

  AudioManager.playQAudio = function(id, audio, options) {
    if (audio.name) {
      this._QAudioBuffers = this._QAudioBuffers.filter(function(b) {
        if (b.uid === id) {
          b.stop();
          b = null;
          return false;
        }
        return true;
      })
      var buffer = this.createBuffer(options.type, audio.name);
      if (options.bindTo) {
        buffer.bindTo = options.bindTo;
      } else {
        buffer.mapX = options.x;
        buffer.mapY = options.y;
      }
      buffer.uid = id;
      buffer.type = options.type;
      buffer.radius = options.radius;
      buffer.maxVolume = options.maxVolume;
      buffer.doPan = options.doPan;
      buffer.rVolume = 1;
      buffer.fadingIn = null;
      if (options.fadeIn) {
        buffer.rVolume = 0;
        buffer.fadingIn = {
          t: 0,
          dur: options.fadeIn * 60
        }
      }
      this.updateQAudioDistance(buffer);
      buffer.play(options.loop, 0);
      if (!options.loop) {
        buffer.addStopListener(this.stopQAudio.bind(this, id));
      }
      this._QAudioBuffers.push(buffer);
      $gameSystem._QAudios.push({
        id: id,
        audio: audio,
        options: options
      })
    }
  };

  AudioManager.stopQAudio = function(id) {
    var buffers = this._QAudioBuffers;
    for (var i = buffers.length - 1; i >= 0; i--) {
      if (buffers[i] && buffers[i].uid === id) {
        buffers[i].stop();
        buffers[i] = null;
        buffers.splice(i, 1);
        $gameSystem._QAudios.splice(i, 1);
        break;
      }
    }
  };

  AudioManager.stopAllQAudio = function() {
    var buffers = this._QAudioBuffers;
    for (var i = 0; i < buffers.length; i++) {
      if (buffers[i]._stopListeners) {
        buffers[i]._stopListeners.length = 0;
      }
      buffers[i].stop();
      buffers[i] = null;
    }
    this._QAudioBuffers = [];
    if ($gameSystem) {
      $gameSystem._QAudios = [];
    }
  };

  var Alias_AudioManager_stopAll = AudioManager.stopAll;
  AudioManager.stopAll = function() {
    Alias_AudioManager_stopAll.call(this);
    this.stopAllQAudio();
  };

  AudioManager.fadeOutQAudio = function(id, duration) {
    var buffers = this._QAudioBuffers;
    for (var i = buffers.length - 1; i >= 0; i--) {
      if (buffers[i] && buffers[i].uid === id) {
        buffers[i].fadeOut(duration);
        buffers[i] = null;
        buffers.splice(i, 1);
        $gameSystem._QAudios.splice(i, 1);
        break;
      }
    }
  };

  AudioManager.fadeOutAllQAudio = function(duration) {
    var buffers = this._QAudioBuffers;
    for (var i = buffers.length - 1; i >= 0; i--) {
      buffers[i].fadeOut(duration);
      buffers[i] = null;
      buffers.splice(i, 1);
      $gameSystem._QAudios.splice(i, 1);
    }
  };

  AudioManager.checkForQAudios = function() {
    if (this._QAudioBuffers.length !== $gameSystem._QAudios.length) {
      var newAudios = $gameSystem._QAudios.clone();
      this.stopAllQAudio();
      for (var i = 0; i < newAudios.length; i++) {
        var qAudio = newAudios[i];
        this.playQAudio(qAudio.id, qAudio.audio, qAudio.options);
      }
    }
  };

  AudioManager.updateQAudio = function() {
    this.checkForQAudios();
    var buffers = this._QAudioBuffers;
    for (var i = buffers.length - 1; i >= 0; i--) {
      if (!buffers[i]._autoPlay && !buffers[i].isPlaying()) {
        buffers[i].stop();
        buffers.splice(i, 1);
        $gameSystem._QAudios.splice(i, 1);
        continue;
      }
      if (buffers[i].fadingIn) {
        this.updateQAudioFadeIn(buffers[i]);
      }
      this.updateQAudioDistance(buffers[i]);
    }
  };

  AudioManager.updateQAudioFadeIn = function(buffer) {
    buffer.fadingIn.t++;
    buffer.rVolume = buffer.fadingIn.t / buffer.fadingIn.dur;
    if (buffer.fadingIn.t === buffer.fadingIn.dur) {
       buffer.fadingIn = null;
    }
  };

  AudioManager.updateQAudioDistance = function(buffer) {
    var x1 = $gamePlayer._realX;
    var y1 = $gamePlayer._realY;
    var x2 = buffer.mapX;
    var y2 = buffer.mapY;
    if (buffer.bindTo || buffer.bindTo === 0) {
      var chara = QPlus.getCharacter(buffer.bindTo);
      x2 = chara._realX;
      y2 = chara._realY;
    }
    if (buffer.cached) {
      if ((buffer.cached.x1 === x1 && buffer.cached.y1 === y1) &&
      (buffer.cached.x2 === x2 && buffer.cached.y2 === y2) &&
      (buffer.cached.rV === buffer.rVolume)) {
        return;
      }
    }
    var radius  = buffer.radius;
    var radian = Math.atan2(y2 - y1, x2 - x1);
    var dx = $gameMap.deltaX(x2, x1);
    var dy = $gameMap.deltaY(y2, y1);
    var dist = Math.sqrt(dx * dx + dy * dy);
    var volume = Math.max((radius - dist) / radius, 0);
    var typeVolume = 100;
    if (buffer.type === 'bgm') typeVolume = this._bgmVolume;
    if (buffer.type === 'bgs') typeVolume = this._bgsVolume;
    if (buffer.type === 'me')  typeVolume = this._meVolume;
    if (buffer.type === 'se')  typeVolume = this._seVolume;
    volume *= buffer.maxVolume * (typeVolume / 100);
    buffer.volume = volume * buffer.rVolume;
    if (buffer.doPan) {
      var pan = Math.cos(radian);
      if (x2 === x1 && y2 === y1) {
        pan = 0;
      }
      buffer.pan = pan;
    }
    buffer.cached = {
      x1: x1, x2: x2,
      y1: y1, y2: y2,
      rV: buffer.rVolume
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_Base

  var Alias_Scene_Base_fadeOutAll = Scene_Base.prototype.fadeOutAll;
  Scene_Base.prototype.fadeOutAll = function() {
    Alias_Scene_Base_fadeOutAll.call(this);
    var time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutAllQAudio(time);
  };

  //-----------------------------------------------------------------------------
  // Scene_Title

  var Alias_Scene_Title_playTitleMusic = Scene_Title.prototype.playTitleMusic;
  Scene_Title.prototype.playTitleMusic = function() {
    Alias_Scene_Title_playTitleMusic.call(this);
    AudioManager.stopAllQAudio();
  };

  //-----------------------------------------------------------------------------
  // Scene_Map

  var Alias_Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    Alias_Scene_Map_update.call(this);
    AudioManager.updateQAudio();
  };

  var Alias_Scene_Map_stopAudioOnBattleStart = Scene_Map.prototype.stopAudioOnBattleStart;
  Scene_Map.prototype.stopAudioOnBattleStart = function() {
    Alias_Scene_Map_stopAudioOnBattleStart.call(this);
    AudioManager.stopAllQAudio();
  };

  //-----------------------------------------------------------------------------
  // Game_Map

  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    AudioManager.stopAllQAudio();
    Alias_Game_Map_setup.call(this, mapId);
  };

  //-----------------------------------------------------------------------------
  // Game_System

  var Alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Alias_Game_System_initialize.call(this);
    this._QAudios = [];
  };
})()
