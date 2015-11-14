var Util = require('../modules/util');
var Force = require('../modules/force');

var exports = function(){
  var PointLight = function() {
    this.rad1 = Util.getRadian(0);
    this.rad2 = Util.getRadian(0);
    this.range = 200;
    this.hex = 0xffffff;
    this.intensity = 1;
    this.distance = 2000;
    this.decay = 1;
    this.obj;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
  };
  
  PointLight.prototype = {
    init: function(hex, distance) {
      if (hex) this.hex = hex;
      if (distance) this.distance = distance;
      this.obj = new THREE.PointLight(this.hex, this.intensity, this.distance, this.decay);
      this.setPositionSpherical();
    },
    setPositionSpherical: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.obj.position.copy(points);
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
  };
  
  return PointLight;
};

module.exports = exports();
