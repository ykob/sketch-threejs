var THREE = require('three');
var Util = require('../modules/util');
var Force = require('../modules/force');

var exports = function(){
  var PointLight = function() {
    this.rad1 = Util.getRadian(0);
    this.rad2 = Util.getRadian(0);
    this.range = 200;
    this.hex = 0xffffff;
    this.intensity = 1;
    this.distance = 2000;
    this.decay = 1;
    this.obj;
    Force.call(this);
  };
  PointLight.prototype = Object.create(Force.prototype);
  PointLight.prototype.constructor = PointLight;
  PointLight.prototype.init = function(hex, distance) {
    if (hex) this.hex = hex;
    if (distance) this.distance = distance;
    this.obj = new THREE.PointLight(this.hex, this.intensity, this.distance, this.decay);
    this.position = this.obj.position;
    this.setPositionSpherical();
  };
  PointLight.prototype.setPositionSpherical = function() {
    var points = Util.getSpherical(this.rad1, this.rad2, this.range);
    this.position.copy(points);
  };
  return PointLight;
};

module.exports = exports();
