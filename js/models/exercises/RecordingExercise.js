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
    this.activeStage++;
  },

  /**
   * The conversation scripts between the 2 characters.
   * @type {array}
   */
  script: [{
    question: {
      character: {
        name: '',
        image: ''
      },
      LearningLang: {
        value: '',
        audio: ''
      },
      SpeakingLang: {
        value: '',
        audio: ''
      }
    },
    answer: {
      character: {
        name: '',
        image: ''
      },
      LearningLang: {
        value: '',
        audio: ''
      },
      SpeakingLang: {
        value: '',
        audio: ''
      }
    },
    key: ''
  }],

  /**
   * The current active script.
   * @type {Number}
   */
  activeScript: 0,

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
    return this.translationMap[strID][lang];
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

    var transformedScripts = [];

    scripts.forEach(function(item, i, arr) {

      // We're doing this in pairs, so ignore odd numbers
      if (i % 2) return;

      var questioner = item;
      var answerer = arr[i + 1];
      var characters = opts.content.characters;

      // Set the characters on the exercise
      if (i === 0) {
         var qCharacter = _this.transformCharacter(characters[questioner.character_id]);
         var aCharacter = _this.transformCharacter(characters[answerer.character_id]);

        _this.availableCharacters[0] = qCharacter;
        _this.availableCharacters[0].key = qCharacter.name;

        _this.availableCharacters[1] = aCharacter;
        _this.availableCharacters[1].key = aCharacter.name;
      }

      obj = {
        question: {},
        answer: {}
      };

      // Set question
      obj.question.character = _this.transformCharacter(characters[questioner.character_id]);
      obj.question[LearningLang] = _this.translate(questioner.line, LearningLang);
      obj.question[SpeakingLang] = _this.translate(questioner.line, SpeakingLang);

      // Set Answer
      obj.answer.character = _this.transformCharacter(characters[answerer.character_id]);
      obj.answer[LearningLang] = _this.translate(answerer.line, LearningLang);
      obj.answer[SpeakingLang] = _this.translate(answerer.line, SpeakingLang);

      transformedScripts.push(obj);
    });

    // Set the scripts on this exercise
    this.script = transformedScripts;

    // Start off on the first stage
    this.activeStage = this.STAGES.CHARACTER_SELECTION;
  }
});

module.exports = RecordingExercise;