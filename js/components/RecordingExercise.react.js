/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;

window.React = React; // This is so you can use the chrome react inspector

var ExerciseStore = require('../stores/ExerciseStore');
var ExerciseActions = require('../actions/ExerciseActions');

function getExerciseState(id) {
  var exercise = ExerciseStore.get(id);

  if (exercise) {
    return {
      exercise: exercise
    };
  } else {
    return {
      exercise: null
    };
  }
}

// Stages
var characterSelectionStage = React.createClass({
  render: function() {
    return(
      <div className="pal">
        <h3 className="bold">Choose your character:</h3>
        <h3 className="text-muted">{this.props.exercise.intro}</h3>
      </div>
    );
  }
});

var conversationStage = React.createClass({
  render: function() {
    return(<h1>conversationStage</h1>);
  }
});

var previewStage = React.createClass({
  render: function() {
    return(<h1>previewStage</h1>);
  }
});

// The full exercise
var RecordingExercise = React.createClass({

  render: function() {
    var exercise = this.state.exercise;

    var title = "Practice your pronunciation and get corrections from native speakers";

    if (exercise) {
      var passed = exercise.isPassed ? "Passed!!" : "";
      var failed = exercise.isFailed ? "Failed..." : "";

      return (
        <div id="lu-content" className="panel bg-white mal">
          <div className="header">
            <div className="instruction"></div>
          </div>
          <div id="activity-frame">
            <div className="exercise">
              <div className="exercise__title">
                <h3>{title}</h3>
              </div>
              <characterSelectionStage exercise={exercise}/>
              <conversationStage exercise={exercise}/>
              <previewStage exercise={exercise}/>
            </div>
          </div>
        </div>
        );
    } else {
      return (
        <h2>Loading Recording exercise...</h2>
        );
    }
  },

  _onChange: function() {
    this.setState(getExerciseState(this.props.exerciseID));
  },

  _pass: function() {
   ExerciseActions.pass(this.props.exerciseID);
  },
  _fail: function() {
    ExerciseActions.fail(this.props.exerciseID);
  },

  getInitialState: function() {
    return getExerciseState(this.props.exerciseID);
  },
  componentDidMount: function() {
    ExerciseStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ExerciseStore.removeChangeListener(this._onChange);
  }
});

module.exports = RecordingExercise;