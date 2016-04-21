var log4js = require('log4js');
var log = log4js.getLogger('configuration');

var fs = require('fs');
var yaml = require('js-yaml');
var objectMerge = require('object-merge');

module.exports = exports = Configuration;


/**
 * Create a configuration object for a given file
 */
function Configuration(common_config_file, environment_config_file) {
  this.common_config_file = common_config_file;
  this.environment_config_file = environment_config_file;
  this.common_loaded = false;
  this.env_loaded = false;
}

var extend = Configuration.prototype;

extend.configFilenameCommon = function () {
  return this.common_config_file;
};

extend.configFilenameEnvironment = function () {
  return this.environment_config_file;
};


extend.isLoaded = function() {
  return this.common_loaded && this.env_loaded;
};

extend.loadConfigurationFile = function(configFilename) {
  var fileContent = null;
  var parsedYaml = null;
  var loaded = false;
  var loadedData = {};

  try {
    log.debug('Reading config data from: "%s"', configFilename);
    fileContent = fs.readFileSync(configFilename);

    log.debug('Parsing config data from: "%s"', configFilename);
    parsedYaml = yaml.safeLoad(fileContent);

    log.debug('Parsed YAML: ' + parsedYaml);
  } catch (exception) {
    log.debug('Caught an exception: ' + exception);
  }

  if(parsedYaml == null) {
    log.error('Failed to load YAML for "%s"', configFilename);
    loaded = false;
  } else {
    log.debug('Loaded JSON');
    loaded = true;
    loadedData = parsedYaml;
  }

  return { loaded: loaded, loadedData: loadedData };
};

extend.loadConfiguration = function() {
  var commonResult = this.loadConfigurationFile(this.configFilenameCommon());
  var environmentResult = this.loadConfigurationFile(this.configFilenameEnvironment());
  
  this.common_loaded = commonResult.loaded;
  this.env_loaded = environmentResult.loaded;
  this.configData = objectMerge(commonResult.loadedData, environmentResult.loadedData);
  
  return this.isLoaded();
};

extend.loadIfNeeded = function () {
  if(this.common_loaded != true || this.env_loaded != true) {
    this.loadConfiguration();
  }
};

extend.get = function(key) {
  return this.configData[key];
};
