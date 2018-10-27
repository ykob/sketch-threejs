const THREE = require('three');
const Util = require('./util');
const Force3 = require('./Force3');

var exports = function(){
  var ForceCamera = function(fov, aspect, near, far) {
    THREE.PerspectiveCamera.call(this, fov, aspect, near, far);
    this.force = {
      position: new Force3(),
      look: new Force3(),
    };
    this.up.set(0, 1, 0);
  };
  ForceCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
  ForceCamera.prototype.constructor = ForceCamera;
  ForceCamera.prototype.updatePosition = function() {
    this.position.copy(this.force.position.velocity);
  };
  ForceCamera.prototype.updateLook = function() {
    this.lookAt(
      this.force.look.velocity.x,
      this.force.look.velocity.y,
      this.force.look.velocity.z
    );
  };
  ForceCamera.prototype.reset = function() {
    this.setPolarCoord();
    this.lookAtCenter();
  };
  ForceCamera.prototype.resize = function(width, height) {
    this.aspect = width / height;
    this.updateProjectionMatrix();
  };
  ForceCamera.prototype.setPolarCoord = function(rad1, rad2, range) {
    this.force.position.anchor.copy(Util.getPolarCoord(rad1, rad2, range));
  };
  ForceCamera.prototype.lookAtCenter = function() {
    this.lookAt(0, 0, 0);
  };
  return ForceCamera;
};

module.exports = exports();
