var Util = require('../modules/util');
var glslify = require('glslify');
// var vs = glslify('../sketches/points.vs');
// var fs = glslify('../sketches/points.fs');
var vs = glslify('../../glsl/raymarching.vs');
var fs = glslify('../../glsl/raymarching.fs');

var exports = function(){
  var Sketch = function() {};
  var plane_geometry = new THREE.PlaneBufferGeometry(2.0, 2.0);
  var plane_material = new THREE.ShaderMaterial({
    uniforms: {
      time: {
        type: 'f',
        value: 0
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight)
      },
      mouse: {
        type: 'v2',
        value: new THREE.Vector2(0, 0)
      }
    },
    vertexShader: vs,
    fragmentShader: fs,
  });
  var plane = new THREE.Mesh(plane_geometry, plane_material);

  Sketch.prototype = {
    init: function(scene, camera) {
      scene.add(plane);
      camera.range = 1400;
      camera.rad1_base = Util.getRadian(0);
      camera.rad1 = camera.rad1_base;
      camera.rad2 = Util.getRadian(0);
      camera.setPositionSpherical();
    },
    remove: function(scene, camera) {
      // points.geometry.dispose();
      // points.material.dispose();
      // scene.remove(points.obj);
      camera.range = 1000;
    },
    render: function(scene, camera) {
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.lookAtCenter();

    },
    touchStart: function(scene, camera, vector_mouse_down, vector_mouse_move) {
    },
    touchMove: function(scene, camera, vector_mouse_down, vector_mouse_move) {
      plane_material.uniforms.mouse.value.copy(vector_mouse_move);
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
    }
  };

  return Sketch;
};

module.exports = exports();
