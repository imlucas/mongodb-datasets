var helpers = require('./helpers');
var Joi = require('joi');
var assert = require('assert');

describe('generate other datatypes', function() {
  var res = { items: null };
  var expected = {
    count: 5,
    schema: Joi.object().keys({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
    }).length(2)
  };

  before(function(done) {
    var schema = {
      username: '{{c.name()}}',
      email: '{{c.email()}}'
    };
    var opts = {
      size: 5,
    };
    helpers.generate(schema, opts, function (err, items) {
      if (err) return done(err);
      res.items = items;
      done();
    });
  });

  it('should have the correct size', function () {
    assert.equal(expected.count, res.items.length);
  });

  it('should produce correct schema structure', function () {
    res.items.forEach(function (item) {
      Joi.validate(item, expected.schema, function(err, val) {
        assert.ifError(err);
      });
    });
  });

  it('should produce entries with random content', function (done) {
    helpers.sampleAndStrip(res.items, 2, function (sample) {
      assert.notDeepEqual(sample[0], sample[1]);
      done();
    });
  });
});
