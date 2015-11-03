var Util = require('./util');
var Force = require('./force');

var exports = function(){
  var Camera = function() {
    this.rad1_base = Util.getRadian(10);
    this.rad1 = this.rad1_base;
    this.rad2 = Util.getRadian(0);
    this.range = 1000;
    this.obj;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
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
      this.anchor.copy(points);
    },
    updatePosition: function() {
      this.obj.position.copy(this.velocity);
    },
    updateVelocity: function() {
      this.acceleration.divideScalar(this.mass);
      this.velocity.add(this.acceleration);
    },
    applyForce: function(vector) {
      this.acceleration.add(vector);
    },
    applyFriction: function() {
      var friction = Force.friction(this.acceleration, 0.1);
      this.applyForce(friction);
    },
    applyDragForce: function(value) {
      var drag = Force.drag(this.acceleration, value);
      this.applyForce(drag);
    },
    hook: function(rest_length, k) {
      var force = Force.hook(this.velocity, this.anchor, rest_length, k);
      this.applyForce(force);
    },
    rotate: function() {
      this.rad1_base += Util.getRadian(0.25);
      this.rad1 = Util.getRadian(Math.sin(this.rad1_base) * 80);
      this.rad2 += Util.getRadian(0.5);
      this.reset();
    },
    lookAtCenter: function() {
      this.obj.lookAt({
        x: 0,
        y: 0,
        z: 0
      });
    },
  };

  return Camera;
};

module.exports = exports();
