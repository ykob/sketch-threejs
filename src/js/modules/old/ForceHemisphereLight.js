var Util = require('./util');
var Force3 = require('./Force3');

var exports = function(){
  var ForceHemisphereLight = function(hex1, hex2, intensity) {
    THREE.HemisphereLight.call(this, hex1, hex2, intensity);
    this.force = new Force3();
  };
  ForceHemisphereLight.prototype = Object.create(THREE.HemisphereLight.prototype);
  ForceHemisphereLight.prototype.constructor = ForceHemisphereLight;
  ForceHemisphereLight.prototype.updatePosition = function() {
    this.position.copy(this.force.velocity);
  };
  ForceHemisphereLight.prototype.setPositionSpherical = function(rad1, rad2, range) {
    this.position.copy(Util.getPolarCoord(rad1, rad2, range));
  };
  return ForceHemisphereLight;
};

module.exports = exports();
