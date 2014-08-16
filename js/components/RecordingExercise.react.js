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
var AudioStore = require('../stores/AudioStore');
var RecordingStore = require('../stores/RecordingStore');

var Recorder = require('./Recorder');
var AudioPlayer = require('./AudioPlayer');

var ExerciseActions = require('../actions/ExerciseActions');
var AudioActions = require('../actions/AudioActions');

var AudioConstants = require('../constants/Constants').Audio;

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

// The circular button with character image inside
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

// Stage 1
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

// Stage 2 Part
var conversationGroup = React.createClass({
  _waitingAudios: [],
  _playingAudio: null,
  _finishedAudios: [],
  _nextAudio: function() {
    var _this = this;
    setTimeout(function() {
      AudioActions.play(_this._waitingAudios[0]);
      ExerciseActions.startAutoPlay(_this.props.exercise.id);
    }, 0);
  },
  _audioChange: function() {
    var allAudio = AudioStore.getAll();
    var playingAudio = AudioStore.getPlaying();

    // Our first waiting audio is now playing
    if (this._waitingAudios[0] &&
      this._waitingAudios[0] === playingAudio) {
      this._playingAudio = this._waitingAudios.shift();
      return;
    }

    // If our audio has now stopped
    if (this._playingAudio &&
      allAudio[this._playingAudio].isPlaying === AudioConstants.AUDIO_STOPPED) {
      this._finishedAudios.push(this._playing);

      if (this._waitingAudios.length) {
        this._nextAudio();
      } else {
        ExerciseActions.stopAutoPlay(this.props.exercise.id);
      }
      return;
    }
  },
  autoPlay: function(tokenArr) {
    this._waitingAudios = tokenArr;
    this._nextAudio();
  },

  nextScript: function() {
    ExerciseActions.nextStep(this.props.exercise.id);
  },

  componentDidMount: function() {
    var _this = this;

    // Listen out for audio events
    AudioStore.addChangeListener(this._audioChange);

    setTimeout(function() {
      _this.autoPlay([
        _this.props.script.question[LearningLang].audio,
        _this.props.script.answer[LearningLang].audio,
        ]);
    }, 500);
  },
  componentWillUnmount: function() {
    AudioStore.removeChangeListener(this._audioChange);
  },
  render: function () {
    var _this = this;
    var exercise = this.props.exercise;
    var question = this.props.script.question;
    var answer = this.props.script.answer;

    return(
      <div>
        <h3 className="bold mbl">Listen and then record yourself speaking</h3>
        <div className="exercise--golf__section--left">
          <div className="exercise--golf__panel__avatar">
            <img className="img-profile-m img-round img-border" src={question.character.image}/>
          </div>
          <div className={cx({
            "panel panel-tick-left panel-border--bs-grey panel-bg--white text-left text-medium": true,
            "active": exercise.currentPlayingAudio === question[LearningLang].audio
          })}>
            <div className="panel__inner exercise--golf__panel__inside">
              <div>
                <AudioPlayer src={question[LearningLang].audio}/>
              </div>
              <p>{question[LearningLang].value}</p>
            </div>
            <panelFooter isActive={exercise.chosenCharacter.name === question.character.name && !exercise.isAutoPlaying}/>
          </div>
        </div>

        <div className="exercise--golf__section--right">
          <div className="exercise--golf__panel__avatar">
            <img className="img-profile-m img-round img-border" src={answer.character.image}/>
          </div>
          <div className={cx({
            "panel panel-tick-right panel-border--bs-grey panel-bg--white text-left text-medium": true,
            "active": exercise.currentPlayingAudio === answer[LearningLang].audio
          })}>
            <div className="panel__inner exercise--golf__panel__inside">
              <div>
                <AudioPlayer src={answer[LearningLang].audio}/>
              </div>
              <p>{answer[LearningLang].value}</p>
            </div>
            <panelFooter isActive={exercise.chosenCharacter.name === answer.character.name && !exercise.isAutoPlaying}/>
          </div>
        </div>
        <div className="exercise__actions">
          <button className="btn btn--primary" onClick={this.nextScript}>Continue</button>
        </div>
      </div>
    );
  }
});

// Stage 2
var conversationStage = React.createClass({
  getInitialState: function () {
    return {
      hasRecorded: false,
      isRecording: false,
      currentPlayingAudio: null
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

/**
 * The Controller-view for the entire recording exercise.
 */
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
    AudioStore.addChangeListener(this._onChange);
    RecordingStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    ExerciseStore.removeChangeListener(this._onChange);
    AudioStore.removeChangeListener(this._onChange);
    RecordingStore.removeChangeListener(this._onChange);
  }
});

module.exports = RecordingExercise;