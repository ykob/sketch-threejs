var Util = require('../modules/util');
var glslify = require('glslify');
var Force3 = require('../modules/force3');
var HemiLight = require('../modules/hemiLight');
// var vs = glslify('../sketches/points.vs');
// var fs = glslify('../sketches/points.fs');
var vs = glslify('../../glsl/metal_cube.vs');
var fs = glslify('../../glsl/metal_cube.fs');
var vs_bg = glslify('../../glsl/background.vs');
var fs_bg = glslify('../../glsl/background.fs');

var exports = function(){
  var Sketch = function(scene, camera) {
    this.init(scene, camera);
  };
  var light = new HemiLight();
  var raycaster = new THREE.Raycaster();
  var intersects = null;
  var cube_force = new Force3();
  var cube_force2 = new Force3();
  var vactor_raycast = null;
  cube_force.mass = 1.4;

  var createPlaneForRaymarching = function() {
    var geometry = new THREE.PlaneBufferGeometry(6.0, 6.0);
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        time2: {
          type: 'f',
          value: 0,
        },
        acceleration: {
          type: 'f',
          value: 0
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'MetalCube';
    return mesh;
  };
  var createBackground =  function() {
    var geometry_base = new THREE.OctahedronGeometry(30, 4);
    var geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(geometry_base);
    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
          time: {
            type: 'f',
            value: 0,
          },
          acceleration: {
            type: 'f',
            value: 0
          },
        }
      ]),
      vertexShader: vs_bg,
      fragmentShader: fs_bg,
      shading: THREE.FlatShading,
      side: THREE.BackSide,
      lights: true,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Background';
    return mesh;
  };

  var moveMetalCube = function(scene, camera, vector) {
    if (cube_force.acceleration.length() > 0.1 || !vector) return;
    raycaster.setFromCamera(vector, camera.obj);
    intersects = raycaster.intersectObjects(scene.children)[0];
    if(intersects && intersects.object.name == 'MetalCube') {
      cube_force.anchor.copy(Util.getSpherical(
        Util.getRadian(Util.getRandomInt(-20, 20)),
        Util.getRadian(Util.getRandomInt(0, 360)),
        Util.getRandomInt(30, 90) / 10
      ));
      cube_force2.applyForce(new THREE.Vector3(1, 0, 0));
    }
  };

  var plane = createPlaneForRaymarching();
  var bg = createBackground();

  Sketch.prototype = {
    init: function(scene, camera) {
      scene.add(plane);
      scene.add(bg);

      light.rad1 = Util.getRadian(-45);
      light.init(0x777777, 0x111111);
      scene.add(light.obj);

      camera.range = 24;
      camera.rad1_base = Util.getRadian(0);
      camera.rad1 = camera.rad1_base;
      camera.rad2 = Util.getRadian(90);
      camera.setPositionSpherical();
    },
    remove: function(scene, camera) {
      plane.geometry.dispose();
      plane.material.dispose();
      scene.remove(plane);
      bg.geometry.dispose();
      bg.material.dispose();
      scene.remove(bg);
      scene.remove(light.obj);
      camera.range = 1000;
    },
    render: function(scene, camera) {
      moveMetalCube(scene, camera, vactor_raycast);
      cube_force.applyHook(0, 0.12);
      cube_force.applyDrag(0.01);
      cube_force.updateVelocity();
      cube_force.updatePosition();
      cube_force2.applyHook(0, 0.005);
      cube_force2.applyDrag(0.2);
      cube_force2.updateVelocity();
      cube_force2.updatePosition();
      plane.position.copy(cube_force.position);
      plane.material.uniforms.time.value++;
      plane.material.uniforms.time2.value += 1 + Math.floor(cube_force.acceleration.length() * 4);
      plane.material.uniforms.acceleration.value = cube_force.acceleration.length();
      plane.lookAt(camera.obj.position);
      bg.material.uniforms.time.value++;
      bg.material.uniforms.acceleration.value = cube_force2.position.length();
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
      vactor_raycast = vector_mouse_move;
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
    },
    mouseOut: function(scene, camera) {
    },
    resizeWindow: function(scene, camera) {
      plane.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }
  };

  return Sketch;
};

module.exports = exports();
