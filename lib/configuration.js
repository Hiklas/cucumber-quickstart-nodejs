var log4js = require('log4js');
var log = log4js.getLogger('configuration');

var fs = require('fs');
var yaml = require('js-yaml');

module.exports = exports = Configuration;

/**
 * Create a configuration object for a given file
 */
function Configuration(config_file) {
  this.config_file = config_file;
  this.loaded = false;
}

var extend = Configuration.prototype;

extend.configFilename = function () {
  return this.config_file;
};

extend.isLoaded = function() {
  return this.loaded;
};

extend.loadConfiguration = function() {
  var fileContent = null;
  var parsedYaml = null;

  try {
    log.debug('Reading config data from: ' + this.config_file);
    fileContent = fs.readFileSync(this.config_file);

    log.debug('Parsing config data from: ' + this.config_file);
    parsedYaml = yaml.safeLoad(fileContent);

    log.debug('Parsed YAML: ' + parsedYaml);
  } catch (exception) {
    log.debug('Caught an exception: ' + exception);
  }

  if(parsedYaml == null) {
    log.debug('Failed to load YAML');
    this.loaded = false;
    this.configData = null;
  } else {
    log.debug('Loaded JSON');
    this.loaded = true;
    this.configData = parsedYaml;
  }

  return this.loaded;
};

extend.loadIfNeeded = function () {
  if(this.loaded != true) {
    this.loadConfiguration();
  }
};
