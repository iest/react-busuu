var merge = require('react/lib/merge');
var request = require('superagent');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Store = require('./Store');

var Constants = require('../constants/Constants');
var AudioConstants = Constants.Audio;

var _tokens = {};

// We'll keep track of audios by their src file...
// Not likely we'll have the multiple audioplayers on screen with the 
// same src

function _create(token) {
  _tokens[token] = {
    isPlaying: AudioConstants.AUDIO_STOPPED,
    duration: 0,
    isDisabled: false
  };
}

function _setDuration(token, seconds) {
  if (!_tokens[token]) {
    _create(token);
  }
  _tokens[token].duration = seconds * 1000;
}

function _play(token){
  if (!_tokens[token]) {
    _create(token);
  }

  // Stop all other tokens first
  for (var tok in _tokens) {
    _tokens[tok].isPlaying = AudioConstants.AUDIO_STOPPED;
  }

  // Now start ours
  _tokens[token].isPlaying = AudioConstants.AUDIO_PLAYING;
}

function _stop(token) {
  _tokens[token].isPlaying = AudioConstants.AUDIO_STOPPED;
}

var AudioStore = merge(Store, {
  get: function(token) {
    return _tokens[token];
  },
  getAll: function() {
    return _tokens;
  },
  getAllPlaying: function() {
    var playing = [];
    for (var tok in _tokens) {
      if (tok.isPlaying === AudioConstants.AUDIO_PLAYING) {
        playing.push(tok);
      }
    }
    return playing;
  },
  destroy: function(token) {
    if (_tokens[token]) {
      delete _tokens[token];
      return true;
    } else {
      return false;
    }
  }
});


AudioStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.actionType) {
    case AudioConstants.SET_DURATION:
      _setDuration(action.token, action.duration);
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_START:
      _play(action.token);
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_STOP:
      _stop(action.token);
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_DESTROY:
      _destroy(action.token);
      AudioStore.emitChange();
      break;
    default:
      // No change
      break;
  }

  return true;
});

module.exports = AudioStore;