
var build = require('./build');
var install = require('./install');

exports.handler = function(event, context) {
  var command =  event.cmd || 'npm version';
  console.log('Run some NPM!!');

  install(function() {
    console.log('install finished:');

    var invokeId = context.invokeid;
    build(event, invokeId, context.done);

  });
};

