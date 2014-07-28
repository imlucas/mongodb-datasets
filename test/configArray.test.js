var helpers = require('./helpers');
var assert = require('assert');

describe('configurable arrays', function() {
  var res = { items: null };
  before(function(done) {
    var schema = {
      'defaults': [ 'default options apply' ],
      'hardcoded': {
        'zero': [ 0, 'should not appear' ],
        'normal': [ 3, '{{N(counter())}}']
      },
      'random': {
        'field': [ '{{_.random(1, 1)}}', '{{c.name()}}' ],
        'doc': [ '{{_.random(1, 3)}}', {
          'some_field': '{{c.name()}}'
        } ]
      },
      'embedded': [ 1, [ '{{N(c.latitude())}}',
                         '{{N(c.longitude())}}' ] ]
    };
    var opts = {
      size: 50,
    };
    helpers.generate(schema, opts, function (err, items) {
      if (err) return done(err);
      res.items = items;
      done();
    });
  });

  it('should not affect un-configured array', function () {
    res.items.forEach(function (item) {
      assert.ok(Array.isArray(item.defaults));
      var l = item.defaults.length;
      assert.ok(l < 4 && l > 0);
    });
  });

  it('should support hardcoded array length', function () {
    res.items.forEach(function (item) {
      assert.ok(Array.isArray(item.hardcoded.zero));
      assert.ok(Array.isArray(item.hardcoded.normal));
      assert.equal(0, item.hardcoded.zero.length);
      assert.equal(3, item.hardcoded.normal.length);
    });
  });

  it('should support random array length', function () {
    res.items.forEach(function (item) {
      assert.ok(Array.isArray(item.random.field));
      assert.ok(Array.isArray(item.random.doc));
      assert.equal(1, item.random.field.length);
      var l = item.random.doc.length;
      assert.ok(l > 0 && l < 4);
    });
  });

  // it('should support array of any length as content', function () {
  //   console.log(res.items[0].embedded);
  //   res.items.forEach(function (item) {
  //     assert.ok(Array.isArray(item.embedded));
  //     assert.equal(1, item.embedded.length);
  //     assert.ok(Array.isArray(item.embedded[0]));
  //     assert.equal(2, item.embedded[0].length);
  //     assert.ok(typeof item.embedded[0][0] === 'number');
  //     assert.ok(typeof item.embedded[0][1] === 'number');
  //   });
  // });

});
