var log4js = require('log4js');
var log = log4js.getLogger('world');
var Configuration = require('../../lib/configuration');

// Configure the logging 
log4js.configure('./config/bootstrap_log_config.json', {});

var common_config = process.env.CUCUMBER_COMMON_CONFIG || './config/common.yaml';
var env_config = process.env.CUCUMBER_ENV_CONFIG || './config/dev.yaml';

log.trace('world.js');
log.debug('Common config: %s', common_config);
log.debug('Environment config: %s', env_config);

function World() {
  log.trace('Creating world object');
  this.config = new Configuration(common_config, env_config);
  this.web_client = null;

}

module.exports = function() {
  this.World = World;
};
