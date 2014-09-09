var debug = require('debug')('mongodb-datasets:api:context'),
  _ = require('underscore'),
  helpers = require('./helpers');
  // util = require('util'),

/**
 * @module  api
 */

/**
 * Context object is solely used as context in function _.template
 * @class
 * @param {!Document} host The Document this Context is used
 */
function Context (host) {
  if (!(this instanceof Context)) return new Context(host);
  // APIRandom.call(this);

  /**
   * Internal state of this Context
   * @member {Object}
   * @private
   * @property {boolean} display Visibility of the current Field
   * @property {*} override Value overriding the default `_.template` output
   */
  this._state = {
    display: undefined, // when true, the current field will not be visible
    override: undefined // if present, used to override the template output
  };

  /**
   * Collection of utility methods for clients
   * @member {Object}
   * @api public
   * @property {function} sample {@link http://underscorejs.org/#sample}
   * @since  0.1.0
   */
  this.util = {
    sample: _.sample
  };

  /**
   * Counter
   * @method
   * @api public
   * @param  {number} [id=0]    Index of the counter to increment
   * @param  {number} [start=0] Initial value,
   *                            valid when the counter is initialized
   * @param  {number} [step=1]  Increment of each count
   * @return {number}           Current value of the specified counter
   * @since  0.1.0
   */
  this.counter = function (id, start, step) {
    id = id || 0; // though id=0 is false, does not matter
    debug('counter called id=%d', id);
    var counter = host._schema._state.counter; //pointer
    if (typeof counter[id] === 'undefined') {
      return (counter[id] = start || 0);
    }
    return (counter[id] += (step || 1));
  };

  /**
   * Total number of generated Document's in the current run
   * @instance
   * @api public
   * @memberOf Context
   * @member {number} _$size
   * @since  0.1.4
   */
  Object.defineProperty(this, '_$size', {
    get: function () {
      return host._schema._state.size;
    }
  });

  /**
   * Index of the current Document being generated, starting from 0
   * @instance
   * @api public
   * @memberOf Context
   * @member {number} _$index
   * @since  0.1.4
   */
  Object.defineProperty(this, '_$index', {
    get: function () {
      return host._schema._state.index;
    }
  });

}
// util.inherits(Context, APIRandom);
// Context.prototype = APIRandom;
helpers.inheritsAPI(Context);

/**
 * Change the visibility of current Field
 * @method
 * @api public
 * @param  {boolean} pred Effective if true
 * @since  0.1.4
 */
Context.prototype.hide = function (pred) {
  if (pred) this._state.display = false;
};

/**
 * Convenient method to reset the internal state of this Context
 * @method
 * @private
 * @param  {boolean} hard True when the current Document finishes generating
 */
Context.prototype._reset = function (hard) {
  this._state.override = undefined;
  if (hard) {
    this._state.display = undefined;
  }
};

module.exports = Context;
