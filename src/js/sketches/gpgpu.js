var glslify = require('glslify');
var Util = require('../modules/util');
var PhysicsRenderer = require('../modules/physics_renderer');

var exports = function(){
  var Sketch = function(scene, camera) {
    this.init(scene, camera);
  };

  var physics_renderer = new PhysicsRenderer(100);

  var createPoints = function() {
    var geometry = new THREE.BufferGeometry();
    var vertices_base = [];
    var vertices = new Float32Array(vertices_base);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        size: {
          type: 'f',
          value: 32.0,
        },
      },
      vertexShader: glslify('../../glsl/gpgpu_points.vs'),
      fragmentShader: glslify('../../glsl/gpgpu_points.fs'),
      transparent: true,
    });
    return new THREE.Points(geometry, material);
  }

  var points = new THREE.Points();

  Sketch.prototype = {
    init: function(scene, camera) {
      camera.force.position.anchor.set(1000, -300, 0);
      camera.force.look.anchor.set(0, 0, 0);
    },
    remove: function(scene) {
    },
    render: function(scene, camera, renderer) {
      camera.force.position.applyHook(0, 0.025);
      camera.force.position.applyDrag(0.2);
      camera.force.position.updateVelocity();
      camera.updatePosition();
      camera.force.look.applyHook(0, 0.2);
      camera.force.look.applyDrag(0.4);
      camera.force.look.updateVelocity();
      camera.updateLook();
    },
    touchStart: function(scene, camera, vector) {
    },
    touchMove: function(scene, camera, vector_mouse_down, vector_mouse_move) {
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
    },
    mouseOut: function(scene, camera) {
    },
    resizeWindow: function(scene, camera) {
    }
  };

  return Sketch;
};

module.exports = exports();
