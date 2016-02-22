var Util = require('../modules/util');
var HemiLight = require('../modules/hemiLight');
var glslify = require('glslify');
var vs = glslify('../../glsl/wiggle.vs');
var fs = glslify('../../glsl/wiggle.fs');

var exports = function(){
  var Sketch = function() {};
  var sphere = null;
  var bg = null;
  var light = new HemiLight();

  var createSphere = function() {
    var geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(new THREE.OctahedronGeometry(250, 4));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });
    return new THREE.Mesh(geometry, material);
  };

  var createBackground = function() {
    var geometry = new THREE.SphereGeometry(2000);
    var material = new THREE.MeshPhongMaterial({
      side: THREE.BackSide
    });
    return new THREE.Mesh(geometry, material);
  };

  Sketch.prototype = {
    init: function(scene, camera) {
      sphere = createSphere();
      scene.add(sphere);
      bg = createBackground();
      scene.add(bg);
      light.init(0xffffff, 0x000000);
      scene.add(light.obj);
      camera.anchor.set(1200, 1200, 0);
      camera.look.anchor.set(0, 0, 0);
    },
    remove: function(scene) {
      sphere.geometry.dispose();
      sphere.material.dispose();
      scene.remove(sphere);
      bg.geometry.dispose();
      bg.material.dispose();
      scene.remove(bg);
      scene.remove(light.obj);
    },
    render: function(scene, camera) {
      sphere.material.uniforms.time.value += 1;
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
