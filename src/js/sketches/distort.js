var Util = require('../modules/util');
var Camera = require('../modules/camera');
var Force2 = require('../modules/force2');
var glslify = require('glslify');
var vs = glslify('../../glsl/distort.vs');
var fs = glslify('../../glsl/distort.fs');
var vs_pp = glslify('../../glsl/base_posteffect.vs');
var fs_pp = glslify('../../glsl/distort_posteffect.fs');

var exports = function(){
  var Sketch = function(scene, camera) {
    this.init(scene, camera);
  };
  var sphere = null;
  var bg = null;
  var light = new THREE.HemisphereLight(0xffffff, 0x666666, 1);
  var sub_scene = new THREE.Scene();
  var sub_camera = new Camera();
  var sub_light = new THREE.HemisphereLight(0xffffff, 0x666666, 1);
  var force = new Force2();
  var time_unit = 1;
  var render_target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
    magFilter: THREE.NearestFilter,
    minFilter: THREE.NearestFilter,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping
  })
  var framebuffer = null;

  var createSphere = function() {
    var geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(new THREE.OctahedronGeometry(200, 5));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
        radius: {
          type: 'f',
          value: 1.0
        },
        distort: {
          type: 'f',
          value: 0.4
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
    });
    return new THREE.Mesh(geometry, material);
  };

  var createBackground = function() {
    var geometry = new THREE.SphereGeometry(1800);
    var material = new THREE.MeshPhongMaterial({
      side: THREE.BackSide,
    });
    return new THREE.Mesh(geometry, material);
  };

  var createPlaneForPostProcess = function() {
    var geometry_base = new THREE.PlaneGeometry(2, 2);
    var geometry = new THREE.BufferGeometry();
    geometry.fromGeometry(geometry_base);
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        },
        acceleration: {
          type: 'f',
          value: 0
        },
        texture: {
          type: 't',
          value: render_target,
        },
      },
      vertexShader: vs_pp,
      fragmentShader: fs_pp,
    });
    return new THREE.Mesh(geometry, material);
  }

  Sketch.prototype = {
    init: function(scene, camera) {
      sub_camera.init(window.innerWidth, window.innerHeight);
      document.body.className = 'bg-white';
      sphere = createSphere();
      sub_scene.add(sphere);
      bg = createBackground();
      sub_scene.add(bg);
      sub_scene.add(sub_light);
      sub_camera.anchor.set(1800, 1800, 0);
      sub_camera.look.anchor.set(0, 0, 0);

      framebuffer = createPlaneForPostProcess();
      scene.add(framebuffer);
      scene.add(light);
      camera.anchor.set(1800, 1800, 0);
      camera.look.anchor.set(0, 0, 0);
      force.anchor.set(1, 0);
      force.anchor.set(1, 0);
      force.velocity.set(1, 0);
      force.k = 0.045;
      force.d = 0.16;
    },
    remove: function(scene) {
      document.body.className = '';
      sphere.geometry.dispose();
      sphere.material.dispose();
      sub_scene.remove(sphere);
      bg.geometry.dispose();
      bg.material.dispose();
      sub_scene.remove(bg);
      sub_scene.remove(sub_light.obj);
      framebuffer.geometry.dispose();
      framebuffer.material.dispose();
      scene.remove(framebuffer);
      scene.remove(light.obj);
    },
    render: function(scene, camera, renderer) {
      force.applyHook(0, force.k);
      force.applyDrag(force.d);
      force.updateVelocity();
      force.updatePosition();
      // console.log(force.acceleration.length());
      sphere.material.uniforms.time.value += time_unit;
      sphere.material.uniforms.radius.value = force.position.x;
      sphere.material.uniforms.distort.value = force.position.x / 2 - 0.1;
      sub_camera.applyHook(0, 0.025);
      sub_camera.applyDrag(0.2);
      sub_camera.updateVelocity();
      sub_camera.updatePosition();
      sub_camera.look.applyHook(0, 0.2);
      sub_camera.look.applyDrag(0.4);
      sub_camera.look.updateVelocity();
      sub_camera.look.updatePosition();
      sub_camera.obj.lookAt(sub_camera.look.position);

      framebuffer.material.uniforms.time.value += 0.4;
      framebuffer.material.uniforms.acceleration.value = force.acceleration.length();
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.look.applyHook(0, 0.2);
      camera.look.applyDrag(0.4);
      camera.look.updateVelocity();
      camera.look.updatePosition();
      camera.obj.lookAt(camera.look.position);

      renderer.render(sub_scene, sub_camera.obj, render_target);
    },
    touchStart: function(scene, camera, vector) {
      if (force.anchor.x < 3) {
        force.k += 0.005;
        force.d -= 0.02;
        force.anchor.x += 0.8;
        time_unit += 0.4;
      } else {
        force.k = 0.05;
        force.d = 0.16;
        force.anchor.x = 1.0;
        time_unit = 1;
      }
      is_touched = true;
    },
    touchMove: function(scene, camera, vector_mouse_down, vector_mouse_move) {
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
      is_touched = false;
    },
    mouseOut: function(scene, camera) {
      this.touchEnd(scene, camera)
    },
    resizeWindow: function(scene, camera) {
      sub_camera.resize(window.innerWidth, window.innerHeight);
      framebuffer.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }
  };

  return Sketch;
};

module.exports = exports();
