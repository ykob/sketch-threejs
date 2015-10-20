var Util = require('./util');

var exports = function(){
  var Camera = function() {
    this.rad1 = Util.getRadian(60);
    this.rad2 = Util.getRadian(30);
    this.range = 1000;
    this.obj;
  };
  
  Camera.prototype = {
    init: function(width, height) {
      this.obj = new THREE.PerspectiveCamera(35, width / height, 1, 10000);
      this.obj.up.set(0, 1, 0);
      this.setPosition();
      this.lookAtCenter();
    },
    reset: function() {
      this.setPosition();
      this.lookAtCenter();
    },
    resize: function(width, height) {
      this.obj.aspect = width / height;
      this.obj.updateProjectionMatrix();
    },
    setPosition: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.obj.position.set(points[0], points[1], points[2]);
    },
    lookAtCenter: function() {
      this.obj.lookAt({
        x: 0,
        y: 0,
        z: 0
      });
    }
  };

  return Camera;
};

module.exports = exports();
