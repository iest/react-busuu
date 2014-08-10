/**
 * @jsx React.DOM
 */

var React = require('react');

var AudioPlayer = React.createClass({
  getInitialState: function () {
    return {
      isPlaying: false,
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
    this.setState({isPlaying: true});
    this.refs.audioObject.getDOMNode().play();
  },
  pause: function() {
    this.setState({isPlaying: false});
    this.refs.audioObject.getDOMNode().pause();
  },
  stop: function() {
    this.pause();
    this.refs.audioObject.getDOMNode().currentTime = 0;
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
  },
  componentWillUnmount: function () {
    var audioElement = this.refs.audioObject.getDOMNode();
    audioElement.removeEventListener('ended', this.stop);
  }
});

module.exports = AudioPlayer;