var debug = require('debug')('mognodb-datasets:schema:field');
var util = require('util');
var _ = require('underscore');
var Entry = require('./entry');

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

/**
 * Internal representation of non-object non-array fields in template schema
 * @class
 * @augments {Entry}
 * @memberOf module:schema
 * @param {(string|number|boolean)} field 
 * @param {string} name  
 * @param {Entry} parent
 */
function Field (field, name, parent) {
  if (!(this instanceof Field)) return new Field(field, name, parent);

  debug('field <%s> being built from <%s>', name, field);
  Entry.call(this, field, name, parent);
  this._context = parent._context;
  this._this = parent._this;

  if (typeof this._content !== 'string') {
    this._compiled = function () {
      return this._content;
    }.bind(this);
  } else {
    this._compiled = _.template(this._content);
  }
}
util.inherits(Field, Entry);

Field.prototype.next = function () {
  if (typeof this._currVal !== 'undefined') {
    debug('field <%s> value already generated', this._name);
    return this._currVal;
  }
  debug('field <%s> starts generating', this._name);

  this._context._reset();
  var res = this._compiled.call(this._this, this._context);
  var alt = this._context._state.override;
  var data = (typeof alt === 'undefined') ? res : alt;
  debug('field <%s> completes generating', this._name);
  return (this._currVal = data);
};

Field.prototype._clean = function () {
  this._prevVal = this._currVal;
  this._currVal = undefined;
};

module.exports = Field;
