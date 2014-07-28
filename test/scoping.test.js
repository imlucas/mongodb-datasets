var helpers = require('./helpers');
var assert = require('assert');

describe('scoping', function() {
  var res = { item: null };
  before(function(done) {
    var schema = {
      'greetings': 'This is {{this.name}}',
      'name': '{{c.name()}}',
      'zip': '00000',
      'full_zip': '{{this.zip+"-0000"}}',
      'num': {
        'one': 1,
        'zip': '{{this._$parent.zip}}',
        'name': '{{this._$parent.name}}',
        's2': '{{this._$parent.s2}}',
        'index': '{{N(counter())}}'
      },
      'two': '{{N(this.num.one+1)}}',
      'dependent': '{{this.s1}}-{{this.s2}}',
      's1': 'Constant',
      's2': '{{c.name()}}',
      'index': '{{N(this.num.index)}}'
    };
    var options = {
      size: 1,
    };
    helpers.generate(schema, options, function (err, items) {
      if (err) return done(err);
      res.item = items[0];
      done();
    });
  });

  it('should work with constants', function () {
    assert.equal('00000', res.item.zip);
    assert.equal('00000-0000', res.item.full_zip);
  });

  it('should work with random content', function () {
    var name = res.item.name;
    assert.equal('This is ' + name, res.item.greetings);
  });

  it('should work with embedded docs', function () {
    assert.ok(typeof res.item.num.one === 'number');
    assert.deepEqual(1, res.item.num.one);
    assert.ok(typeof res.item.two === 'number');
    assert.deepEqual(2, res.item.two);
  });

  it('should support using not-yet-generated variables', function () {
    var d = res.item.dependent;
    assert.ok(typeof d === 'string');
    var comps = d.split('-');
    assert.equal('Constant', comps[0]);
    assert.equal(res.item.s2, comps[1]);
  });

  it('should have access to parent variables', function () {
    assert.equal(res.item.num.zip, res.item.zip);
    assert.equal(res.item.num.name, res.item.name);
    assert.equal(res.item.num.s2, res.item.s2);
  });

  it('should not cause redundant generating via getter of a doc', function () {
    assert.equal(0, res.item.index);
    assert.equal(0, res.item.num.index);
  });

});
