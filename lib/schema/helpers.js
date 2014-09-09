var Document = require('./document'),
  Field = require('./field'),
  ArrayField = require('./array'),
  Joi = require('joi'),
  API = require('../api');

// @todo better isolation between API and class logic
// maybe move all API-related default value, behavior to ../api?
module.exports.getAPI = function (host) {
  return new API(host);
};

module.exports.build = function (content, name, parent) {
  if (Array.isArray(content))
    return new ArrayField(content, name, parent);
  if (typeof content === 'object')
    return new Document(content, name, parent);
  return new Field(content, name, parent);
};

var SCHEMAS = {
  name: Joi.any(),
  field: Joi.any(),
  meta: Joi.any()
};

module.exports.validate = function (schema) {
  Joi.validate(schema, SCHEMAS.field, function (err) {
    if (err) throw err;
  });
};
