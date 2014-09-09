var _ = require('underscore');
var apis = [
  require('./random'),
  require('./type')
];

// aggregate all apis
module.exports.inheritsAPI = function (ctor) {
  var apisProp = {};
  apis.forEach(function (api) {
    for (var funcName in api) {
      apisProp[funcName] = {
        value: api[funcName]
      };
    }
  });
  ctor.prototype = Object.create({}, apisProp);
};

// exports.inherits = function(ctor, superCtor) {
//   ctor.super_ = superCtor;
//   ctor.prototype = Object.create(superCtor.prototype, {
//     constructor: {
//       value: ctor,
//       enumerable: false,
//       writable: true,
//       configurable: true
//     }
//   });
// };

/**
 * Each datasets random function (i.e. except chance, faker) accepts a variable
 * number of OptionHash's which aggregate into a single Object internally.
 * @memberOf Context
 * @typedef OptionHash
 * @type {(string|Object)}
 * @since  0.2.0
 *
 * @example
 * // as {a: true}
 * randomFunc('a');
 * @example
 * // as {}
 * randomFunc({a: 1}, {a: null});
 * @example
 * // as {a: 1, b: 2, c: true}
 * randomFunc({a: 0}, {b: 2}, 'c', {a: 1})
 */

/**
 * Aggregate variable number of option hashes to a single option Object
 * @see {@link Context.OptionHash}
 * @method
 * @api public
 * @param {Array.<(string|Object)>} args
 * @return {Object}
 * @since  0.2.0
 */
module.exports.mix = function (args) {
  var input = arguments.length > 1 ? arguments : args;
  var opts = {};
  for (var i = 0; i < input.length; i++ ) {
    var item = input[i];
    if (typeof item === 'object') {
      opts = _.extend(opts, item);
      opts = _.omit(opts, _.pairs(item).map(function (e) {
        return e[1] === null ? e[0] : undefined;
      }));
    } else {
      opts[item] = true;
    }
  }
  return opts;
};
