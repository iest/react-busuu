/**
 * RecordingExercise Class/model, extending off base Exercise class
 *
 * Notice that everything we want to be on this model has been
 * explicitely defined.
 */

var Exercise = require('../Exercise');

// These two would be taken from the user object in reality
var LearningLang = 'fr';
var SpeakingLang = 'enc';

var RecordingExercise = Exercise.extend({

  /**
   * The conversation scripts between the 2 characters
   * @type {Object}
   */
  script: {
    character: {},
    LearningLang: '',
    SpeakingLang: ''
  },

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

    this.script = scripts.map(function(item) {
      var char = opts.content.characters[item.character_id];

      var obj = {};
      obj.character = _this.transformCharacter(char);
      obj[LearningLang] = _this.translate(item.line, LearningLang);
      obj[SpeakingLang] = _this.translate(item.line, SpeakingLang);

      return obj;
    });
  }
});

module.exports = RecordingExercise;