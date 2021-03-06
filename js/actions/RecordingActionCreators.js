var AppDispatcher = require('../dispatcher/AppDispatcher');
var RecordingConstants = require('../constants/Constants').Recording;

var RecordingActionCreators = {
  startRecording: function(id) {
    AppDispatcher.handleViewAction({
      actionType: RecordingConstants.RECORD_START,
      id: id
    });
  },
  stopRecording: function(id) {
    AppDispatcher.handleViewAction({
      actionType: RecordingConstants.RECORD_END,
      id: id
    });
  },
  play: function(id) {
    AppDispatcher.handleViewAction({
      actionType: RecordingConstants.RECORD_PLAY,
      id: id
    });
  },
  stop: function(id) {
    AppDispatcher.handleViewAction({
      actionType: RecordingConstants.RECORD_STOP,
      id: id
    });
  },
  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: RecordingConstants.RECORD_DESTROY,
      id: id
    });
  }
};

module.exports = RecordingActionCreators;