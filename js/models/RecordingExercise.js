/**
 * RecordingExercise Class/model, extending off base Exercise class
 * @type {[type]}
 */

var Exercise = require('./Exercise');

var RecordingExercise = Exercise.extend({
  init: function(opts) {

    // Init the Exercise
    this._super(opts);

    var _this = this;
    var content = opts.content;
    var scripts = content.script;

    function inENC(strID) {
      return _this.translationMap[strID].enc;
    }

    function inFR(strID) {
      return _this.translationMap[strID].fr;
    }

    function transformCharacter(character) {
      return {
        name: inENC(character.name),
        image: character.image
      };
    }

    this.script = scripts.map(function(item) {
      var char = content.characters[item.character_id];

      return {
        character: transformCharacter(char),
        enc: inENC(item.line).value,
        fr: inFR(item.line).value
      };
    });
  }
});

module.exports = RecordingExercise;