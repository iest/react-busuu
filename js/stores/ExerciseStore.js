/**
 * ExerciseStore
 *
 * Stores and manipulates Exercises.
 * - Fetches a given exercise from the backend (dummy response for now)
 * - Transforms it into a sensible model
 * - Stores it
 *
 * This should be split out into a RecordingExerciseStore in a real
 * implementation.
 */


var merge = require('react/lib/merge');
var request = require('superagent');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Store = require('./Store');

var Constants = require('../constants/Constants');
var AudioConstants = Constants.Audio;
var ExerciseConstants = Constants.Exercise;
var ExerciseTypes = Constants.ExerciseTypes;

var AudioStore = require('./AudioStore');

var RecordingExercise = require('../models/exercises/RecordingExercise');

var LearningLang = 'fr';
var SpeakingLang = 'enc';

var _exercises = {};

// API methods

function create(exe) {
  switch (exe.type) {

    case ExerciseTypes.RECORDING:
      return new RecordingExercise(exe);

    case ExerciseTypes.VOCABULARY:
      return {}; // Would return other types here too

    default:
      throw new Error("No type matching " + exe.type);
  }
}

function setCharacter(id, char) {
  _exercises[id].chosenCharacter = char;
  _exercises[id].nextStage();
}

function setPass(id) {
  _exercises[id].isFailed = false;
  _exercises[id].isPassed = true;
}

function setFail(id) {
  _exercises[id].isPassed = false;
  _exercises[id].isFailed = true;
}

function findExerciseByToken(token) {
  var foundExercise;
  // Find the given token in our exercises
  // This is horrible but not sure how else to do it ¯\_(ツ)_/¯
  for (var k in _exercises) {
    var exercise = _exercises[k];
    for (var i = 0; i < exercise.script.length; i++) {
      if (exercise.script[i].answer[SpeakingLang].audio === token ||
        exercise.script[i].answer[LearningLang].audio === token ||
        exercise.script[i].question[SpeakingLang].audio === token ||
        exercise.script[i].question[LearningLang].audio === token) {
        foundExercise = exercise;
        break;
      }
    }
  }

  if (foundExercise){
    return foundExercise;
  } else {
    return null;
  }
}

function setPlaying(token) {
  var exercise = findExerciseByToken(token);

  if (exercise) {
    _exercises[exercise.id].currentPlayingAudio = token;
  } else {
    throw "failed to set currentPlayingAudio for token " + token;
  }
}

function cancelPlaying(token) {
  var exercise = findExerciseByToken(token);

  if (exercise) {
    _exercises[exercise.id].currentPlayingAudio = null;
  } else {
    throw "failed to set currentPlayingAudio for token " + token;
  }
}

var ExerciseStore = merge(Store, {

  /**
   * Get all loaded exercises
   * @return {object}
   */
  getAll: function() {
    return _exercises;
  },

  /**
   * Get an exercise specified by ID
   * @param  {string} id
   * @return {[type]}    [description]
   */
  get: function(id) {
    var _this = this;

    if (_exercises[id]) {
      return _exercises[id];
    } else {

      request
        .get('/responses/' + id + '.js')
        .end(function(resp) {
          resp = JSON.parse(resp.text);
          _exercises[id] = create(resp);
          _this.emitChange();
        });
    }
  }
});

// Register with the Dispatcher, emit a change if something
// changed that we care about
AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.actionType) {
    case ExerciseConstants.CHOSE_CHARACTER:
      setCharacter(action.id, action.character);
      ExerciseStore.emitChange();
      break;
    case ExerciseConstants.EXERCISE_PASS:
      setPass(action.id);
      ExerciseStore.emitChange();
      break;
    case ExerciseConstants.EXERCISE_FAIL:
      setFail(action.id);
      ExerciseStore.emitChange();
      break;
    case AudioConstants.AUDIO_START:
      setPlaying(action.token);
      ExerciseStore.emitChange();
      break;
    case AudioConstants.AUDIO_STOP:
      cancelPlaying(action.token);
      ExerciseStore.emitChange();
      break;
    default:
      // No change
      break;
  }

  return true;
});


module.exports = ExerciseStore;