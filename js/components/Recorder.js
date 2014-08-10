/**
 * @jsx React.DOM
 */

var React = require('react');

var Recorder = React.createClass({
  render: function () {
    return (
      <span>
        <button className="btn btn--icon btn--secondary mrm">
          R
        </button>
        <button className="btn btn--icon btn--secondary mrm">
          P
        </button>
      </span>
    );
  }
});

module.exports = Recorder;