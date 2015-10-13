var Util = require('./util');

var exports = function(){
  var HemiLight = function() {
    this.rad1 = 0;
    this.rad2 = 0;
    this.range = 0;
    this.obj;
  };
  
  HemiLight.prototype = {
    init: function(scene, rad1, rad2, range, hex1, hex2, intensity) {
      this.range = range;
      this.obj = new THREE.HemisphereLight(hex1, hex2, intensity);
      this.setPosition(rad1, rad2);
      scene.add(this.obj);
    },
    setPosition: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.r);
      this.obj.position.set(points[0], points[1], points[2]);
    }
  };
  
  return HemiLight;
};

module.exports = exports();
