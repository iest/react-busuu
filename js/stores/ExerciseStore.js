/**
 * ExerciseStore
 *
 * Stores and manipulates Exercises.
 * - Fetches a given exercise from the backend (dummy response for now)
 * - Transforms it into a sensible model
 */

 var merge = require('react/lib/merge');
 var request = require('superagent');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var ExerciseConstants = require('../constants/Constants').Exercise;
var RecordingExercise = require('../models/exercises/RecordingExercise');

var CHANGE_EVENT = 'change';

var _exercises = {};

// API methods
function setPass(id) {
  _exercises[id].isFailed = false;
  _exercises[id].isPassed = true;
}

function setFail(id) {
  _exercises[id].isPassed = false;
  _exercises[id].isFailed = true;
}

var ExerciseStore = merge(EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

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
          _exercises[id] = new RecordingExercise(resp);
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
    case ExerciseConstants.EXERCISE_PASS:
      setPass(action.id);
      ExerciseStore.emitChange();
      break;
    case ExerciseConstants.EXERCISE_FAIL:
      setFail(action.id);
      ExerciseStore.emitChange();
      break;
    default:
      // No change
      break;
  }

  return true;
});


module.exports = ExerciseStore;