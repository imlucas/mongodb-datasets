var _ = require('underscore'),
  debug = require('debug')('mongodb-datasets:entry');

function Entry (content, name, parent) {
  if (!(this instanceof Entry)) return new Entry(content, name, parent);

  this._parent = parent;
  this._schema = parent._schema;
  this._name = name;
  this._hidden = isHidden(name);
  this._prevVal = undefined;
  this._currVal = undefined;
  this._arrayConfig = demuxArray(content);
  this._content = this._arrayConfig.isArray ? _.last(content) : content;
}

Entry.build = function () {
  debug('build');
};

Entry.prototype.next = function () {
  throw 'Abstract Method';
};

Entry.prototype._produce = function () {
  throw 'Abstract Method';
};

Entry.prototype._clean = function () {
  throw 'Abstract Method';
};


// helper functions

function isHidden (name) {
  return /^_\$.*/.test(name);
}

function demuxArray (array) {
  if (!Array.isArray(array) || array.length === 0) {
    return {
      isArray: false
    };
  }
  var num = function () { return _.random(1, 3); };
  if (array.length > 1) {
    var userNum = _.first(array);
    if (typeof userNum === 'number') {
      num = function () {
        return userNum;
      };
    } else {
      num = function () {
        return Number(_.template(userNum)());
      };
    }
  }
  return {
    isArray: true,
    num: num
  };
}

module.exports = Entry;
