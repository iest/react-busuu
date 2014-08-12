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
    EXERCISE_CONTINUE: null,
    EXERCISE_PASS: null,
    EXERCISE_FAIL: null,
    EXERCISE_COMPLETE: null
  }),

  ActionTypes: keyMirror({

    RECIEVE_RAW_EXERCISE: null,

    AUDIO_START: null,
    AUDIO_END: null,
    RECORD_START: null,
    RECORD_END: null
  })
};