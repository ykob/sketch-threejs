var Util = require('../modules/util');
var Camera = require('../modules/camera');
var glslify = require('glslify');
// var vs = glslify('../../glsl/hole.vs');
// var fs = glslify('../../glsl/hole.fs');
var vs_points = glslify('../../glsl/hole_points.vs');
var fs_points = glslify('../../glsl/hole_points.fs');
var vs_fb = glslify('../../glsl/hole_fb.vs');
var fs_fb = glslify('../../glsl/hole_fb.fs');

var exports = function(){
  var Sketch = function(scene, camera) {
    this.init(scene, camera);
  };

  var points = null;
  var bg = null;
  var light = new THREE.HemisphereLight(0xffffff, 0x666666, 1);

  var sub_scene = new THREE.Scene();
  var sub_camera = new Camera();
  var sub_light = new THREE.HemisphereLight(0xffffff, 0x666666, 1);
  var render_target = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  var framebuffer = null;

  var createSphereForCrossFade = function() {
    var geometry = new THREE.SphereGeometry(400, 32, 32);
    var material = new THREE.MeshBasicMaterial({
    });
    return new THREE.Mesh(geometry, material);
  }

  var createPointsForCrossFade = function() {
    var geometry = new THREE.BufferGeometry();
    var vertices_base = [];
    var radians_base = [];
    for (let i = 0; i < 32; i ++) {
      var x = 0;
      var y = 0;
      var z = 0;
      vertices_base.push(x, y, z);
      var r1 = Util.getRadian(Util.getRandomInt(0, 360));
      var r2 = Util.getRadian(Util.getRandomInt(0, 360));
      var r3 = Util.getRadian(Util.getRandomInt(0, 360));
      radians_base.push(r1, r2, r3);
    }
    var vertices = new Float32Array(vertices_base);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var radians = new Float32Array(radians_base);
    geometry.addAttribute('radian', new THREE.BufferAttribute(radians, 3));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0.0
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        },
        size: {
          type: 'f',
          value: 28.0
        },
        // texture: {
        //   type: 't',
        //   value:
        // }
      },
      vertexShader: vs_points,
      fragmentShader: fs_points,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Points(geometry, material);
  };

  var createBackground = function() {
    var geometry = new THREE.SphereGeometry(1800, 32, 32);
    var material = new THREE.MeshPhongMaterial({
      side: THREE.BackSide,
      shading: THREE.FlatShading,
    });
    return new THREE.Mesh(geometry, material);
  };

  var createPlaneForFramebuffer = function() {
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
        texture: {
          type: 't',
          value: render_target,
        },
        texture2: {
          type: 't',
          value: new THREE.TextureLoader().load("img/galaxy.jpg"),
        },
      },
      vertexShader: vs_fb,
      fragmentShader: fs_fb,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  }

  Sketch.prototype = {
    init: function(scene, camera) {
      sphere = createSphereForCrossFade();
      sub_scene.add(sphere);
      points = createPointsForCrossFade();
      sub_scene.add(points);
      sub_scene.add(sub_light);
      sub_camera.init(window.innerWidth, window.innerHeight);
      sub_camera.anchor.set(3000, 0, 0);
      sub_camera.look.anchor.set(0, 0, 0);

      framebuffer = createPlaneForFramebuffer();
      scene.add(framebuffer);
      bg = createBackground();
      scene.add(bg);
      scene.add(light);
      camera.anchor.set(3000, 0, 0);
      camera.look.anchor.set(0, 0, 0);
    },
    remove: function(scene) {
      sphere.geometry.dispose();
      sphere.material.dispose();
      sub_scene.remove(sphere);
      points.geometry.dispose();
      points.material.dispose();
      sub_scene.remove(points);
      sub_scene.remove(sub_light);

      framebuffer.geometry.dispose();
      framebuffer.material.dispose();
      scene.remove(framebuffer);
      bg.geometry.dispose();
      bg.material.dispose();
      scene.remove(bg);
      scene.remove(light);
    },
    render: function(scene, camera, renderer) {
      points.material.uniforms.time.value++;
      sub_camera.applyHook(0, 0.025);
      sub_camera.applyDrag(0.2);
      sub_camera.updateVelocity();
      sub_camera.updatePosition();
      sub_camera.look.applyHook(0, 0.2);
      sub_camera.look.applyDrag(0.4);
      sub_camera.look.updateVelocity();
      sub_camera.look.updatePosition();
      sub_camera.obj.lookAt(sub_camera.look.position);

      framebuffer.material.uniforms.time.value++;
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
    },
    touchMove: function(scene, camera, vector_mouse_down, vector_mouse_move) {
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
    },
    mouseOut: function(scene, camera) {
    },
    resizeWindow: function(scene, camera) {
      render_target.setSize(window.innerWidth, window.innerHeight);
      sub_camera.resize(window.innerWidth, window.innerHeight);
      points.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
      framebuffer.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    }
  };

  return Sketch;
};

module.exports = exports();
