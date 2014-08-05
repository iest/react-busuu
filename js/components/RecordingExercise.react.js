/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;

window.React = React;

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

var RecordingExercise = React.createClass({

  render: function() {
    var exercise = this.state.exercise;

    if (exercise) {
      var passed = exercise.isPassed ? "Passed!!" : "";
      var failed = exercise.isFailed ? "Failed..." : "";

      return (
        <div>
          <h1>{exercise.intro}</h1>

          <ol>
            {exercise.script.map(function(item) {
              return(
                <li>
                  <span>{item.character.name}</span>
                  <img src={item.character.image} />
                  <strong>{item.enc}</strong>
                  <em>{item.fr}</em>
                </li>
              );
            })}
          </ol>

          <button onClick={this._pass}>Pass!</button>
          <button onClick={this._fail}>Fail!</button>
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