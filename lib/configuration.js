var log4js = require('log4js');
var log = log4js.getLogger('configuration');

var fs = require('fs');
var yaml = require('js-yaml');
var objectMerge = require('object-merge');
var is = require('is_js');

module.exports = exports = Configuration;

/**
 * Utility function to check a value and return empty string if it's
 * undefined or null.
 * 
 * @param resultToCheck
 * @returns {string}
 */
function orEmptyString(resultToCheck) {
  return (is.existy(resultToCheck) ? resultToCheck : '');
}

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
  
  log.trace('Config data: %s', this.configData);
  return this.isLoaded();
};

extend.loadIfNeeded = function () {
  if(this.common_loaded != true || this.env_loaded != true) {
    this.loadConfiguration();
  }
};

/**
 * Return a value based on a given key.
 * 
 * If the key is a simple string the data is simply returned based on that top-level
 * property in the parsed YAML data, for example
 * 
 * ---
 * someKey: Some Value
 * 
 * get('someKey') would return 'Some Value'.
 * 
 * If the key is an array it specifies a path through the configuration object,
 * for example
 * 
 * ---
 * someKey:
 *   someOtherKey: Some Other Value
 *   
 * get(['someKey', 'someOtherKey']) would return 'Some other value'
 * 
 * @param key
 * @returns Object or String depending on whether the key refers to a property that 
 * has child nodes or not.  If a key or keys do not match an empty string will be 
 * returned.
 */
extend.get = function(key) {
  log.trace('Get config: %s', key);
  // We MUST clone arrays as they will be modified by the getFromObject
  // method and this can confuse the hell out of any code that calls us
  key = (is.array(key) ? key.slice(0) : key);
  return this.getFromObject(key, this.configData);
};

/**
 * Get the value of a given key (property) from the provided object.
 * 
 * This method is used by the configuration get function to retrieve 
 * values from objects recursively.
 * 
 * This method affects the key object passed to it.  For an array key 
 * the items are shifted as progress is made through the config object.
 * 
 * @param key This MUST be a key that can be modified
 * @param object
 */
extend.getFromObject = function (nextKey, object) {
  if(is.string(nextKey)) {
    log.trace('Key is a string: %s', nextKey);
    return orEmptyString(object[nextKey]);
  }
  
  if(is.array(nextKey)) {
    log.trace('Key is an array');

    var thisKey = nextKey.shift();
    var thisResult = object[thisKey];
    var remainingKeys = nextKey.length;
    
    log.trace('This key is: %s', thisKey);
    
    if(remainingKeys == 0) {
      log.trace('No more keys');
      return orEmptyString(thisResult);
    } else {
      log.trace('There are "%d" more keys', remainingKeys);
      return (is.existy(thisResult) ? this.getFromObject(nextKey, thisResult) : '');
    }    
  }

  log.trace('Do not know what key we are dealing with here, %s, contents: %s', typeof(nextKey), nextKey);
  return '';
};

