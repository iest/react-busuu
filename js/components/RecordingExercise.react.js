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

  _setSelected: function(ev) {
    debugger;
  },

  render: function() {

    var exercise = this.props.exercise;
    var _this = this;

    if (this.props.isActive) {
      return(
        <div className="pal">
          <h3 className="bold">Choose your character:</h3>
          <h3 className="text-muted">{this.props.exercise.intro}</h3>


          {exercise.availableCharacters.map(function(character){
            return(
              <button className="btn btn--link" onClick={_this._setSelected}>
                <img src={character.image} className="mam img-round img-btn"/>

              </button>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  }
});

var conversationStage = React.createClass({
  render: function() {
    if (this.props.isActive) {
      return(<h1>conversationStage</h1>);
    } else {
      return null;
    }
  }
});

var previewStage = React.createClass({
  render: function() {
    if (this.props.isActive) {
      return(<h1>previewStage</h1>);
    } else {
      return null;
    }
  }
});

// The full exercise
var RecordingExercise = React.createClass({

  render: function() {
    var exercise = this.state.exercise;

    var titleString = "Practice your pronunciation and get corrections from native speakers";

    if (exercise) {

      var activeStage = this.state.exercise.activeStage;

      return (
        <div id="lu-content" className="panel bg-white mal">
          <div className="header">
            <div className="instruction"></div>
          </div>
          <div id="activity-frame">
            <div className="exercise">

              <div className="exercise__title">
                <h3>{titleString}</h3>
              </div>

              <characterSelectionStage isActive={exercise.activeStage === exercise.STAGES.CHARACTER_SELECTION} exercise={exercise}/>

              <conversationStage isActive={exercise.activeStage === exercise.STAGES.CONVERSATION} exercise={exercise}/>

              <previewStage isActive={exercise.activeStage === exercise.STAGES.PREVIEW} exercise={exercise}/>
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