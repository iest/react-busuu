/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var Promise = require('es6-promise').Promise;

var AudioPlayer = React.createClass({

  propTypes: {
    src: ReactPropTypes.string.isRequired,
    onPlay: ReactPropTypes.func,
    onPause: ReactPropTypes.func,
    onStop: ReactPropTypes.func
  },

  playPromise: {},

  getInitialState: function () {
    return {
      isPlaying: false,
      duration: 0
    }
  },

  togglePlay: function () {
    if (this.state.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  },
  play: function() {

    if (this.playPromise.reject) {
      this.playPromise.reject();
    }

    this.setState({isPlaying: true});
    this.props.onPlay ? this.props.onPlay(this.props.src) : null;
    this.refs.audioObject.getDOMNode().play();
    var _this = this;

    return new Promise(function(resolve, reject) {
      _this.playPromise.resolve = resolve;
      _this.playPromise.reject = reject;
    });
  },
  pause: function() {
    this.setState({isPlaying: false});
    this.refs.audioObject.getDOMNode().pause();
  },
  stop: function() {
    this.pause();
    if (this.playPromise) {
      this.playPromise.resolve();
    }
    this.props.onStop ? this.props.onStop(this.props.src) : null;
    this.refs.audioObject.getDOMNode().currentTime = 0;
  },

  handleLoad: function() {
    var duration = this.refs.audioObject.getDOMNode().duration;
    this.setState({duration: duration});
  },

  render: function() {
    var cx = require('react/lib/cx');
    return (
      <div>
        <button className="btn btn--icon btn--secondary mrm" onClick={this.togglePlay}>
          {this.state.isPlaying ? "Stop":"Play"}
        </button>
        <audio ref="audioObject" src={this.props.src}></audio>
      </div>
    );
  },

  componentDidMount: function () {
    var audioElement = this.refs.audioObject.getDOMNode();
    audioElement.addEventListener('ended', this.stop);
    audioElement.addEventListener('loadeddata', this.handleLoad);
  },
  componentWillUnmount: function () {
    var audioElement = this.refs.audioObject.getDOMNode();
    audioElement.removeEventListener('ended', this.stop);
    audioElement.removeEventListener('loadeddata', this.handleLoad);
  }
});

module.exports = AudioPlayer;