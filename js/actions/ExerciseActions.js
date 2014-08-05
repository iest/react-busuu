/**
 * Exercise Actions
 */

var AppDispatcher = require('../dispatcher/AppDispatcher');
var ExerciseConstants = require('../constants/Constants').Exercise;

module.exports = {
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