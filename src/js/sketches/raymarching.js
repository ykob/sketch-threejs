var Util = require('../modules/util');
var glslify = require('glslify');
// var vs = glslify('../sketches/points.vs');
// var fs = glslify('../sketches/points.fs');
var vs = glslify('../../glsl/raymarching.vs');
var fs = glslify('../../glsl/raymarching.fs');
var Light = require('../modules/pointLight');

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
        value: new THREE.Vector2()
      },
      cPos: {
        type: 'v3',
        value: new THREE.Vector3()
      },
      cDir: {
        type: 'v3',
        value: new THREE.Vector3()
      },
    },
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true
  });
  var plane = new THREE.Mesh(plane_geometry, plane_material);

  var light = new Light();
  var createBackground =  function() {
    var geometry = new THREE.OctahedronGeometry(1500, 3);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading,
      side: THREE.BackSide
    });
    return new THREE.Mesh(geometry, material);
  };

  Sketch.prototype = {
    init: function(scene, camera) {
      plane.material.uniforms.cPos.value = camera.obj.position;
      scene.add(plane);

      camera.range = 1400;
      camera.rad1_base = Util.getRadian(0);
      camera.rad1 = camera.rad1_base;
      camera.rad2 = Util.getRadian(0);
      camera.setPositionSpherical();

      light.init(0xfffffff, 2100);
      scene.add(light.obj);
      bg = createBackground();
      scene.add(bg);
    },
    remove: function(scene, camera) {
      // points.geometry.dispose();
      // points.material.dispose();
      // scene.remove(points.obj);
      camera.range = 1000;
    },
    render: function(scene, camera) {
      plane.material.uniforms.time.value++;
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
      plane_material.uniforms.mouse.value.copy(vector_mouse_move);
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
    }
  };

  return Sketch;
};

module.exports = exports();
