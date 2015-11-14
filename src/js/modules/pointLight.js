var Util = require('../modules/util');

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
  };
  
  PointLight.prototype = {
    init: function(hex, distance) {
      if (hex) this.hex = hex;
      if (distance) this.distance = distance;
      this.obj = new THREE.PointLight(this.hex, this.intensity, this.distance, this.decay);
      this.setPositionSpherical();
    },
    setPositionSpherical: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.obj.position.copy(points);
    }
  };
  
  return PointLight;
};

module.exports = exports();
