var log4js = require('log4js');
var log = log4js.getLogger('general-steps');

log.trace('general-steps.js');

module.exports = function () {
  
  this.Given(/^I am using a (.+) client$/, function (clientName, callback) {
    log.trace('Given I am using a "%s" client', clientName);
    this.retrieveClient(clientName);
    callback();
  });

  this.Given(/^I am using a new (.+) client$/, function (clientName, callback) {
    log.trace('Given I am using a new "%s" client', clientName);
    this.retrieveNewClient(clientName);
    callback();
  });
  

  this.Given(/^I open the browser$/, function (callback) {
    log.trace('I open the browser');

    this.pending(callback);
  });


  this.When(/^I navigate to the (.+) page$/, function (pageName, callback) {
    log.trace('I navigate to the "%s" page', pageName);

    this.pending(callback);
  });

  this.Then(/^The page I am on has the correct title$/, function (callback) {
    log.trace('The page I am on has the correct title');

    this.pending(callback);
  });

  this.Then(/^There is a (.+) element$/, function (elementName, callback) {
    log.trace('There is a "%s" element', elementName);

    this.pending(callback);
  });
  
};


