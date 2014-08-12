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
    CHOSE_CHARACTER: null,
    EXERCISE_CONTINUE: null,
    EXERCISE_PASS: null,
    EXERCISE_FAIL: null,
    EXERCISE_COMPLETE: null
  }),

  Audio: keyMirror({

    // States
    AUDIO_PLAYING: null,
    AUDIO_STOPPED: null,

    // Actions
    SET_DURATION: null,
    AUDIO_START: null,
    AUDIO_END: null,
    AUDIO_DESTROY: null
  }),

  ActionTypes: keyMirror({

    RECIEVE_RAW_EXERCISE: null,

    RECORD_START: null,
    RECORD_END: null
  })
};