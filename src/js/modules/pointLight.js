var Util = require('../modules/util');

var exports = function(){
  var PointLight = function() {
    this.rad1 = Util.getRadian(0);
    this.rad2 = Util.getRadian(0);
    this.range = 200;
    this.hex = 0xdddd33;
    this.intensity = 1;
    this.distance = 2300;
    this.decay = 1;
    this.obj;
  };
  
  PointLight.prototype = {
    init: function(hex) {
      this.obj = new THREE.PointLight(this.hex, this.intensity, this.distance, this.decay);
      this.setPosition();
    },
    setPosition: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.obj.position.copy(points);
    }
  };
  
  return PointLight;
};

module.exports = exports();
