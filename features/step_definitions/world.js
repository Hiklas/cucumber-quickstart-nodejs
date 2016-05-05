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

var ext = World.prototype;

ext.pending = function(callback) {
  callback.apply(this, [null, 'pending']);
};


