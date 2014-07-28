var _ = require('underscore');
var debug = require('debug')('mongodb-datasets:schema:context');
var bson = require('bson');
var chance = require('chance').Chance();
var faker = require('faker');

// object that will pass into _.template
function Context (host) {
  if (!(this instanceof Context)) return new Context(host);

  // need to add security feature
  this.c = chance;
  this.f = faker;
  this.chance = chance;
  this.faker = faker;

  // internals
  this._state = {
    display: undefined, // when true, the current field will not be visible
    override: undefined // if present, used to override the template output
  };
  this.util = {
    sample: _.sample
  };

  // utility methods
  this.counter = function (id, start, step) {
    id = id || 0; // though id=0 is false, does not matter
    debug('counter called id=%d', id);
    var counter = host._schema._state.counter; //pointer
    if (typeof counter[id] === 'undefined') {
      return (counter[id] = start || 0);
    }
    return (counter[id] += (step || 1));
  };

  Object.defineProperty(this, '_$size', {
    get: function () {
      return host._schema._state.size;
    }
  });

  Object.defineProperty(this, '_$index', {
    get: function () {
      return host._schema._state.index;
    }
  });

}

// internal util
Context.prototype._reset = function (hard) {
  this._state.override = undefined;
  if (hard) {
    this._state.display = undefined;
  }
};

// user util
Context.prototype.hide = function (pred) {
  if (pred) this._state.display = false;
};
Context.prototype.show = function (pred) {
  if (pred) this._state.display = true;
};

// convenient
Context.prototype.coordinates = function (options) {
  var opts = options || {};
  var lat = chance.latitude({fixed: opts.fixed});
  var lng = chance.longitude({fixed: opts.fixed});
  return [lat, lng];
};

// shortcuts
Context.prototype.N = function (i) { this.Number(i); };
Context.prototype.B = function (i) { this.Boolean(i); };
Context.prototype.S = function (i) { this.String(i); };
Context.prototype.D = function (i) { this.Date(i); };
Context.prototype.O = function (i) { this.ObjectID(i); };
// constructors of different types
Context.prototype.Number = function (i) {
  this._state.override = Number(i);
};
Context.prototype.Boolean = function (b) {
  this._state.override = Boolean(b);
};
Context.prototype.String = function (s) {
  this._state.override = String(s);
};
Context.prototype.Date = function (d) {
  this._state.override = new Date(d);
};
Context.prototype.NumberLong = function (i) {
  this._state.override = new bson.Long(i);
};
Context.prototype.MinKey = function () {
  this._state.override = new bson.MinKey();
};
Context.prototype.MaxKey = function () {
  this._state.override = new bson.MaxKey();
};
Context.prototype.Timestamp = function () {
  this._state.override = new bson.Timestamp();
};
Context.prototype.ObjectID = function (i) {
  this._state.override = new bson.ObjectId(i);
};

module.exports = Context;
