var _ = require('underscore'),
  es = require('event-stream'),
  fs = require('fs'),
  datasets = require('../');

module.exports.regex = {
  phone: /(\(\d{3}\)\s*)(\d{3})-(\d{4})/,
  exp: /(\d{2})\/(\d{4})/
};

module.exports.generate = function (schema, opts, fn) {
  if(Object.prototype.toString.call(schema) === '[object Object]'){
    return datasets(opts.size, schema).pipe(es.writeArray(fn));
  }

  fs.createReadStream(schema)
    .pipe(datasets.createGeneratorStream({size: opts.size}))
    .pipe(es.writeArray(fn));
};

module.exports.resolveSchemaPath = function (name) {
  return './examples/' + name;
};

module.exports.sampleAndStrip = function (array, count, fn) {
  // var sample = chance.pick(array, count);
  var sample = _.sample(array, count);
  sample.forEach(function (item) {
    item._id = undefined;
  });
  fn(sample);
};
