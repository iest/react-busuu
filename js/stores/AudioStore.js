var merge = require('react/lib/merge');
var request = require('superagent');

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
    isDisabled: false
  };
}

function setDuration(token, seconds) {
  if (!_tokens[token]) {
    create(token);
  }
  _tokens[token].duration = seconds * 1000;
}

function playSingle(token) {
  if (!_tokens[token]) {
    create(token);
  }

  // Stop all other tokens first
  for (var tok in _tokens) {
    _tokens[tok].isPlaying = AudioConstants.AUDIO_STOPPED;
  }

  // Now start ours
  _tokens[token].isPlaying = AudioConstants.AUDIO_PLAYING;
}

function stopSingle(token) {
  _tokens[token].isPlaying = AudioConstants.AUDIO_STOPPED;
}

function _destroy(token) {
  if (_tokens[token]) {
    delete _tokens[token];
    return true;
  } else {
    return false;
  }
}



var _sequence = [];
function _queueNext() {
  playSingle(_sequence.shift());
}

function playSequence(tokens) {
  _sequence = tokens;
  _queueNext();
}

function handleIfSequence() {
   // called when START or STOP actions come in

   // If we have tokens still to play and we're not playing anything
   if (_sequence.length && !AudioStore.getPlaying()) {
    _queueNext();
   }
}


var AudioStore = merge(Store, {
  get: function(token) {
    return _tokens[token];
  },
  getAll: function() {
    return _tokens;
  },

  /**
   * Return the key of the current playing audio
   * @return {String}
   */
  getPlaying: function() {
    var playing;

    for (var k in _tokens) {
      var token = _tokens[k];
      if (token.isPlaying === AudioConstants.AUDIO_PLAYING) {
        playing = k;
        break;
      }
    }
    return playing ? playing : null;
  }
});


AudioStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.actionType) {

    case AudioConstants.AUDIO_START_SEQUENCE:
      playSequence(action.tokens);
      AudioStore.emitChange();
      break;

    case AudioConstants.AUDIO_STOP_SEQUENCE:
      // halt
      break;

    case AudioConstants.SET_DURATION:
      setDuration(action.token, action.duration);
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_START:
      playSingle(action.token);
      handleIfSequence();
      AudioStore.emitChange();
      break;
    case AudioConstants.AUDIO_STOP:
      stopSingle(action.token);
      handleIfSequence();
      AudioStore.emitChange();
      break;
    // case AudioConstants.AUDIO_DESTROY:
    //   _destroy(action.token);
    //   AudioStore.emitChange();
    //   break;

    default:
      // No change
      break;
  }

});

module.exports = AudioStore;