var log4js = require('log4js');
var log = log4js.getLogger('world');
var Configuration = require('./lib/configuration');

// Configure the logging 
log4js.configure('./config/bootstrap_log_config.json', {});

var common_config = Process.env.CUCUMBER_COMMON_CONFIG || './config/common.yaml';
var env_config = Process.env.CUCUMBER_ENV_CONFIG || './config/dev.yaml';

function World() {
  log.trace('Creating world object');
  this.config = new Configuration(common_config, env_config);
  this.web_client = null;

}

module.exports = function() {
  this.World = World;
};
