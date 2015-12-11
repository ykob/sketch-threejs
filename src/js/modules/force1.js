var Util = require('../modules/util');

var exports = function(){
  var Force1 = function() {
    this.position = 0;
    this.velocity = 0;
    this.acceleration = 0;
    this.anchor = 0;
    this.mass = 1;
  };
  
  Force1.prototype.updatePosition = function() {
    this.position = this.velocity;
  };
  Force1.prototype.updateVelocity = function() {
    this.acceleration /= this.mass;
    this.velocity += this.acceleration;
  };
  Force1.prototype.applyForce = function(value) {
    this.acceleration += value;
  };
  Force1.prototype.applyFriction = function(mu, normal) {
    var force = this.acceleration;
    if (!normal) normal = 1;
    force *= -1;
    force /= force;
    force *= mu;
    this.applyForce(force);
  };
  Force1.prototype.applyDrag = function(value) {
    var force = this.acceleration;
    force *= -1;
    force /= force;
    force *= this.acceleration * value;
    this.applyForce(force);
  };
  Force1.prototype.applyHook = function(rest_length, k) {
    var force = this.velocity - this.anchor;
    var distance = force - rest_length;
    force /= force;
    force *= -1 * k * distance;
    this.applyForce(force);
  };

  return Force1;
};

module.exports = exports();
