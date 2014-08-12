var merge = require('react/lib/merge');
var request = require('superagent');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Store = require('./Store');

var Constants = require('../constants/Constants');
var AudioConstants = Constants.Audio;

var _tokens = {};

// Assume that we'll keep track of audioplayers by what
// their src file is

function _create(token) {
  _tokens[token] = {
    isPlaying: AudioConstants.AUDIO_STOPPED,
    duration: 0,
    isDisabled: false
  };
}

function _setDuration(token, duration) {
  if (!_tokens[token]) {
    _create(token);
  }
  _tokens[token].duration = duration;
}

function _play(token){
  if (!_tokens[token]) {
    _create(token);
  }

  // Stop all other tokens first
  for (var tok in _tokens) {
    _tokens[tok].isPlaying = AudioConstants.AUDIO_STOPPED;

    // Disable all other players too
    _tokens[tok].isDisabled = true;
  }

  // Now play ours
  _tokens[token].isDisabled = false;
  _tokens[token].isPlaying = AudioConstants.AUDIO_PLAYING;
}

function _stop(token) {
  _tokens[token].isPlaying = AudioConstants.AUDIO_STOPPED;

  for (var tok in _tokens) {
    // re-enable all other players too
    _tokens[tok].isDisabled = false;
  }
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


AppDispatcher.register(function(payload) {
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
    case AudioConstants.AUDIO_END:
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