/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var Promise = require('es6-promise').Promise;

var AudioPlayer = React.createClass({

  propTypes: {
    src: ReactPropTypes.string.isRequired,
  },

  getInitialState: function () {
    return {
      isPlaying: false,
      duration: 0
    };
  },

  togglePlay: function () {
    if (this.state.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  },
  play: function() {

    this.setState({isPlaying: true});
    if (this.props.onPlay) {
      this.props.onPlay(this.props.src);
    }
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
    if (this.props.onStop) {
      this.props.onStop(this.props.src);
    }
    this.refs.audioObject.getDOMNode().currentTime = 0;
  },

  handleLoad: function() {
    var duration = this.refs.audioObject.getDOMNode().duration;
    this.setState({duration: duration});
  },

  render: function() {
    return (
      <div>
        <button className="btn btn--icon btn--secondary mrm" onClick={this.togglePlay}>
          {this.state.isPlaying ? "◼︎":"▶︎"}
        </button>
        <audio ref="audioObject" src={this.props.src}></audio>
      </div>
    );
  },

  componentDidMount: function () {
    var audioElement = this.refs.audioObject.getDOMNode();
    audioElement.addEventListener('ended', this.stop);
    audioElement.addEventListener('loadeddata', this.handleLoad);
    
    ExerciseStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function () {

    var audioElement = this.refs.audioObject.getDOMNode();
    audioElement.removeEventListener('ended', this.stop);
    audioElement.removeEventListener('loadeddata', this.handleLoad);

    ExerciseStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(getExerciseState(this.props.exerciseID));
  },

  _pass: function() {
   ExerciseActions.pass(this.props.exerciseID);
  },
  _fail: function() {
    ExerciseActions.fail(this.props.exerciseID);
  }
});

module.exports = AudioPlayer;