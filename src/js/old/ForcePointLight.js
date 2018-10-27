const THREE = require('three');
const Util = require('./util');
const Force3 = require('./Force3');

var exports = function(){
  var ForcePointLight = function(hex, intensity, distance, decay) {
    THREE.PointLight.call(this, hex, intensity, distance, decay);
    this.force = new Force3();
  };
  ForcePointLight.prototype = Object.create(THREE.PointLight.prototype);
  ForcePointLight.prototype.constructor = ForcePointLight;
  ForcePointLight.prototype.updatePosition = function() {
    this.position.copy(this.force.velocity);
  };
  ForcePointLight.prototype.setPolarCoord = function(rad1, rad2, range) {
    this.position.copy(Util.getPolarCoord(rad1, rad2, range));
  };
  return ForcePointLight;
};

module.exports = exports();
