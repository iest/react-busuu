/**
 * RecordingExercise Class/model, extending off base Exercise class
 *
 * Notice that everything we want to be on this model has been
 * explicitely defined.
 */

var keyMirror = require('react/lib/keyMirror');

var Exercise = require('../Exercise');

// These two would be taken from the user object in reality
var LearningLang = 'fr';
var SpeakingLang = 'enc';

var RecordingExercise = Exercise.extend({

  /**
   * The available stages for a recording exercise
   * @type {object}
   */
  STAGES: {
    CHARACTER_SELECTION: 0,
    CONVERSATION: 1,
    PREVIEW: 2
  },

  /**
   * The current active stage for this exercise
   * @type {object}
   */
  activeStage: null,

  nextStage: function() {
    var currentStage = this.activeStage;
    

  },

  /**
   * The conversation scripts between the 2 characters
   * @type {object}
   */
  script: {
    character: {},
    LearningLang: '',
    SpeakingLang: ''
  },

  /**
   * The available characters for this exercise
   * @type {array}
   */
  availableCharacters: [],

  /**
   * The character the user chose;
   * @type {object}
   */
  chosenCharacter: null,

  /**
   * Translate the given string ID
   * @param  {string} strID ID of the string to translate
   * @param  {string} lang  The language to return the translation in
   * @return {string}       The translated string
   * @public
   */
  translate: function(strID, lang) {
    return this.translationMap[strID][lang].value;
  },

  /**
   * Simplify the character object
   * @param  {object} character Character returned from backend
   * @return {object}           The transformed character
   * @private
   */
  transformCharacter: function(character) {
    var _this = this;

    return {
      name: _this.translate(character.name, LearningLang),
      image: character.image
    };
  },

  /**
   * Initialise this model
   * @param  {object} opts
   * @private
   */
  init: function(opts) {

    var _this = this;

    // Init the Exercise
    this._super(opts);

    var scripts = opts.content.script;
    this.script = scripts.map(function(item, index) {

      var char = _this.transformCharacter(opts.content.characters[item.character_id]);

      var obj = {};
      obj.character = char;
      obj[LearningLang] = _this.translate(item.line, LearningLang);
      obj[SpeakingLang] = _this.translate(item.line, SpeakingLang);

      // Set the characters on the exercise
      if (!_this.availableCharacters[index] && index < 2) {
        _this.availableCharacters[index] = char;
        _this.availableCharacters[index].key = char.name;
      }

      return obj;
    });

    // Start off on the first stage
    this.activeStage = this.STAGES.CHARACTER_SELECTION;
  }
});

module.exports = RecordingExercise;