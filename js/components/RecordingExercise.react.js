/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;

window.React = React; // This is so you can use the chrome react inspector

// These two would be taken from the user object in reality
var LearningLang = 'fr';
var SpeakingLang = 'enc';

var ExerciseStore = require('../stores/ExerciseStore');
var ExerciseActions = require('../actions/ExerciseActions');

var Recorder = require('./Recorder');
var AudioPlayer = require('./AudioPlayer');

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

var characterButton = React.createClass({
  _handleClick: function(event) {
    var char = this.props.character;
    this.props.onSelect(char);
  },
  render: function() {
    return (
      <button className="btn btn--link" onClick={this._handleClick}>
        <img src={this.props.character.image} className="mam img-round img-btn"/>
      </button>);
  }
});

// Stages
var characterSelectionStage = React.createClass({

  _setSelectedCharacter: function(character) {
    ExerciseActions.setCharacter(this.props.exercise.id, character);
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
            return(<characterButton character={character} onSelect={_this._setSelectedCharacter}/>);
          })}
          <pre>{exercise.chosenCharacter}</pre>
        </div>
      );
    } else {
      return null;
    }
  }
});

var conversationGroup = React.createClass({
  render: function () {
    var question = this.props.script.question;
    var answer = this.props.script.answer;

    return(
      <div>
        <h3 className="bold mbl">Listen and then record yourself speaking</h3>
        <div className="exercise--golf__section--left">
          <div className="exercise--golf__panel__avatar">
            <img className="img-profile-m img-round img-border" src={question.character.image}/>
          </div>
          <div className="panel panel-tick-left panel-border--bs-grey panel-bg--white text-left text-medium">
            <div className="panel__inner exercise--golf__panel__inside">
              <div>
                <AudioPlayer src={question[LearningLang].audio}/>
              </div>
              <p>{question[LearningLang].value}</p>
            </div>
            <div className="panel__footer">
              <Recorder />
              <strong>Record your own version</strong>
            </div>
          </div>
        </div>

        <div className="exercise--golf__section--right">
          <div className="exercise--golf__panel__avatar">
            <img className="img-profile-m img-round img-border" src={answer.character.image}/>
          </div>
          <div className="panel panel-tick-right panel-border--bs-grey panel-bg--white text-left text-medium">
            <div className="panel__inner exercise--golf__panel__inside">
              <div>
                <AudioPlayer src={answer[LearningLang].audio}/>
              </div>
              <p>{answer[LearningLang].value}</p>
            </div>
            <div className="panel__footer">
              <Recorder />
              <strong>Record your own version</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var conversationStage = React.createClass({
  getInitialState: function () {
    return {
      hasRecorded: false,
      isRecording: false,
      currentPlayingToken: null
    }
  },
  render: function() {
    if (this.props.isActive) {

      var activeScriptIndex = this.props.exercise.activeScript;
      var activeScript = this.props.exercise.script[activeScriptIndex];

      return(<conversationGroup script={activeScript}/>);
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