var Util = require('./util');
var Force = require('./force');

var exports = function(){
  var Mover = function() {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1;
    this.time = 0;
    this.is_active = false;
  };
  
  Mover.prototype = {
    init: function(vector) {
      this.position = vector.clone();
      this.velocity = vector.clone();
      this.anchor = vector.clone();
      this.acceleration.set(0, 0, 0);
      this.a = 1;
      this.time = 0;
    },
    updatePosition: function() {
      this.position.copy(this.velocity);
    },
    updateVelocity: function() {
      this.acceleration.divideScalar(this.mass);
      this.velocity.add(this.acceleration);
      // if (this.velocity.distanceTo(this.position) >= 1) {
      //   this.direct(this.velocity);
      // }
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
    activate: function () {
      this.is_active = true;
    },
    inactivate: function () {
      this.is_active = false;
    }
  };

  return Mover;
};

module.exports = exports();
