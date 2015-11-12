var Util = require('../modules/util');

var exports = function(){
  var Points = function() {
    this.geometry = new THREE.BufferGeometry();
    this.material = null;
    this.obj = null;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
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
    },
    updateVelocity: function() {
      this.velocity.add(this.acceleration);
    },
    updatePosition: function() {
      this.position.copy(this.velocity);
    },
    updatePoints: function() {
      this.obj.geometry.attributes.position.needsUpdate = true;
      this.obj.geometry.attributes.vertexOpacity.needsUpdate = true;
      this.obj.geometry.attributes.size.needsUpdate = true;
    }
  };

  return Points;
};

module.exports = exports();
