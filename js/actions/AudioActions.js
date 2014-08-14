var AppDispatcher = require('../dispatcher/AppDispatcher');
var AudioConstants = require('../constants/Constants').Audio;

module.exports = {
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

  /**
   * Play an array of tokens in sequence
   */
  playSequence: function(tokenArr) {
    AppDispatcher.handleViewAction({
      actionType: AudioConstants.AUDIO_START_SEQUENCE,
      tokens: tokenArr
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