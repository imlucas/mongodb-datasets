var bson = require('bson');

/////////////////////////////////////////
// Constructors of all supported APITypes //
/////////////////////////////////////////

/**
 * @namespace
 */
var APIType = {};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @param {} i Must be acceptable by `Number` constructor
 * @since  0.1.0
 */
APIType.Number = function (i) {
  this._state.override = Number(i);
};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @param {} b Must be acceptable by `Boolean` constructor
 * @since  0.1.0
 */
APIType.Boolean = function (b) {
  this._state.override = Boolean(b);
};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @param {} s Must be acceptable by `String` constructor
 * @since  0.1.0
 */
APIType.String = function (s) {
  this._state.override = String(s);
};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @param {} d Must be acceptable by `Date` constructor
 * @since  0.1.0
 */
APIType.Date = function (d) {
  this._state.override = new Date(d);
};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @param {} i Must be acceptable by `Long` constructor in bson package
 * @see  {@link https://github.com/mongodb/js-bson|bson}
 * @since  0.1.0
 */
APIType.NumberLong = function (i) {
  this._state.override = new bson.Long(i);
};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @see  {@link https://github.com/mongodb/js-bson|bson}
 * @since  0.1.0
 */
APIType.MinKey = function () {
  this._state.override = new bson.MinKey();
};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @see  {@link https://github.com/mongodb/js-bson|bson}
 * @since  0.1.0
 */
APIType.MaxKey = function () {
  this._state.override = new bson.MaxKey();
};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @see  {@link https://github.com/mongodb/js-bson|bson}
 * @since  0.1.0
 */
APIType.Timestamp = function () {
  this._state.override = new bson.Timestamp();
};

/**
 * Replace `_.template` ouput
 * @method
 * @api public
 * @param {} i Must be acceptable by `ObjectId` constructor in bson package
 * @see  {@link https://github.com/mongodb/js-bson|bson}
 * @since  0.1.0
 */
APIType.ObjectID = function (i) {
  this._state.override = new bson.ObjectId(i);
};

module.exports = APIType;