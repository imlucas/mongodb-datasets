// @todo wrong way to mark class as a member of a module

/**
 * @module  schema
 */

var helpers = require('./helpers'),
  debug = require('debug')('mongodb-datasets:schema:index');

/**
 * Internal representation of a user-defined schema
 * @class
 * @memberOf module:schema
 * @param {object} sc  
 * @param {number} size
 */
function Schema (sc, size) {
  if (!(this instanceof Schema)) return new Schema(sc);
  debug('======BUILDING PHASE======');
  helpers.validate(sc);
  debug('schema size=%d being built', size);
  this._schema = this;
  this._document = helpers.build(sc, '$root', this);
  this._state = { // serve as global state
    index: -1,
    size: size,
    counter: []
  };
  debug('======BUILDING ENDS======');
}

Schema.prototype.next = function () {
  this._state.index += 1;
  debug('======GENERATING ROUND %s======', this._state.index);
  return this._document.next();
};

module.exports = Schema;
