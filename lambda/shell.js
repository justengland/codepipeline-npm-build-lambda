var exec = require('child_process').exec;

var BUILD_DIRECTORY = '/tmp/build';
var NPM_COMMAND = 'sh ' + BUILD_DIRECTORY + '/node_modules/.bin/npm ';

module.exports = callExec;

function callExec(command, workingDirectory, onComplete) {
  if (!command) throw 'Command is needed';
  else console.log('call command:', command);

  var commandReplace = replaceNpm(command);

  var options = workingDirectory ? {cwd: workingDirectory} : {};
  var child = exec(commandReplace, options, function (err, standardOut, standardError) {
    if(standardOut) console.log(command, 'complete', '\n############ child console', commandReplace ,'############\n',  standardOut);
    if(standardError) console.warn(command, 'error', '\n############ child error', commandReplace ,'############\n', standardError);

    // Resolve with result of process
    onComplete && onComplete(err);
  });
};

// A little regex to replace the npm command with a bash statement
function replaceNpm(source) {
  return source.replace(/npm /g, NPM_COMMAND)
}
