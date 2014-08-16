/**
 * Exercise Actions
 *
 * API used by views to manipulate exercises.
 * Passes action event to Dispatcher.
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ExerciseConstants = require('../constants/Constants').Exercise;

var ExerciseActionCreators =  {
  startAutoPlay: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ExerciseConstants.EXERCISE_START_AUTO_PLAY,
      id: id
    });
  },
  stopAutoPlay: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ExerciseConstants.EXERCISE_STOP_AUTO_PLAY,
      id: id
    });
  },
  nextStep: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ExerciseConstants.EXERCISE_STEP,
      id: id
    });
  },
  setCharacter: function(id, character) {
    AppDispatcher.handleViewAction({
      actionType: ExerciseConstants.CHOSE_CHARACTER,
      id: id,
      character: character
    });
  },
  pass: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ExerciseConstants.EXERCISE_PASS,
      id: id
    });
  },
  fail: function(id) {
    AppDispatcher.handleViewAction({
      actionType: ExerciseConstants.EXERCISE_FAIL,
      id: id
    });
  }
};

module.exports = ExerciseActionCreators;