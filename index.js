var util = require('util');
var stream = require('stream');
var exec = require('child_process').exec;

var commands = require('./commands');

util.inherits(Driver,stream);
util.inherits(Device,stream);

function Driver(opts,app) {

  this._app = app;

  app.on('client::up',function(){
    commands.forEach(this.createCommandDevice.bind(this));
  }.bind(this));

}

Driver.prototype.createCommandDevice = function(cmd) {
  var d = new Device(this._app, cmd);
  this.emit('register', d);
};

function Device(app, config) {
  app.log.debug('Creating Pi Device : ' + config.name);
  var self = this;

  this._app = app;
  this.config = config

  this.writeable = true;
  this.readable = true;
  this.V = config.vendorId;
  this.D = config.deviceId;
  this.G = 'pi' + (config.name).replace(/[^a-zA-Z0-9]/g, '');
  this.name = 'Pi - ' + config.name;

  this.read();
}

Device.prototype.write = Device.prototype.read = function() {
  this._app.log.debug('Pi Driver : Executing : ' + this.config.command);

  exec(this.config.command, function(error, stdout, stderr) {
    setTimeout(this.read.bind(this), this.config.interval || 30000);

    if (error || stderr) {
      this._app.log.warning('Pi Driver : ' + this.name + ' failed! - ' + error||stderr);
      return;
    }

    var result = (stdout+'');

    if (this.config.regex) {
      result = result.match(this.config.regex);
      if (result && result.length) {
        result = result.pop();
      }
    }

    (this.config.data || []).forEach(function(fn) {

      var x = result;
      try {
        result = fn(result);
      } catch(e) {
        result = undefined;
      }
      //console.log(this.name + ' DATA ' + x + '>' + result);
    }.bind(this));

    if (result !== undefined && !isNaN(result)) {
      this.emit('data', result);
    }

  }.bind(this));
};


module.exports = Driver;
