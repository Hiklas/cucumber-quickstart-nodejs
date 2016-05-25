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

/**
 * Create the client.
 * 
 * This creates a client for the given driver.  We only expect there to be 
 * one client/connection for a given driver and this call is used to set this up
 * and ensure that everything is ready to run tests.
 * 
 * Often clients will persist across many tests, for example, we may use the same 
 * browser so that the session is maintained.
 */
extend.create = function() {
  throw new Error('Not implemented');
};

/**
 * Destroy this client, cleaning up any resources.
 * 
 * This is the opposite of create and is called to shutdown and clean-up a client
 * either because we have finished the tests or in preparation for starting 
 * some new steps that require a clean session.
 */
extend.destroy = function() {
  throw new Error('Not implemented');
};

