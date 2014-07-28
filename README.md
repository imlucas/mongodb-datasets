# MongoDB-Datasets

[![Build Status](https://secure.travis-ci.org/imlucas/mongodb-datasets.png)](http://travis-ci.org/imlucas/mongodb-datasets)
[![Dependency Status](https://david-dm.org/imlucas/mongodb-datasets.svg?theme=shields.io)](https://david-dm.org/imlucas/mongodb-datasets)
![npm version](http://img.shields.io/npm/v/mongodb-datasets.svg)
<!-- [![Coverage Status](https://coveralls.io/repos/imlucas/mongodb-datasets/badge.png)](https://coveralls.io/r/imlucas/mongodb-datasets) -->
What's a database without any data? With mongodb-datasets you never worry about
how to populate your MongoDB database with the data as you wish. Unlike a simple
populator, mongodb-datasets is designed to offer you the maximum control of the
data to be in your database.

## Installation

To use the `mongodb-datasets` command, install mongodb-datasets globally:

    $ npm install -g mongodb-datasets

To use the Javascript API, in your project directory:

    $ npm install mongodb-datasets --save

## A Simple Example

test_schema.json
```json
{
  "_id": "{{counter()}}",
  "name": "{{chance.name()}}",
  "phones": [ 3, "{{chance.phone()}}" ],
  "title": "Software {{util.sample(['Engineer', 'Programmer'])}}"
}
```

Using the command:

    $ mongodb-datasets test_schema.json -n 10 -o datasets.json

Or using the Javascript API:
```javascript
var fs = require('fs'),
  es = require('event-stream'),
  assert = require('assert'),
  datasets = require('mongodb-datasets');

fs.createReadStream('./test_schema.json')
  .pipe(datasets.createGeneratorStream({size: 10})
  .pipe(es.writeArray(function (err, array) {
    assert.equal(10, array.length);
  });
```

## Usage

`createGeneratorStream(options)` creates a [Transform]
(http://nodejs.org/api/stream.html#stream_class_stream_transform) stream, which
consumes a Readable stream containing a template schema and produces a stream
of generated documents in the form of Javascript objects.

### Options

* `size` - the number of documents to be populated
* `schema` - an object representing the template schema of your data.
If present, the returned stream effectively behaves as a Writable stream.

### Command line

You can also use mongodb-datasets in cli. Examples:

    $ mongodb-datasets schema.json -n 10 -o dump.out
    $ cat schema.json | mongodb-datasets -n 10 -o -

```
Options:
  -0          Path to a template schema file           [string]
  -n, --size  Number of documents to generate          [required]
  -o, --out   Path to output file. Use "-" for stdout  [required]
  --pretty    Whether to format results
  -h, --help  Show help message
```

## Building your schema

The schema is a JSON or Javascript object which is used as the template of every
single document to be inserted into MongoDB database. The following content in
this section discusses how to specify the value of each name/value pair of the
object.

### Basics

The value can be any primitive data types, such as boolean, number, array, and
object. When the value is a string, it can be used to evaluate Javascript
expressions. All string segments intended to be treated as expressions must be
surrounded by `{{ <expr> }}`. A mix of regular string and expressions are
allowed, whereas a mix of different types is not. Some examples:
* `{ "boolean": true }`
* `{ "brackets_parade": [ { 1: { 2: [ { 3: 3 } ] } } ] }`
* `{ "mix": "1 + 1 = {{ 1+1 }}" }`

### Random data

This project uses [chance.js](http://chancejs.com/) and
[faker.js](https://github.com/FotoVerite/Faker.js) as the internal random data
generator. To invoke them, use `faker.<method>` and `chance.<method>`, or
shortcuts `f.<method>` and `c.<method>`.
* `{ "use_chance": "{{ c.name({ gender: 'female' }) }}" }`
* `{ "use_faker": "{{ faker.Company.catchPhrase() }}" }`

### Type conversion

Maybe you've already noticed. It's not very useful to generate a string from
`"{{c.year()}}"` which is expected to apply commands such as `$gte`.
Since its MongoDB-specific nature, the package currently supports common bson
types as in [bson](https://github.com/mongodb/js-bson) module, such as Number,
Timestamp, Date, and ObjectID. Note that once conversion is triggered, the
target object will be the only produced content. Shortcuts are available: D for
Date, N for Number, O for ObjectID, B for Boolean. Some examples:
* `{ "date": "{{ D(c.date()) }}" }` becomes `ISODate(...)` in MongoDB
* `{ "two": "{{ N(1) + N(1) }}" }` produces `{ "two": 1 }`

### Document-level scope

You can make use of `this` keyword in expressions to get access to values of
other name/value pairs. But its behavior is different from the default `this`
in a Javascript object in the sense that all properties must correspond to
a name/value pair. Using values not yet generated is also supported, and the
invoked values will not be generated more than once per inserted document. You
can also access a field's parent using `this._$parent`.
* `{ "one": 1, "two: "{{ Number(this.one + 1) }}" }`
* `{ "first_name": "{{ this.name.first }}",
     "name": { "first": "{{ c.first() }}" } }` produces consistent result.
* `{ "echo": {{ Object.keys(this) }} }` returns `{ "echo": [ "echo" ] }`
* `{ "1": { "2": "{{ this._$parent.3 }}" }, "3": "{{ c.d6() }}" }`

### Field visibility

You also have control on the visibility of each field. By default, fields with
name starting with `_$` are hidden. To toggle the visibility, simply call
`show(boolean)` or `hide(boolean)` anywhere in the target field's expression.
Note that while hidden one can still access its newly generated value.
* `{ "_$digit": 3, "lat": "{{ c.latitude({fixed: this._$digit}) }}",
                   "lng": "{{ c.longitude({fixed: this._$digit}) }}"}`
* `{ "temperature": "{{ util.random(40, 130) }}",
     "warning": "Too hot! {{ hide(this.temperature < 100) }}" }`

### Utility methods

We are happy to add more methods in a prompt manner should you find any could be
potentially helpful. Currently we have:
* `_$size` - the total number of generated docs in the current run
* `_$index` - the index of the current document, starting from 0
* `counter([id], [start], [step])` - the underlying counts are accessble
  anywhere in the outmost document so that you can use the same counter
  consistently regardless of its position
  + `id` - the index of the counter to use, default is 0
  + `start` - the first count, default is 0
  + `step` - increment of each count, default is 1
* `coordinates(options)` - generate a coordinate pairs of the
  form [\<lat\>, \<lng\>]. Options:
  + `fixed` - number of decimal digits for lat/lng
* `util.sample(list, [n])` - identical to [underscore.js](http://underscorejs.org/#sample)

### Imperfections

* Due to the use of underscore.js, `_` is accessible from within the template
  schema. Its many powerful methods may cause unwanted effects if used unchecked.
* A lot of efforts were made to avoid exposing internal variables, but there is
  still one not properly handled, such as `_state`. Please do not mess with it.
* Expressions provided by users are directly evaluated without any error
  checking, which may cause the program to crash without supplying much helpful
  information to users

## Purpose of this project

With the explosion of data volume and availability, users are transitioning
their focus to analysis and data-mining on these vast datasets. We believe
MongoDB is ideally positioned to provide the backbone to meet these market
needs. While several users have already begun to exploit this, it requires
substantial sunk costs including mapping the aggregation framework to their
current mental model, designing efficient schemas, and acquiring datasets for
prototyping. Work to humanize the aggregation framework is already underway. We
believe supplying users with example schemas for common use cases, such as user
activity streams, time series data, and entity management, and more importantly,
corresponding datasets for prototyping will establish MongoDB as a leader in
this emerging market.

## Change log

### 0.1.0 - Jul. 23, 2014
First release!

### 0.1.1 - Jul. 23, 2014
* Fixed bug that causes `mongodb-datasets` command crash
* Updated README to include all features

### 0.1.3 - Jul. 24, 2014
* Fixed bug that causes inconsistent content if `this.<embedded doc>` is used

### 0.1.4 - Jul. 24, 2014
* Changed `Double` to `Number` to hide Javascript's `Number` constructor
* Added shortcuts `N, D, O, B` for `Number, Date, ObjectID, Boolean`
* Added shortcuts `f` for `faker` and `c` for `chance`
* Added `_$index`
* Made the former `_$size()` a property `_$size`

## License

MIT
