var Util = require('./util');

var exports = function(){
  var Camera = function() {
    this.width = 0;
    this.height = 0;
    this.rad1 = Util.getRadian(60);
    this.rad2 = Util.getRadian(30);
    this.range = 1600;
    this.obj;
  };
  
  Camera.prototype = {
    init: function(width, height) {
      this.width = width;
      this.height = height;
      this.obj = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 10000);
      this.obj.up.set(0, 1, 0);
      this.setPosition(this.rad1, this.rad2, this.r);
      this.lookAtCenter();
    },
    reset: function() {
      this.setPosition(this.rad1, this.rad2, this.r);
      this.lookAtCenter();
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
