var helper = require('./helper');
var assert = require('assert');

describe('generate different types of data', function() {
  var res = { item: null };
  before(function(done) {
    var opts = {
      size: 1,
      schema: {
        double: {
          zero: '{{Double(0)}}',
          one: '{{Double(1)}}',
          decimal: '{{Double(0.1)}}',
          neg: '{{Double(-0.1)}}'
        },
        boolean: {
          basic: '{{Boolean(true)}}',
          interp: '{{Boolean(0)}}',
          string: '{{Boolean("false")}}'
        },
        date: {
          basic: '{{Date(0)}}',
          string: '{{Date("01/01/2000")}}',
          type: '{{Date(chance.date())}}'
        }
      }
    };
    helper.getResults(opts, function (err, items) {
      if (err) return done(err);
      res.item = items[0];
      done();
    });
  });

  describe('#double', function() {
    it('should support integer', function () {
      assert.ok(typeof res.item.double.zero === 'number');
      assert.strictEqual(0, res.item.double.zero);
      assert.ok(typeof res.item.double.one === 'number');
      assert.strictEqual(1, res.item.double.one);
    });

    it('should support decimal', function () {
      assert.ok(typeof res.item.double.decimal === 'number');
      assert.strictEqual(0.1, res.item.double.decimal);
    });

    it('should support negatives', function () {
      assert.ok(typeof res.item.double.neg === 'number');
      assert.strictEqual(-0.1, res.item.double.neg);
    });
  });

  describe('#boolean', function() {
    it('should be able to build from boolean', function () {
      assert.ok(typeof res.item.boolean.basic === 'boolean');
      assert.strictEqual(true, res.item.boolean.basic);
    });

    it('should be able to interpolate from other values', function () {
      assert.ok(typeof res.item.boolean.interp === 'boolean');
      assert.strictEqual(false, res.item.boolean.interp);
      assert.ok(typeof res.item.boolean.string === 'boolean');
      assert.strictEqual(true, res.item.boolean.string);
    });
  });

  describe('#date', function() {
    it('should be able to build from integer', function () {
      assert.ok(res.item.date.basic instanceof Date);
      assert.strictEqual(0, res.item.date.basic.valueOf());
    });

    it('should be able to build from string', function () {
      assert.ok(res.item.date.string instanceof Date);
      assert.strictEqual(new Date('01/01/2000').valueOf(),
        res.item.date.string.valueOf());
    });

    it('should work with chance', function () {
      assert.ok(res.item.date.type instanceof Date);
    });
  });
});