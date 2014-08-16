var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var AudioConstants = Constants.Audio;
var AutoPlayConstants = Constants.AutoPlay;

var AudioActionCreators = {
  setDuration: function(token, duration) {
    AppDispatcher.handleViewAction({
      actionType: AudioConstants.SET_DURATION,
      token: token,
      duration: duration
    });
  },
  play: function(token) {
    AppDispatcher.handleViewAction({
      actionType: AudioConstants.AUDIO_START,
      token: token
    });
  },
  stop: function(token) {
    AppDispatcher.handleViewAction({
      actionType: AudioConstants.AUDIO_STOP,
      token: token
    });
  },

  destroy: function(token) {
    AppDispatcher.handleViewAction({
      actionType: AudioConstants.AUDIO_DESTROY,
      token: token
    });
  }
};

module.exports = AudioActionCreators;