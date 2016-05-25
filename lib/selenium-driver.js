var log4js = require('log4js');
var log = log4js.getLogger('selenium-driver');
var WebpageClient = require('webpage-client'); 
  
module.exports = exports = SeleniumDriver;

function SeleniumDriver(config) {
  log.trace('Creating SeleniumDriver');
  WebpageClient.call(this, config);
}

var extend = SeleniumDriver.prototype = Object.create(WebpageClient.prototype);

extend.name = function() {
  return 'SeleniumDriver'
};

