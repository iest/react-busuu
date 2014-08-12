/**
 * @jsx React.DOM
 */

var React = require('react');
var ReactPropTypes = React.PropTypes;
var cx = require('react/lib/cx');
var AnimGroup = require('react/lib/ReactCSSTransitionGroup');
var Promise = require('es6-promise').Promise;

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
      <button className="btn btn--link text-center" onClick={this._handleClick}>
        <img src={this.props.character.image} className="db mam img-round img-btn"/>
        {this.props.character.name}
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
            return(<characterButton key={character.name[LearningLang]} character={character} onSelect={_this._setSelectedCharacter}/>);
          })}
        </div>
      );
    } else {
      return null;
    }
  }
});

var panelFooter = React.createClass({
  render: function() {
    if (this.props.isActive) {
      return(
        <div key={this.props.isActive} className="panel__footer">
          <Recorder />
          <strong>Record your own version</strong>
        </div>
      );
    } else {
      return null;
    }
  }
});

var conversationGroup = React.createClass({
  getInitialState: function() {
    return {
      isAutoPlaying: true,
      audioIsPlaying: false,
      playingSrc: null
    };
  },
  autoPlayPromise: {},
  cancelAutoPlay: function() {
    this.setState({
      isAutoPlaying: false
    });
  },
  autoPlay: function() {
    var _this = this;

    this.setState({
      isAutoPlaying: true
    });
    this.autoPlayPromise = new Promise(function(resolve, reject) {

      _this.autoPlayPromise.resolve = resolve;
      _this.autoPlayPromise.reject = reject;

      _this.refs.questionAudio.play()
        .then(function() {
          return _this.refs.answerAudio.play();
        })
        .then(function() {
          _this.cancelAutoPlay();
          resolve();
        });
    });
  },
  render: function () {
    var _this = this;

    var exercise = this.props.exercise;
    var question = this.props.script.question;
    var answer = this.props.script.answer;
    var isAutoPlaying = this.state.isAutoPlaying;

    return(
      <div>
        <h1>{this.state.audioIsPlaying}</h1>
        <h3 className="bold mbl">Listen and then record yourself speaking</h3>
        <div className="exercise--golf__section--left">
          <div className="exercise--golf__panel__avatar">
            <img className="img-profile-m img-round img-border" src={question.character.image}/>
          </div>
          <div className={cx({
            "panel panel-tick-left panel-border--bs-grey panel-bg--white text-left text-medium": true,
            active: _this.state.audioIsPlaying && _this.state.playingSrc === question[LearningLang].audio
          })}>
            <div className="panel__inner exercise--golf__panel__inside">
              <div>
                <AudioPlayer ref="questionAudio" src={question[LearningLang].audio}/>
              </div>
              <p>{question[LearningLang].value}</p>
            </div>
            <panelFooter isActive={exercise.chosenCharacter.name === question.character.name && !isAutoPlaying}/>
          </div>
        </div>

        <div className="exercise--golf__section--right">
          <div className="exercise--golf__panel__avatar">
            <img className="img-profile-m img-round img-border" src={answer.character.image}/>
          </div>
          <div className={cx({
            "panel panel-tick-right panel-border--bs-grey panel-bg--white text-left text-medium": true,
            active: _this.state.audioIsPlaying && _this.state.playingSrc === answer[LearningLang].audio
          })}>
            <div className="panel__inner exercise--golf__panel__inside">
              <div>
                <AudioPlayer ref="answerAudio" onPlay={this.handleAudioStart} onStop={this.handleAudioStop} src={answer[LearningLang].audio}/>
              </div>
              <p>{answer[LearningLang].value}</p>
            </div>
            <panelFooter isActive={exercise.chosenCharacter.name === answer.character.name && !isAutoPlaying}/>
          </div>
        </div>
      </div>
    );
  },
  componentDidMount: function() {
    var _this = this;
    // setTimeout(function() {
    //   _this.autoPlay();
    // }, 500);
  }
});

var conversationStage = React.createClass({
  getInitialState: function () {
    return {
      hasRecorded: false,
      isRecording: false,
      currentPlayingToken: null
    };
  },
  render: function() {
    if (this.props.isActive) {

      var exercise = this.props.exercise;
      var activeScriptIndex = this.props.exercise.activeScript;
      var activeScript = this.props.exercise.script[activeScriptIndex];

      return(<conversationGroup script={activeScript} exercise={exercise} />);
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