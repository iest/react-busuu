/**
 * Constants
 */

var keyMirror = require('react/lib/keyMirror');

module.exports = {
  ExerciseTypes: {
    RECORDING: 'recording',
    VOCABULARY: 'vocabulary'
  },
  Exercise: keyMirror({
    EXERCISE_PASS: null,
    EXERCISE_FAIL: null,
    CHOSE_CHARACTER: null
  })
};