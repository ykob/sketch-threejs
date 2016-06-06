var glslify = require('glslify');
var Util = require('../modules/util');
var PhysicsRenderer = require('../modules/physics_renderer');

var exports = function(){
  var Sketch = function(scene, camera) {
    this.init(scene, camera);
  };

  var length = 1000;
  var physics_renderer = new PhysicsRenderer(length);

  var createPoints = function() {
    var geometry = new THREE.BufferGeometry();
    var vertices_base = [];
    var forces_base = [];
    for (var i = 0; i < Math.pow(length, 2); i++) {
      var r = Util.getRandomInt(0, 1000);
      var rad = Util.getRadian(Util.getRandomInt(0, 3600) / 10);
      vertices_base.push(Math.cos(rad) * r, 0, Math.sin(rad) * r);
      forces_base.push(Util.getRandomInt(1, 1000) / 1000)
    }
    var vertices = new Float32Array(vertices_base);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var forces = new Float32Array(forces_base);
    geometry.addAttribute('force', new THREE.BufferAttribute(forces, 1));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        size: {
          type: 'f',
          value: 32.0,
        },
        velocity: {
          type: 't',
          value: physics_renderer.target
        }
      },
      vertexShader: glslify('../../glsl/gpgpu_points.vs'),
      fragmentShader: glslify('../../glsl/gpgpu_points.fs'),
      transparent: true,
    });
    return new THREE.Points(geometry, material);
  }
  var points = createPoints();

  Sketch.prototype = {
    init: function(scene, camera) {
      scene.add(points);
      camera.force.position.anchor.set(200, 1000, 0);
      camera.force.look.anchor.set(-200, 10, 0);
    },
    remove: function(scene) {
      scene.remove(points);
    },
    render: function(scene, camera, renderer) {
      physics_renderer.render(renderer);
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
