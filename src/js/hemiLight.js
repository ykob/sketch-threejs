var Util = require('./util');

var exports = function(){
  var HemiLight = function() {
    this.rad1 = Util.getRadian(60);
    this.rad2 = Util.getRadian(30);
    this.range = 1000;
    this.hex1 = 0xffffff;
    this.hex2 = 0x333333;
    this.intensity = 1;
    this.obj;
  };
  
  HemiLight.prototype = {
    init: function(hex1, hex2) {
      if (hex1) this.hex1 = hex1;
      if (hex2) this.hex2 = hex2;
      this.obj = new THREE.HemisphereLight(this.hex1, this.hex2, this.intensity);
      this.setPosition();
    },
    setPosition: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.obj.position.copy(points);
    }
  };
  
  return HemiLight;
};

module.exports = exports();
