var Util = require('./util');
var util = new Util();

var exports = function(){
  var HemiLight = function() {
    this.rad1 = 0;
    this.rad2 = 0;
    this.r = 0;
    this.obj;
  };
  
  HemiLight.prototype.init = function(scene, rad1, rad2, r, hex1, hex2, intensity) {
    this.r = r;
    this.obj = new THREE.HemisphereLight(hex1, hex2, intensity);
    this.setPosition(rad1, rad2);
    scene.add(this.obj);
  };
  
  HemiLight.prototype.setPosition = function(rad1, rad2) {
    var points = util.getPointSphere(rad1, rad2, this.r);
    this.obj.position.set(points[0], points[1], points[2]);
  };
  
  return HemiLight;
};

module.exports = exports();
