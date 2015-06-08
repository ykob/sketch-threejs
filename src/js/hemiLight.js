var exports = function(){
  var HemiLight = function() {
    this.rad1 = 0;
    this.rad2 = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.r = 0;
    this.obj;
  };
  
  HemiLight.prototype.init = function(scene, rad1, rad2, r, color1, color2, val) {
    this.r = r;
    this.obj = new THREE.HemisphereLight(color1, color2, val);
    this.setPosition(rad1, rad2);
    scene.add(this.obj);
  };
  
  HemiLight.prototype.setPosition = function(rad1, rad2) {
    this.rad1 = rad1;
    this.rad2 = rad2;
    this.x = Math.cos(this.rad1) * Math.cos(this.rad2) * this.r;
    this.y = Math.cos(this.rad1) * Math.sin(this.rad2) * this.r;
    this.z = Math.sin(this.rad1) * this.r;

    this.obj.position.set(this.x, this.y, this.z);
  };
  
  return HemiLight;
};

module.exports = exports();
