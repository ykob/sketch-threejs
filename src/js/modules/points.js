var Util = require('../modules/util');
var Force = require('../modules/force');

var exports = function(){
  var Points = function() {
    this.geometry = new THREE.BufferGeometry();
    this.material = null;
    this.obj = null;
    this.position = null;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
  };
  
  Points.prototype = {
    init: function(param) {
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          color: { type: 'c', value: new THREE.Color(0xffffff) },
          texture: { type: 't', value: param.texture }
        },
        vertexShader: param.vs,
        fragmentShader: param.fs,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      this.geometry.addAttribute('position', new THREE.BufferAttribute(param.positions, 3));
      this.geometry.addAttribute('customColor', new THREE.BufferAttribute(param.colors, 3));
      this.geometry.addAttribute('vertexOpacity', new THREE.BufferAttribute(param.opacities, 1));
      this.geometry.addAttribute('size', new THREE.BufferAttribute(param.sizes, 1));
      this.obj = new THREE.Points(this.geometry, this.material);
      param.scene.add(this.obj);
      this.position = this.obj.position;
    },
    updatePoints: function() {
      this.obj.geometry.attributes.position.needsUpdate = true;
      this.obj.geometry.attributes.vertexOpacity.needsUpdate = true;
      this.obj.geometry.attributes.size.needsUpdate = true;
    },
    updateVelocity: function() {
      this.acceleration.divideScalar(this.mass);
      this.velocity.add(this.acceleration);
    },
    updatePosition: function() {
      this.position.copy(this.velocity);
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

  return Points;
};

module.exports = exports();
