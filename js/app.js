/**
 * Recording in react... how hard can it be?
 * -----------------------------
 * 
 *
 * Views -> (actions) -> Dispatcher -> (registered callback) -> Stores -+
 *   ^                                                                            |
 *   |                                                                            V
 *   +- ("change" event handlers) <- (store's emitted "change events") -+
 *
 * Need to split app out into:
 * - stores 
 * - dispatcher
 * - actions
 * - components
 * - contants
 * 
 * Actions are discrete, semantic helper functions that facilitate passing data
 * into the dispatcher.
 *
 * All data flows through the dispatcher as a central hub. It calls callbacks
 * that stores have registered with it.
 *
 * Store registers callback with Dispatcher. The callback would switch over the
 * payload it's given, performing different actions on the store.
 * 
 * - [View]: Calls action (TodoActions.updateText())
 * - [Actions]: Calls Dispatcher, passes in payload (action type with change)
 * - [Dispatcher]: Dispatches payload to registered callbacks
 * 
 * ...seperately...
 *
 * - [Store] has callback registered. Switches over action in payload: makes 
 *   changes to actual data.
 * - [View] has change listener registered on store, calls callback when change
 *   occurs to data. View re-renders.
 * 
 * @jsx React.DOM
 */

var React = require('react');

var RecordingExercise = require('./components/RecordingExercise.react');

React.renderComponent(
  <RecordingExercise exerciseID="exercise_recording_1_1_9"/>,
  document.getElementById('recording-exercise')
  );