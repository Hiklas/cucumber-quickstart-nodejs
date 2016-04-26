var log4js = require('log4js');
log4js.configure('./test/test_log_config.json', {});
var log = log4js.getLogger('configuration_test');

var assert = require('assert'),
    config = require('../lib/configuration');

var TEST_FILENAME = 'Bibbidy_bobbedy_boo';
var TEST_CONFIG_FILE = './test/common.yaml';
var TEST_CONFIG_DEV_FILE = './test/dev.yaml';
var TEST_BROKEN_FILE = './test/common-broken.yaml';
var TEST_MISSING_FILE = './test/test_config_missing_not_here_vanished.yaml';
var TEST_EMPTY = './test/empty.yaml';

var TEST_OBJECT = {
  'fred' : 'ginger',
  'jim' : {
    'sheila' : '6502',
    'acorn' : 'electron',
    'dundee' : {
       'crocodile' : 'Oz'
    }
  }
};

var TEST_SIMPLE_KEY = 'json_schema';
var TEST_SIMPLE_KEY_VALUE = 'data/json_schema';

var TEST_ARRAY_KEY = [ 'webpage_client', 'default_client' ];
var TEST_ARRAY_KEY_VALUE = 'selenium';

var TEST_MERGED_KEY = [ 'webpage_client', 'base_url' ];
var TEST_MERGED_KEY_VALUE = 'http://localhost/';


describe('Configuration', function() {
  describe('Get config object', function() {
    it('Should be an Object', function(done) {
      var result = new config();

      assert.equal(result instanceof config, true, 'Should be an instance of the config object');
      assert.equal(result.constructor.prototype, config.prototype, 'Prototypes should be the same');
      done();
    });
  });

  describe('Get filename', function() {
    it('Should be the same as constructor argument', function(done) {
      var resultObj = new config(TEST_FILENAME);
      var result = resultObj.configFilenameCommon();

      log.debug('Config object: ' + resultObj);
      log.debug('Config result filename: ' + result);

      assert.equal(result, TEST_FILENAME, 'Should be the test config filename');
      done();
    });
  });
  
  describe('Load broken Yaml config file', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_BROKEN_FILE);
      var resultFilename = resultObj.configFilenameCommon();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilename, TEST_BROKEN_FILE, 'Should be the test config filename');
      assert.equal(resultLoaded, false, 'Should not load the config file');
      done();
    });
  });

  describe('Load missing Yaml config file', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_MISSING_FILE);
      var resultFilename = resultObj.configFilenameCommon();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilename, TEST_MISSING_FILE, 'Should be the test config filename');
      assert.equal(resultLoaded, false, 'Should not load the config file');
      done();
    });
  });

  describe('Not loading any file yet', function() {
    it('Should set loaded to false', function(done) {
      var configObj = new config(TEST_MISSING_FILE);
      var loadedResult = configObj.isLoaded();
      assert.equal(loadedResult, false, 'Should be false to indicate no file loaded');
      done();
    });
  });

  describe('Creating with common and environment config', function() {
    it('Should set the respective properties', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_CONFIG_DEV_FILE);
      var loadedResult = configObj.isLoaded();
      assert.equal(loadedResult, false, 'Should be false to indicate no file loaded');
      assert.equal(configObj.common_config_file, TEST_CONFIG_FILE, 'Should be common config file');
      assert.equal(configObj.environment_config_file, TEST_CONFIG_DEV_FILE, 'Should be environment config file');
      done();
    });
  });

  describe('Load Yaml config file', function() {
    it('Should set loaded to true', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE, TEST_CONFIG_DEV_FILE);
      var resultFilenameCommon = resultObj.configFilenameCommon();
      var resultFilenameEnv = resultObj.configFilenameEnvironment();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilenameCommon, TEST_CONFIG_FILE, 'Should be the test config filename');
      assert.equal(resultFilenameEnv, TEST_CONFIG_DEV_FILE, 'Should be the environment file');
      assert.equal(resultLoaded, true, 'Should load the config file');
      done();
    });
  });

  describe('Environment file is broken', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE, TEST_BROKEN_FILE);
      var resultFilenameCommon = resultObj.configFilenameCommon();
      var resultFilenameEnv = resultObj.configFilenameEnvironment();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilenameCommon, TEST_CONFIG_FILE, 'Should be the test config filename');
      assert.equal(resultFilenameEnv, TEST_BROKEN_FILE, 'Should be the environment file');
      assert.equal(resultLoaded, false, 'Should load the config files');
      done();
    });
  });

  describe('Common file is broken', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_BROKEN_FILE, TEST_CONFIG_DEV_FILE);
      var resultFilenameCommon = resultObj.configFilenameCommon();
      var resultFilenameEnv = resultObj.configFilenameEnvironment();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilenameCommon, TEST_BROKEN_FILE, 'Should be the test config filename');
      assert.equal(resultFilenameEnv, TEST_CONFIG_DEV_FILE, 'Should be the environment file');
      assert.equal(resultLoaded, false, 'Should not load the config files');
      done();
    });
  });

  describe('Both files are broken', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_BROKEN_FILE, TEST_BROKEN_FILE);
      var resultFilenameCommon = resultObj.configFilenameCommon();
      var resultFilenameEnv = resultObj.configFilenameEnvironment();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilenameCommon, TEST_BROKEN_FILE, 'Should be the test config filename');
      assert.equal(resultFilenameEnv, TEST_BROKEN_FILE, 'Should be the environment file');
      assert.equal(resultLoaded, false, 'Should not load the config files');
      done();
    });
  });

  describe('Environment file is missing', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE, TEST_MISSING_FILE);
      var resultFilenameCommon = resultObj.configFilenameCommon();
      var resultFilenameEnv = resultObj.configFilenameEnvironment();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilenameCommon, TEST_CONFIG_FILE, 'Should be the test config filename');
      assert.equal(resultFilenameEnv, TEST_MISSING_FILE, 'Should be the environment file');
      assert.equal(resultLoaded, false, 'Should not load the config files');
      done();
    });
  });

  describe('Common file is missing', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_MISSING_FILE, TEST_CONFIG_DEV_FILE);
      var resultFilenameCommon = resultObj.configFilenameCommon();
      var resultFilenameEnv = resultObj.configFilenameEnvironment();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilenameCommon, TEST_MISSING_FILE, 'Should be the test config filename');
      assert.equal(resultFilenameEnv, TEST_CONFIG_DEV_FILE, 'Should be the environment file');
      assert.equal(resultLoaded, false, 'Should load not the config files');
      done();
    });
  });

  describe('Both files are missing', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_MISSING_FILE, TEST_MISSING_FILE);
      var resultFilenameCommon = resultObj.configFilenameCommon();
      var resultFilenameEnv = resultObj.configFilenameEnvironment();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilenameCommon, TEST_MISSING_FILE, 'Should be the test config filename');
      assert.equal(resultFilenameEnv, TEST_MISSING_FILE, 'Should be the environment file');
      assert.equal(resultLoaded, false, 'Should not load the config files');
      done();
    });
  });

  describe('Loading empty dev file', function() {
    it('Should set loaded to true', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);
      var resultFilenameCommon = resultObj.configFilenameCommon();
      var resultFilenameEnv = resultObj.configFilenameEnvironment();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilenameCommon, TEST_CONFIG_FILE, 'Should be the test config filename');
      assert.equal(resultFilenameEnv, TEST_EMPTY, 'Should be the environment file');
      assert.equal(resultLoaded, true, 'Should load the config files');
      done();
    });
  });


  describe('The getFromObject method', function() {
    it('Should return a single result for a string key', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);
       
      var resultValue = configObj.getFromObject('fred', TEST_OBJECT);
      
      assert.equal(resultValue, 'ginger', 'Should match the correct value, was: ' + resultValue);
      done();
    });

    it('Should return an object result for a string key', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);

      var resultValue = configObj.getFromObject('jim', TEST_OBJECT);

      assert.equal(typeof(resultValue), 'object', 'Should be an object');
      assert.equal(resultValue.sheila, '6502', 'Should match the correct value, was: ' + resultValue.sheila);
      assert.equal(resultValue.acorn, 'electron', 'Should match the correct value, was: ' + resultValue.acorn);
      done();
    });

    it('Should return a string result for an array key', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);

      var resultValue = configObj.getFromObject(['jim', 'sheila'], TEST_OBJECT);

      assert.equal(typeof(resultValue), 'string', 'Should be a string');
      assert.equal(resultValue, '6502', 'Should match the correct value, was: ' + resultValue);
      done();
    });

    it('Should return an object result for an array key', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);

      var resultValue = configObj.getFromObject(['jim', 'dundee'], TEST_OBJECT);

      assert.equal(typeof(resultValue), 'object', 'Should be an object');
      assert.equal(resultValue.crocodile, 'Oz', 'Should match the correct value, was: ' + resultValue.crocodile);
      done();
    });

    it('Should return a string result for a long array key', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);

      var resultValue = configObj.getFromObject(['jim', 'dundee', 'crocodile'], TEST_OBJECT);

      assert.equal(typeof(resultValue), 'string', 'Should be a string');
      assert.equal(resultValue, 'Oz', 'Should match the correct value, was: ' + resultValue);
      done();
    });

    it('Should return an empty string result for an incorrect long array key', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);

      var resultValue = configObj.getFromObject(['bibble', 'waffle', 'blip'], TEST_OBJECT);

      assert.equal(typeof(resultValue), 'string', 'Should be a string');
      assert.equal(resultValue, '', 'Should match the correct value, was: ' + resultValue);
      done();
    });

    it('Should return an empty string result for an incorrect short array key', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);

      var resultValue = configObj.getFromObject(['bibble'], TEST_OBJECT);

      assert.equal(typeof(resultValue), 'string', 'Should be a string');
      assert.equal(resultValue, '', 'Should match the correct value, was: ' + resultValue);
      done();
    });

    it('Should return an empty string result for an incorrect string key', function(done) {
      var configObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);

      var resultValue = configObj.getFromObject('bibble', TEST_OBJECT);

      assert.equal(typeof(resultValue), 'string', 'Should be a string');
      assert.equal(resultValue, '', 'Should match the correct value, was: ' + resultValue);
      done();
    });
  });
  
  
  describe('Getting a simple value from common with no environment file', function() {
    it('Should set loaded to true and also return the value', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);
      var resultLoaded = resultObj.loadConfiguration();

      var resultValue = resultObj.get(TEST_SIMPLE_KEY);
      
      assert.equal(resultLoaded, true, 'Should load the config files');
      assert.equal(resultValue, TEST_SIMPLE_KEY_VALUE, 'Should match the correct value, was: ' + resultValue);
      done();
    });
  });

  describe('Using array key from common with no environment file', function() {
    it('Should set loaded to true and also return the correct value', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE, TEST_EMPTY);
      var resultLoaded = resultObj.loadConfiguration();

      var resultValue = resultObj.get(TEST_ARRAY_KEY);

      assert.equal(resultLoaded, true, 'Should load the config files');
      assert.equal(resultValue, TEST_ARRAY_KEY_VALUE, 'Should match the correct value, was: ' + resultValue);
      done();
    });
  });

  describe('Using array key from common and environment file merging same value', function() {
    it('Should set loaded to true and also return the correct value', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE, TEST_CONFIG_DEV_FILE);
      var resultLoaded = resultObj.loadConfiguration();

      var resultValue = resultObj.get(TEST_ARRAY_KEY);

      assert.equal(resultLoaded, true, 'Should load the config files');
      assert.equal(resultValue, TEST_ARRAY_KEY_VALUE, 'Should match the correct value, was: ' + resultValue);
      done();
    });
  });
  
  describe('Using array key from common and environment file merging different value', function() {
    it('Should set loaded to true and also return the correct value', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE, TEST_CONFIG_DEV_FILE);
      var resultLoaded = resultObj.loadConfiguration();

      var resultValue = resultObj.get(TEST_MERGED_KEY);

      assert.equal(resultLoaded, true, 'Should load the config files');
      assert.equal(resultValue, TEST_MERGED_KEY_VALUE, 'Should match the correct value, was: ' + resultValue);
      done();
    });
  });
  
});

