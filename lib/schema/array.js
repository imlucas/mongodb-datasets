var debug = require('debug')('mongodb-datasets:schema:array'),
  util = require('util'),
  helpers = require('./helpers'),
  Entry = require('./entry'),
  _ = require('underscore');

var DEFAULTS = {
  size: [2, 5]
};

/**
 * Internal representation of Arrays in template schema
 * @class
 * @augments {Entry}
 * @memberOf module:schema
 * @param {!Array} array   Raw user-supplied array
 * @param {string} name   Key corresponding to the field
 * @param {!Entry} parent  Immediate enclosing Entry
 */
function ArrayField (array, name, parent) {
  if (!(this instanceof ArrayField)) return new ArrayField(array, name, parent);
  debug('array <%s> being built', name);
  Entry.call(this, array, name, parent);
  this._context = parent._context;
  this._this = parent._this;
  this._currVal = {};

  var data = this._content;
  this._config = {
    size: function () { return 1; }
  };
  if (this._content.length > 0 &&
      this._content[0] === '{{_$config}}') {
    data = this._content.slice(2);
    debug('array <%s> is configured with options <%s>', name, this._content[1]);
    var opts = _.defaults(this._content[1], DEFAULTS);
    if (Array.isArray(opts.size)) {
      this._config.size = function () {
        return _.random(opts.size[0], opts.size[1]);
      };
    } else {
      this._config.size = function () {
        return Number(opts.size);
      };
    }
  }
  this._children = [];
  data.forEach(function (child, index) {
    this._children.push(helpers.build(child, index, this));
    (function (method) {
      var child = this._children[method];
      Object.defineProperty(this._currVal, method, {
        enumerable: true,
        get: function () {
          if (child._currVal === undefined)
            return child.next();
          return child._currVal; // doc and array's currval never empty
        }
      });
    }).call(this, index);
  }, this);

  debug('array <%s> build complete', name);
}
util.inherits(ArrayField, Entry);

ArrayField.prototype.next = function () {
  var data = [];
  for (var i = this._config.size(); i > 0; i--) {
    this._clean();
    this._children.forEach(function (child, index) {
      debug('array <%s> calls child <%s>', this._name, index);
      var res = child.next();
      if (this._context._state.display ||
         (!child._hidden && this._context._state.display === undefined))
        data.push(res);
      this._context._reset(true);
    }, this);
  }
  return data;
};

ArrayField.prototype._clean = function () {
  this._children.forEach(function (child) {
    child._clean();
  });
};

module.exports = ArrayField;
