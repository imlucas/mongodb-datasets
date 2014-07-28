var helpers = require('./helpers');
var assert = require('assert');

describe('generate different types of data', function() {
  var res = { item: null };
  before(function(done) {
    var schema = {
      double: {
        zero: '{{N(0)}}',
        one: '{{Number(1)}}',
        decimal: '{{Number(0.1)}}',
        neg: '{{Number(-0.1)}}',
        array: ['{{Number(0)}}']
      },
      boolean: {
        basic: '{{B(true)}}',
        interp: '{{Boolean(0)}}',
        string: '{{Boolean("false")}}'
      },
      date: {
        basic: '{{D(0)}}',
        string: '{{Date("01/01/2000")}}',
        type: '{{Date(c.date())}}'
      },
      primitive: {
        number: 1,
        bool1: true,
        bool0: false,
        null: null
      }
    };
    var opts = {
      size: 1,
    };
    helpers.generate(schema, opts, function (err, items) {
      if (err) return done(err);
      res.item = items[0];
      done();
    });
  });

  describe('#number', function() {
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

    it('should work in array', function () {
      res.item.double.array.forEach(function (i) {
        assert.ok(typeof i === 'number');
        assert.strictEqual(0, i);
      });
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

  describe('#primitive', function() {
    it('should accept number', function () {
      assert.ok(typeof res.item.primitive.number === 'number');
      assert.strictEqual(1, res.item.primitive.number);
    });

    it('should accept boolean', function () {
      assert.ok(typeof res.item.primitive.bool0 === 'boolean');
      assert.ok(typeof res.item.primitive.bool1 === 'boolean');
      assert.strictEqual(false, res.item.primitive.bool0);
      assert.strictEqual(true, res.item.primitive.bool1);
    });

    // it('should accept null', function () {
    //   assert.strictEqual(null, res.item.primitive.null);
    // });
  });

});
