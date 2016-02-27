var shell = require('./shell');

var INSTALL_COMMAND = 'sh ./install.sh';
var isWindows = /^win/.test(process.platform);

module.exports = install;

function install(onComplete) {
  console.log('---------------------------------------------------------------------------');
  console.log('----------------------------  Run install ---------------------------------');
  if(!isWindows) {

    shell(INSTALL_COMMAND, '.', function(err) {
      console.log(INSTALL_COMMAND, 'finished:');
      onComplete && onComplete(err);
    });
  }
  else {
    onComplete && onComplete();
  }
}