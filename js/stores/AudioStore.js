var merge = require('react/lib/merge');
var request = require('superagent');
var Promise = require('es6-promise');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Store = require('./Store');

var Constants = require('../constants/Constants');
var AudioConstants = Constants.Audio;

var _tokens = {};
var _resolves = {};
var _rejects = {};

// We'll keep track of audios by their src file...
// Not likely we'll have the multiple audioplayers on screen with the 
// same src

function create(token) {
  _tokens[token] = {
    isPlaying: AudioConstants.AUDIO_STOPPED,
    duration: 0,
    isDisabled: false,
    playPromise: null
  };
}

function setDuration(token, seconds) {
  if (!_tokens[token]) {
    create(token);
  }
  _tokens[token].duration = seconds * 1000;
}

function play(token) {
  if (!_tokens[token]) {
    create(token);
  }

  // Stop all other tokens first
  for (var tok in _tokens) {
    _tokens[tok].isPlaying = AudioConstants.AUDIO_STOPPED;
  }

  // Now start ours
  _tokens[token].isPlaying = AudioConstants.AUDIO_PLAYING;
  return new Promise(function(resolve, reject) {
    _resolves[token] = resolve;
    _rejects[token] = reject;
  });
}

function playSequence(tokenArr) {
  var _this = this;

  // Pretty much what we want to do
  // play(tokenArr[0]).then(function() {
  //   return play(tokenArr[1]);
  // }).then(function() {
  //   return play(tokenArr[2]);
  // });
  
  // For an infinite-length array...
  tokenArr.forEach(function(token, i) {
    Promise.resolve().then(function() {
      _resolves[token]();
    });
  });
}

function stop(token) {
  _tokens[token].isPlaying = AudioConstants.AUDIO_STOPPED;
  _resolves[token]();
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

  /**
   * Could have an array of token:promises.
   * On specific events, check if there's a promise to resolve.
   */

  switch (action.actionType) {
    case AudioConstants.SET_DURATION:
      setDuration(action.token, action.duration);
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_START:
      play(action.token);
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_START_SEQUENCE:
      playSequence(action.tokens);
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_STOP_SEQUENCE:
      // playSequence(action.tokens);
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_STOP:
      stop(action.token);
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