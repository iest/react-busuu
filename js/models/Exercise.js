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
    this.id = opts.id;
    this.type = opts.type;
    this.premium = opts.premium;
    this.translationMap = opts.translationMap;

    this.intro = this.translationMap[opts.content.intro].enc;

    this.isPassed = false;
    this.isFailed = false;
  }
});

module.exports = Exercise;