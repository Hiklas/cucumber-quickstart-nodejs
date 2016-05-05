var log4js = require('log4js');
var log = log4js.getLogger('world');

log.trace('world.js');

function World() {
  log.trace('Creating world object');
  this.web_client = null;
}

module.exports = function() {
  this.World = World;
};

var extend = World.prototype;

extend.pending = function(callback) {
  callback.apply(this, [null, 'pending']);
};

extend.retrieveClient = function(clientName) {
  log.trace('retrieveClient - client name: %s', clientName);
  this.current_client = this.galaxy.retrieveClient(clientName);
};
