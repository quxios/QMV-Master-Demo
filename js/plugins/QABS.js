//=============================================================================
// QABS
//=============================================================================

var Imported = Imported || {};

if (!Imported.QMovement || !QPlus.versionCheck(Imported.QMovement, '1.4.0')) {
  alert('Error: QABS requires QMovement 1.4.0 or newer to work.');
  throw new Error('Error: QABS requires QMovement 1.4.0 or newer to work.');
}

Imported.QABS = '1.6.2';

//=============================================================================
/*:
 * @plugindesc <QABS>
 * Action Battle System for QMovement
 * @version 1.6.2
 * @author Quxios  | Version 1.6.2
 * @site https://quxios.github.io/
 * @updateurl https://quxios.github.io/data/pluginsMin.json
 *
 * @repo https://github.com/quxios/QABS
 *
 * @requires QMovement
 *
 * @video TODO
 *
 * @param Attack Settings
 *
 * @param Quick Target
 * @parent Attack Settings
 * @desc Ground target skills will instantly cast at mouse location
 * @type Boolean
 * @default false
 *
 * @param Lock when Targeting
 * @parent Attack Settings
 * @desc Player can't move when using Ground / Select targeting skills
 * @type Boolean
 * @on Can't Move
 * @off Can Move
 * @default false
 *
 * @param Aim with Mouse
 * @parent Attack Settings
 * @desc All actions will be used towards your mouse location
 * @type Boolean
 * @on Towards mouse
 * @off Towards player direction
 * @default false
 *
 * @param Aim with Analog
 * @parent Attack Settings
 * @desc All actions will be used towards right analog stick when using a
 * gamepad.
 * @type Boolean
 * @on Towards right analog
 * @off Towards player direction
 * @default false
 *
 * @param Move Resistance Rate Stat
 * @parent Attack Settings
 * @desc Which stat to use for Move Resistance Rate
 * Default: xparam(1)     //  This is Evasion
 * @default xparam(1)
 *
 * @param Loot Settings
 *
 * @param Loot Decay
 * @parent Loot Settings
 * @desc How long until the loot disappears, in frames.
 * @type Number
 * @min 1
 * @default 600
 *
 * @param AoE Loot
 * @parent Loot Settings
 * @desc Collect nearby loot or pick up one at a time.
 * @type Boolean
 * @default true
 *
 * @param Loot Touch Trigger
 * @parent Loot Settings
 * @desc Pick up loot on player touch
 * @type Boolean
 * @default false
 *
 * @param Gold Icon
 * @parent Loot Settings
 * @desc Icon Index to display for gold loot
 * Default: 314
 * @default 314
 *
 * @param Level Animation
 * @parent Loot Settings
 * @desc The animation ID to play on level up.
 * Default: 52
 * @type Animation
 * @default 52
 *
 * @param Enemy AI
 *
 * @param AI Default Sight Range
 * @parent Enemy AI
 * @desc Default range for enemies to go after player, in pixels
 * Default: 240
 * @type Number
 * @min 1
 * @default 240
 *
 * @param AI Action Wait
 * @parent Enemy AI
 * @desc How many frames to wait before running AI for next skill
 * Default: 30
 * @min 1
 * @default 30
 *
 * @param AI Uses QSight
 * @parent Enemy AI
 * @desc Set to true or false if AI should use QSight
 * May decrease performance
 * @type Boolean
 * @default true
 *
 * @param AI uses QPathfind
 * @parent Enemy AI
 * @desc Set to true or false if AI should use QPathfind
 * May decrease performance
 * @type Boolean
 * @default true
 *
 * @param Default Skills
 * @type Struct<SkillKey>[]
 * @default []
 *
 * @help
 * ============================================================================
 * ## About
 * ============================================================================
 * A collider based action battle system for QMovement. *Note* This is not
 * your simple rpg maker action battle system. Using this plugin you can
 * create more advance like action games.
 *
 * **_Note that the help section is still in development and may be missing
 * some info! Sorry!_**
 *
 * For a demo visit the steamwork shop:
 *
 * http://steamcommunity.com/sharedfiles/filedetails/?id=952886994
 * ============================================================================
 * ## Is this for you?
 * ============================================================================
 * First, this is a very complex action battle system. If you're looking for
 * something that you can spend less than an hour to set up then this plugin
 * is not for you.
 *
 * To make full use of this plugin you need to know how to properly use and
 * setup QMovement. If you don't know what that plugin is or what colliders
 * are then again, this plugin is not for you.
 *
 * There are a lot of actions for skill sequences so you can create some pretty
 * crazy skills. Learning how to use the actions may take awhile since there
 * are a lot of actions, and maybe more to come.
 *
 * Enemies have a very basic AI. If you want to create more AI styles, you
 * will need to know how to JS and create a plugin / extend this plugin.
 * ============================================================================
 * ## Skill Keys
 * ============================================================================
 * **Default Skill keys**
 * ----------------------------------------------------------------------------
 * For the player to be able to use a skill from a hotkey, you will first need
 * to create a skill key in the plugin parameter `Default Skills`.
 *
 * ![Skill Keys](https://quxios.github.io/imgs/qabs/skillKeys.png)
 *
 * When creating a skill key you have 4 parameters:
 *
 * - #### Keyboard Input:
 *  * The keyboard input that will trigger this skill, set this to `mouse1` for
 *    left click, and `mouse2` for right click.
 * - #### Gamepad Input:
 *  * The gamepad input that will trigger this skill.
 * - #### Rebind:
 *  * If this is true, the skill that's assigned to this skill key can be
 *  reassigned.
 * - #### Skill Id:
 *  * The skill that this skill key will use when triggered.
 *
 * **_Note_** for input values those are the button values; `ok`, `cancel`, ect. Or
 * if you're using an input plugin, use their value. For example in QInput you can
 * use the `#A` for the a key or `#tab` for tab, ect.
 *
 * **_Note_** that rebind doesn't do much as this doesn't have a rebinding feature.
 * But the ground work is there so it can easily be created for an addon.
 *
 * **_Note_** that the `Skill Key Number` is the number next to the skill key you created.
 * `Skill Key Number` will be referenced later.
 *
 * ![Skill Keys](https://quxios.github.io/imgs/qabs/skillKeysNumber.png)
 *
 * ----------------------------------------------------------------------------
 * **Class Skill keys**
 * ----------------------------------------------------------------------------
 * You can change the players skill keys based on their class by adding the notetag:
 * ~~~
 * <skillKeys>
 * [SKILL KEY NUMBER]: [SKILL ID] [REBIND?]
 * </skillKeys>
 * ~~~
 * - #### SKILL KEY NUMBER:
 *  * The skill key that you want to change
 * - #### SKILL ID:
 *  * The skill to assign to this skill key number
 * - #### REBIND?:
 *  * Set to true or false if this can be reassigned
 *
 * If the skill key that you are trying to change has its `Rebind` value set to false,
 * nothing will happen since it can't be reassigned.
 *
 * **_Important!_** make sure the skill key you are trying to set is created in the
 * plugin parameters `Default Skills`. If it's not, the game will have an error.
 *
 * Example:
 * ~~~
 * <skillKeys>
 * 1: 2
 * 3: 15
 * 4: 16
 * </skillKeys>
 * ~~~
 * Class Skill keys will replace the default skill keys. So if you set up skill
 * keys 1 through 9 in the parameters and a class changes the skills for skill
 * keys 1, 3, 4. The over all skill keys will be, 1, 3, 4 from the class and
 * the rest are from the default values.
 * ----------------------------------------------------------------------------
 * **Weapon Skill keys**
 * ----------------------------------------------------------------------------
 * Weapons can also change the skill keys. For example you might want to change
 * the main attack to use a range skill if the player has a bow equipped! To do
 * this you use a similar tag as the class, but in the weapon
 * ~~~
 * <skillKeys>
 * [SKILL KEY NUMBER]: [SKILL ID]
 * </skillKeys>
 * ~~~
 * - #### SKILL KEY NUMBER:
 *  * The skill key that you want to change
 * - #### SKILL ID:
 *  * The skill to assign to this skill key number
 *
 * **_Important!_** make sure the skill key you are trying to set is created in the
 * plugin parameters `Default Skills`. If it's not, the game will have an error.
 *
 * Example:
 * ~~~
 * <skillKeys>
 * 1: 3
 * </skillKeys>
 * ~~~
 * Weapon skill keys take top priority, so they will replace both class keys
 * and the default keys! This example will replace skill key 1 with the skill
 * id 3
 * ----------------------------------------------------------------------------
 * **Override Skill keys**
 * ----------------------------------------------------------------------------
 * You can manually override a skill key with a plugin command. Override skill keys
 * take priority over weapon, class and default skill keys.
 *
 * Plugin command:
 * ~~~
 * qabs override SKILLKEYNUMBER SKILLID
 * ~~~
 * - #### SKILLKEYNUMBER:
 *  * The skill key that you want to change
 * - #### SKILLID:
 *  * The skill to assign to this skill key number. Set to -1 if you want to
 *    remove this override
 *
 * **_Important!_** make sure the skill key you are trying to set is created in the
 * plugin parameters `Default Skills`. If it's not, the game will have an error.
 *
 * **_Note_** that the player still needs to know the skill to be able to use it.
 * Assigning it won't let him use it if he doesn't know it.
 *
 * Example:
 * ~~~
 * qabs override 1 3
 * ~~~
 * Will override skill key 1 and assign the skill with id 3. To remove this
 * override later on use the plugin command:
 * ~~~
 * qabs override 1 -1
 * ~~~
 * ============================================================================
 * ## Skills
 * ============================================================================
 * **Skill Settings**
 * ----------------------------------------------------------------------------
 * Each skill should have a skill settings tag. This tag can change the settings
 * for the skills cooldown, through, and other effects. The tag is:
 * ~~~
 *  <absSettings>
 *  [SETTINGS]: [VALUE]
 *  </absSettings>
 * ~~~
 * Here's a list of all the settings:
 * ~~~
 * collider: [SHAPE], [WIDTH], [HEIGHT]
 * collides: [STRING]
 * cooldown: [NUMBER]
 * infront: [TRUE or FALSE]
 * rotate: [TRUE or FALSE]
 * through: [0, 1, 2 or 3]
 * throughTerrain: [LIST OF TERRAINS IT CAN GO THROUGH]
 * groundtarget: [NUMBER]
 * selecttarget: [NUMBER]
 * ~~~
 * - #### collider:
 *  * Set this to the collider this skill will use. See QMovement help for details
 *    on colliders. 
 *  * Default: The users collider
 *  * Format is: `shape, width, height`
 * - #### collides:
 *   * Set this to which collider type to check for against skill hit. If you
 *  want to use a custom collider, use the `<colliders></colliders>` tag
 *  * Default: collision
 * - #### cooldown:
 *  * Set to the number of frames until you can use this skill again. 
 *  * Default: 0
 * - #### infront:
 *  * Set to true or false. When true, the collider will appear in front of the user.
 *    When false the collider will be centered on the user. 
 *  * Default: false
 * - #### rotate:
 *  * Set to true or false. When true, the collider will rotate based on the users
 *    direction when skill is starting. Default: false
 * - #### through:
 *  * Set to 0, 1, 2, or 3. Default: 0
 *    - 0: Goes through events and tiles
 *    - 1: Goes through tiles but stops when it hits an event
 *    - 2: Goes through events but stops when it hits a tile
 *    - 3: Stops when it hits an event or tile
 * - #### throughTerrain:
 *  * Set to a list of tile terrains it can go through, separate each terrain with a comma
 * - #### groundtarget:
 *  * Set to the max distance, in pixels, for the ground target. If value is 0 ground 
 *    targeting will not be used. 
 *  * Default: 0
 * - #### selecttarget:
 *  * Set to the max distance, in pixels, for the select target. If value is 0 select 
 *    targeting will not be used. 
 *  * Default: 0
 * ----------------------------------------------------------------------------
 * **Skill Sequence**
 * ----------------------------------------------------------------------------
 * When a skill is used, it's sequence will run. You will need to configure
 * a sequence to tell the skill what it should do or it won't do anything.
 * 
 * This can be done with the notetag:
 * ~~~
 *  <absSequence>
 *  [ACTION]
 *  </absSequence>
 * ~~~
 * There are a bunch of actions. Each action needs to be on a different line.
 * 
 * Here's a list of all the actions:
 * ~~~
 * user casting [TRUE or FALSE]
 * user lock
 * user unlock
 * user speed [INC or DEC] [VALUE]
 * user move [FORWARD or BACKWARD] [DIST] [WAIT? TRUE or FALSE]
 * user moveHere [WAIT? TRUE or FALSE]
 * user jump [FORWARD or BACKWARD] [DIST] [WAIT? TRUE or FALSE]
 * user jumpHere [WAIT? TRUE or FALSE]
 * user teleport
 * user setDirection [DIR]
 * user directionFix [TRUE or FALSE]
 * user pose [POSE NAME] [WAIT? TRUE or FALSE]
 * user forceSkill [SKILL ID] [ANGLE OFFSET IN DEGREES]
 * user animation [ANIMATION ID]
 * user qaudio [NAME] [QAUDIO OPTIONS]
 * store
 * move [FORWARD or BACKWARD] [DIST] [DURATION] [WAIT? TRUE or FALSE]
 * moveToStored [DURATION] [WAIT? TRUE or FALSE]
 * wave [FORWARD or BACKWARD] [AMPLITUDE] [HARM] [DIST] [DURATION] [WAIT? TRUE or FALSE]
 * waveToStored [AMPLITUDE] [HARM] [DURATION] [WAIT? TRUE or FALSE]
 * trigger
 * adjustAim
 * wait [DURATION]
 * picture [FILE NAME] [ROTATABLE? TRUE or FALSE] [BASE DIRECTION]
 * trail [FILE NAME] [ROTATABLE? TRUE or FALSE] [BASE DIRECTION]
 * collider [SHOW or HIDE]
 * animation [ANIMATION ID]
 * se [NAME] [VOLUME] [PITCH] [PAN]
 * qaudio [NAME] [QAUDIO OPTIONS]
 * forceSkill [SKILL ID] [ANGLE OFFSET IN DEGREES]
 * globalLock
 * globalUnlock
 * ~~~
 * - #### user casting [TRUE or FALSE]
 *  * Set the user casting state. If the user is casting, this skill can be
 *    ended early if they get hit with a skill that has `user cancel` in it's
 *    `absOnDamage`
 *
 * - #### user lock
 *  * Locks the users movement. The user can't move or use any actions until
 *    `user unlock` is called. 
 *  * `user unlock` is called automatically after every skill ends to ensure 
 *    the user can move again if the skill ended.
 *
 * - #### user unlock
 *  * Unlocks the users movement. The user is unlocked if it was locked and can
 *    move and use actions again.
 *  * `user unlock` is called automatically after every skill ends to ensure
 *    the user can move again if the skill ended.
 *
 * - #### user speed [INC or DEC] [VALUE]
 *  * Changes the users move speed.
 *  * INC or DEC: 
 *    - Set to `inc` to increase movespeed
 *    - Set to `dec` to decrease move speed
 *  * VALUE: Set to a number to inc or dec the movespeed by.
 *
 * - #### user move [FORWARD or BACKWARD] [DIST] [WAIT? TRUE or FALSE]
 *  * The user will move forward or backwards by X distance.
 *  * FORWARD or BACKWARD:
 *    - Set to `forward` to move towards the direction the user is facing
 *    - Set to `backward` to move towards the opposite direction the user is facing
 *  * DIST: Set to the distance the user should move, in pixels
 *  * WAIT: Set to `true` or `false`. If true the sequencer will wait until the move
 *    is complete before going to the next action
 *
 * - #### user moveHere [WAIT? TRUE or FALSE]
 *  * The user will move to the skills current location
 *  * WAIT: Set to `true` or `false`. If true the sequencer will wait until the move
 *    is complete before going to the next action
 *
 * - #### user jump [FORWARD or BACKWARD] [DIST] [WAIT? TRUE or FALSE]
 *  * The user will jump forward or backwards by X distance.
 *  * FORWARD or BACKWARD: 
 *    - Set to `forward` to jump towards the direction the user is facing
 *    - Set to `backward` to jump towards the opposite direction the user is facing
 *  * DIST: Set to the distance the user should jump, in pixels
 *  * WAIT: Set to `true` or `false`. If true the sequencer will wait until the jump
 *    is complete before going to the next action
 *
 * - #### user jumpHere [WAIT? TRUE or FALSE]
 *  * The user will jump to the skills current location
 *  * WAIT: Set to `true` or `false`. If true the sequencer will wait until the jump
 *    is complete before going to the next action
 *
 * - #### user teleport
 *  * The user will be placed at the skills current location. Similar to an
 *    event transfer command.
 *
 * - #### user setDirection [DIR]
 *  * Change the users direction
 *  * DIR: Set to: 2, 4, 6 or 8. For diagonals; 1, 3, 7, or 9
 *
 * - #### user directionFix [TRUE or FALSE]
 *  * Sets the users direction fix.
 *  * TRUE or FALSE: Set to `true` or `false`. When true the users direction can't change
 *
 * - #### user pose [POSE NAME] [WAIT? TRUE or FALSE]
 *  * **_Requires QSprite plugin_**
 *  * If the user is a QSprite, it will play the pose
 *  * POSE NAME: The pose to play
 *  * WAIT: Set to `true` or `false`. If true the sequencer will wait until the pose
 *    is done playing before going to the next action
 *
 * - #### user forceSkill [SKILL ID] [ANGLE OFFSET IN DEGREES]
 *  * Forces the user to use a skill.
 *  * SKILL ID: The ID of the skill to use
 *  * ANGLE OFFSET: Lets you offset the angle, in degrees, that this skill be used
 *    towards. This is optional and can be left out.
 *    - Default: 0
 *
 * - #### user animation [ANIMATION ID]
 *  * Plays an animation on the user
 *  * ANIMATION ID: The ID of the animation to play
 *
 * - #### user qaudio [NAME] [QAUDIO OPTIONS]
 *  * **_Requires QAudio plugin_**
 *  * Binds a QAudio to the user
 *  * NAME: The name of the audio file to use
 *  * QAUDIO OPTIONS: any of the QAudio options besides; xX, yY, bindToCHARAID.
 *    View QAudio help for more details
 *
 * - #### store
 *  * Stores the skills current location. This location value is used when
 *    the actions `moveToStored` or 'waveToStored' are used.
 *
 * - #### move [FORWARD or BACKWARD] [DIST] [DURATION] [WAIT? TRUE or FALSE]
 *  * Moves the skill forward or backwards by X dist in Y frames
 *  * FORWARD or BACKWARD:
 *    - Set to `forward` to move towards the direction the skill is currently moving
 *    - Set to `backward` to move towards the opposite direction the skill is current moving
 *  * DIST: The distance you want the skill to move, in pixels.
 *  * DURATION: How long should it take to complete this move, in frames.
 *  * WAIT: Set to `true` or `false`. If true the sequencer will wait until the skill
 *    is done moving before going to the next action
 *
 * - #### moveToStored [DURATION] [WAIT? TRUE or FALSE]
 *  * Moves the skill to the stored position
 *  * DURATION: How long should it take to complete this move, in frames.
 *  * WAIT: Set to `true` or `false`. If true the sequencer will wait until the skill
 *    is done moving before going to the next action
 *
 * - #### wave [FORWARD or BACKWARD] [AMPLITUDE] [HARM] [DIST] [DURATION] [WAIT? TRUE or FALSE]
 *
 * - #### waveToStored [AMPLITUDE] [HARM] [DURATION] [WAIT? TRUE or FALSE]
 *
 * - #### trigger
 *  * Activates the skill at it's current location
 *
 * - #### adjustAim
 *  * Recalculates the direction the skill should move. This is only works
 *    when the skill is used from an enemy.
 *
 * - #### wait [DURATION]
 *  * The sequencer will wait before moving to the next action
 *  * DURATION: How long should the wait last, in frames
 *
 * - #### picture [FILE NAME] [ROTATABLE? TRUE or FALSE] [BASE DIRECTION]
 *  * Bind a picture to the skill
 *  * FILE NAME: The file name of the picture. Should be located in the
 *    Pictures folder. For an animated picture it should have the format:
 *    - %[COLS-SPEED]
 *    - COLS: The number of slices in the picture
 *    - SPEED: The time to wait between frames
 *  * ROTATABLE: Set to `true` or `false`. If true the picture will rotate based
 *    on the direction the skill is moving
 *  * BASE DIRECTION: The direction the skill is facing by default. The directions
 *    should be 2, 4, 6, or 8
 *
 * - #### trail [FILE NAME] [ROTATABLE? TRUE or FALSE] [BASE DIRECTION]
 *  * Binds a picture that stretches from the user to the skills position
 *  * FILE NAME: The file name of the picture. Should be located in the
 *    Pictures folder.
 *  * ROTATABLE: Set to `true` or `false`. If true the picture will rotate based
 *    on the direction the skill is moving
 *  * BASE DIRECTION: The direction the skill is facing by default. The directions
 *    should be 2, 4, 6, or 8
 *
 * - #### collider [SHOW or HIDE]
 *  * Shows the skills collider
 *  * SHOW or HIDE: 
 *    - Set to `show` to show the skills collider
 *    - Set to `hide` to hide the skills collider
 *
 * - #### animation [ANIMATION ID]
 *  * Play an animation at the skills current location
 *  * ANIMATION ID: The ID of the animation to play
 *
 * - #### se [NAME] [VOLUME] [PITCH] [PAN]
 *  * Play an se
 *  * NAME: The name of the SE to play
 *  * VOLUME: The volume of the SE, default: 90
 *  * PITCH: The pitch of the SE, default: 100
 *  * PAN: The pan of the SE, default: 0
 *
 * - #### qaudio [NAME] [QAUDIO OPTIONS]
 *  * Play a qAudio at the skills location
 *  * NAME: The name of the audio file
 *  * QAUDIO OPTIONS: Visit the QAudio help for information. The options
 *    are the same from the plugin commands. x, y, bindTo options will not work.
 *
 * - #### forceSkill [SKILL ID] [ANGLE OFFSET]
 *  * Force a skill at the skills current location
 *  * SKILL ID: The ID of the skill to use
 *  * ANGLE OFFSET: Lets you offset the angle, in degrees, this skill be used towards.
 *    This is optional and can be left out.
 *
 * - #### globalLock
 *  * Locks all characters movement
 *
 * - #### globalUnlock
 *  * Unlocks all characters movement
 *
 * ----------------------------------------------------------------------------
 * **Skill On Damage**
 * ----------------------------------------------------------------------------
 * Whenever a skill hits a target you can run another sequence. This is done
 * by using the notetag:
 * ~~~
 * <absOnDamage>
 * [ACTION]
 * </absOnDamage>
 * ~~~
 * There are a few actions you can add here:
 * ~~~
 * target move [TOWARDS or AWAY or INTO] [DIST]
 * target jump [TOWARDS or AWAY or INTO] [DIST]
 * target pose [POSE]
 * target cancel
 * target qaudio [NAME] [QAUDIO OPTIONS]
 * user forceSkill [SKILL ID] [ANGLE OFFSET IN DEGREES]
 * animationTarget [0 or 1]
 * ~~~
 * - #### target move [TOWARDS or AWAY or INTO] [DIST]
 *  * The target will move X distance.
 *  * TOWARDS or AWAY or INTO: 
 *    - Set to `towards` to move towards the user of the skill
 *    - Set to `away` to move away from the user of the skill
 *    - Set to `into` to move towards the skill center
 *  * DIST: Set to the distance the target should move, in pixels
 * 
 * - #### target jump [TOWARDS or AWAY or INTO] [DIST]
 *  * The target will jump X distance.
 *  * TOWARDS or AWAY or INTO:
 *    - Set to `towards` to jump towards the user of the skill
 *    - Set to `away` to jump away from the user of the skill
 *    - Set to `into` to jump towards the skill position
 *  * DIST: Set to the distance the target should jump, in pixels
 * 
 * - #### target pose [POSE]
 *  * **_Requires QSprite plugin_**
 *  * If the target is a QSprite, it will play the pose
 *  * POSE NAME: The pose to play
 * 
 * - #### target cancel
 *  * If the target is `casting`, it will cancel the skill
 * 
 * - #### target qaudio [NAME] [QAUDIO OPTIONS]
 *  * **_Requires QAudio plugin_**
 *  * Binds a QAudio to the target
 *  * NAME: The name of the audio file to use
 *  * QAUDIO OPTIONS: any of the QAudio options besides; xX, yY, bindToCHARAID.
 *    View QAudio help for more details
 * 
 * - #### user forceSkill [SKILL ID] [ANGLE OFFSET IN DEGREES]
 *  * Forces the user to use a skill.
 *  * SKILL ID: The ID of the skill to use
 *  * ANGLE OFFSET: Lets you offset the angle, in degrees, that this skill be used
 *    towards. This is optional and can be left out.
 *    - Default: 0
 * 
 * - #### animationTarget [0 or 1]
 *  * Sets where to play the skill animation
 *  * 0 or 1: 
 *    - When 0, the animation will play at the current location.
 *      Animation will only play once if the skill hit multiple targets
 *    - When 1, the animation will play on the target
 *      Animation will play on all targets it hits
 * ============================================================================
 * ## Enemies
 * ============================================================================
 * **Event**
 * ----------------------------------------------------------------------------
 * To mark an event as an enemy, add the notetag to the event
 * ~~~
 * <enemy:X>
 * ~~~
 * Where X is the ID of the enemy in the database.
 * ----------------------------------------------------------------------------
 * **Enemy Database**
 * ----------------------------------------------------------------------------
 * #### To set the enemies respawn time
 * ~~~
 * <respawn:X>
 * ~~~
 * - X: How long until it respawns, in frames.
 *
 * #### To change the team of the enemy
 * ~~~
 * <team:X>
 * ~~~
 * Set X to the team number
 * - 0: Neutral
 * - 1: Player team
 * - 2: Enemy team
 * - 3+ can also be used
 *
 * **_Note_** teams don't do much because there is no team based AI
 * 
 * #### To set an Enemies AI type
 * ~~~
 * <AIType:TYPE>
 * ~~~
 * - TYPE: The AI type, set this to `none` to disable AI.
 *
 * **_Note_** There's only 1 type of AI, so for now that AI is only to disable AI
 *
 * #### To set it's AI range
 * ~~~
 * <range:X>
 * ~~~
 * - X: The range in pixels
 *
 * #### To disable damage popups on this enemy
 * ~~~
 * <noPopup>
 * ~~~
 *
 * #### To add an offset to the popup's y use:
 * ~~~
 * <popupOY:Y>
 * ~~~
 * - Y: The y offset in pixels, can be negative
 *
 * #### To keep the event around after it dies
 * ~~~
 * <dontErase>
 * ~~~
 *
 * #### To run some JS when the enemy dies
 * ~~~
 * <onDeath>
 * javascript code
 * </onDeath>
 * ~~~
 * 
 * #### To auto gain the enemies loot
 * ~~~
 * <autoLoot>
 * ~~~
 * ============================================================================
 * ## Disabling QABS
 * ============================================================================
 * You can disable the QABS or disable certain events with a plugin command.
 *
 * #### To disable the QABS for everything use the plugin command
 * ~~~
 * qabs disable
 * ~~~
 * 
 * #### To re-enable use the plugin command:
 * ~~~
 * qabs enable
 * ~~~
 *
 * #### To disable certain event(s) use the plugin command
 * ~~~
 * qabs disable [LIST OF CHARAIDS TO DISABLE]
 * ~~~
 * - CHARAID: The character identifier.
 *  * For events: EVENTID, eEVENTID, eventEVENTID or this for the event that
 *    called this (replace EVENTID with a number)
 *
 * Where each CHARAID is separated with a space. CHARAID can only be for events.
 *
 * #### Example:
 * ~~~
 * qabs disable event1 e2 4
 * ~~~
 * Will disable events 1, 2 and 4. Used different types of CHARAIDs as an example
 * but you can use whichever one you like
 *
 * #### To re-enable event(s) use the plugin command
 * ~~~
 * qabs enable [LIST OF CHARAIDS TO DISABLE]
 * ~~~
 *
 * **_Note_** that disabling ABS doesn't remove it from the event, it just "pauses"
 * it until it's re-enabled.
 * ============================================================================
 * ## States
 * ============================================================================
 * To have a state affect the characters move speed use:
 * ~~~
 * <moveSpeed:X>
 * ~~~
 * Set X to the value to modify the move speed by. Can be negative.
 *
 * To disable a characters actions, use the following notetag. When disabled
 * the character can't use any skills until the state is removed.
 * ~~~
 * <stun>
 * ~~~
 * ============================================================================
 * ## Popups
 * ============================================================================
 * All of the popups are powered with the QPopup plugin. If you want to change
 * any styles of the popups you can edit their presets in that plugins parameters
 * or using the plugin commands from the QPopup plugin.
 *
 * The following are the qPopup presets this ABS uses:
 * - QABS-LEVEL
 * - QABS-EXP
 * - QABS-ITEM
 * - QABS-MISSED
 * - QABS-DMG
 * - QABS-DMG-CRIT
 * - QABS-HEAL
 * - QABS-HEAL-CRIT
 * - QABS-MP
 * - QABS-MP-CRIT
 * 
 * ============================================================================
 * ## Showcase
 * ============================================================================
 * This section is for user created stuff. If you created a video, game, tutorial,
 * or an addon for QABS feel free to send me a link and I'll showcase it here!
 * ============================================================================
 * ## Links
 * ============================================================================
 * Formated Help:
 *
 *  https://quxios.github.io/#/plugins/QABS
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
 * @tags QM-Addon, ABS, Battle
 */
 /*~struct~SkillKey:
 * @param Keyboard Input
 * @desc Set to which keyboard input to use for this skill
 * @default
 *
 * @param Gamepad Input
 * @desc Set to which gamepad input to use for this skill
 * @default
 *
 * @param Rebind
 * @desc Can this skill be reassigned?
 * @type Boolean
 * @on Yes
 * @off No
 * @default true
 *
 * @param Skill Id
 * @desc Which skill does this skill use
 * @type skill
 * @default
 */
//=============================================================================
//=============================================================================
// QABS Static Class

function QABS() {
  throw new Error('This is a static class');
}

(function() {
  var _PARAMS = QPlus.getParams('<QABS>', {
    'Default Skills': []
  });

  QABS.quickTarget = _PARAMS['Quick Target'];
  QABS.lockTargeting = _PARAMS['Lock when Targeting'];
  QABS.towardsMouse = _PARAMS['Aim with Mouse'];
  QABS.towardsAnalog = _PARAMS['Aim with Analog']
  QABS.radianAtks = QMovement.offGrid;

  QABS.lootDecay = _PARAMS['Loot Decay'];
  QABS.aoeLoot = _PARAMS['AoE Loot'];
  QABS.lootTrigger = _PARAMS['Loot Touch Trigger'] ? 2 : 0;
  QABS.goldIcon = _PARAMS['Gold Icon'];
  QABS.levelAni = _PARAMS['Level Animation'];
  QABS.showDmg = _PARAMS['Show Damage'];

  QABS.mrst = _PARAMS['Move Resistance Rate Stat'];

  QABS.aiLength = _PARAMS['AI Default Sight Range'];
  QABS.aiWait = _PARAMS['AI Action Wait'];
  QABS.aiSight = _PARAMS['AI Uses QSight'];
  QABS.aiPathfind = _PARAMS['AI uses QPathfind'];

  QABS.getDefaultSkillKeys = function() {
    var obj = {};
    var skills = _PARAMS['Default Skills'];
    for (var i = 0; i < skills.length; i++) {
      var skill = skills[i];
      obj[i + 1] = {
        input: [skill['Keyboard Input'].trim(), skill['Gamepad Input'].trim()],
        rebind: skill.Rebind,
        skillId: skill['Skill Id']
      }
    }
    return obj;
  };

  QABS.skillKey = QABS.getDefaultSkillKeys();

  QABS.stringToSkillKeyObj = function(string) {
    var obj = QPlus.stringToObj(string);
    for (var key in obj) {
      var data = String(obj[key]).split(' ').filter(function(i) {
        return i !== '';
      }).map(function(i) {
        return i.trim();
      });
      var skillId = Number(data[0]) || 0;
      var rebind = data[1] === 'true';
      var msg;
      if (skillId && !$dataSkills[skillId]) {
        msg = 'ERROR: Attempted to apply a Skill Id that does not exist in database.\n';
        msg += 'Skill Key Number: ' + key;
        alert(msg);
        delete obj[key];
        continue;
      }
      if (!QABS.skillKey[key]) {
        msg = 'ERROR: Attempted to apply a skill key that has not been setup ';
        msg += 'in the plugin parameters.\n';
        msg += 'Skill Key Number: ' + key;
        alert(msg);
        delete obj[key];
        continue;
      }
      obj[key] = {
        input: QABS.skillKey[key].input.clone(),
        skillId: skillId,
        rebind: rebind
      }
    }
    return obj;
  };

  QABS._skillSettings = {};
  QABS.getSkillSettings = function(skill) {
    if (!this._skillSettings.hasOwnProperty(skill.id)) {
      var settings = skill.qmeta.absSettings;
      this._skillSettings[skill.id] = {
        cooldown: 0,
        through: 0,
        groundTarget: false,
        selectTarget: false,
        throughTerrain: []
      }
      if (settings) {
        // TODO change this, hate how it looks
        settings = QPlus.stringToObj(settings);
        Object.assign(settings, {
          cooldown: Number(settings.cooldown) || 0,
          through: Number(settings.through) || 0,
          groundTarget: settings.groundtarget && !settings.selecttarget,
          selectTarget: !settings.groundtarget && settings.selecttarget,
          throughTerrain: settings.throughTerrain || ''
        });
        if (settings.throughTerrain.constructor !== Array) {
          settings.throughTerrain = [settings.throughTerrain];
        }
        if (settings.groundtarget) var range = Number(settings.groundtarget);
        if (settings.selecttarget) var range = Number(settings.selecttarget);
        settings.range = range || 0;
        this._skillSettings[skill.id] = settings;
      }
    }
    return this._skillSettings[skill.id];
  };

  QABS._skillSequence = {};
  QABS.getSkillSequence = function(skill) {
    if (!this._skillSequence.hasOwnProperty(skill.id)) {
      var settings = skill.qmeta.absSequence;
      this._skillSequence[skill.id] = [];
      if (settings) {
        settings = settings.split('\n');
        var actions = [];
        for (var i = 0; i < settings.length; i++) {
          if (settings[i].trim() !== '') {
            actions.push(settings[i].trim());
          }
        }
        actions.push('collider hide');
        actions.push('user unlock');
        actions.push('user casting false');
        this._skillSequence[skill.id] = actions;
      }
    }
    return this._skillSequence[skill.id].clone();
  };

  QABS._skillOnDamage = {};
  QABS.getSkillOnDamage = function(skill) {
    if (!this._skillOnDamage.hasOwnProperty(skill.id)) {
      var settings = skill.qmeta.absOnDamage;
      var actions = [];
      actions.push('animation 0');
      if (settings) {
        settings = settings.split('\n');
        for (var i = 0; i < settings.length; i++) {
          if (settings[i].trim() !== '') {
            actions.push(settings[i].trim());
          }
        }
      }
      this._skillOnDamage[skill.id] = actions;
    }
    return this._skillOnDamage[skill.id].clone();
  };

  QABS._weaponSkills = {};
  QABS.weaponSkills = function(id) {
    if (!this._weaponSkills[id]) {
      var skills = $dataWeapons[id].qmeta.skillKeys || $dataWeapons[id].qmeta.absSkills;
      this._weaponSkills[id] = {};
      if (skills) {
        this._weaponSkills[id] = this.stringToSkillKeyObj(skills);
      }
    }
    return this._weaponSkills[id];
  };

  QABS._aiRange = {};
  QABS.getAIRange = function(skill) {
    if (!this._aiRange.hasOwnProperty(skill.id)) {
      this._aiRange[skill.id] = this.calcAIRange(skill);
    }
    return this._aiRange[skill.id];
  };

  QABS.calcAIRange = function(skill) {
    var settings = this.getSkillSettings(skill);
    if (settings.range) {
      return settings.range;
    }
    var actions = this.getSkillSequence(skill);
    var currDist = 0;
    var stored = 0;
    var maxDist = 0;
    actions.forEach(function(action) {
      var move = /^(?:move|wave) (.*)/i.exec(action);
      if (move) {
        move = move[1].trim().split(' ');
        if (move[0] === 'forward') {
          currDist += Number(move[1]) || 0;
        } else {
          currDist -= Number(move[1]) || 0;
        }
        maxDist = Math.max(currDist, maxDist);
      }
      var store = /^store/i.exec(action);
      if (store) {
        stored = currDist;
      }
      var toStore = /^(?:move|wave)ToStored/i.exec(action);
      if (toStore) {
        currDist = stored;
        maxDist = Math.max(currDist, maxDist);
      }
      var userForce = /^user forceSkill (.*)/i.exec(action);
      if (userForce) {
        userForce = Number(userForce[1].trim().split(' ')[0]);
        var dist2 = QABS.getAIRange($dataSkills[userForce]);
        maxDist = Math.max(dist2, maxDist);
      }
      var skillForce = /^forceSkill (.*)/i.exec(action);
      if (skillForce) {
        skillForce = Number(skillForce[1].trim().split(' ')[0]);
        var dist3 = QABS.getAIRange($dataSkills[skillForce]);
        dist3 += currDist;
        maxDist = Math.max(dist3, maxDist);
      }
    });
    return maxDist;
  };

})();

//-----------------------------------------------------------------------------
// QABS Manager Static Class

function QABSManager() {
  throw new Error('This is a static class');
}

(function() {
  QABSManager.clear = function() {
    this._animations = [];
    this._pictures = [];
    this._mapId = $gameMap._mapId;
  };

  QABSManager.getTargets = function(item, self) {
    return ColliderManager.getCharactersNear(item.collider, function(chara) {
      if (typeof chara.battler !== 'function' || !chara.battler()) return false;
      if (chara.battler().isDeathStateAffected()) return false;
      if (chara.isFriendly(self) && [1, 2, 3, 4, 5, 6].contains(item.data.scope)) {
        return false;
      }
      if (!chara.isFriendly(self) && [7, 8, 9, 10].contains(item.data.scope)) {
        return false;
      }
      if (item.data.scope === 11 && chara !== self) return false;
      var type = item.settings.collides || 'collision';
      return item.collider.intersects(chara.collider(type));
    });
  };

  QABSManager.bestAction = function(userId) {
    var chara = QPlus.getCharacter(userId);
    if (!chara.battler()) return null;
    var targets;
    var skills = chara.usableSkills().filter(function(skillId) {
      if (!skillId) return false;
      targets = QABSManager.skillWillHit(skillId, userId);
      if (targets && targets.length > 0) {
        return true;
      }
      return false;
    })
    if (skills.length === 0) return null;
    return skills[Math.floor(Math.random() * skills.length)];
  };

  QABSManager.skillWillHit = function(skillId, userId) {
    var skill = $dataSkills[skillId];
    var chara = QPlus.getCharacter(userId);
    var settings = QABS.getSkillSettings(skill);
    var collider = chara.collider('collision');
    var skillCollider = chara.makeSkillCollider(settings);
    var w1 = settings.collider[1] || chara.collider('collision').width;
    var h1 = settings.collider[2] || chara.collider('collision').height;
    var x1 = chara.cx() - w1 / 2;
    var y1 = chara.cy() - h1 / 2;
    var targets = [];
    var aiRange = QABS.getAIRange(skill);
    if (aiRange > 0) {
      var r1 = aiRange * 2;
      range = new Circle_Collider(w1 + r1, h1 + r1);
      range.moveTo(x1 - r1 / 2, y1 - r1 / 2);
      targets = this.getTargets({
        settings: settings,
        data: skill,
        collider: range
      }, chara);
      ColliderManager.draw(range, QABS.aiWait / 2);
    } else {
      targets = this.getTargets({
        settings: settings,
        data: skill,
        collider: skillCollider
      }, chara);
      ColliderManager.draw(skillCollider, QABS.aiWait / 2);
    }
    return targets;
  };

  QABSManager.startAction = function(self, targets, item) {
    if (!item.animationTarget || targets.length === 0) {
      this.startAnimation(item.data.animationId, item.collider.center.x, item.collider.center.y);
    }
    for (var i = 0; i < targets.length; i++) {
      if (item.animationTarget === 1) {
        var x = targets[i].cx();
        var y = targets[i].cy();
        this.startAnimation(item.data.animationId, x, y);
      }
      var action = new Game_Action(self.battler(), true);
      action.setSkill(item.data.id);
      action.absApply(targets[i].battler());
      targets[i].addAgro(self.charaId(), item.data);
    }
  };

  QABSManager.startPopup = function(type, options) {
    if (!Imported.QPopup) return;
    var preset = $gameSystem.qPopupPreset(type);
    Object.assign(options, {
      style: preset.style,
      transitions: preset.transitions
    })
    if (!options.duration) options.duration = 80;
    if (!options.transitions) {
      var start = options.duration - 30;
      var end = start + 30;
      var fadeout = start + ' 30 fadeout';
      var slideup = '0 ' + end + ' slideup 24';
      options.transitions = [fadeout, slideup];
    }
    return QPopup.start(options);
  };

  QABSManager._animations = [];
  QABSManager.startAnimation = function(id, x, y) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    if (id < 0) id = 1;
    if (id <= 0) return;
    var animation = $dataAnimations[id];
    var temp = new Sprite_MapAnimation(animation);
    temp.move(x, y);
    this._animations.push(temp);
    scene._spriteset._tilemap.addChild(temp);
  };

  QABSManager.removeAnimation = function(sprite) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    var i = this._animations.indexOf(sprite);
    if (i < 0) return;
    this._animations[i] = null;
    this._animations.splice(i, 1);
    scene._spriteset._tilemap.removeChild(sprite);
  };

  QABSManager._pictures = [];
  QABSManager.addPicture = function(sprite) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    this._pictures.push(sprite);
    scene._spriteset._tilemap.addChild(sprite);
  };

  QABSManager.removePicture = function(sprite) {
    var scene = SceneManager._scene;
    if (scene.constructor !== Scene_Map) return;
    var i = this._pictures.indexOf(sprite);
    if (i < 0) return;
    this._pictures[i] = null;
    this._pictures.splice(i, 1);
    scene._spriteset._tilemap.removeChild(sprite);
  };

  QABSManager.createItem = function(x, y, itemId, type) {
    var loot = new Game_Loot(x, y);
    var data = $dataItems;
    if (type === 1) data = $dataWeapons;
    if (type === 2) data = $dataArmors;
    loot.setItem(data[itemId]);
    return loot;
  };

  QABSManager.createGold = function(x, y, value) {
    var loot = new Game_Loot(x, y);
    loot.setGold(value);
    return loot;
  };

  QABSManager._freeEventIds = [];
  QABSManager.addEvent = function(event) {
    var id = this._freeEventIds.unshift() || 0;
    if (!id || $gameMap._events[id]) {
      id = $gameMap._events.length;
    }
    event._eventId = id;
    $gameMap._events[id] = event;
    if (!event._noSprite) {
      var scene = SceneManager._scene;
      if (scene === Scene_Map) {
        var spriteset = scene._spriteset;
        var sprite = new Sprite_Character(event);
        spriteset._characterSprites.push(sprite);
        spriteset._tilemap.addChild(sprite);
      }
    }
  };

  QABSManager.removeEvent = function(event) {
    var id = event._eventId;
    if (!id || !$gameMap._events[id]) return;
    event.removeColliders();
    if (!event._noSprite) {
      var scene = SceneManager._scene;
      if (scene === Scene_Map) {
        var spriteset = scene._spriteset;
        var spriteCharas = spriteset._characterSprites;
        for (var i = 0; i < spriteCharas.length; i++) {
          if (spriteCharas[i] && spriteCharas[i]._character === event) {
            spriteset._tilemap.removeChild(spriteCharas[i]);
            spriteCharas.splice(i, 1);
            break;
          }
        }
      }
    }
    $gameMap._events[id].clearABS();
    $gameMap._events[id] = null;
    this._freeEventIds.push(id);
  };

  QABSManager.preloadSkill = function(skill) {
    var aniId = skill.animationId;
    aniId = aniId < 0 ? 1 : aniId;
    var ani = $dataAnimations[aniId];
    if (ani) {
      ImageManager.loadAnimation(ani.animation1Name, ani.animation1Hue);
      ImageManager.loadAnimation(ani.animation2Name, ani.animation2Hue);
    }
    var sequence = QABS.getSkillSequence(skill);
    for (var i = 0; i < sequence.length; i++) {
      var action = sequence[i];
      var ani = /^animation (.*)/i.exec(action);
      var pic = /^picture (.*)/i.exec(action);
      var forced = /forceSkill (\d+)/i.exec(action);
      if (ani) {
        ani = ani[1].trim();
        ani = $dataAnimations[ani];
        if (ani) {
          ImageManager.loadAnimation(ani.animation1Name, ani.animation1Hue);
          ImageManager.loadAnimation(ani.animation2Name, ani.animation2Hue);
        }
      }
      if (pic) {
        pic = QPlus.makeArgs(pic[1])[0];
        ImageManager.loadPicture(pic);
      }
      if (forced) {
        var forcedSkill = $dataSkills[Number(forced[1])];
        if (forcedSkill) this.preloadSkill(forcedSkill);
      }
    }
  };
})();

//-----------------------------------------------------------------------------
// Skill_Sequencer

function Skill_Sequencer() {
  this.initialize.apply(this, arguments);
}

(function() {

  Skill_Sequencer.prototype.initialize = function(character, skill) {
    this._character = character;
    this._skill = skill;
  };

  Skill_Sequencer.prototype.startAction = function(action) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'user': {
        this.startUserAction(action);
        break;
      }
      case 'store': {
        this.actionStore();
        break;
      }
      case 'move': {
        this.actionMove(action);
        break;
      }
      case 'movetostored': {
        this.actionMoveToStored(action);
        break;
      }
      case 'wave': {
        this.actionWave(action);
        break;
      }
      case 'wavetostored': {
        this.actionWaveToStored(action);
        break;
      }
      case 'damage':
      case 'trigger': {
        this.actionTrigger(action);
        break;
      }
      case 'adjustaim': {
        this.actionAdjustAim(action);
        break;
      }
      case 'wait': {
        this.actionWait(action);
        break;
      }
      case 'picture': {
        this.actionPicture(action);
        break;
      }
      case 'trail': {
        this.actionTrail(action);
        break;
      }
      case 'collider': {
        this.actionCollider(action);
        break;
      }
      case 'animation': {
        this.actionAnimation(action);
        break;
      }
      case 'se': {
        this.actionSE(action);
        break;
      }
      case 'qaudio': {
        this.actionQAudio(action);
        break;
      }
      case 'forceskill': {
        this.actionForceSkill(action);
        break;
      }
      case 'globallock': {
        $gameMap.globalLock(null, 0, 1);
        break;
      }
      case 'globalunlock': {
        $gameMap.globalUnlock(null, 0, 0);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startUserAction = function(action) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'casting': {
        this.userCasting(action);
        break;
      }
      case 'lock': {
        this.userLock();
        break;
      }
      case 'unlock': {
        this.userUnlock();
        break;
      }
      case 'speed': {
        this.userSpeed(action);
        break;
      }
      case 'move': {
        this.userMove(action);
        break;
      }
      case 'movehere': {
        this.userMoveHere(action);
        break;
      }
      case 'jump': {
        this.userJump(action);
        break;
      }
      case 'jumphere': {
        this.userJumpHere(action);
        break;
      }
      case 'teleport': {
        this.userTeleport();
        break;
      }
      case 'setdirection': {
        this.userSetDirection(action);
        break;
      }
      case 'directionfix': {
        this.userDirectionFix(action);
        break;
      }
      case 'pose': {
        this.userPose(action);
        break;
      }
      case 'forceskill': {
        this.userForceSkill(action);
        break;
      }
      case 'animation': {
        this.userAnimation(action);
        break;
      }
      case 'qaudio': {
        this.userQAudio(action);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startOnDamageAction = function(action, targets) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'target': {
        this.startOnDamageTargetAction(action, targets);
        break;
      }
      case 'user': {
        this.startOnDamageUserAction(action, targets);
        break;
      }
      case 'animationtarget': {
        this._skill.animationTarget = Number(action[1]) || 0;
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startOnDamageTargetAction = function(action, targets) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'move': {
        this.targetMove(action, targets);
        break;
      }
      case 'jump': {
        this.targetJump(action, targets);
        break;
      }
      case 'pose': {
        this.targetPose(action, targets);
        break;
      }
      case 'cancel': {
        this.targetCancel(action, targets);
        break;
      }
      case 'qaudio': {
        this.targetQAudio(action, targets);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.startOnDamageUserAction = function(action, targets) {
    var cmd = action.shift().toLowerCase();
    switch (cmd) {
      case 'forceskill': {
        this.userForceSkill(action);
        break;
      }
    }
  };

  Skill_Sequencer.prototype.userCasting = function(action) {
    if (!this._skill.forced) {
      this._character._casting = action[0] === 'true' ? this._skill : false;
    }
  };

  Skill_Sequencer.prototype.userLock = function() {
    var i = this._character._skillLocked.indexOf(this._skill);
    if (i >= 0) return;
    this._character._skillLocked.push(this._skill);
  };

  Skill_Sequencer.prototype.userUnlock = function() {
    var i = this._character._skillLocked.indexOf(this._skill);
    if (i >= 0) {
      this._character._skillLocked.splice(i, 1);
    }
  };

  Skill_Sequencer.prototype.userSpeed = function(action) {
    var amt = Number(action[1]) || 1;
    var spd = this._character.moveSpeed();
    if (action[0] === 'inc') {
      this._character.setMoveSpeed(spd + amt);
    } else if (action[0] === 'dec') {
      this._character.setMoveSpeed(spd - amt);
    }
  };

  Skill_Sequencer.prototype.userMove = function(action) {
    var dist = Number(action[1]) || this._character.moveTiles();
    var route = {
      list: [],
      repeat: false,
      skippable: true,
      wait: false
    }
    var radian = oldRadian = this._character._radian;
    if (action[0] === 'backward') {
      radian -= Math.PI;
    }
    route.list.push({
      code: Game_Character.ROUTE_SCRIPT,
      parameters: ['qmove2(' + radian + ',' + dist + ')']
    });
    if (action[0] === 'backward') {
      route.list.unshift({
        code: Game_Character.ROUTE_DIR_FIX_OFF
      });
      route.list.push({
        code: this._character.isDirectionFixed() ?
          Game_Character.ROUTE_DIR_FIX_ON : Game_Character.ROUTE_DIR_FIX_OFF
      });
    }
    route.list.push({
      code: Game_Character.ROUTE_END
    });
    this._character.forceMoveRoute(route);
    this._character.updateRoutineMove();
    this._waitForUserMove = action[2] ? action[2] === 'true' : false;
  };

  Skill_Sequencer.prototype.userMoveHere = function(action) {
    var center = this._character.centerWithCollider(this._skill.collider);
    var final = this._character.adjustPosition(center.x, center.y);
    var dx = final.x - this._character.px;
    var dy = final.y - this._character.py;
    var radian = Math.atan2(dy, dx);
    var dist = Math.sqrt(dx * dx + dy * dy);
    var route = {
      list: [],
      repeat: false,
      skippable: true,
      wait: false
    }
    route.list.push({
      code: Game_Character.ROUTE_SCRIPT,
      parameters: ['qmove2(' + radian + ',' + dist + ')']
    });
    route.list.push({
      code: Game_Character.ROUTE_END
    });
    this._character.forceMoveRoute(route);
    this._character.updateRoutineMove();
    this._waitForUserMove = action[0] ? action[0] === 'true' : false;
  };

  Skill_Sequencer.prototype.userJump = function(action) {
    var dist = Number(action[1]) || 0;
    var x1 = this._character.px;
    var y1 = this._character.py;
    var radian = oldRadian = this._character._radian;
    if (action[0] === 'backward') {
      radian -= Math.PI;
    }
    var x2 = x1 + Math.cos(radian) * dist;
    var y2 = y1 + Math.sin(radian) * dist;
    var final = this._character.adjustPosition(x2, y2);
    var dx = final.x - x1;
    var dy = final.y - y1;
    var lastDirectionFix = this._character.isDirectionFixed();
    if (action[0] === 'backward') {
      this._character.setDirectionFix(true);
    }
    this._character.pixelJump(dx, dy);
    this._character.setDirectionFix(lastDirectionFix);
    this._character.setRadian(oldRadian);
    this._waitForUserJump = action[2] ? action[2] === 'true' : false;
  };

  Skill_Sequencer.prototype.userJumpHere = function(action) {
    var center = this._character.centerWithCollider(this._skill.collider);
    var final = this._character.adjustPosition(center.x, center.y);
    var dx = final.x - this._character.px;
    var dy = final.y - this._character.py;
    this._character.pixelJump(dx, dy);
    this._waitForUserJump = action[0] ? action[0] === 'true' : false;
  };

  Skill_Sequencer.prototype.userTeleport = function() {
    var x1 = this._skill.collider.x;
    var y1 = this._skill.collider.y;
    this._character.setPixelPosition(x1, y1);
  };

  Skill_Sequencer.prototype.userSetDirection = function(action) {
    var dir = Number(action[0]);
    if (dir) {
      this._character.setDirection(dir);
    }
  };

  Skill_Sequencer.prototype.userDirectionFix = function(action) {
    this._character.setDirectionFix(action[0] === 'true');
  };

  Skill_Sequencer.prototype.userPose = function(action) {
    if (Imported.QSprite) {
      this._character.playPose(action[0]);
      this._waitForUserPose = action[1] === 'true';
    }
  };

  Skill_Sequencer.prototype.userForceSkill = function(action) {
    var id = Number(action[0]);
    var angleOffset = Number(action[1]);
    var radian = this._character._radian;
    if (angleOffset) {
      radian += angleOffset * Math.PI / 180;
    }
    var skill = this._character.forceSkill(id, true);
    skill.radian = radian;
    skill._target = this._skill._target;
  };

  Skill_Sequencer.prototype.userAnimation = function(action) {
    var id = Number(action[0]);
    var x = this._character.cx();
    var y = this._character.cy();
    QABSManager.startAnimation(id, x, y);
  };

  Skill_Sequencer.prototype.userQAudio = function(action) {
    if (!Imported.QAudio) return;
    var id = Game_Interpreter.prototype.getUniqueQAudioId.call();
    var name = action[0];
    var loop = !!QPlus.getArg(action, /^loop$/i);
    var dontPan = !!QPlus.getArg(action, /^noPan$/i);
    var fadein = QPlus.getArg(action, /^fadein(\d+)/i);
    var type = QPlus.getArg(action, /^(bgm|bgs|me|se)$/i) || 'bgm';
    type = type.toLowerCase();
    var max = QPlus.getArg(action, /^max(\d+)/i);
    if (max === null) {
      max = 90;
    }
    max = Number(max) / 100;
    var radius = QPlus.getArg(action, /^radius(\d+)/i);
    if (radius === null) {
      radius = 5;
    }
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
      bindTo: this._character.charaId(),
      doPan: !dontPan,
      fadeIn: Number(fadein) || 0
    });
  };

  Skill_Sequencer.prototype.actionStore = function() {
    this._stored = new Point(this._skill.collider.x, this._skill.collider.y);
  };

  Skill_Sequencer.prototype.actionMove = function(action) {
    var dir = action[0];
    var distance = Number(action[1]);
    var duration = Number(action[2]);
    ColliderManager.draw(this._skill.collider, duration);
    var radian = this._skill.radian;
    if (dir === 'backward') {
      radian -= Math.PI;
    }
    radian += radian < 0 ? Math.PI * 2 : 0;
    this._waitForMove = action[3] === 'true';
    this.setSkillRadian(Number(radian));
    this.actionMoveSkill(distance, duration);
  };

  Skill_Sequencer.prototype.actionMoveToStored = function(action) {
    if (this._stored) {
      var x1 = this._skill.collider.x;
      var y1 = this._skill.collider.y;
      var x2 = this._stored.x;
      var y2 = this._stored.y;
      var dx = x2 - x1;
      var dy = y2 - y1;
      var dist = Math.sqrt(dx * dx + dy * dy);
      this._skill.radian = Math.atan2(y2 - y1, x2 - x1);
      this._skill.radian += this._skill.radian < 0 ? Math.PI * 2 : 0;
      this.actionMove(['forward', dist, action[0], action[1]]);
    }
  };

  Skill_Sequencer.prototype.actionWave = function(action) {
    var dir = action[0];
    var amp = Number(action[1]);
    var harm = Number(action[2]);
    var distance = Number(action[3]);
    var duration = Number(action[4]);
    ColliderManager.draw(this._skill.collider, duration);
    var radian = this._skill.radian;
    if (dir === 'backward') {
      radian -= Math.PI;
    }
    radian += radian < 0 ? Math.PI * 2 : 0;
    this.setSkillRadian(Number(radian));
    this.actionWaveSkill(amp, harm, distance, duration);
    this._waitForMove = action[5] === "true";
  };

  Skill_Sequencer.prototype.actionWaveToStored = function(action) {
    if (this._stored) {
      var x1 = this._skill.collider.x;
      var y1 = this._skill.collider.y;
      var x2 = this._stored.x;
      var y2 = this._stored.y;
      var dx = x2 - x1;
      var dy = y2 - y1;
      var dist = Math.sqrt(dx * dx + dy * dy);
      this._skill.radian = Math.atan2(dy, dx);
      this.actionWave(['forward', action[0], action[1], dist, action[2], action[3]]);
    }
  };

  Skill_Sequencer.prototype.actionTrigger = function() {
    this._skill.targets = QABSManager.getTargets(this._skill, this._character);
    this.updateSkillDamage();
  };

  Skill_Sequencer.prototype.actionAdjustAim = function() {
    if (!this._skill._target) return;
    var x1 = this._skill.collider.x;
    var y1 = this._skill.collider.y;
    var forward = this._skill._target.forwardV();
    var dt = Math.randomInt(5) || 1;
    var x2 = this._skill._target.px + forward.x * dt;
    var y2 = this._skill._target.py + forward.y * dt;
    var dx = x2 - x1;
    var dy = y2 - y1;
    this._skill.radian = Math.atan2(dy, dx);
  };

  Skill_Sequencer.prototype.actionWait = function(action) {
    var duration = Number(action[0]);
    ColliderManager.draw(this._skill.collider, duration);
    this._waitCount = duration;
  };

  Skill_Sequencer.prototype.actionPicture = function(action) {
    this._skill.picture = new Sprite_SkillPicture();
    this._skill.picture.bitmap = ImageManager.loadPicture(action[0]);
    this._skill.picture.rotatable = action[1] === 'true';
    this._skill.picture.originDirection = Number(action[2]);
    this._skill.picture.z = 3;
    this._skill.picture.anchor.x = 0.5;
    this._skill.picture.anchor.y = 0.5;
    var isAnimated = /%\[(\d+)-(\d+)\]/.exec(action[0]);
    if (isAnimated) {
      var frames = Number(isAnimated[1]);
      var speed = Number(isAnimated[2]);
      this._skill.picture.setupAnim(frames, speed);
    }
    this.setSkillPictureRadian(this._skill.picture, this._skill.radian);
    var x = this._skill.collider.center.x;
    var y = this._skill.collider.center.y;
    this._skill.picture.move(x, y);
    this._skill.picture.bitmap.addLoadListener(function() {
      QABSManager.addPicture(this);
    }.bind(this._skill.picture));
  };

  Skill_Sequencer.prototype.actionTrail = function(action) {
    this._skill.trail = new Sprite_SkillTrail();
    this._skill.trail.bitmap = ImageManager.loadPicture(action[0]);
    this._skill.trail.move(0, 0, Graphics.width, Graphics.height);
    this._skill.trail.rotatable = action[1] === 'true';
    this._skill.trail.originDirection = Number(action[2]);
    this._skill.trail.z = 3;
    this.setSkillPictureRadian(this._skill.trail, this._skill.radian);
    var x = this._skill.collider.center.x;
    var y = this._skill.collider.center.y;
    this._skill.trail.startX = x;
    this._skill.trail.startY = y;
    this._skill.trail.bitmap.addLoadListener(function() {
      var w = this.bitmap.width;
      var h = this.bitmap.height;
      this.move(x, y, w, h);
      QABSManager.addPicture(this);
    }.bind(this._skill.trail));
  };

  Skill_Sequencer.prototype.actionCollider = function(action) {
    var display = action[0];
    if (display === 'show') {
      this._skill.pictureCollider = new Sprite_SkillCollider(this._skill.collider);
      QABSManager.addPicture(this._skill.pictureCollider);
    } else if (display === 'hide' && this._skill.pictureCollider) {
      QABSManager.removePicture(this._skill.pictureCollider);
      this._skill.pictureCollider = null;
    }
  };

  Skill_Sequencer.prototype.actionAnimation = function(action) {
    var id = Number(action[0]);
    var x = this._skill.collider.center.x;
    var y = this._skill.collider.center.y;
    QABSManager.startAnimation(id, x, y);
  };

  Skill_Sequencer.prototype.actionSE = function(action) {
    var se = {};
    se.name = action[0];
    se.volume = Number(action[1]) || 90;
    se.pitch = Number(action[2]) || 100;
    se.pan = Number(action[3]) || 0;
    AudioManager.playSe(se);
  };

  Skill_Sequencer.prototype.actionQAudio = function(action) {
    if (!Imported.QAudio) return;
    var x = this._skill.collider.center.x;
    var y = this._skill.collider.center.x;
    var id = Game_Interpreter.prototype.getUniqueQAudioId.call();
    var name = action[0];
    var loop = !!QPlus.getArg(action, /^loop$/i);
    var dontPan = !!QPlus.getArg(action, /^noPan$/i);
    var fadein = QPlus.getArg(action, /^fadein(\d+)/i);
    var type = QPlus.getArg(action, /^(bgm|bgs|me|se)$/i) || 'bgm';
    type = type.toLowerCase();
    var max = QPlus.getArg(action, /^max(\d+)/i);
    if (max === null) {
      max = 90;
    }
    max = Number(max) / 100;
    var radius = QPlus.getArg(action, /^radius(\d+)/i);
    if (radius === null) {
      radius = 5;
    }
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
      x: x / QMovement.tileSize,
      y: y / QMovement.tileSize,
      doPan: !dontPan,
      fadeIn: Number(fadein) || 0
    });
  };

  Skill_Sequencer.prototype.actionForceSkill = function(action) {
    var id = Number(action[0]);
    var angleOffset = Number(action[1]);
    var radian = this._skill.radian;
    if (angleOffset) {
      radian += angleOffset * Math.PI / 180;
    }
    var center = this._skill.collider.center;
    var skill = this._character.makeSkill(id);
    var w = skill.collider.width;
    var h = skill.collider.height;
    skill.collider.moveTo(center.x - w / 2, center.y - w / 2);
    skill.radian = radian;
    skill._target = this._skill._target;
    this._character._activeSkills.push(skill);
    this._character._skillCooldowns[id] = skill.settings.cooldown;
  };

  Skill_Sequencer.prototype.actionMoveSkill = function(distance, duration) {
    var instant = duration === 0;
    if (duration <= 0) duration = 1;
    this._skill.newX = this._skill.collider.x + Math.round(distance * Math.cos(this._skill.radian));
    this._skill.newY = this._skill.collider.y + Math.round(distance * Math.sin(this._skill.radian));
    this._skill.speed = Math.abs(distance / duration);
    this._skill.speedX = Math.abs(this._skill.speed * Math.cos(this._skill.radian));
    this._skill.speedY = Math.abs(this._skill.speed * Math.sin(this._skill.radian));
    this._skill.moving = true;
    if (instant) {
      this.updateSkillPosition();
    }
  };

  Skill_Sequencer.prototype.actionWaveSkill = function(amp, harmonics, distance, duration) {
    this._skill.amp = amp;
    this._skill.distance = distance;
    this._skill.waveLength = harmonics * Math.PI;
    this._skill.waveSpeed = this._skill.waveLength / duration;
    this._skill.theta = 0;
    this._skill.xi = this._skill.collider.x;
    this._skill.yi = this._skill.collider.y;
    this._skill.waving = true;
    this._skill.moving = true;
  };

  Skill_Sequencer.prototype.targetMove = function(action, targets) {
    var dist = Number(action[1]) || this._character.moveTiles();
    for (var i = 0; i < targets.length; i++) {
      var dist2 = dist - dist * eval('targets[i].battler().' + QABS.mrst);
      if (dist2 <= 0) return;
      var dx = targets[i].cx() - this._character.cx();
      var dy = targets[i].cy() - this._character.cy();
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? Math.PI * 2 : 0;
      if (action[0] === 'towards') {
        radian += Math.PI;
      } else if (action[0] === 'into' || action[0] === 'towardsSkill') {
        var dxi = this._skill.collider.center.x - targets[i].cx();
        var dyi = this._skill.collider.center.y - targets[i].cy();
        radian = Math.atan2(dyi, dxi);
        dist2 = Math.min(dist2, Math.sqrt(dxi * dxi + dyi * dyi));
      } else if (action[0] === 'awayFromSkill') {
        var dxi = targets[i].cx() - this._skill.collider.center.x;
        var dyi = targets[i].cy() - this._skill.collider.center.y;
        radian = Math.atan2(dyi, dxi);
      }
      var route = {
        list: [],
        repeat: false,
        skippable: true,
        wait: false
      }
      route.list.push({
        code: Game_Character.ROUTE_DIR_FIX_ON
      });
      route.list.push({
        code: Game_Character.ROUTE_SCRIPT,
        parameters: ['qmove2(' + radian + ',' + dist + ')']
      });
      if (!targets[i].isDirectionFixed()) {
        route.list.push({
          code: Game_Character.ROUTE_DIR_FIX_OFF
        });
      }
      route.list.push({
        code: Game_Character.ROUTE_SCRIPT,
        parameters: ['this.setRadian(' + targets[i]._radian + ')']
      });
      route.list.push({
        code: Game_Character.ROUTE_END
      });
      targets[i].forceMoveRoute(route);
      targets[i].updateRoutineMove();
    }
  };

  Skill_Sequencer.prototype.targetJump = function(action, targets) {
    var dist = Number(action[1]) || 0;
    for (var i = 0; i < targets.length; i++) {
      var dist2 = dist - dist * eval('targets[i].battler().' + QABS.mrst);
      if (dist2 <= 0) return;
      var dx = targets[i].cx() - this._character.cx();
      var dy = targets[i].cy() - this._character.cy();
      var radian = Math.atan2(dy, dx);
      radian += radian < 0 ? Math.PI * 2 : 0;
      if (action[0] === 'towards') {
        radian += Math.PI;
      } else if (action[0] === 'into' || action[0] === 'towardsSkill') {
        var dxi = this._skill.collider.center.x - targets[i].cx();
        var dyi = this._skill.collider.center.y - targets[i].cy();
        radian = Math.atan2(dyi, dxi);
        dist2 = Math.min(dist2, Math.sqrt(dxi * dxi + dyi * dyi));
      } else if (action[0] === 'awayFromSkill') {
        var dxi = targets[i].cx() - this._skill.collider.center.x;
        var dyi = targets[i].cy() - this._skill.collider.center.y;
        radian = Math.atan2(dyi, dxi);
        dist2 = Math.min(dist2, Math.sqrt(dxi * dxi + dyi * dyi));
      }
      var x1 = targets[i].px;
      var y1 = targets[i].py;
      var x2 = x1 + Math.round(dist2 * Math.cos(radian));
      var y2 = y1 + Math.round(dist2 * Math.sin(radian));
      var final = targets[i].adjustPosition(x2, y2);
      dx = final.x - x1;
      dy = final.y - y1;
      var lastDirectionFix = targets[i].isDirectionFixed();
      var prevRadian = targets[i]._radian;
      targets[i].setDirectionFix(true);
      targets[i].pixelJump(dx, dy);
      targets[i].setDirectionFix(lastDirectionFix);
      targets[i].setRadian(prevRadian);
    }
  };

  Skill_Sequencer.prototype.targetPose = function(action, targets) {
    var pose = action[0];
    if (Imported.QSprite) {
      for (var i = 0; i < targets.length; i++) {
        targets[i].playPose(pose);
      }
    }
  };

  Skill_Sequencer.prototype.targetCancel = function(action, targets) {
    for (var i = 0; i < targets.length; i++) {
      if (targets[i]._casting) {
        targets[i]._casting.break = true;
      }
    }
  };

  Skill_Sequencer.prototype.targetQAudio = function(action, targets) {
    if (!Imported.QAudio) return;
    var id = Game_Interpreter.prototype.getUniqueQAudioId.call();
    var name = action[0];
    var loop = !!QPlus.getArg(action, /^loop$/i);
    var dontPan = !!QPlus.getArg(action, /^noPan$/i);
    var fadein = QPlus.getArg(action, /^fadein(\d+)/i);
    var type = QPlus.getArg(action, /^(bgm|bgs|me|se)$/i) || 'bgm';
    type = type.toLowerCase();
    var max = QPlus.getArg(action, /^max(\d+)/i);
    if (max === null) {
      max = 90;
    }
    max = Number(max) / 100;
    var radius = QPlus.getArg(action, /^radius(\d+)/i);
    if (radius === null) {
      radius = 5;
    }
    var audio = {
      name: name,
      volume: 100,
      pitch: 0,
      pan: 0
    }
    for (var i = 0; i < targets.length; i++) {
      AudioManager.playQAudio(id, audio, {
        type: type,
        loop: loop,
        maxVolume: Number(max),
        radius: Number(radius),
        bindTo: targets[i].charaId(),
        doPan: !dontPan,
        fadeIn: Number(fadein) || 0
      });
    };
  };

  Skill_Sequencer.prototype.setSkillRadian = function(radian) {
    var rotate = this._skill.settings.rotate === true;
    this._skill.radian = radian;
    this._skill.collider.setRadian(Math.PI / 2 + radian);
    if (this._skill.picture) {
      this.setSkillPictureRadian(this._skill.picture, this._skill.radian);
    }
  };

  Skill_Sequencer.prototype.setSkillPictureRadian = function(picture, radian) {
    if (!picture.rotatable) return;
    var originDirection = picture.originDirection;
    var originRadian = this._character.directionToRadian(originDirection);
    picture.rotation = originRadian + radian;
  };

  Skill_Sequencer.prototype.canSkillMove = function() {
    var collided = false;
    var through = this._skill.settings.through;
    var targets = QABSManager.getTargets(this._skill, this._character);
    if (targets.length > 0) {
      for (var i = targets.length - 1; i >= 0; i--) {
        if (!this._skill.targetsHit.contains(targets[i].charaId())) {
          this._skill.targetsHit.push(targets[i].charaId());
        } else {
          targets.splice(i, 1);
        }
      }
      if (targets.length > 0) {
        this._skill.targets = targets;
        if (through === 1 || through === 3) {
          collided = true;
          // TODO select the nearest target
          this._skill.targets = [targets[0]];
        }
        this.updateSkillDamage();
      }
    }
    if (collided) return false;
    var edge = this._skill.collider.gridEdge();
    var maxW = $gameMap.width();
    var maxH = $gameMap.height();
    if (!$gameMap.isLoopHorizontal()) {
      if (edge.x2 < 0 || edge.x1 >= maxW) return false;
    }
    if (!$gameMap.isLoopVertical()) {
      if (edge.y2 < 0 || edge.y1 >= maxH) return false;
    }
    if (through === 2 || through === 3) {
      ColliderManager.getCollidersNear(this._skill.collider, function(collider) {
        if (collider === this.collider) return false;
        if (this.settings.throughTerrain.contains(collider.terrain)) {
          return false;
        }
        if (this.collider.intersects(collider)) {
          collided = true;
          return 'break';
        }
      }.bind(this._skill));
    }
    if (through === 1 || through === 3) {
      ColliderManager.getCharactersNear(this._skill.collider, function(chara) {
        if (chara === this._character || chara.isThrough() || !chara.isNormalPriority()) return false;
        if (chara.isLoot || chara._erased || chara.isDead) return false;
        if (this._skill.collider.intersects(chara.collider('collision'))) {
          collided = true;
          return 'break';
        }
      }.bind(this));
    }
    return !collided;
  };

  Skill_Sequencer.prototype.isWaiting = function() {
    return this._waitCount > 0 || this._waitForMove ||
      this._waitForUserMove || this._waitForUserJump ||
      this._waitForUserJump || this._waitForUserPose;
  };

  Skill_Sequencer.prototype.onBreak = function() {
    var i = this._character._skillLocked.indexOf(this._skill);
    if (i >= 0) {
      this._character._skillLocked.splice(i, 1);
    }
    this._character._casting = false;
    this.onEnd();
  };

  Skill_Sequencer.prototype.onEnd = function() {
    this._skill.collider.kill = true;
    QABSManager.removePicture(this._skill.picture);
    QABSManager.removePicture(this._skill.trail);
    QABSManager.removePicture(this._skill.pictureCollider);
    var i = this._character._activeSkills.indexOf(this._skill);
    this._character._activeSkills.splice(i, 1);
  };

  Skill_Sequencer.prototype.update = function() {
    if (this._skill.break || this._character.battler().isStunned()) {
      return this.onBreak();
    }
    if (this._skill.moving) {
      this.updateSkillPosition();
    }
    if (!this.isWaiting()) {
      this.updateSequence();
    } else {
      this.updateWait();
    }
  };

  Skill_Sequencer.prototype.updateWait = function() {
    if (this._waitCount > 0) {
      this._waitCount--;
    }
    if (this._waitForUserMove && !this._character.isMoving()) {
      this._waitForUserMove = false;
    }
    if (this._waitForUserJump && !this._character.isJumping()) {
      this._waitForUserJump = false;
    }
    if (this._waitForUserPose && !this._character._posePlaying) {
      this._waitForUserPose = false;
    }
  };

  Skill_Sequencer.prototype.updateSequence = function() {
    var sequence = this._skill.sequence;
    while (sequence.length !== 0) {
      var action = QPlus.makeArgs(sequence.shift());
      this.startAction(action);
      if (this.isWaiting()) {
        break;
      }
    }
    if (this._skill.sequence.length === 0 && !this._skill.moving) {
      return this.onEnd();
    }
  };

  Skill_Sequencer.prototype.updateSkillDamage = function() {
    var targets = this._skill.targets;
    for (var i = 0; i < this._skill.ondmg.length; i++) {
      var action = this._skill.ondmg[i].split(' ');
      this.startOnDamageAction(action, targets);
    }
    QABSManager.startAction(this._character, targets, this._skill);
  };

  Skill_Sequencer.prototype.updateSkillPosition = function() {
    if (this._skill.waving) {
      return this.updateSkillWavePosition();
    }
    var collider = this._skill.collider;
    var x1 = collider.x;
    var x2 = this._skill.newX;
    var y1 = collider.y;
    var y2 = this._skill.newY;
    if (x1 < x2) x1 = Math.min(x1 + this._skill.speedX, x2);
    if (x1 > x2) x1 = Math.max(x1 - this._skill.speedX, x2);
    if (y1 < y2) y1 = Math.min(y1 + this._skill.speedY, y2);
    if (y1 > y2) y1 = Math.max(y1 - this._skill.speedY, y2);
    collider.moveTo(x1, y1);
    var x3 = collider.center.x;
    var y3 = collider.center.y;
    if (this._skill.picture) {
      this._skill.picture.move(x3, y3);
    }
    if (this._skill.trail) {
      var x4 = this._skill.trail.startX;
      var y4 = this._skill.trail.startY;
      var x5 = x4 - x3;
      var y5 = y4 - y3;
      var dist = Math.sqrt(x5 * x5 + y5 * y5);
      var radian = this._skill.trail.rotation;
      var w = this._skill.trail.bitmap.width;
      var h = this._skill.trail.bitmap.height;
      var ox = w * Math.sin(radian);
      var oy = (h / 2) * -Math.cos(radian);
      x4 += dist * -Math.cos(radian) + ox;
      y4 += dist * -Math.sin(radian) + oy;
      this._skill.trail.move(x4, y4, dist, h);
    }
    if (!this.canSkillMove() || (x1 === x2 && y1 === y2)) {
      this._skill.targetsHit = [];
      this._skill.moving = false;
      this._waitForMove = false;
    }
  };

  Skill_Sequencer.prototype.updateSkillWavePosition = function() {
    var collider = this._skill.collider;
    var x1 = this._skill.xi;
    var y1 = this._skill.yi;
    var x2 = (this._skill.theta / this._skill.waveLength * this._skill.distance);
    var y2 = this._skill.amp * -Math.sin(this._skill.theta);
    var h = Math.sqrt(y2 * y2 + x2 * x2);
    var radian = Math.atan2(y2, x2);
    radian += this._skill.radian;
    var x3 = h * Math.cos(radian);
    var y3 = h * Math.sin(radian);
    collider.moveTo(x1 + x3, y1 + y3);
    var x4 = collider.center.x;
    var y4 = collider.center.y;
    if (this._skill.picture) {
      this._skill.picture.move(x4, y4);
    }
    if (!this.canSkillMove() || this._skill.theta >= this._skill.waveLength) {
      this._skill.targetsHit = [];
      this._skill.waving = false;
      this._skill.moving = false;
      this._waitForMove = false;
    }
    this._skill.theta += this._skill.waveSpeed;
  };

})();

//-----------------------------------------------------------------------------
// Game_Interpreter

(function() {
  var Alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    if (command.toLowerCase() === 'qabs') {
      return this.qABSCommand(QPlus.makeArgs(args));
    }
    Alias_Game_Interpreter_pluginCommand.call(this, command, args);
  };

  Game_Interpreter.prototype.qABSCommand = function(args) {
    var cmd = args.shift().toLowerCase();
    if (cmd === 'disable' || cmd === 'enable') {
      if (args.length === 0) {
        $gameSystem._absEnabled = cmd === 'enable';
      } else {
        for (var i = 0; i < args.length; i++) {
          var chara = QPlus.getCharacter(args[i]);
          if (chara.constructor === Game_Event) {
            var id = chara.eventId();
            var mapId = chara._mapId;
            if (cmd === 'enable') {
              $gameSystem.enableEnemy(mapId, id);
            } else {
              $gameSystem.disableEnemy(mapId, id);
            }
          }
        }
      }
      return;
    }
    if (cmd === 'override') {
      var key = Number(args.shift());
      var skillId = Number(args.shift());
      if (skillId === -1) {
        skillId = null;
      }
      $gameSystem.changeABSOverrideSkill(key, skillId);
      return;
    }
  };
})();

//-----------------------------------------------------------------------------
// Game_System

(function() {
  var Alias_Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    Alias_Game_System_initialize.call(this);
    this._absKeys = QABS.getDefaultSkillKeys();
    this._absClassKeys = {};
    this._absWeaponKeys = {};
    this._absOverrideKeys = {};
    this._absEnabled = true;
    this._disabledEnemies = {};
    this.checkAbsMouse();
  };

  Game_System.prototype.disableEnemy = function(mapId, eventId) {
    if (!this._disabledEnemies[mapId]) {
      this._disabledEnemies[mapId] = [];
    }
    this._disabledEnemies[mapId][eventId] = true;
  };

  Game_System.prototype.enableEnemy = function(mapId, eventId) {
    if (!this._disabledEnemies[mapId]) {
      this._disabledEnemies[mapId] = [];
    }
    this._disabledEnemies[mapId][eventId] = false;
  };

  Game_System.prototype.isDisabled = function(mapId, eventId) {
    if (!this._disabledEnemies[mapId]) {
      return false;
    }
    return this._disabledEnemies[mapId][eventId] || !this._absEnabled;
  };

  Game_System.prototype.loadClassABSKeys = function() {
    if (!$gameParty.leader()) return;
    var playerClass = $gameParty.leader().currentClass();
    var classKeys = /<skillKeys>([\s\S]*)<\/skillKeys>/i.exec(playerClass.note);
    if (classKeys && classKeys[1].trim() !== '') {
      this._absClassKeys = QABS.stringToSkillKeyObj(classKeys[1]);
      this.resetABSKeys();
    }
  };

  Game_System.prototype.resetABSKeys = function() {
    this._absKeys = QABS.getDefaultSkillKeys();
    for (var key in this._absKeys) {
      Object.assign(
        this._absKeys[key],
        this._absClassKeys[key] || {},
        this._absWeaponKeys[key] || {},
        this._absOverrideKeys[key] || {}
      );
    }
    this.preloadAllSkills();
    this.checkAbsMouse();
  };

  Game_System.prototype.absKeys = function() {
    return this._absKeys;
  };
  Game_System.prototype.changeABSOverrideSkill = function(skillNumber, skillId, forced) {
    var absKeys = this.absKeys();
    var override = this._absOverrideKeys;
    if (!absKeys[skillNumber]) return;
    if (!forced && !absKeys[skillNumber].rebind) return;
    if (!override[skillNumber]) {
      override[skillNumber] = {};
    }
    if (skillId !== null) {
      if (skillId > 0) {
        for (var key in absKeys) {
          if (absKeys[key].skillId === skillId) {
            if (!override[key]) {
              override[key] = {};
            }
            override[key].skillId = null;
          }
        }
      }
      override[skillNumber].skillId = skillId;
    } else {
      delete override[skillNumber].skillId;
    }
    this.resetABSKeys();
  };

  Game_System.prototype.changeABSWeaponSkills = function(skillSet) {
    this._absWeaponKeys = skillSet;
    this.resetABSKeys();
  };

  Game_System.prototype.changeABSSkillInput = function(skillNumber, input) {
    var absKeys = this.absKeys();
    var override = this._absOverrideKeys;
    if (!absKeys[skillNumber]) return;
    if (!override[skillNumber]) {
      override[skillNumber] = {};
    }
    for (var key in absKeys) {
      var i = absKeys[key].input.indexOf(input);
      if (i !== -1) {
        if (!override[key]) {
          override[key] = {
            input: absKeys[key].input.clone()
          };
        }
        override[key].input.splice(i, 1);
        break;
      }
    }
    var i = /^\$/.test(input) ? 1 : 0;
    override[skillNumber].input[i] = input;
    this.checkAbsMouse();
  };

  Game_System.prototype.preloadAllSkills = function() {
    var absKeys = this.absKeys();
    for (var key in absKeys) {
      var skill = $dataSkills[absKeys[key].skillId];
      if (skill) QABSManager.preloadSkill(skill);
    }
  };

  Game_System.prototype.anyAbsMouse = function() {
    return this._absMouse1;
  };

  Game_System.prototype.anyAbsMouse2 = function() {
    return this._absMouse2;
  };

  Game_System.prototype.checkAbsMouse = function() {
    this._absMouse1 = false;
    this._absMouse2 = false;
    var keys = this.absKeys();
    for (var key in keys) {
      if (keys[key].input[0] === 'mouse1') {
        this._absMouse1 = true;
      }
      if (keys[key].input[0] === 'mouse2') {
        this._absMouse2 = true;
      }
    }
  };

  var Alias_Game_System_onBeforeSave = Game_System.prototype.onBeforeSave;
  Game_System.prototype.onBeforeSave = function() {
    Alias_Game_System_onBeforeSave.call(this);
    $gameMap.compressBattlers();
    QABS._needsUncompress = true;
  };

  var Alias_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
  Game_System.prototype.onAfterLoad = function() {
    Alias_Game_System_onAfterLoad.call(this);
    QABS._needsUncompress = true;
  };
})();

//-----------------------------------------------------------------------------
// Game_Map

(function() {
  var Alias_Game_Map_setup = Game_Map.prototype.setup;
  Game_Map.prototype.setup = function(mapId) {
    Alias_Game_Map_setup.call(this, mapId);
    if (mapId !== QABSManager._mapId) {
      QABSManager.clear();
    }
  };

  var Alias_Game_Map_update = Game_Map.prototype.update;
  Game_Map.prototype.update = function(sceneActive) {
    Alias_Game_Map_update.call(this, sceneActive);
    if (QABS._needsUncompress) {
      this.uncompressBattlers();
      QABS._needsUncompress = false;
    }
  };

  Game_Map.prototype.compressBattlers = function() {
    for (var i = 0; i < this.events().length; i++) {
      if (this.events()[i]._battler) {
        var oldRespawn = this.events()[i]._respawn;
        this.events()[i].clearABS();
        this.events()[i]._battler = null;
        this.events()[i]._respawn = oldRespawn;
      }
      if (this.events()[i].constructor === Game_Loot) {
        QABSManager.removePicture(this.events()[i]._itemIcon);
        QABSManager.removeEvent(this.events()[i]);
      }
    }
    $gamePlayer.clearABS();
    QABSManager.clear();
  };

  Game_Map.prototype.uncompressBattlers = function() {
    for (var i = 0; i < this.events().length; i++) {
      if (this.events()[i]._respawn >= 0) {
        var wasDead = true;
        var oldRespawn = this.events()[i]._respawn;
      }
      this.events()[i].setupBattler();
      if (wasDead) {
        this.events()[i].clearABS();
        this.events()[i]._battler = null;
        this.events()[i]._respawn = oldRespawn;
      }
    }
    // TODO setup player?
  };


})();

//-----------------------------------------------------------------------------
// Game_Action

(function() {
  var Alias_Game_Action_setSubject = Game_Action.prototype.setSubject;
  Game_Action.prototype.setSubject = function(subject) {
    Alias_Game_Action_setSubject.call(this, subject);
    this._realSubject = subject;
  };

  var Alias_Game_Action_subject = Game_Action.prototype.subject;
  Game_Action.prototype.subject = function() {
    if (this._isAbs) return this._realSubject;
    return Alias_Game_Action_subject.call(this);
  };

  Game_Action.prototype.absApply = function(target) {
    this._isAbs = true;
    var result = target.result();
    this._realSubject.clearResult();
    result.clear();
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (this.item().damage.type > 0) {
      result.critical = (Math.random() < this.itemCri(target));
      var value = this.makeDamageValue(target, result.critical);
      this.executeDamage(target, value);
      target.startDamagePopup();
    }
    this.item().effects.forEach(function(effect) {
      this.applyItemEffect(target, effect);
    }, this);
    this.applyItemUserEffect(target);
    this.applyGlobal();
    this._isAbs = false;
  };

  var Alias_Game_ActionResult_clear = Game_ActionResult.prototype.clear;
  Game_ActionResult.prototype.clear = function() {
    Alias_Game_ActionResult_clear.call(this);
    this.damageIcon = null;
  };
})();

//-----------------------------------------------------------------------------
// Game_BattlerBase

(function() {
  var Alias_Game_BattlerBase_resetStateCounts = Game_BattlerBase.prototype.resetStateCounts;
  Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    Alias_Game_BattlerBase_resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove || 0;
  };

  var Alias_Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
  Game_BattlerBase.prototype.addNewState = function(stateId) {
    Alias_Game_BattlerBase_addNewState.call(this, stateId);
    if ($dataStates[stateId].meta.moveSpeed) {
      this._moveSpeed += Number($dataStates[stateId].meta.moveSpeed) || 0;
    }
    if ($dataStates[stateId].meta.stun) {
      this._isStunned++;
    }
  };
})();

//-----------------------------------------------------------------------------
// Game_Battler

(function() {
  var Alias_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
  Game_Battler.prototype.initMembers = function() {
    Alias_Game_Battler_initMembers.call(this);
    this._isStunned = 0;
    this._moveSpeed = 0;
    this._damageQueue = [];
  };

  var Alias_Game_Battler_startDamagePopup = Game_Battler.prototype.startDamagePopup;
  Game_Battler.prototype.startDamagePopup = function() {
    this._damageQueue.push(Object.assign({}, this._result));
    Alias_Game_Battler_startDamagePopup.call(this);
  };

  Game_Battler.prototype.updateABS = function() {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
      this.updateStateSteps(states[i]);
    }
    //this.showAddedStates();   //Currently does nothing, so no need to run it
    //this.showRemovedStates(); //Currently does nothing, so no need to run it
  };

  Game_Battler.prototype.stepsForTurn = function() {
    return 60;
  };

  Game_Battler.prototype.updateStateSteps = function(state) {
    if (!state.removeByWalking) return;
    if (this._stateSteps[state.id] >= 0) {
      if (this._stateSteps[state.id] % this.stepsForTurn() === 0) {
        this.onTurnEnd();
        this.result().damageIcon = $dataStates[state.id].iconIndex;
        this.startDamagePopup();
        if (this._stateSteps[state.id] === 0) this.removeState(state.id);
      }
      this._stateSteps[state.id]--;
    }
  };

  Game_Battler.prototype.showAddedStates = function() {
    // TODO
    this.result().addedStateObjects().forEach(function(state) {
      // does nothing
    }, this);
  };

  Game_Battler.prototype.showRemovedStates = function() {
    // TODO
    this.result().removedStateObjects().forEach(function(state) {
      // Popup that state was removed?
    }, this);
  };

  var Alias_Game_Battler_removeState = Game_Battler.prototype.removeState;
  Game_Battler.prototype.removeState = function(stateId) {
    if (this.isStateAffected(stateId)) {
      if ($dataStates[stateId].meta.moveSpeed) {
        this._moveSpeed -= Number($dataStates[stateId].meta.moveSpeed) || 0;
      }
      if ($dataStates[stateId].meta.stun) {
        this._isStunned--;
      }
    }
    Alias_Game_Battler_removeState.call(this, stateId);
  };

  Game_Battler.prototype.moveSpeed = function() {
    return this._moveSpeed;
  };

  Game_Battler.prototype.isStunned = function() {
    return this._isStunned > 0;
  };
})();

//-----------------------------------------------------------------------------
// Game_Actor

(function() {
  var Alias_Game_Actor_setup = Game_Actor.prototype.setup;
  Game_Actor.prototype.setup = function(actorId) {
    Alias_Game_Actor_setup.call(this, actorId);
    var meta = this.actor().qmeta;
    this._popupOY = Number(meta.popupOY) || 0;
  };

  var Alias_Game_Actor_changeClass = Game_Actor.prototype.changeClass;
  Game_Actor.prototype.changeClass = function(classId, keepExp) {
    Alias_Game_Actor_changeClass.call(this, classId, keepExp);
    if (this === $gameParty.leader()) $gameSystem.loadClassABSKeys();
  };

  var Alias_Game_Actor_initEquips = Game_Actor.prototype.initEquips;
  Game_Actor.prototype.initEquips = function(equips) {
    Alias_Game_Actor_initEquips.call(this, equips);
    if (this === $gameParty.leader()) this.initWeaponSkills();
  };

  Game_Actor.prototype.initWeaponSkills = function() {
    var equips = this._equips;
    for (var i = 0; i < equips.length; i++) {
      if (equips[i].object()) {
        var equipId = equips[i].object().baseItemId || equips[i].object().id;
        if (equips[i].isWeapon() && equipId) {
          this.changeWeaponSkill(equipId);
        }
      }
    }
  };

  var Alias_Game_Actor_changeEquip = Game_Actor.prototype.changeEquip;
  Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this !== $gameParty.leader()) {
      return Alias_Game_Actor_changeEquip.call(this, slotId, item);
    }
    var equips = this._equips;
    var oldId, newId = 0;
    var wasWeapon;
    if (equips[slotId] && equips[slotId].object()) {
      oldId = equips[slotId].object().baseItemId || equips[slotId].object().id;
      wasWeapon = equips[slotId].isWeapon();
    }
    Alias_Game_Actor_changeEquip.call(this, slotId, item);
    if (equips[slotId] && equips[slotId].object()) {
      newId = equips[slotId].object().baseItemId || equips[slotId].object().id;
    }
    if (newId && newId !== oldId && equips[slotId].isWeapon()) {
      this.changeWeaponSkill(newId);
    } else if (wasWeapon) {
      this.changeWeaponSkill(0);
    }
  };

  Game_Actor.prototype.changeWeaponSkill = function(id) {
    if (this !== $gameParty.leader()) return;
    var weaponSkills;
    if (!$dataWeapons[id]) {
      weaponSkills = {};
    } else {
      weaponSkills = QABS.weaponSkills(id);
    }
    $gameSystem.changeABSWeaponSkills(weaponSkills);
  };

  Game_Actor.prototype.displayLevelUp = function(newSkills) {
    QABSManager.startPopup('QABS-LEVEL', {
      x: $gamePlayer.cx(),
      y: $gamePlayer.cy(),
      string: 'Level Up!'
    })
    QABSManager.startAnimation(QABS.levelAnimation, $gamePlayer.cx(), $gamePlayer.cy());
  };

  Game_Actor.prototype.onPlayerWalk = function() {
    this.clearResult();
    this.checkFloorEffect();
  };

  Game_Actor.prototype.updateStateSteps = function(state) {
    Game_Battler.prototype.updateStateSteps.call(this, state);
  };

  Game_Actor.prototype.showAddedStates = function() {
    Game_Battler.prototype.showAddedStates.call(this);
  };

  Game_Actor.prototype.showRemovedStates = function() {
    Game_Battler.prototype.showRemovedStates.call(this);
  };

  Game_Actor.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
  };

  Game_Actor.prototype.stepsForTurn = function() {
    return Game_Battler.prototype.stepsForTurn.call(this);
  };
})();

//-----------------------------------------------------------------------------
// Game_Enemy

(function() {
  var Alias_Game_Enemy_setup = Game_Enemy.prototype.setup;
  Game_Enemy.prototype.setup = function(enemyId, x, y) {
    Alias_Game_Enemy_setup.call(this, enemyId, x, y);
    var meta = this.enemy().qmeta;
    this._aiType = (meta.AIType || 'simple').toLowerCase();
    this._aiRange = Number(meta.range) || 0;
    this._noPopup = !!meta.noPopup;
    this._popupOY = Number(meta.popupOY) || 0;
    this._onDeath = meta.onDeath || '';
    this._dontErase = !!meta.dontErase;
    this._team = Number(meta.team || 2);
  };

  Game_Enemy.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    this._stateSteps = {};
  };

  Game_Enemy.prototype.eraseState = function(stateId) {
    Game_Battler.prototype.eraseState.call(this, stateId);
    delete this._stateSteps[stateId];
  };
})();

//-----------------------------------------------------------------------------
// Game_CharacterBase

(function() {
  Game_CharacterBase.prototype.battler = function() {
    return null;
  };

  Game_CharacterBase.prototype.clearABS = function() {
    if (this._activeSkills && this._activeSkills.length > 0) {
      this.clearSkills();
    }
    if (this._agroList) {
      this.clearAgro();
    }
    this._activeSkills = [];
    this._skillCooldowns = {};
    this._agroList = {};
    this._agrodList = [];
    this._inCombat = false;
    this._casting = null;
    this._skillLocked = [];
  };

  Game_CharacterBase.prototype.clearSkills = function() {
    for (var i = this._activeSkills.length - 1; i >= 0; i--) {
      var skill = this._activeSkills[i];
      QABSManager.removePicture(skill.picture);
      QABSManager.removePicture(skill.trail);
      QABSManager.removePicture(skill.pictureCollider);
      this._activeSkills.splice(i, 1);
    }
  };

  Game_CharacterBase.prototype.team = function() {
    return 0;
  };

  Game_CharacterBase.prototype.isFriendly = function(target) {
    return target.team() === this.team();
  };

  Game_CharacterBase.prototype.inCombat = function() {
    if (!this.battler()) return false;
    return this._inCombat;
  };

  Game_CharacterBase.prototype.isCasting = function() {
    if (this._casting) {
      if (this._casting.break) {
        this._casting = null;
        return false;
      }
      return true;
    }
    return false;
  };

  var Alias_Game_CharacterBase_canMove = Game_CharacterBase.prototype.canMove;
  Game_CharacterBase.prototype.canMove = function() {
    if (this.battler()) {
      if (this._skillLocked.length > 0) return false;
      if (this.battler().isStunned()) return false;
    }
    if (this.realMoveSpeed() <= 0) return false;
    return Alias_Game_CharacterBase_canMove.call(this);
  };

  Game_CharacterBase.prototype.canInputSkill = function(fromEvent) {
    if (this._globalLocked > 0) return false;
    if (!fromEvent && $gameMap.isEventRunning()) return false;
    if (!$gameSystem._absEnabled) return false;
    if (!this.battler()) return false;
    if (this.battler().isDead()) return false;
    if (this.battler().isStunned()) return false;
    if (this.isCasting()) return false;
    if (this._skillLocked.length > 0) return false;
    return true;
  };

  Game_CharacterBase.prototype.canUseSkill = function(id) {
    var skill = $dataSkills[id];
    return this.usableSkills().contains(id) && this.battler().canPaySkillCost(skill);
  };

  Game_CharacterBase.prototype.usableSkills = function() {
    return [];
  };

  var Alias_Game_CharacterBase_realMoveSpeed = Game_CharacterBase.prototype.realMoveSpeed;
  Game_CharacterBase.prototype.realMoveSpeed = function() {
    var value = Alias_Game_CharacterBase_realMoveSpeed.call(this);
    if (this.battler()) {
      value += this.battler().moveSpeed();
    }
    return value;
  };

  Game_CharacterBase.prototype.addAgro = function(charaId, skill) {
    var chara = QPlus.getCharacter(charaId);
    if (!chara || chara === this || this.isFriendly(chara)) return;
    this._agroList[charaId] = this._agroList[charaId] || 0;
    this._agroList[charaId] += (skill && skill.agroPoints) ? skill.agroPoints : 1;
    if (!chara._agrodList.contains(this.charaId())) {
      chara._agrodList.push(this.charaId());
    }
    this._inCombat = true;
    chara._inCombat = true;
  };

  Game_CharacterBase.prototype.removeAgro = function(charaId) {
    delete this._agroList[charaId];
    var i = this._agrodList.indexOf(charaId);
    if (i !== -1) {
      this._agrodList.splice(i, 1);
      this._inCombat = (this.totalAgro() + this._agrodList.length) > 0;
      if (!this._inCombat && typeof this.endCombat === 'function') {
        this.endCombat();
      }
    }
  };

  Game_CharacterBase.prototype.clearAgro = function() {
    for (var charaId in this._agroList) {
      var chara = QPlus.getCharacter(charaId);
      if (chara) chara.removeAgro(this.charaId());
    }
    for (var i = this._agrodList.length - 1; i >= 0; i--) {
      var chara = QPlus.getCharacter(this._agrodList[i]);
      if (chara) chara.removeAgro(this.charaId());
    }
    this._agroList = {};
    this._agrodList = [];
    this._inCombat = false;
  };

  Game_CharacterBase.prototype.totalAgro = function() {
    var total = 0;
    for (var agro in this._agroList) {
      total += this._agroList[agro] || 0;
    }
    return total;
  };

  Game_CharacterBase.prototype.bestTarget = function() {
    // TODO consider team
    var mostAgro = 0;
    var bestChara = null;
    for (var charaId in this._agroList) {
      if (this._agroList[charaId] > mostAgro) {
        mostAgro = this._agroList[charaId];
        bestChara = charaId;
      }
    }
    if (bestChara !== null) {
      return QPlus.getCharacter(bestChara);
    }
    return null;
  };

  var Alias_Game_CharacterBase_update = Game_CharacterBase.prototype.update;
  Game_CharacterBase.prototype.update = function() {
    Alias_Game_CharacterBase_update.call(this);
    if (this.battler() && $gameSystem._absEnabled) this.updateABS();
  };

  Game_CharacterBase.prototype.updateABS = function() {
    if (this.battler().isDead()) {
      if (!this._isDead) {
        this.onDeath();
      }
      return;
    }
    this.updateSkills();
    this.battler().updateABS();
  };

  Game_CharacterBase.prototype.onDeath = function() {
    // Placeholder method, overwritten in Game_Player and Game_Event
  };

  Game_CharacterBase.prototype.updateSkills = function() {
    if (this._groundTargeting) this.updateTargeting();
    if (this._activeSkills.length > 0) this.updateSkillSequence();
    this.updateSkillCooldowns();
  };

  Game_CharacterBase.prototype.updateTargeting = function() {
    return this.onTargetingEnd();
  };

  Game_CharacterBase.prototype.updateSkillSequence = function() {
    for (var i = this._activeSkills.length - 1; i >= 0; i--) {
      this._activeSkills[i].sequencer.update();
    }
  };

  Game_CharacterBase.prototype.updateSkillCooldowns = function() {
    for (var id in this._skillCooldowns) {
      if (this._skillCooldowns[id] === 0) {
        delete this._skillCooldowns[id];
      } else {
        this._skillCooldowns[id]--;
      }
    }
  };

  Game_CharacterBase.prototype.onTargetingEnd = function() {
    var skill = this._groundTargeting;
    this.battler().paySkillCost(skill.data);
    this._activeSkills.push(skill);
    this._skillCooldowns[skill.id] = skill.settings.cooldown;
    ColliderManager.draw(skill.collider, skill.sequence.length + 60);
    this.onTargetingCancel();
  };

  Game_CharacterBase.prototype.onTargetingCancel = function() {
    QABSManager.removePicture(this._groundTargeting.picture);
    this._groundTargeting.targeting.kill = true;
    this._groundTargeting = null;
    this._selectTargeting = null;
  };

  Game_CharacterBase.prototype.useSkill = function(skillId, fromEvent) {
    if (!this.canInputSkill(fromEvent)) return null;
    if (!this.canUseSkill(skillId)) return null;
    if (this._groundTargeting) {
      this.onTargetingCancel();
    }
    var skill = this.forceSkill(skillId);
    if (!this._groundTargeting) {
      this.battler().paySkillCost($dataSkills[skillId]);
    }
    return skill;
  };

  Game_CharacterBase.prototype.beforeSkill = function(skill) {
    // Runs before the skills sequence and collider are made
    var before = skill.data.qmeta.beforeSkill || '';
    if (before !== '') {
      try {
        eval(before);
      } catch (e) {
        console.error('Error with `beforeSkill` meta inside skill ' + skill.data.id, e);
      }
    }
  };

  Game_CharacterBase.prototype.forceSkill = function(skillId, forced) {
    var skill = this.makeSkill(skillId, forced);
    if (skill.settings.groundTarget || skill.settings.selectTarget) {
      return this.makeTargetingSkill(skill);
    }
    this._activeSkills.push(skill);
    this._skillCooldowns[skillId] = skill.settings.cooldown;
    ColliderManager.draw(skill.collider, skill.sequence.length + 60);
    return skill;
  };

  Game_CharacterBase.prototype.makeSkill = function(skillId, forced) {
    var data = $dataSkills[skillId];
    var skill = {
      id: skillId,
      data: data,
      settings: QABS.getSkillSettings(data),
      sequence: QABS.getSkillSequence(data),
      ondmg: QABS.getSkillOnDamage(data),
      radian: this._radian,
      targetsHit: [],
      forced: forced
    }
    this.beforeSkill(skill);
    skill.sequencer = new Skill_Sequencer(this, skill);
    skill.collider = this.makeSkillCollider(skill.settings);
    return skill;
  };

  Game_CharacterBase.prototype.makeSkillCollider = function(settings) {
    var w1 = this.collider('collision').width;
    var h1 = this.collider('collision').height;
    settings.collider = settings.collider || ['box', w1, h1];
    var collider = ColliderManager.convertToCollider(settings.collider);
    var infront = settings.infront === true;
    var rotate = settings.rotate === true;
    if (rotate) {
      if (QABS.radianAtks) {
        collider.rotate(Math.PI / 2 + this._radian);
      } else {
        collider.rotate(Math.PI / 2 + this.directionToRadian(this._direction));
      }
    }
    var x1 = this.cx() - collider.center.x;
    var y1 = this.cy() - collider.center.y;
    if (infront) {
      var w2 = collider.width;
      var h2 = collider.height;
      var radian;
      if (QABS.radianAtks) {
        radian = this._radian;
      } else {
        radian = this.directionToRadian(this._direction);
      }
      var w3 = Math.cos(radian) * w1 / 2 + Math.cos(radian) * w2 / 2;
      var h3 = Math.sin(radian) * h1 / 2 + Math.sin(radian) * h2 / 2;
      x1 += w3;
      y1 += h3;
    }
    collider.moveTo(x1, y1);
    return collider;
  };

  Game_CharacterBase.prototype.makeTargetingSkill = function(skill) {
    this._groundTargeting = skill;
    this._selectTargeting = this.constructor === Game_Event ? true : skill.settings.selectTarget;
    var collider = skill.collider;
    var diameter = skill.settings.range * 2;
    skill.targeting = new Circle_Collider(diameter, diameter);
    skill.targeting.moveTo(this.cx() - diameter / 2, this.cy() - diameter / 2);
    ColliderManager.draw(skill.targeting, -1);
    skill.collider = skill.targeting;
    skill.targets = QABSManager.getTargets(skill, this);
    skill.collider = collider;
    skill.picture = new Sprite_SkillCollider(skill.collider);
    if (this._selectTargeting) {
      if (skill.targets.length === 0) {
        return this.onTargetingCancel();
      }
      skill.collider.color = '#00ff00';
      skill.index = 0;
    }
    QABSManager.addPicture(skill.picture);
    return skill;
  };
})();

//-----------------------------------------------------------------------------
// Game_Player

(function() {
  var Alias_Game_Player_refresh = Game_Player.prototype.refresh;
  Game_Player.prototype.refresh = function() {
    Alias_Game_Player_refresh.call(this);
    if (this.battler() && this._battlerId !== this.battler()._actorId) {
      this.setupBattler();
    }
  };

  Game_Player.prototype.battler = function() {
    return this.actor();
  };

  Game_Player.prototype.setupBattler = function() {
    if (!this.battler()) return;
    this.clearABS();
    this._battlerId = this.battler()._actorId;
    this.battler()._charaId = 0;
    $gameSystem.loadClassABSKeys();
    $gameSystem.changeABSWeaponSkills({});
    this.battler().initWeaponSkills();
    this._isDead = false;
  };

  Game_Player.prototype.team = function() {
    return 1;
  };

  var Alias_Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if (QABS.lockTargeting && this._groundTargeting) return false;
    return Alias_Game_Player_canMove.call(this);
  };

  Game_Player.prototype.canInput = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
      return false;
    }
    return this.canInputSkill() && !this._groundTargeting;
  };

  Game_Player.prototype.usableSkills = function() {
    return this.battler().skills().filter(function(skill) {
      return !this._skillCooldowns[skill.id];
    }, this).map(function(skill) {
      return skill.id;
    });
  };

  Game_Player.prototype.onDeath = function() {
    this.clearABS();
    this._isDead = true;
    SceneManager.goto(Scene_Gameover);
  };

  var Alias_Game_Player_onPositionChange = Game_Player.prototype.onPositionChange;
  Game_Player.prototype.onPositionChange = function() {
    Alias_Game_Player_onPositionChange.call(this);
    if (this._groundTargeting && !QABS.lockTargeting) {
      this.onTargetingCancel();
    }
  };

  var Alias_Game_Player_collidesWithEvent = Game_Player.prototype.collidesWithEvent;
  Game_Player.prototype.collidesWithEvent = function(event, type) {
    if (event.constructor === Game_Loot) {
      return event.collider('interaction').intersects(this.collider(type));
    }
    return Alias_Game_Player_collidesWithEvent.call(this, event, type);
  };

  Game_Player.prototype.updateABS = function() {
    if (this._isDead) return;
    if (this.battler() && this.canInput()) this.updateABSInput();
    Game_CharacterBase.prototype.updateABS.call(this);
    if (this._battlerId !== this.actor()._actorId) {
      this.clearABS();
      this.setupBattler();
    }
  };

  Game_Player.prototype.updateABSInput = function() {
    var absKeys = $gameSystem.absKeys();
    for (var key in absKeys) {
      if (!absKeys[key]) continue;
      var inputs = absKeys[key].input;
      for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        if (Input.isTriggered(input) || Input.isPressed(input)) {
          Input.stopPropagation();
          this.useSkill(absKeys[key].skillId);
          break;
        }
        if (input === 'mouse1' && (TouchInput.isTriggered() || TouchInput.isPressed()) && this.canClick()) {
          TouchInput.stopPropagation();
          this.useSkill(absKeys[key].skillId);
          break;
        }
        if (input === 'mouse2' && TouchInput.isCancelled() && this.canClick()) {
          TouchInput.stopPropagation();
          this.useSkill(absKeys[key].skillId);
          break;
        }
      }
    }
  };

  Game_Player.prototype.updateTargeting = function() {
    return this._selectTargeting ? this.updateSelectTargeting() : this.updateGroundTargeting();
  };

  Game_Player.prototype.updateSelectTargeting = function() {
    // TODO add mouse support
    if (Input.isTriggered('pageup')) {
      Input.stopPropagation();
      this._groundTargeting.index++;
      this.updateSkillTarget();
    }
    if (Input.isTriggered('pagedown')) {
      Input.stopPropagation();
      this._groundTargeting.index--;
      this.updateSkillTarget();
    }
    if (Input.isTriggered('ok')) {
      Input.stopPropagation();
      this.onTargetingEnd();
    }
    if (Input.isTriggered('escape') || TouchInput.isCancelled()) {
      TouchInput.stopPropagation();
      Input.stopPropagation();
      this.onTargetingCancel();
    }
  };

  Game_Player.prototype.updateSkillTarget = function() {
    var skill = this._groundTargeting;
    if (skill.index < 0) skill.index = skill.targets.length - 1;
    if (skill.index >= skill.targets.length) skill.index = 0;
    var target = skill.targets[skill.index];
    var w = skill.collider.width;
    var h = skill.collider.height;
    var x = target.cx() - w / 2;
    var y = target.cy() - h / 2;
    skill.collider.moveTo(x, y);
  };

  Game_Player.prototype.updateGroundTargeting = function() {
    this.updateGroundTargetingPosition();
    if (Input.isTriggered('escape') || TouchInput.isCancelled()) {
      TouchInput.stopPropagation();
      Input.stopPropagation();
      this.onTargetingCancel();
    }
    if (Input.isTriggered('ok') || (this.canClick() && TouchInput.isTriggered()) ||
      QABS.quickTarget) {
      if (!this._groundTargeting.isOk) {
        TouchInput.stopPropagation();
        Input.stopPropagation();
        this.onTargetingCancel();
      } else {
        this.onTargetingEnd();
      }
    }
  };

  Game_Player.prototype.updateGroundTargetingPosition = function() {
    var skill = this._groundTargeting;
    var w = skill.collider.width;
    var h = skill.collider.height;
    if (Imported.QInput && Input.preferGamepad()) {
      var x1 = skill.collider.center.x;
      var y1 = skill.collider.center.y;
      x1 += Input._dirAxesB.x * 5;
      y1 += Input._dirAxesB.y * 5;
    } else {
      var x1 = $gameMap.canvasToMapPX(TouchInput.x);
      var y1 = $gameMap.canvasToMapPY(TouchInput.y);
    }
    var x2 = x1 - w / 2;
    var y2 = y1 - h / 2;
    this.setRadian(Math.atan2(y1 - this.cy(), x1 - this.cx()));
    skill.radian = this._radian;
    skill.collider.moveTo(x2, y2);
    var dx = Math.abs(this.cx() - x2 - w / 2);
    var dy = Math.abs(this.cy() - y2 - h / 2);
    var distance = Math.sqrt(dx * dx + dy * dy);
    skill.isOk = distance <= skill.settings.range;
    skill.collider.color = skill.isOk ? '#00ff00' : '#ff0000';
  };

  Game_Player.prototype.beforeSkill = function(skill) {
    var meta = skill.data.qmeta;
    var isGamepad = Imported.QInput && Input.preferGamepad();
    if (!meta.dontTurn) {
      if (isGamepad && QABS.towardsAnalog) {
        var horz = Input._dirAxesB.x;
        var vert = Input._dirAxesB.y;
        if (horz !== 0 || vert !== 0) {
          this.setRadian(Math.atan2(vert, horz));
          skill.radian = this._radian;
        }
      } else if (!isGamepad && QABS.towardsMouse) {
        var x1 = $gameMap.canvasToMapPX(TouchInput.x);
        var y1 = $gameMap.canvasToMapPY(TouchInput.y);
        var x2 = this.cx();
        var y2 = this.cy();
        this.setRadian(Math.atan2(y1 - y2, x1 - x2));
        skill.radian = this._radian;
      }
    }
    if (meta.towardsMove) {
      var radian;
      if (isGamepad) {
        var horz = Input._dirAxesA.x;
        var vert = Input._dirAxesA.y;
        if (horz === 0 && vert === 0) {
          radian = skill.radian;
        } else {
          radian = Math.atan2(vert, horz);
        }
      } else {
        var direction = QMovement.diagonal ? Input.dir8 : Input.dir4;
        if (direction === 0) {
          radian = skill.radian;
        } else {
          radian = this.directionToRadian(direction);
        }
      }
      skill.radian = radian;
    }
    Game_CharacterBase.prototype.beforeSkill.call(this, skill);
  };

  Game_Player.prototype.makeTargetingSkill = function(skill) {
    Game_CharacterBase.prototype.makeTargetingSkill.call(this, skill);
    if (this._selectTargeting) {
      this.updateSkillTarget();
    }
  };

  var Alias_Game_Player_requestMouseMove = Game_Player.prototype.requestMouseMove;
  Game_Player.prototype.requestMouseMove = function() {
    if ($gameSystem.anyAbsMouse()) return this.clearMouseMove();
    if (this._groundTargeting) return this.clearMouseMove();
    Alias_Game_Player_requestMouseMove.call(this);
  };
})();

//-----------------------------------------------------------------------------
// Game_Event

(function() {
  var Alias_Game_Event_initialize = Game_Event.prototype.initialize;
  Game_Event.prototype.initialize = function(mapId, eventId) {
    Alias_Game_Event_initialize.call(this, mapId, eventId);
    this.setupBattler();
  };

  Game_Event.prototype.battler = function() {
    return this._battler;
  };

  Game_Event.prototype.setupBattler = function() {
    var foe = /<enemy:([0-9]*?)>/i.exec(this.notes());
    if (foe) {
      this.clearABS();
      this._battlerId = Number(foe[1]);
      this._battler = new Game_Enemy(this._battlerId, 0, 0);
      this._battler._charaId = this.charaId();
      this._skillList = [];
      this._aiType = this._battler._aiType;
      this._aiRange = this._battler._aiRange || QABS.aiLength;
      this._aiWait = 0;
      this._aiPathfind = Imported.QPathfind && QABS.aiPathfind && this.validAI();
      this._aiSight = Imported.QSight && QABS.aiSight && this.validAI();
      if (this._aiSight) {
        this.setupSight({
          shape: 'circle',
          range: this._aiRange / QMovement.tileSize,
          handler: 'AI',
          targetId: '0'
        });
      }
      var actions = this._battler.enemy().actions;
      for (var i = 0; i < actions.length; i++) {
        this._skillList.push(actions[i].skillId);
      }
      this._respawn = -1;
      this._onDeath = this._battler._onDeath;
      this._noPopup = this._battler._noPopup;
      this._dontErase = this._battler._dontErase;
      this._team = this._battler._team;
      this._isDead = false;
    }
  };

  var Alias_Game_Event_comments = Game_Event.prototype.comments;
  Game_Event.prototype.comments = function(withNotes) {
    var comments = Alias_Game_Event_comments.call(this, withNotes);
    if (!this._aiSight) return comments;
    var range = this._aiRange / QMovement.tileSize;
    return comments + '<sight:circle,' + range + ', AI, 0>';
  };

  Game_Event.prototype.canSeeThroughChara = function(chara) {
    if (typeof chara.team === 'function' && chara.team() === this.team()) {
      return true;
    } else if (this._isDead || (typeof chara.battler === 'function' && chara.battler() && chara.battler().isDead())) {
      return true;
    }
    return Game_CharacterBase.prototype.canSeeThroughChara.call(this, chara);
  };

  Game_Event.prototype.disableEnemy = function() {
    $gameSystem.disableEnemy(this._mapId, this._eventId);
    this.clearABS();
    this._battler = null;
  };

  Game_Event.prototype.team = function() {
    return this._battler ? this._team : 0;
  };

  Game_Event.prototype.usableSkills = function() {
    if (!this._battler) return [];
    return this._skillList.filter(function(skillId) {
      return !this._skillCooldowns[skillId];
    }, this);
  };

  var Alias_Game_Event_bestTarget = Game_Event.prototype.bestTarget;
  Game_Event.prototype.bestTarget = function() {
    var best = Alias_Game_Event_bestTarget.call(this);
    if (!best && this.team() === 2) {
      return $gamePlayer;
    }
    return best;
  };

  Game_Event.prototype.addAgro = function(charaId, skill) {
    var isNew = !this._agroList[charaId];
    Game_CharacterBase.prototype.addAgro.call(this, charaId, skill);
    if (isNew) {
      if (this._aiPathfind) {
        this.clearPathfind();
      }
      if (this._endWait) {
        this.removeWaitListener(this._endWait);
        this._endWait = null;
      }
    }
  };

  Game_Event.prototype.updateABS = function() {
    if ($gameSystem.isDisabled(this._mapId, this._eventId)) return;
    Game_CharacterBase.prototype.updateABS.call(this);
    if (this.page() && !this._isDead && this.isNearTheScreen() && this.validAI()) {
      return this.updateAI(this._aiType);
    }
    if (this._respawn >= 0) {
      this.updateRespawn();
    }
  };

  Game_Event.prototype.validAI = function() {
    // if added new AI types, expand here with its name so the
    // updateAI will run
    return this._aiType === "simple";
  };

  Game_Event.prototype.updateAI = function(type) {
    if (type === 'simple') {
      return this.updateAISimple();
    }
    // to add more AI types, alias this function
    // and do something similar to above
  };

  Game_Event.prototype.updateAISimple = function() {
    var bestTarget = this.bestTarget();
    if (!bestTarget) return;
    var targetId = bestTarget.charaId();
    if (!this.AISimpleInRange(bestTarget)) return;
    this.AISimpleAction(bestTarget, this.AISimpleGetAction(bestTarget));
  };

  Game_Event.prototype.AISimpleInRange = function(bestTarget) {
    var targetId = bestTarget.charaId();
    if (this.isTargetInRange(bestTarget)) {
      if (!this._agroList.hasOwnProperty(targetId)) {
        this._aiWait = QABS.aiWait;
        this.addAgro(targetId);
        if (this._aiPathfind) {
          this.clearPathfind();
        }
      }
      if (this._endWait) {
        this.removeWaitListener(this._endWait);
        this._endWait = null;
      }
      return true;
    } else {
      if (!this._endWait && this.inCombat()) {
        bestTarget.removeAgro(this.charaId());
        if (this._aiPathfind) {
          this.clearPathfind();
        }
        this._endWait = this.wait(90).then(function() {
          this._endWait = null;
          this.endCombat();
        }.bind(this));
      }
      if (this._endWait && this.canMove()) {
        this.moveTowardCharacter(bestTarget);
      }
      return false;
    }
    return false;
  };

  Game_Event.prototype.AISimpleGetAction = function(bestTarget) {
    var bestAction = null;
    if (this._aiWait >= QABS.aiWait) {
      this.turnTowardCharacter(bestTarget);
      bestAction = QABSManager.bestAction(this.charaId());
      this._aiWait = 0;
    } else {
      this._aiWait++;
    }
    return bestAction;
  };

  Game_Event.prototype.AISimpleAction = function(bestTarget, bestAction) {
    if (bestAction) {

      var skill = this.useSkill(bestAction);
      if (skill) skill._target = bestTarget;
    } else if (this.canMove()) {
      if (this._aiPathfind) {
        var dx = bestTarget.cx() - this.cx();
        var dy = bestTarget.cy() - this.cy();
        var mw = this.collider('collision').width + bestTarget.collider('collision').width;
        var mh = this.collider('collision').height + bestTarget.collider('collision').height;
        if (Math.abs(dx) <= mw && Math.abs(dy) <= mh) {
          this.clearPathfind();
          this.moveTowardCharacter(bestTarget);
        } else {
          this.initChase(bestTarget.charaId());
        }
      } else {
        this.moveTowardCharacter(bestTarget);
      }
    }
  };

  Game_Event.prototype.isTargetInRange = function(target) {
    if (!target) return false;
    if (this._aiSight) {
      var prev = this._sight.range;
      if (this.inCombat()) {
        this._sight.range = this._aiRange + QMovement.tileSize * 3;
      } else {
        this._sight.range = this._aiRange;
      }
      this._sight.range /= QMovement.tileSize;
      if (prev !== this._sight.range) {
        if (this._sight.base) {
          this._sight.base.kill = true;
          this._sight.base.id = 'sightOld' + this.charaId();
        }
        this._sight.base = null;
        this._sight.reshape = true;
      }
      if (this._sight.targetId !== target.charaId()) {
        delete this._sight.cache.charas[this._sight.targetId];
        this._sight.targetId = target.charaId();
        this._sight.reshape = true;
      }
      if (this._sight.reshape) {
        this.updateSight();
      }
      var key = [this._mapId, this._eventId, this._sight.handler];
      return $gameSelfSwitches.value(key);
    }
    var dx = Math.abs(target.cx() - this.cx());
    var dy = Math.abs(target.cy() - this.cy());
    var range = this._aiRange + (this._inCombat ? 96 : 0);
    return dx <= range && dy <= range;
  };

  Game_Event.prototype.updateRespawn = function() {
    if (this._respawn === 0) {
      this.respawn();
    } else {
      this._respawn--;
    }
  };

  Game_Event.prototype.respawn = function() {
    this._erased = false;
    this.refresh();
    this.findRespawnLocation();
    this.setupBattler();
  };

  Game_Event.prototype.endCombat = function() {
    if (this._aiPathfind) {
      this.clearPathfind();
    }
    this._inCombat = false;
    this.clearAgro();
    if (this._aiPathfind || Imported.QPathfind) {
      var x = this.event().x * QMovement.tileSize;
      var y = this.event().y * QMovement.tileSize;
      this.initPathfind(x, y, {
        smart: 1,
        adjustEnd: true
      });
    } else {
      this.findRespawnLocation();
    }
    this.refresh();
  };

  Game_Event.prototype.findRespawnLocation = function() {
    var x = this.event().x * QMovement.tileSize;
    var y = this.event().y * QMovement.tileSize;
    if (this.canPixelPass(x, y, 5)) {
      this.setPixelPosition(x, y);
      this.straighten();
      this.refreshBushDepth();
      return;
    }
    var dist = Math.min(this.collider('collision').width, this.collider('collision').height);
    dist = Math.max(dist / 2, this.moveTiles());
    var open = [x + ',' + y];
    var closed = [];
    var current;
    var x2;
    var y2;
    while (open.length) {
      current = open.shift();
      closed.push(current);
      current = current.split(',').map(Number);
      var passed;
      for (var i = 1; i < 5; i++) {
        var dir = i * 2;
        x2 = Math.round($gameMap.roundPXWithDirection(current[0], dir, dist));
        y2 = Math.round($gameMap.roundPYWithDirection(current[1], dir, dist));
        if (this.canPixelPass(x2, y2, 5)) {
          passed = true;
          break;
        }
        var key = x2 + ',' + y2;
        if (!closed.contains(key) && !open.contains(key)) {
          open.push(key);
        }
      }
      if (passed) break;
    }
    this.setPixelPosition(x2, y2);
    this.straighten();
    this.refreshBushDepth();
  };

  Game_Event.prototype.onDeath = function() {
    if (this._onDeath) {
      try {
        eval(this._onDeath);
      } catch (e) {
        var id = this.battler()._enemyId;
        console.error('Error with `onDeath` meta inside enemy ' + id, e);
      }
    }
    if (this._agroList[0] > 0) {
      var exp = this.battler().exp();
      $gamePlayer.battler().gainExp(exp);
      if (exp > 0) {
        QABSManager.startPopup('QABS-EXP', {
          x: $gamePlayer.cx(), y: $gamePlayer.cy(),
          string: 'Exp: ' + exp
        });
      }
      this.setupLoot();
    }
    this.clearABS();
    this._respawn = Number(this.battler().enemy().meta.respawn) || -1;
    this._isDead = true;
    if (!this._dontErase) this.erase();
  };

  Game_Event.prototype.setupLoot = function() {
    var x, y;
    var loot = [];
    this.battler().makeDropItems().forEach(function(item) {
      x = this.x + (Math.random() / 2) - (Math.random() / 2);
      y = this.y + (Math.random() / 2) - (Math.random() / 2);
      var type = 0;
      if (DataManager.isWeapon(item)) type = 1;
      if (DataManager.isArmor(item)) type = 2;
      loot.push(QABSManager.createItem(x, y, item.id, type));
    }.bind(this));
    if (this.battler().gold() > 0) {
      x = this.x + (Math.random() / 2) - (Math.random() / 2);
      y = this.y + (Math.random() / 2) - (Math.random() / 2);
      loot.push(QABSManager.createGold(x, y, this.battler().gold()));
    }
    if (this.battler().enemy().meta.autoLoot) {
      var prevAoeLoot = QABS.aoeLoot;
      QABS.aoeLoot = false;
      loot.forEach(function(loot) {
        loot.collectDrops();
      });
    }
  };

  Game_Event.prototype.onTargetingEnd = function() {
    var skill = this._groundTargeting;
    var target = skill.targets[Math.floor(Math.random() * skill.targets.length)];
    var w = skill.collider.width;
    var h = skill.collider.height;
    var x = target.cx() - w / 2;
    var y = target.cy() - h / 2;
    skill.collider.moveTo(x, y);
    skill.picture.move(x + w / 2, y + h / 2);
    Game_CharacterBase.prototype.onTargetingEnd.call(this);
  };
})();

//-----------------------------------------------------------------------------
// Game_Loot

function Game_Loot() {
  this.initialize.apply(this, arguments);
}

(function() {
  Game_Loot.prototype = Object.create(Game_Event.prototype);
  Game_Loot.prototype.constructor = Game_Loot;

  Game_Loot.prototype.initialize = function(x, y) {
    Game_Character.prototype.initialize.call(this);
    this.isLoot = true;
    this._decay = QABS.lootDecay;
    this._eventId = -1;
    this._gold = null;
    this._loot = null;
    this._noSprite = true;
    this.locate(x, y);
    QABSManager.addEvent(this);
    this.refresh();
  };

  Game_Loot.prototype.event = function() {
    return {
      note: ''
    }
  };

  Game_Loot.prototype.shiftY = function() {
    return 0;
  };

  Game_Loot.prototype.setGold = function(value) {
    this._gold = value;
    this.setIcon(QABS.goldIcon);
  };

  Game_Loot.prototype.setItem = function(item) {
    this._loot = item;
    this.setIcon(item.iconIndex);
  };

  Game_Loot.prototype.setIcon = function(iconIndex) {
    this._iconIndex = iconIndex;
    this._itemIcon = new Sprite_Icon(iconIndex);
    this._itemIcon.move(this._px, this._py);
    this._itemIcon.z = 1;
    this._itemIcon._isFixed = true;
    QABSManager.addPicture(this._itemIcon);
  };

  Game_Loot.prototype.page = function() {
    if (!this._lootPage) {
      this._lootPage = {
        conditions: {
          actorId: 1, actorValid: false,
          itemId: 1, itemValid: false,
          selfSwitchCh: 'A', selfSwitchValid: false,
          switch1Id: 1, switch1Valid: false,
          switch2Id: 1, switch2Valid: false,
          variable1Id: 1, variable1Valid: false, variableValue: 0
        },
        image: {
          characterIndex: 0, characterName: '',
          direction: 2, pattern: 1, tileId: 0
        },
        moveRoute: {
          list: [{ code: 0, parameters: [] }],
          repeat: false, skippable: false, wait: false
        },
        list: [],
        directionFix: false,
        moveFrequency: 4,
        moveSpeed: 3,
        moveType: 0,
        priorityType: 0,
        stepAnime: false,
        through: true,
        trigger: QABS.lootTrigger,
        walkAnime: true
      };
      this._lootPage.list = [];
      this._lootPage.list.push({
        code: 355,
        indent: 0,
        parameters: ['this.character().collectDrops();']
      });
      this._lootPage.list.push({
        code: 0,
        indent: 0,
        parameters: [0]
      });
    }
    return this._lootPage;
  };

  Game_Loot.prototype.findProperPageIndex = function() {
    return 0;
  };

  Game_Loot.prototype.collectDrops = function() {
    if (QABS.aoeLoot) {
      return this.aoeCollect();
    }
    if (this._loot) $gameParty.gainItem(this._loot, 1);
    if (this._gold) $gameParty.gainGold(this._gold);
    var string = this._gold ? String(this._gold) : this._loot.name;
    if (this._iconIndex) {
      string = '\\I[' + this._iconIndex + ']' + string;
    }
    QABSManager.startPopup('QABS-ITEM', {
      x: this.cx(), y: this.cy(),
      string: string
    });
    this.erase();
    QABSManager.removeEvent(this);
    QABSManager.removePicture(this._itemIcon);
  };

  Game_Loot.prototype.aoeCollect = function() {
    var loot = ColliderManager.getCharactersNear(this.collider(), function(chara) {
      return chara.constructor === Game_Loot &&
        chara.collider().intersects(this.collider());
    }.bind(this));
    var x = this.cx();
    var y = this.cy();
    var totalLoot = [];
    var totalGold = 0;
    var i;
    for (i = 0; i < loot.length; i++) {
      if (loot[i]._loot) totalLoot.push(loot[i]._loot);
      if (loot[i]._gold) totalGold += loot[i]._gold;
      QABSManager.removeEvent(loot[i]);
      QABSManager.removePicture(loot[i]._itemIcon);
    }
    var display = {};
    for (i = 0; i < totalLoot.length; i++) {
      var item = totalLoot[i];
      $gameParty.gainItem(item, 1);
      display[item.name] = display[item.name] || {};
      display[item.name].iconIndex = item.iconIndex;
      display[item.name].total = display[item.name].total + 1 || 1;
    }
    for (var name in display) {
      var iconIndex = display[name].iconIndex;
      var string = 'x' + display[name].total + ' ' + name;
      if (iconIndex) {
        string = '\\I[' + iconIndex + ']' + string;
      }
      QABSManager.startPopup('QABS-ITEM', {
        x: x, y: y,
        string: string
      });
      y += 22;
    }
    if (totalGold > 0) {
      $gameParty.gainGold(totalGold);
      var string = String(totalGold);
      if (QABS.goldIcon) {
        string = '\\I[' + QABS.goldIcon + ']' + string;
      }
      QABSManager.startPopup('QABS-ITEM', {
        x: x, y: y,
        string: string
      });
    }
  };

  Game_Loot.prototype.update = function() {
    if (this._decay <= 0) {
      this.erase();
      QABSManager.removeEvent(this);
      QABSManager.removePicture(this._itemIcon);
      return;
    }
    this._decay--;
  };

  Game_Loot.prototype.defaultColliderConfig = function() {
    return 'box,48,48,-8,-8';
  };

  Game_Loot.prototype.castsShadow = function() {
    return false;
  };
})();

//-----------------------------------------------------------------------------
// Scene_Map

(function() {
  var Alias_Scene_Map_initialize = Scene_Map.prototype.initialize;
  Scene_Map.prototype.initialize = function() {
    Alias_Scene_Map_initialize.call(this);
    $gameSystem.preloadAllSkills();
  };

  var Alias_Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
  Scene_Map.prototype.isMenuCalled = function() {
    if ($gameSystem.anyAbsMouse2()) return Input.isTriggered('menu');
    return Alias_Scene_Map_isMenuCalled(this);
  };
})();

//-----------------------------------------------------------------------------
// Sprite_Character

(function() {
  var Alias_Sprite_Character_initMembers = Sprite_Character.prototype.initMembers;
  Sprite_Character.prototype.initMembers = function() {
    Alias_Sprite_Character_initMembers.call(this);
    this.createStateSprite();
  };

  Sprite_Character.prototype.createStateSprite = function() {
    this._stateSprite = new Sprite_StateOverlay();
    this.addChild(this._stateSprite);
  };

  var Alias_Sprite_Character_update = Sprite_Character.prototype.update;
  Sprite_Character.prototype.update = function() {
    Alias_Sprite_Character_update.call(this);
    if (this._character) this.updateBattler();
    if (this._battler) this.updateDamagePopup();
  };

  Sprite_Character.prototype.updateDamagePopup = function() {
    this.setupDamagePopup();
  };

  Sprite_Character.prototype.updateBattler = function() {
    if (this._battler !== this._character.battler()) {
      this.setBattler(this._character.battler());
    }
  };

  Sprite_Character.prototype.setBattler = function(battler) {
    this._battler = battler;
    this._stateSprite.setup(this._battler);
  };

  Sprite_Character.prototype.setupDamagePopup = function() {
    if (!Imported.QPopup || this._character._noPopup) return;
    if (this._battler._damageQueue.length > 0) {
      var string;
      var fill = '#ffffff';
      var result = this._battler._damageQueue.shift();
      var type = 'DMG';
      if (result.missed || result.evaded) {
        string = 'Missed';
        type = 'MISSED';
      } else if (result.hpAffected) {
        var dmg = result.hpDamage;
        string = String(Math.abs(dmg));
        if (dmg >= 0) {
          type = 'DMG';
        } else {
          type = 'HEAL';
        }
      } else if (result.mpDamage) {
        string = String(result.mpDamage);
        type = 'MP';
      }
      if (!string && string !== '0') return;
      var iconIndex = result.damageIcon;
      if (iconIndex) {
        string = '\\I[' + iconIndex + ']' + string;
      }
      if (result.critical) {
        type += '-CRIT';
      }
      QABSManager.startPopup('QABS-' + type, {
        string: string,
        oy: this._battler._popupOY,
        bindTo: this._character.charaId(),
        duration: 80
      });
      this._battler.clearDamagePopup();
      this._battler.clearResult();
    }
  };
})();

//-----------------------------------------------------------------------------
// Sprite_Icon

function Sprite_Icon() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_Icon.prototype = Object.create(Sprite.prototype);
  Sprite_Icon.prototype.constructor = Sprite_Icon;

  Sprite_Icon.prototype.initialize = function(index, sheet, w, h) {
    Sprite.prototype.initialize.call(this);
    this._iconIndex = index;
    this._iconSheet = sheet || 'IconSet';
    this._iconW = w || 32;
    this._iconH = h || 32;
    this._realX = this.x;
    this._realY = this.y;
    this._isFixed = false;
    this.setBitmap();
  };

  Sprite_Icon.prototype.setBitmap = function() {
    this.bitmap = ImageManager.loadSystem(this._iconSheet);
    var pw = this._iconW;
    var ph = this._iconH;
    var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
  };

  Sprite_Icon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._isFixed) this.updatePosition();
  };

  Sprite_Icon.prototype.updatePosition = function() {
    this.x = this._realX;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._realY;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
  };

  Sprite_Icon.prototype.move = function(x, y) {
    Sprite.prototype.move.call(this, x, y);
    this._realX = x;
    this._realY = y;
    this.updatePosition();
  };
})();

//-----------------------------------------------------------------------------
// Sprite_SkillPicture

function Sprite_SkillPicture() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_SkillPicture.prototype = Object.create(Sprite.prototype);
  Sprite_SkillPicture.prototype.constructor = Sprite_SkillPicture;

  Sprite_SkillPicture.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._maxFrames = 1;
    this._speed = 0;
    this._isAnimated = false;
    this._tick = 0;
    this._frameI = 0;
    this._lastFrameI = null;
    this._realX = this.x;
    this._realY = this.y;
  };

  Sprite_SkillPicture.prototype.setupAnim = function(frames, speed) {
    this._isAnimated = true;
    this._maxFrames = frames;
    this._speed = speed;
  };

  Sprite_SkillPicture.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updatePosition();
    if (this._isAnimated) this.updateAnimation();
    this.updateFrame();
  };

  Sprite_SkillPicture.prototype.updatePosition = function() {
    this.x = this._realX;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._realY;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
  };

  Sprite_SkillPicture.prototype.updateAnimation = function() {
    if (this._tick % this._speed === 0) {
      this._frameI = (this._frameI + 1) % this._maxFrames;
    }
    this._tick = (this._tick + 1) % this._speed;
  };

  Sprite_SkillPicture.prototype.updateFrame = function() {
    if (this._lastFrameI !== null) {
      if (this._lastFrameI === this._frameI) return;
    }
    var i = this._frameI;
    var pw = this.bitmap.width / this._maxFrames;
    var ph = this.bitmap.height;
    var sx = i * pw;
    this.setFrame(sx, 0, pw, ph);
    this._lastFrameI = i;
  };

  Sprite_SkillPicture.prototype.move = function(x, y) {
    Sprite.prototype.move.call(this, x, y);
    this._realX = x;
    this._realY = y;
    this.updatePosition();
  };
})();

//-----------------------------------------------------------------------------
// Sprite_SkillTrail

function Sprite_SkillTrail() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_SkillTrail.prototype = Object.create(TilingSprite.prototype);
  Sprite_SkillTrail.prototype.constructor = Sprite_SkillTrail;

  Sprite_SkillTrail.prototype.initialize = function() {
    TilingSprite.prototype.initialize.call(this);
    this._realX = this.x;
    this._realY = this.y;
  };

  Sprite_SkillTrail.prototype.update = function() {
    TilingSprite.prototype.update.call(this);
    this.updatePosition();
  };

  Sprite_SkillTrail.prototype.updatePosition = function() {
    this.x = this._realX;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._realY;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
  };

  Sprite_SkillTrail.prototype.move = function(x, y, width, height) {
    TilingSprite.prototype.move.call(this, x, y, width, height);
    this._realX = x;
    this._realY = y;
    this.updatePosition();
  };
})();

//-----------------------------------------------------------------------------
// Sprite_MapAnimation

function Sprite_MapAnimation() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_MapAnimation.prototype = Object.create(Sprite_Base.prototype);
  Sprite_MapAnimation.prototype.constructor = Sprite_MapAnimation;

  Sprite_MapAnimation.prototype.initialize = function(animation) {
    Sprite_Base.prototype.initialize.call(this);
    this.z = 8;
    this._realX = this.x;
    this._realY = this.y;
    this._animation = animation;
    this._hasStarted = false;
  };

  Sprite_MapAnimation.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updatePosition();
    if (!this._hasStarted && this.parent) {
      this.startAnimation(this._animation, false, 0);
      this._hasStarted = true;
    }
    if (this._hasStarted && !this.isAnimationPlaying()) {
      QABSManager.removeAnimation(this);
    }
  };

  Sprite_MapAnimation.prototype.updatePosition = function() {
    this.x = this._realX;
    this.x -= $gameMap.displayX() * QMovement.tileSize;
    this.y = this._realY;
    this.y -= $gameMap.displayY() * QMovement.tileSize;
  };

  Sprite_MapAnimation.prototype.move = function(x, y) {
    Sprite_Base.prototype.move.call(this, x, y);
    this._realX = x;
    this._realY = y;
    this.updatePosition();
  };
})();

//-----------------------------------------------------------------------------
// Sprite_SkillCollider

function Sprite_SkillCollider() {
  this.initialize.apply(this, arguments);
}

(function() {
  Sprite_SkillCollider.prototype = Object.create(Sprite_Collider.prototype);
  Sprite_SkillCollider.prototype.constructor = Sprite_SkillCollider;

  Sprite_SkillCollider.prototype.initialize = function(collider) {
    Sprite_Collider.prototype.initialize.call(this, collider, -1);
    this.z = 2;
    this.alpha = 0.4;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._frameCount = 0;
  };

  Sprite_SkillCollider.prototype.update = function() {
    Sprite_Collider.prototype.update.call(this);
    this.updateAnimation();
  };

  Sprite_SkillCollider.prototype.updateAnimation = function() {
    this._frameCount++;
    if (this._frameCount > 30) {
      this.alpha += 0.2 / 30;
      this.scale.x += 0.1 / 30;
      this.scale.y = this.scale.x;
      if (this._frameCount === 60) this._frameCount = 0;
    } else {
      this.alpha -= 0.2 / 30;
      this.scale.x -= 0.1 / 30;
      this.scale.y = this.scale.x;
    }
  };
})();

//-----------------------------------------------------------------------------
// Spriteset_Map

(function() {
  var Alias_Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    Alias_Spriteset_Map_createLowerLayer.call(this);
    this._pictures = [];
    this._tempAnimations = [];
  };

  Spriteset_Map.prototype.addPictures = function() {
    this._pictures = QABSManager._pictures;
    if (this._pictures.length === 0) return;
    for (var i = 0; i < this._pictures.length; i++) {
      if (this.children.indexOf(this._pictures[i]) !== -1) continue;
      this._tilemap.addChild(this._pictures[i]);
    }
  };

  Spriteset_Map.prototype.addAnimations = function() {
    this._tempAnimations = QABSManager._animations;
    if (this._tempAnimations.length === 0) return;
    for (var i = 0; i < this._tempAnimations.length; i++) {
      if (this.children.indexOf(this._tempAnimations[i]) !== -1) continue;
      this._tilemap.addChild(this._tempAnimations[i]);
      if (this._tempAnimations[i].isAnimationPlaying()) {
        for (var j = 0; j < this._tempAnimations[i]._animationSprites.length; j++) {
          this._tilemap.addChild(this._tempAnimations[i]._animationSprites[j]);
        }
      }
    }
  };

  var Alias_Spriteset_Map_updateTilemap = Spriteset_Map.prototype.updateTilemap;
  Spriteset_Map.prototype.updateTilemap = function() {
    Alias_Spriteset_Map_updateTilemap.call(this);
    if (this._pictures !== QABSManager._pictures) this.addPictures();
    if (this._tempAnimations !== QABSManager._animations) this.addAnimations();
  };
})();

