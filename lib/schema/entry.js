var debug = require('debug')('mongodb-datasets:schema:entry');

/**
 * High level representation of all fields in template schemas
 * @class
 * @abstract
 * @memberOf module:schema
 * @param {*} content
 * @param {string} name   
 * @param {(Entry|Schema)} parent 
 */
function Entry (content, name, parent) {
  if (!(this instanceof Entry)) return new Entry(content, name, parent);

  this._parent = parent; // parent can be a Document or ArrayField
  this._schema = parent._schema; // the root Document
  this._name = name; // the field name supplied by the user
  this._hidden = isHidden(name); // visibility in the output
  this._prevVal = undefined;
  this._currVal = undefined; // generated value in the current next() call
  this._content = content; // the original content supplied by the user
  this._context = null; // Context object used as compiled()'s argument
  this._this = null; // 'this' object user has access to
}

Entry.build = function () {
  debug('build');
};

Entry.prototype.next = function () {
  throw 'Abstract Method';
};

Entry.prototype._clean = function () {
  throw 'Abstract Method';
};

// helper functions

function isHidden (name) {
  return /^_\$.*/.test(name);
}

module.exports = Entry;
