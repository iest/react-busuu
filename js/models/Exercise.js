/**
 * Having inheritance of models is super powerful.
 *
 * A lot of our data layer is repeated everywhere, using inheritance
 * is a way to solve that.
 *
 * In this example, I create an Exercise Class, which all other exercises
 * can extend from.
 */

var Class = require('./Class');

var Exercise = Class.extend({
  init: function(opts) {

    /**
     * The ID of the exercise.
     * @type {string}
     */
    this.id = opts.id;

    /**
     * The type of the exercise.
     * @type {string}
     */
    this.type = opts.type;

    /**
     * If this exercise is premium.
     * @type {boolean}
     */
    this.premium = opts.premium;

    /**
     * Map of string_id:translation for this exercise.
     * @type {object}
     */
    this.translationMap = opts.translationMap;

    /**
     * The introductory text for this exercise.
     * @type {string}
     */
    this.intro = this.translationMap[opts.content.intro].enc;

    /**
     * If the user passed this exercise.
     * @type {Boolean}
     */
    this.isPassed = false;

    /**
     * If the user failed this exercise.
     * @type {Boolean}
     */
    this.isFailed = false;

    /**
     * If this user has finished this exercise.
     * @type {Boolean}
     */
    this.isCompleted = false;
  }
});

module.exports = Exercise;