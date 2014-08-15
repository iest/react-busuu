var merge = require('react/lib/merge');
var request = require('superagent');
var Promise = require('es6-promise').Promise;

var AppDispatcher = require('../dispatcher/AppDispatcher');
var Store = require('./Store');

var Constants = require('../constants/Constants');
var AudioConstants = Constants.Audio;
var AutoPlayConstants = Constants.AutoPlay;

var AudioActions = require('../actions/AudioActions');

var _waiting = [];
var _playing = null;
var _finished = [];

function cleanUp() {

}

function next() {
  setTimeout(function() {
    AudioActions.play(_waiting[0]);
  }, 0);
}

function setPlaying() {
  _playing = _waiting.shift();
}

function setFinished() {
  _finished.push(_playing);
  if (_waiting.length) {
    next();
  } else {

  }
}

function playSequence(tokenArr) {
  _waiting = tokenArr;
  next();
}

function stopSequence(token) {

}

function checkExists(token) {
  return !!_waiting.filter(function(tok) {
    return tok === token;
  }).length;
}

var AutoPlayStore = merge(Store, {

});


AutoPlayStore.dispatchToken = AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.actionType) {
    case AutoPlayConstants.AUDIO_START_SEQUENCE:
      playSequence(action.tokens);
      AutoPlayStore.emitChange();
      break;
    case AutoPlayConstants.AUDIO_STOP_SEQUENCE:
      cancelSequence();
      AutoPlayStore.emitChange();
      break;

    case AudioConstants.AUDIO_START:
      if (checkExists(action.token)) {
        setPlaying();
      }
      break;

    case AudioConstants.AUDIO_STOP:
      if (action.token === _playing) {
        setFinished();
      }
      break;

    default:
      // No change
      break;
  }
});

module.exports = AutoPlayStore;