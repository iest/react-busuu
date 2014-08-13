/**
 * @jsx React.DOM
 */

var React = require('react');

var RecordingActions = require('../actions/RecordingActions');
var RecordingConstants = require('../constants/Constants').Recording;
var RecordingStore = require('../stores/RecordingStore');

function getStateFromStore(id) {
  return RecordingStore.get(id);
}

var RecorderComponent = React.createClass({
  id: uniqueId('recording'),
  getInitialState: function() {
    var _this = this;
    return {
      id: _this.id,
      isRecording: RecordingConstants.RECORD_NOT_RECORDING,
      isPlaying: RecordingConstants.RECORD_STOPPED
    };
  },
  toggleRecord: function() {
    if (this.state.isRecording === RecordingConstants.RECORD_RECORDING) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  },
  startRecording: function() {
    RecordingActions.startRecording(this.id);
  },
  stopRecording: function() {
    RecordingActions.stopRecording(this.id);
  },
  togglePlay: function() {
    if (this.state.isPlaying === RecordingConstants.RECORD_PLAYING) {
      this.stop();
    } else if (this.state.isPlaying === RecordingConstants.RECORD_STOPPED) {
      this.play();
    }
  },
  play: function() {
    RecordingActions.play(this.id);
  },
  stop: function() {
    RecordingActions.stop(this.id);
  },
  render: function () {

    var isRecording = this.state.isRecording === RecordingConstants.RECORD_RECORDING;
    var isPlaying = this.state.isPlaying === RecordingConstants.RECORD_PLAYING;

    return (
      <span>
        <button className="btn btn--icon btn--secondary mrm" onClick={this.toggleRecord}>
          {isRecording ? "◼︎":"◉︎"}
        </button>
        <button className="btn btn--icon btn--secondary mrm" onClick={this.togglePlay}>
          {isPlaying ? "◼︎":"▶︎"}
        </button>
      </span>
    );
  },
  componentDidMount: function() {
    window.Recorder.initialize({
      swfSrc: "lib/recorder/recorder.swf",
      flashContainer: document.getElementById("recorderFlashContainer"),
      initialized: function() {
        debugger;
        window.Recorder.showFlash();
      }
    });

    RecordingStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    RecordingStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(getStateFromStore(this.id));
  }
});

window.Recorder = {
  swfObject: null,
  _callbacks: {},
  _events: {},
  _initialized: false,
  options: {},
  initialize: function(options) {

    this.options = options || {};

    this.bind('initialized', function() {
      if (options.initialized) {
        options.initialized();
      }
    });

    this.bind('showFlash', this._showFlash);
    this.bind('hideFlash', this._hideFlash);
    this._loadFlash();
  },

  clear: function() {
    Recorder._events = {};
  },

  setActiveBuffer: function(index) {
    return this.flashInterface().setActiveBuffer(index);
  },

  record: function(options) {
    options = options || {};
    this.clearBindings("recordingStart");
    this.clearBindings("recordingProgress");
    this.clearBindings("recordingCancel");

    this.bind('recordingStart', this._hideFlash);
    this.bind('recordingCancel', this._hideFlash);
    // reload flash to allow mic permission dialog to show again
    this.bind('recordingCancel', this._loadFlash);
    this.bind('recordingStart', options.start);
    this.bind('recordingProgress', options.progress);
    this.bind('recordingCancel', options.cancel);

    this.flashInterface().record();
  },

  stop: function() {
    return this.flashInterface()._stop();
  },

  play: function(options) {
    options = options || {};
    this.clearBindings("playingProgress");
    this.clearBindings("playingStop");
    this.bind('playingProgress', options.progress);
    this.bind('playingStop', options.finished);

    this.flashInterface()._play();
  },

  upload: function(options) {
    options.audioParam = options.audioParam || "audio";
    options.fileName = options.fileName || "recording.wav";
    this.clearBindings("uploadSuccess");
    this.bind("uploadSuccess", function(responseText) {
      options.success(Recorder._externalInterfaceDecode(responseText));
    });

    this.flashInterface()
      .upload(options.url, options.fileName, options.audioParam);
  },

  audioData: function() {
    return this.flashInterface()
      .audioData()
      .split(";");
  },

  request: function(method, uri, contentType, data, callback) {
    var callbackName = this.registerCallback(callback);
    this.flashInterface()
      .request(method, uri, contentType, data, callbackName);
  },

  clearBindings: function(eventName) {
    Recorder._events[eventName] = [];
  },

  bind: function(eventName, fn) {
    if (!Recorder._events[eventName]) {
      Recorder._events[eventName] = [];
    }
    Recorder._events[eventName].push(fn);
  },

  triggerEvent: function(eventName, arg0, arg1) {
    Recorder._executeInWindowContext(function() {
      for (var cb in Recorder._events[eventName]) {
        if (Recorder._events[eventName][cb]) {
          Recorder._events[eventName][cb].apply(Recorder, [arg0, arg1]);
        }
      }
    });
  },

  triggerCallback: function(name, args) {
    Recorder._executeInWindowContext(function() {
      Recorder._callbacks[name].apply(null, args);
    });
  },

  registerCallback: function(fn) {
    var name = "CB" + parseInt(Math.random() * 999999, 10);
    Recorder._callbacks[name] = fn;
    return name;
  },

  flashInterface: function() {
    if (!this.swfObject) {
      return null;
    } else if (this.swfObject.record) {
      return this.swfObject;
    } else if (this.swfObject.children[3].record) {
      return this.swfObject.children[3];
    }
  },

  _executeInWindowContext: function(fn) {
    window.setTimeout(fn, 1);
  },

  _clearFlash: function() {
    var flashElement = this.options.flashContainer.children[0];
    if (flashElement) {
      this.options.flashContainer.removeChild(flashElement);
    }
  },

  _loadFlash: function() {
    this._clearFlash();
    var flashElement = document.createElement("div");
    flashElement.setAttribute("id", "recorderFlashObject");
    this.options.flashContainer.appendChild(flashElement);
    swfobject.embedSWF(this.options.swfSrc, "recorderFlashObject", "231", "141", "10.1.0", undefined, undefined, {
      allowscriptaccess: "always"
    }, undefined, function(e) {
      if (e.success) {
        Recorder.swfObject = e.ref;
      } else {
        Recorder._showFlashRequiredDialog();
      }
    });
  },

  _showFlash: function() {
    document.querySelector('.recorderFlashWrapper').classList.add('active');
  },

  _hideFlash: function() {
    document.querySelector('.recorderFlashWrapper').classList.remove('active');
  },

  _showFlashRequiredDialog: function() {
    Recorder.options.flashContainer.innerHTML = "<p>Adobe Flash Player 10.1 or newer is required to use this feature.</p><p><a href='http://get.adobe.com/flashplayer' target='_top'>Get it on Adobe.com.</a></p>";
    Recorder.options.flashContainer.style.color = "white";
    Recorder.options.flashContainer.style.backgroundColor = "#777";
    Recorder.options.flashContainer.style.textAlign = "center";
    Recorder.triggerEvent("showFlash");
  },

  _externalInterfaceDecode: function(data) {
    return data.replace(/%22/g, "\"")
      .replace(/%5c/g, "\\")
      .replace(/%26/g, "&")
      .replace(/%25/g, "%");
  }
};

module.exports = RecorderComponent;