var shell = require('./shell');
var INSTALL_COMMAND = 'sh ./install.sh';
var BUILD_DIRECTORY = '/tmp/build';

exports.handler = function(event, context) {
  var command =  event.cmd || 'npm version';
  console.log('Run some NPM!!');

  shell(INSTALL_COMMAND, '.', function(shErr){
    console.log(INSTALL_COMMAND, 'finished:');

    shell(command, BUILD_DIRECTORY, function (commandErr) {
      console.log(command, 'finished:');
      context.done();
    });
  });
};

