var datasets = require('../'),
  assert = require('assert'),
  es = require('event-stream');

describe('Generator', function(){
  it('should create a stream automatically', function(done){
    datasets(1, {email: "{{c.email()}}"}).pipe(es.writeArray(function(err, docs){
      if(err) return done(err);
      assert.equal(1, docs.length, 'generate one document');
      assert(docs[0].email, 'with an email field');
      done();
    }));
  });
});
