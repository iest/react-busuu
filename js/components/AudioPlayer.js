/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var Promise = require('es6-promise').Promise;

var AudioStore = require('../stores/AudioStore');
var AudioActions = require('../actions/AudioActions');
var AudioConstants = require('../constants/Constants').Audio;

function getStateFromStore(token) {
  var audio = AudioStore.get(token);
  return audio;
}

var AudioPlayer = React.createClass({
  propTypes: {
    src: ReactPropTypes.string.isRequired,
  },

  _play: function() {
    this.refs.audioObject.getDOMNode().play();
  },
  _pause: function() {
    this.refs.audioObject.getDOMNode().pause();
  },
  _stop: function() {
    this.refs.audioObject.getDOMNode().pause();
    if (this.refs.audioObject.getDOMNode().currentTime) {
      this.refs.audioObject.getDOMNode().currentTime = 0;
    }
  },

  getInitialState: function () {
    return {
      isPlaying: AudioConstants.AUDIO_STOPPED,
      duration: 0,
      isDisabled: false
    };
  },
  togglePlay: function () {
    if (this.state.isPlaying === AudioConstants.AUDIO_PLAYING) {
      this.stop();
    } else {
      this.play();
    }
  },
  play: function() {
    AudioActions.play(this.props.src);
  },
  progress: function(stuff) {
    console.log(stuff);
    // var progress = this.refs.audioObject.getDOMNode().duration;
    // AudioActions.progress(this.props.src);
  },
  stop: function() {
    AudioActions.stop(this.props.src);
  },

  handleLoad: function() {
    var duration = this.refs.audioObject.getDOMNode().duration;
    AudioActions.setDuration(this.props.src, duration);
  },

  render: function() {
    var isPlaying = this.state.isPlaying === AudioConstants.AUDIO_PLAYING;
    return (
      <div>
        <button className="btn btn--icon btn--secondary mrm" onClick={this.togglePlay} disabled={this.state.isDisabled}>
          {isPlaying ? "◼︎":"▶︎"}
        </button>
        <audio ref="audioObject" preload="true" src={this.props.src}></audio>
      </div>
    );
  },

  componentDidMount: function () {
    var audioElement = this.refs.audioObject.getDOMNode();
    audioElement.addEventListener('ended', this.stop);
    audioElement.removeEventListener('progress', this.progress);
    audioElement.addEventListener('loadeddata', this.handleLoad);
    
    AudioStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function () {

    var audioElement = this.refs.audioObject.getDOMNode();
    audioElement.removeEventListener('ended', this.stop);
    audioElement.removeEventListener('progress', this.progress);
    audioElement.removeEventListener('loadeddata', this.handleLoad);

    AudioActions.destroy(this.props.src);
    AudioStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {

    var state = getStateFromStore(this.props.src);

    // Only do stuff if we have state for our token
    if (state) {

      this.setState(state, function() {
        if (state.isPlaying === AudioConstants.AUDIO_PLAYING) {
          this._play();
        } else if (state.isPlaying === AudioConstants.AUDIO_STOPPED) {
          this._stop();
        }
      });
    }
  }
});

module.exports = AudioPlayer;