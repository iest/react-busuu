/**
 * Recording in react... how hard can it be?
 * -----------------------------
 * 
 * FLUX ARCHITECTURE:
 * 
 * Views -> (actions) -> Dispatcher -> (registered callback) -> Stores -+
 *   ^                                                                  |
 *   |                                                                  V
 *   +- ("change" event handlers) <- (store's emitted "change events") -+
 *
 * VIEWS get given data to render, and manipulate it via actions.
 * 
 * ACTIONS are discrete, semantic helper functions that facilitate
 * passing data into the dispatcher.
 *
 * All data flows through the DISPATCHER as a central hub. It calls
 * callbacks that stores have registered with it.
 *
 * STORES have callbacks registered with Dispatcher. The callback would
 * switch over the payload it's given, performing different actions on
 * the store.
 *
 * Example - User changes the text for a ToDo item:
 * 
 * - VIEW: Calls action (TodoActions.updateText())
 * - ACTION: Calls Dispatcher, passes in payload (action type with
 * change)
 * - DISPATCHER: Dispatches payload to all registered callbacks
 * 
 * ...seperately...
 *
 * - STORE has callback registered. Switches over action in payload:
 * makes changes to actual data.
 * - VIEW has change listener registered on store, calls callback when
 * change occurs to data. View re-renders.
 * 
 * @jsx React.DOM
 */

var React = require('react');

var RecordingExercise = require('./components/RecordingExercise.react');

// In reality this would be returned by some other means
var exerciseID = "exercise_recording_1_1_9";

React.renderComponent(
  <RecordingExercise exerciseID={exerciseID}/>,
  document.getElementById('recording-exercise')
  );

/**
 * TODO:
 *
 * Define exercise STAGES:
 * 1. Character selection
 * 2. Conversation between the characters
 * 3. Preview of convo between character & user
 */