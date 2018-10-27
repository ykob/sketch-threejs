const THREE = require('three');
const Util = require('./util');

var exports = function(){
  var Force2 = function() {
    this.velocity = new THREE.Vector2();
    this.acceleration = new THREE.Vector2();
    this.anchor = new THREE.Vector2();
    this.mass = 1;
  };

  Force2.prototype.updateVelocity = function() {
    this.acceleration.divideScalar(this.mass);
    this.velocity.add(this.acceleration);
  };
  Force2.prototype.applyForce = function(vector) {
    this.acceleration.add(vector);
  };
  Force2.prototype.applyFriction = function(mu, normal) {
    var force = this.acceleration.clone();
    if (!normal) normal = 1;
    force.multiplyScalar(-1);
    force.normalize();
    force.multiplyScalar(mu);
    this.applyForce(force);
  };
  Force2.prototype.applyDrag = function(value) {
    var force = this.acceleration.clone();
    force.multiplyScalar(-1);
    force.normalize();
    force.multiplyScalar(this.acceleration.length() * value);
    this.applyForce(force);
  };
  Force2.prototype.applyHook = function(rest_length, k) {
    var force = this.velocity.clone().sub(this.anchor);
    var distance = force.length() - rest_length;
    force.normalize();
    force.multiplyScalar(-1 * k * distance);
    this.applyForce(force);
  };

  return Force2;
};

module.exports = exports();
