/**
 * Constants
 */

var keyMirror = require('react/lib/keyMirror');

/**
 * All the constants for the application.
 *
 * These should be split out into STATES and ACTION_TYPES
 * @type {Object}
 */
module.exports = {

  ExerciseTypes: {

    // States
    RECORDING: 'recording',
    VOCABULARY: 'vocabulary'
  },

  Exercise: keyMirror({

    // Actions
    CHOSE_CHARACTER: null,
    EXERCISE_STEP: null,
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
    AUDIO_STOP: null,
    AUDIO_DESTROY: null
  }),

  Recording: keyMirror({
    // States
    RECORD_RECORDING: null,
    RECORD_NOT_RECORDING: null,
    RECORD_PLAYING: null,
    RECORD_STOPPED: null,

    // Actions
    RECORD_START: null,
    RECORD_END: null,
    RECORD_PLAY: null,
    RECORD_STOP: null,
    RECORD_DESTROY: null
  }),

  ActionTypes: keyMirror({
    RECIEVE_RAW_EXERCISE: null,
  })
};