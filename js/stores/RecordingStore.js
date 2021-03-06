var merge = require('react/lib/merge');
var request = require('superagent');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Store = require('./Store');

var Constants = require('../constants/Constants');
var RecordingConstants = Constants.Recording;

var _recordings = {};
var indexCounter = 0;

function create(id) {
  _recordings[id] = {
    isRecording: RecordingConstants.RECORD_NOT_RECORDING,
    isPlaying: RecordingConstants.RECORD_STOPPED,
    bufferIndex: indexCounter
  };
  indexCounter++;

  // A primitive way of getting a new index for the recorder each time
  // a new recording ID is added. This is inefficient as the recorder
  // will just keep all recordings in memory (flash) for the duration
  // of it's life

  return _recordings[id];
}

function startRecording(id) {
  if (!_recordings[id]) {
    create(id);
  }
  _recordings[id].isRecording = RecordingConstants.RECORD_RECORDING;
}

function stopRecording(id) {
  if (!_recordings[id]) {
    create(id);
  }
  _recordings[id].isRecording = RecordingConstants.RECORD_NOT_RECORDING;
}

function startPlaying(id) {
  if (!_recordings[id]) {
    create(id);
  }
  _recordings[id].isPlaying = RecordingConstants.RECORD_PLAYING;
}

function stopPlaying(id) {
  if (!_recordings[id]) {
    create(id);
  }
  _recordings[id].isPlaying = RecordingConstants.RECORD_STOPPED;
}

function destroy(id) {
  if (_recordings[id]) {
    return delete _recordings[id];
  } else {
    return false;
  }
}

var RecordingStore = merge(Store, {
  get: function(id) {
    return _recordings[id];
  },
  getAll: function() {
    return _recordings;
  }
});

RecordingStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.actionType) {
    case RecordingConstants.RECORD_START:
      startRecording(action.id);
      RecordingStore.emitChange();
      break;
    case RecordingConstants.RECORD_END:
      stopRecording(action.id);
      RecordingStore.emitChange();
      break;
    case RecordingConstants.RECORD_PLAY:
      startPlaying(action.id);
      RecordingStore.emitChange();
      break;
    case RecordingConstants.RECORD_STOP:
      stopPlaying(action.id);
      RecordingStore.emitChange();
      break;
    case RecordingConstants.RECORD_DESTROY:
      destroy(action.id);
      RecordingStore.emitChange();
      break;
    default:
      // No change
      break;
  }

  return true;
});

module.exports = RecordingStore;