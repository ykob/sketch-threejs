var exports = function(){
  var Camera = function() {
    this.width = 0;
    this.height = 0;
    this.rad1 = 0;
    this.rad2 = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.r = 0;
    this.obj;
    this.trackball;
  };
  
  Camera.prototype.init = function(width, height, rad1, rad2, r) {
    this.width = width;
    this.height = height;
    this.r = r;
    this.obj = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 4000);
    this.setPosition(rad1, rad2);
    this.initTrackBall();
  };
  
  Camera.prototype.setPosition = function(rad1, rad2) {
    this.rad1 = rad1;
    this.rad2 = rad2;
    this.x = Math.cos(this.rad1) * Math.cos(this.rad2) * this.r;
    this.y = Math.cos(this.rad1) * Math.sin(this.rad2) * this.r;
    this.z = Math.sin(this.rad1) * this.r;

    this.obj.position.set(this.x, this.y, this.z);
    this.obj.up.set(0, 1, 0);
    this.obj.lookAt({
      x: 0,
      y: 0,
      z: 0
    });
  };
  
  Camera.prototype.initTrackBall = function() {
    this.trackball = new THREE.TrackballControls(this.obj, this.canvas);
    this.trackball.screen.width = this.width;
    this.trackball.screen.height = this.height;
    this.trackball.noRotate = false;
    this.trackball.rotateSpeed = 3;
    this.trackball.noZoom = false;
    this.trackball.zoomSpeed = 1;
    this.trackball.noPan = true;
    this.trackball.maxDistance = 3000;
    this.trackball.minDistance = 500;
  };
  
  return Camera;
};

module.exports = exports();
