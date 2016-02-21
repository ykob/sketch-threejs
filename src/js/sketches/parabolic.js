var Util = require('../modules/util');
var glslify = require('glslify');
var vs = glslify('../../glsl/wiggle.vs');
var fs = glslify('../../glsl/wiggle.fs');

var exports = function(){
  var Sketch = function() {};
  var sphere = null;

  var createSphere = function() {
    var geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(new THREE.OctahedronGeometry(250, 4));
    var material = new THREE.ShaderMaterial({
      vertexShader: vs,
      fragmentShader: fs,
    });
    return new THREE.Mesh(geometry, material);
  };

  Sketch.prototype = {
    init: function(scene, camera) {
      sphere = createSphere();
      console.log(sphere);
      scene.add(sphere);
      camera.anchor.set(1200, 1200, 0);
      camera.look.anchor.set(0, 0, 0);
    },
    remove: function(scene) {
      sphere.geometry.dispose();
      sphere.material.dispose();
      scene.remove(sphere);
    },
    render: function(scene, camera) {
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.look.applyHook(0, 0.2);
      camera.look.applyDrag(0.4);
      camera.look.updateVelocity();
      camera.look.updatePosition();
      camera.obj.lookAt(camera.look.position);
    },
    touchStart: function(scene, camera, vector) {
      is_touched = true;
    },
    touchMove: function(scene, camera, vector_mouse_down, vector_mouse_move) {
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
      is_touched = false;
    }
  };

  return Sketch;
};

module.exports = exports();
