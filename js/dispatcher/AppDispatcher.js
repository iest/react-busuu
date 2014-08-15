/**
 * AppDispatcher
 *
 * Singleton that operates as central hub for all application updates
 */

var copyProperties = require('react/lib/copyProperties');

var Dispatcher = require('./Dispatcher');

var AppDispatcher = copyProperties(new Dispatcher(), {

  /**
   * A bridge function between the views and the dispatcher, marking the action
   * as a view action.  Another variant here could be handleServerAction.
   * @param  {object} action The data coming from the view.
   */
  handleViewAction: function(action) {
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  /**
   * A bridge between a store and the dispatcher, for special cases where a
   * store needs to manipulate another store.
   * @param  {[type]} action [description]
   */
  handleStoreAction: function(action) {
    this.dispatch({
      source: 'STORE_ACTION',
      action: action
    });
  }

});

module.exports = AppDispatcher;