var Util = require('../modules/util');
var glslify = require('glslify');
// var vs = glslify('../sketches/points.vs');
// var fs = glslify('../sketches/points.fs');
var vs = glslify('../../glsl/raymarching.vs');
var fs = glslify('../../glsl/raymarching.fs');

var exports = function(){
  var Sketch = function(scene, camera) {
    this.init(scene, camera);
  };
  var plane_geometry = new THREE.PlaneBufferGeometry(5.0, 5.0);
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
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });
  var plane = new THREE.Mesh(plane_geometry, plane_material);

  Sketch.prototype = {
    init: function(scene, camera) {
      scene.add(plane);

      camera.range = 20;
      camera.rad1_base = Util.getRadian(0);
      camera.rad1 = camera.rad1_base;
      camera.rad2 = Util.getRadian(90);
      camera.setPositionSpherical();
    },
    remove: function(scene, camera) {
      plane.geometry.dispose();
      plane.material.dispose();
      scene.remove(plane);
      camera.range = 1000;
    },
    render: function(scene, camera) {
      plane_material.uniforms.time.value++;
      plane.lookAt(camera.obj.position);
      camera.setPositionSpherical();
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.lookAtCenter();
    },
    touchStart: function(scene, camera, vector_mouse_down, vector_mouse_move) {
    },
    touchMove: function(scene, camera, vector_mouse_down, vector_mouse_move) {
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
    }
  };

  return Sketch;
};

module.exports = exports();
