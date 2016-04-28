var log4js = require('log4js');
var log = log4js.getLogger('webpage-client');
  
module.exports = exports = WebpageClient;

function WebpageClient(config) {
  log.trace('Creating WebpageClient');
  this.config = config;
}

var extend = WebpageClient.prototype;

extend.name = function() {
  return 'WebpageClient';
};

