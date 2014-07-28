#!/usr/bin/env node

var datasets = require('../'),
  fs = require('fs'),
  yargs = require('yargs')
    .usage('MongoDB-Datasets version ' + datasets.version + '\n' +
           'Usage: mongodb-datasets [schema] [options]')
    .example('$0 schema.json -n 10 -o dump.out', '')
    .example('cat schema.json | $0 -n 10 -o -', '')
    .describe(0, 'Path to a template schema file')
    .options('n', {
      demand: true,
      alias: 'size',
      describe: 'Number of documents to generate'
    })
    .options('o', {
      demand: true,
      alias: 'out',
      string: true,
      describe: 'Path to output file. Use "-" for stdout'
    })
    .options('pretty', {
      boolean: true,
      describe: 'Whether to format results'
    })
    .options('h', {
      alias: 'help',
      boolean: true,
      describe: 'Show help message'
    }),
  argv = yargs.argv;

if (argv.h || argv._[0] === 'help') return yargs.showHelp();

// the schema file can also be piped in through stdin
if(argv._[0] && !fs.existsSync(argv._[0])){
  console.error('File `'+argv._[0]+'` does not exist!');
  return yargs.showHelp();
}

var stringify = datasets.stringify({spaces: (argv.pretty ? 2 : 0)}),
  src = argv._[0] ? fs.createReadStream(argv._[0]) : process.stdin,
  dest = (argv.out === '-') ? process.stdout : fs.createWriteStream(argv.out),
  generator = datasets.createGeneratorStream({size: argv.size});

src.pipe(generator).pipe(stringify).pipe(dest);
