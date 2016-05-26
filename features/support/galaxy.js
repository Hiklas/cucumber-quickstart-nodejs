/**
 * 
 * IMPORTANT: This *has* to be on the only file in the support directory
 * since we can't guarantee the order that files will be loaded.
 * Everything that is 'global' for tests needs to go in here.  Also the 
 * logging setup and loading of the configuration files is handled here.
 *
 */
  
var log4js = require('log4js');
var log = log4js.getLogger('galaxy');

// Configure the logging 
log4js.configure('./config/bootstrap_log_config.json', {});

log.trace('galaxy');

var Configuration = require('../../lib/configuration');
var common_config = process.env.CUCUMBER_COMMON_CONFIG || './config/common.yaml';
var env_config = process.env.CUCUMBER_ENV_CONFIG || './config/dev.yaml';

log.debug('Common config: %s', common_config);
log.debug('Environment config: %s', env_config);


/**
 * The galaxy object is intended to be the same for all World objects
 * which means that anything stored or available from it will persist 
 * across scenarios
 * 
 * @constructor
 */
function Galaxy() {
  log.trace('Creating configuration');
  this.config = new Configuration(common_config, env_config);
  this.currentDrivers = {};
}

var extend = Galaxy.prototype;

extend.pageUrlFromName = function(pageName) {
  log.trace('pageUrlFromName - Resolving page name: %s', pageName);
  var pageRelativeUrl = this.config.get(['screens', pageName, 'url']);
  var pageFullUrl = this.fullUrl(pageRelativeUrl);
  log.trace('Found full url: %s', pageFullUrl);
  return pageFullUrl;
};


extend.fullUrl = function(relativeUrl) {
  log.trace('fullUrl - Relative url: %s', relativeUrl);
  var baseUrl = this.config.get(['webpage_client', 'base_url']);
  log.trace('baseUrl: %s', baseUrl);
  return baseUrl + relativeUrl;
};


extend.retrieveClient = function(clientName) {
  log.trace('retrieveClient - client: %s', clientName);
  return this.retrieveOrCreateClient(clientName);
};


extend.retrieveNewClient = function(clientName) {
  log.trace('retrieveNewClient - client: %s', clientName);
  return this.createNewClient(clientName);
};

extend.getOrLoadDriverFor = function(clientName) {
  log.trace('getOrLoadDriverFor - client: %s', clientName);
  var driver = this.currentDrivers[clientName];
  if(!driver) {
    var driverClass = require(this.driverNameFromClientName(clientName));
    this.currentDrivers[clientName] = driver = new driverClass(this.config);
  }
  return driver;
};

extend.driverNameFromClientName = function(clientName) {
  var driverName = './lib' + clientName + '-driver';
  log.debug('Calculated driverName as "%s" from client name "%s"', driverName, clientName);
  return driverName;
};

extend.createNewClient = function(clientName) {
  log.trace('createNewClient - client: %s', clientName);
  var currentDriver = this.getOrLoadDriverFor(clientName);
  var resultClient = null;
  if(currentDriver) {
    if(currentDriver.client) {
      log.trace('Client currently exists, destroying');
      currentDriver.destroy();
    }
    resultClient = currentDriver.create()
  } else {
    log.error('Could not get a driver for the given client name: %s', clientName);
  }
  
};


extend.currentClientForName = function(clientName) {
  log.trace('currentClientForName - client: %s', clientName);
  return this.currentClients[clientName];
};


// This is essentially a shared object that all World objects get
// it means that we can store state across scenario invocations
var galaxyForAllWorlds = new Galaxy();

module.exports = function() {
  
  // Hook that ensures that the galaxy is set for each World instance
  this.Before(function(scenario) {
    log.trace('Setting galaxy');
    this.galaxy = galaxyForAllWorlds;
  });
};



