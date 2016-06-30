var glslify = require('glslify');
var Util = require('../modules/util');
var PhysicsRenderer = require('../modules/physics_renderer');

var exports = function(){
  var Sketch = function(scene, camera, renderer) {
    this.init(scene, camera, renderer);
  };

  var length = 1000;
  var physics_renderer = null;

  var createPoints = function() {
    var geometry = new THREE.BufferGeometry();
    var vertices_base = [];
    var uvs_base = [];
    var colors_base = [];
    var masses_base = [];
    for (var i = 0; i < Math.pow(length, 2); i++) {
      vertices_base.push(0, 0, 0);
      uvs_base.push(
        i % length * (1 / (length - 1)),
        Math.floor(i / length) * (1 / (length - 1))
      );
      colors_base.push(Util.getRandomInt(0, 120) / 360, 0.8, 1);
      masses_base.push(Util.getRandomInt(1, 100));
    }
    var vertices = new Float32Array(vertices_base);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var uvs = new Float32Array(uvs_base);
    geometry.addAttribute('uv2', new THREE.BufferAttribute(uvs, 2));
    var colors = new Float32Array(colors_base);
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    var masses = new Float32Array(masses_base);
    geometry.addAttribute('mass', new THREE.BufferAttribute(masses, 1));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
        velocity: {
          type: 't',
          value: new THREE.Texture()
        },
        acceleration: {
          type: 't',
          value: new THREE.Texture()
        }
      },
      vertexShader: glslify('../../glsl/sketch/attract/points.vs'),
      fragmentShader: glslify('../../glsl/sketch/attract/points.fs'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Points(geometry, material);
  }
  var points = createPoints();

  var createPointsIntVelocity = function() {
    var vertices = [];
    for (var i = 0; i < Math.pow(length, 2); i++) {
      var v = Util.getPolarCoord(
        Util.getRadian(Util.getRandomInt(0, 360)),
        Util.getRadian(Util.getRandomInt(0, 360)),
        Util.getRandomInt(10, 1000)
      );
      vertices.push(v.x, v.y / 10.0, v.z);
    }
    return new Float32Array(vertices);
  }

  Sketch.prototype = {
    init: function(scene, camera, renderer) {
      physics_renderer = new PhysicsRenderer(length);
      physics_renderer.init(renderer, createPointsIntVelocity());
      physics_renderer.acceleration_mesh.material.uniforms.anchor = {
        type: 'v2',
        value: new THREE.Vector2(),
      }
      scene.add(points);
      camera.force.position.anchor.set(0, 15, 600);
      camera.force.look.anchor.set(0, 0, 0);
    },
    remove: function(scene) {
      points.geometry.dispose();
      points.material.dispose();
      scene.remove(points);
    },
    render: function(scene, camera, renderer) {
      physics_renderer.render(renderer);
      points.material.uniforms.time.value++;
      points.material.uniforms.velocity.value = physics_renderer.getCurrentVelocity();
      points.material.uniforms.acceleration.value = physics_renderer.getCurrentAcceleration();
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
      physics_renderer.acceleration_mesh.material.uniforms.anchor.value.copy(vector_mouse_move);
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
    },
    mouseOut: function(scene, camera) {
      physics_renderer.acceleration_mesh.material.uniforms.anchor.value.set(0, 0, 0);
    },
    resizeWindow: function(scene, camera) {
    }
  };

  return Sketch;
};

module.exports = exports();
