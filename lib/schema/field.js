var debug = require('debug')('mognodb-datasets:schema:field');
var util = require('util');
var _ = require('underscore');
var Entry = require('./entry');

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

// field must be string or an array of string
util.inherits(Field, Entry);
function Field (field, name, parent) {
  if (!(this instanceof Field)) return new Field(field, name, parent);

  debug('field <%s> being built from <%s>', name, field);
  Entry.call(this, field, name, parent);

  // should support array of normal content
  if (typeof this._content !== 'string') {
    this._compiled = function () {
      return this._content;
    }.bind(this);
  } else {
    this._compiled = _.template(this._content);
  }
}

Field.prototype.next = function () {
  if (typeof this._currVal !== 'undefined') {
    debug('field <%s> value already generated', this._name);
    return this._currVal;
  }
  debug('field <%s> starts generating', this._name);
  var data;
  if (this._arrayConfig.isArray) {
    data = [];
    for (var i = this._arrayConfig.num(); i > 0; i--) {
      data.push(this._produce());
    }
  } else {
    data = this._produce();
  }
  debug('field <%s> completes generating', this._name);
  return (this._currVal = data);
};

Field.prototype._produce = function () {
  if(!this._parent._context){
    throw 'Parent has no context!';
  }
  this._parent._context._reset();
  var res = this._compiled.call(this._parent._currVal, this._parent._context);
  var alt = this._parent._context._state.override;
  return (typeof alt === 'undefined') ? res : alt;
};

Field.prototype._clean = function () {
  this._prevVal = this._currVal;
  this._currVal = undefined;
};

module.exports = Field;
