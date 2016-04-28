var log4js = require('log4js');
var log = log4js.getLogger('dummy-driver');
var WebpageClient = require('webpage-client');

module.exports = exports = DummyDriver;

function DummyDriver(config) {
  log.trace('Creating DummyDriver');
  this.config = config;
}

var extend = DummyDriver.prototype = Object.create(WebpageClient.prototype);

extend.name = function() {
  return 'DummyDriver'
};