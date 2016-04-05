var log4js = require('log4js');
log4js.configure('./test/test_log_config.json', {});
var log = log4js.getLogger('configuration_test');

var assert = require('assert'),
    config = require('../lib/configuration');

var TEST_FILENAME = 'Bibbidy_bobbedy_boo';
var TEST_CONFIG_FILE = './test/common.yaml';
var TEST_CONFIG_DEV_FILE = './test/dev.yaml';
var TEST_BROKEN_FILE = './test/common-broken.yaml';
var TEST_MISSING_FILE = './test/test_config_missing_not_here_vanished.yml';


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
      var result = resultObj.configFilename();

      log.debug('Config object: ' + resultObj);
      log.debug('Config result filename: ' + result);

      assert.equal(result, TEST_FILENAME, 'Should be the test config filename');
      done();
    });
  });

  describe('Load Yaml config file', function() {
    it('Should set loaded to true', function(done) {
      var resultObj = new config(TEST_CONFIG_FILE);
      var resultFilename = resultObj.configFilename();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilename, TEST_CONFIG_FILE, 'Should be the test config filename');
      assert.equal(resultLoaded, true, 'Should load the config file');
      done();
    });
  });

  describe('Load broken Yaml config file', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_BROKEN_FILE);
      var resultFilename = resultObj.configFilename();
      var resultLoaded = resultObj.loadConfiguration();

      assert.equal(resultFilename, TEST_BROKEN_FILE, 'Should be the test config filename');
      assert.equal(resultLoaded, false, 'Should not load the config file');
      done();
    });
  });

  describe('Load missing Yaml config file', function() {
    it('Should set loaded to false', function(done) {
      var resultObj = new config(TEST_MISSING_FILE);
      var resultFilename = resultObj.configFilename();
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

});

