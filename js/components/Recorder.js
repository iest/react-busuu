/**
 * @jsx React.DOM
 */

var React = require('react');

var Recorder = React.createClass({
  render: function () {
    return (
      <span>
        <button className="btn btn--icon btn--secondary mrm">
          ◉
        </button>
        <button className="btn btn--icon btn--secondary mrm">
          ▶︎
        </button>
      </span>
    );
  }
});

module.exports = Recorder;