/**
 * Should really have a scriptStore to handle exercises's inner script steps.
 */

var merge = require('react/lib/merge');
var request = require('superagent');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Store = require('./Store');
var Constants = require('../constants/Constants');
var AudioConstants = Constants.Audio;
var RecordingConstants = Constants.Recording;
var ExerciseConstants = Constants.Exercise;
var ExerciseTypes = Constants.ExerciseTypes;

var RecordingExercise = require('../models/exercises/RecordingExercise');

var AudioStore = require('./AudioStore');
var RecordingStore = require('./RecordingStore');

var LearningLang = 'fr';
var SpeakingLang = 'enc';

var _exercises = {};
var _currentExercise = null;

// API methods

function setCurrent(id) {
  _currentExercise = id;
}

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

function nextStep(id) {
  var exercise = _exercises[id];

  if (exercise.script.length -1 > exercise.activeScript) {
    // If there are more scripts to handle
    exercise.isAutoPlaying = true;
    exercise.activeScript++;
  } else {
    // We're at the last one, do something else
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

function findExerciseByRecordingId(recordingId) {
  var foundExercise = null;
  for (var k in _exercises) {
    var exercise = _exercises[k];
    for (var i = 0; i < exercise.script.length; i++) {
      if (exercise.script[i].recordingId === recordingId) {
        foundExercise = exercise;
        break;
      }
    }
  }
  return foundExercise;
}

function checkAutoPlay(tok) {
  var token = AudioStore.getPlaying();

  if (token) {
    var exercise = findExerciseByToken(token);
    _exercises[exercise.id].isAutoPlaying = true;
    _exercises[exercise.id].currentPlayingAudio = token;
  } else {
    unSetAutoPlay(tok);
  }
}
function unSetAutoPlay(token) {
  var exercise = findExerciseByToken(token);  
  _exercises[exercise.id].isAutoPlaying = false;
}

function setPlaying(token) {
  var exercise = findExerciseByToken(token);

  if (exercise) {
    _exercises[exercise.id].currentPlayingAudio = token;
  } else {
    throw "failed to set currentPlayingAudio for token " + token;
  }
}

function setScriptRecording(recorderId) {
  var exercise = _exercises[_currentExercise];
  exercise.script[exercise.activeScript].recordingId = recorderId;
}

function setScriptDone(recorderId) {
  var exercise = findExerciseByRecordingId(recorderId);
  exercise.script[exercise.activeScript].isComplete = true;
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
ExerciseStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.actionType) {

    case AudioConstants.AUDIO_START_SEQUENCE:
      AppDispatcher.waitFor([AudioStore.dispatchToken]);
      checkAutoPlay();
      ExerciseStore.emitChange();
      break;

    // case AudioConstants.AUDIO_STOP_SEQUENCE:
      // unSetAutoPlay(action.id);
      // ExerciseStore.emitChange();
      // break;

    case ExerciseConstants.EXERCISE_LOAD:
      setCurrent(action.id);
      ExerciseStore.emitChange();
      break;
    

    case ExerciseConstants.EXERCISE_STEP:
      nextStep(action.id);
      ExerciseStore.emitChange();
      break;

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
      AppDispatcher.waitFor([AudioStore.dispatchToken]);
      setPlaying(action.token);
      ExerciseStore.emitChange();
      break;

    case AudioConstants.AUDIO_STOP:
      AppDispatcher.waitFor([AudioStore.dispatchToken]);
      cancelPlaying(action.token);
      checkAutoPlay(action.token);
      ExerciseStore.emitChange();
      break;

    case RecordingConstants.RECORD_START:
      AppDispatcher.waitFor([RecordingStore.dispatchToken]);
      setScriptRecording(action.id);
      ExerciseStore.emitChange();
      break;

    case RecordingConstants.RECORD_END:
      AppDispatcher.waitFor([RecordingStore.dispatchToken]);
      setScriptDone(action.id);
      ExerciseStore.emitChange();
      break;

    default:
      // No change
      break;
  }

});

module.exports = ExerciseStore;