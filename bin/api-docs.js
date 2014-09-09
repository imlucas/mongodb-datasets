#!/usr/bin/env node
var dox = require('dox'),
  fs = require('fs');

var filenames = [ 'lib/schema/context.js' ];
var comments = filenames.map(function (filename) {
  return fs.readFileSync(__dirname + '/../' + filename, 'utf-8');
});
var methods = dox.parseComments(comments.join('\n\n'), {raw: true});

var apis = [];
methods.forEach(function (method) {
  if (method.ignore || method.isPrivate) return;

  var isApi = false; // whether @api tag is present

  method.tags.forEach(function (tag) {
    if (tag.type === 'api') isApi = true;
  });

  if (isApi) apis.push(method);
});

console.log(apis);

//   var stability,
//     isProperty = false,
//     params = [],
//     args = [],
//     opts_arg,
//     group,
//     options = [],
//     todos = [],
//     examples = [],
//     streamable = false;

//   method.tags.forEach(function (tag){
//     var matches;

//     if(tag.type === 'param'){
//       tag.optional = (tag.name.indexOf('[') === 0);
//       tag.name = tag.name.replace('[', '').replace(']', '');
//       if(tag.name === 'opts'){
//         opts_arg = tag;
//       }
//       args.push(tag.name);

//       return params.push(tag);
//     }
//     if(tag.type === 'option'){
//       matches = /\{(\w+)\} (\w+) ?(.*)?/.exec(tag.string);
//       tag.types = [matches[1]];
//       tag.name = matches[2];
//       tag.description = matches[3] || '@todo';
//       return options.push(tag);
//     }
//     if(tag.type === 'example'){
//       matches = /([\w\d\/\:\.]+) (.*)/.exec(tag.string);
//       return examples.push({
//         name: matches[2],
//         url: matches[1]
//       });
//     }
//     if(tag.type === 'group') return group = tag.string;
//     if(tag.type === 'stability') return stability = tag.string;
//     if(tag.type === 'streamable') return streamable = true;
//     if(tag.type === 'todo') todos.push(tag.string);
//   });

//   if(!isProperty && opts_arg && options.length > 0){
//     opts_arg.description += '\n' + options.map(function(opt){
//       return '    - `' + opt.name + '` (' + opt.types.join('|') + ') ... ' + opt.description;
//     }).join('\n') + '\n';
//   }

//   apis.push({
//     name: method.ctx.name,
//     group: group,
//     stability: stability,
//     streamable: streamable,
//     description: method.description.summary,
//     params: params,
//     args: args,
//     options: options,
//     todos: todos,
//     source: method.code,
//     examples: examples
//   });
// });

// var group;
// apis.map(function(api, i){
//   if(i === 0) return; // @todo handle module level docs...
//   if(api.group !== group){
//     console.log('### ' + api.group);
//     group = api.group;
//   }

//   console.log('#### mongoscope.' + api.name + '('+api.args.join(', ')+')\n');

//   if(badges[api.stability]){
//     console.log(badges[api.stability] + '\n');
//   }

//   console.log(api.description);

//   if(api.examples.length > 0){
//     console.log('##### Examples\n');
//     api.examples.map(function(example){
//       console.log('- ['+example.name+']('+example.url+')');
//     });
//     console.log();
//   }

//   if(!api.isProperty && api.params.length > 0){
//     console.log('##### Parameters\n');
//     api.params.map(function(param){
//       console.log('- `'+param.name+'` ('+(param.optional ? 'optional' : 'required')+', '+param.types.join('|')+') ' + (param.description ? '... '+ param.description : ''));
//     });
//     console.log();
//   }

//   if(api.todos.length > 0){
//     console.log('##### Todo\n');
//     api.todos.map(function(t){
//       console.log('- [ ] ' + t);
//     });
//     console.log();
//   }
// });
