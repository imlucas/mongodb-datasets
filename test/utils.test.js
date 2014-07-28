var helpers = require('./helpers');
var assert = require('assert');

describe('util methods for schema config file', function() {
  var res = { items: null };
  before(function(done) {
    var schema = {
      counter: {
        normal: '{{N(counter())}}',
        start: '{{N(counter(2, 100))}}',
        step: '{{N(counter(3, 0, 10))}}'
      },
      index: '{{N(_$index)}}',
      size: '{{N(_$size)}}',
      v: {
        half: '{{hide(this._$parent.index < 5)}}mark',
        data: '{{this.half}}',
        '_$hide': 'wont be showed anyway',
        echo: '{{this._$hide}}'
      }
    };
    var opts = {
      size: 10,
    };
    helpers.generate(schema, opts, function (err, items) {
      if (err) return done(err);
      res.items = items;
      done();
    });
  });

  describe('#counter', function() {
    it('should work in defaults', function () {
      var clock = 0;
      res.items.forEach(function (item) {
        assert.deepEqual(clock++, item.counter.normal);
      });
    });

    it('should work with customized start', function () {
      var clock = 100;
      res.items.forEach(function (item) {
        assert.deepEqual(clock++, item.counter.start);
      });
    });

    it('should work with customized step', function () {
      var clock = -10;
      res.items.forEach(function (item) {
        assert.deepEqual((clock += 10), item.counter.step);
      });
    });
  });

  describe('#_$size', function () {
    it('should return the correct size', function () {
      assert.equal(10, res.items[0].size);
    });
  });

  describe('#hide(cond)', function () {
    it('should hide a field', function () {
      res.items.forEach(function (item) {
        if (item.index < 5)
          assert.ok(item.v.half === undefined);
        else
          assert.equal('mark', item.v.half);
      });
    });

    it('should make the hidden field accessible', function () {
      res.items.forEach(function (item) {
        assert.equal('mark', item.v.data);
      });
    });
  });

  describe('#_$index', function () {
    it('should return the index of the current doc', function () {
      res.items.forEach(function (item, index) {
        assert.equal(index, item.index);
      });
    });
  });

  describe('#_$fields', function () {
    it('should be hidden by default', function () {
      res.items.forEach(function (item) {
        assert.ok(item.v._$hide === undefined);
      });
    });

    it('should make the auto hidden field accessible', function () {
      res.items.forEach(function (item) {
        assert.equal('wont be showed anyway', item.v.echo);
      });
    });
  });

});
