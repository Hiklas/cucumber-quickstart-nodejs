/**
 * 
 * IMPORTANT: This *has* to be on the only file in the support directory
 * since we can't guarantee the order that files will be loaded.
 * Everything that is 'global' for tests needs to go in here.  Also the 
 * logging setup and loading of the configuration files is handled here.
 * 
 * 
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
}

// This is essentially a shared object that all World objects get
// it means that we can store state across scenario invocations
var galaxyForAllWorlds = new Galaxy();

module.exports = function() {
  this.Before(function(scenario) {
    log.trace('Setting galaxy');
    this.galaxy = galaxyForAllWorlds;
  });
};



