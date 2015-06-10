var Get = require('./get');
var get = new Get();

var exports = function(){
  var PointLight = function() {
    this.rad1 = 0;
    this.rad2 = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.r = 0;
    this.obj;
  };
  
  PointLight.prototype.init = function(scene, rad1, rad2, r, hex, intensity, distance) {
    this.r = r;
    this.obj = new THREE.PointLight(hex, intensity, distance);
    this.setPosition(rad1, rad2);
    scene.add(this.obj);
  };
  
  PointLight.prototype.setPosition = function(rad1, rad2) {
    var points;
    this.rad1 = rad1;
    this.rad2 = rad2;
    points = get.pointSphere(this.rad1, this.rad2, this.r);
    this.obj.position.set(points[0], points[1], points[2]);
  };
  
  return PointLight;
};

module.exports = exports();
