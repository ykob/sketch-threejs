import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import Force2 from '../../old/Force2';
import ForceCamera from '../../old/ForceCamera';
import Util from '../../old/util';

export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new ForceCamera(35, window.innerWidth / window.innerHeight, 1, 10000);
  const clock = new THREE.Clock();

  //
  // process for this sketch.
  //
  var points = null;
  var bg = null;
  var bg_wf = null;
  var obj = null;
  var light = new THREE.DirectionalLight(0xffffff, 1);

  var sub_scene = new THREE.Scene();
  var sub_camera = new ForceCamera(45, 1, 1, 10000);
  var render_target = new THREE.WebGLRenderTarget(1200, 1200);
  var framebuffer = null;

  var sub_scene2 = new THREE.Scene();
  var sub_camera2 = new ForceCamera(45, 1, 1, 10000);
  var sub_light = new THREE.HemisphereLight(0xfffffff, 0xcccccc, 1);
  var render_target2 = new THREE.WebGLRenderTarget(1200, 1200);
  var bg_fb = null;
  var points_fb = null;

  var force = new Force2();

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
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var radians = new Float32Array(radians_base);
    geometry.setAttribute('radian', new THREE.BufferAttribute(radians, 3));
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
        force: {
          type: 'v2',
          value: force.velocity,
        },
      },
      vertexShader: require('./glsl/points.vs').default,
      fragmentShader: require('./glsl/points.fs').default,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    return new THREE.Points(geometry, material);
  };

  var createObject = function() {
    var geometry_base = new THREE.SphereGeometry(2, 4, 4);
    var attr = geometry_base.attributes;
    var geometry = new THREE.BufferGeometry();
    var vertices_base = [];
    var radiuses_base = [];
    var radians_base = [];
    var scales_base = [];
    var indices_base = [];
    for (let i = 0; i < 16; i ++) {
      var radius = Util.getRandomInt(300, 1000);
      var radian = Util.getRadian(Util.getRandomInt(0, 3600) / 10);
      var scale = Util.getRandomInt(60, 120) / 100;
      for (var j = 0; j < attr.position.array.length; j += 3) {
        vertices_base.push(
          attr.position.array[j + 0],
          attr.position.array[j + 1],
          attr.position.array[j + 2]
        );
        radiuses_base.push(radius);
        radians_base.push(radian);
        scales_base.push(scale);
      }
      geometry_base.index.array.map((item) => {
        indices_base.push(item + i * attr.position.array.length / 3)
      });
    }
    var vertices = new Float32Array(vertices_base);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var radius = new Float32Array(radiuses_base);
    geometry.setAttribute('radius', new THREE.BufferAttribute(radius, 1));
    var radians = new Float32Array(radians_base);
    geometry.setAttribute('radian', new THREE.BufferAttribute(radians, 1));
    var scales = new Float32Array(scales_base);
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    var indices = new Uint32Array(indices_base);
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
          time: {
            type: 'f',
            value: 0,
          },
        }
      ]),
      vertexShader: require('./glsl/object.vs').default,
      fragmentShader: require('./glsl/object.fs').default,
      lights: true,
    });
    return new THREE.Mesh(geometry, material);
  };

  var createBackground = function() {
    var geometry = new THREE.SphereGeometry(1200, 64, 64);
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
      },
      vertexShader: require('./glsl/bg.vs').default,
      fragmentShader: require('./glsl/bg.fs').default,
      side: THREE.BackSide,
    });
    return new THREE.Mesh(geometry, material);
  };

  var createBackgroundWire = function() {
    var geometry = new THREE.SphereGeometry(1100, 64, 64);
    var material = new THREE.MeshBasicMaterial({
      color: 0xdddddd,
      wireframe: true
    });
    return new THREE.Mesh(geometry, material);
  };

  var createPointsInFramebuffer = function() {
    var geometry = new THREE.BufferGeometry();
    var vertices_base = [];
    for (var i = 0; i < 2000; i++) {
      vertices_base.push(
        Util.getRadian(Util.getRandomInt(0, 120) + 120),
        Util.getRadian(Util.getRandomInt(0, 3600) / 10),
        Util.getRandomInt(200, 1000)
      );
    }
    var vertices = new Float32Array(vertices_base);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
      },
      vertexShader: require('./glsl/fb_points.vs').default,
      fragmentShader: require('./glsl/fb_points.fs').default,
    });
    return new THREE.Points(geometry, material);
  };

  var createBackgroundInFramebuffer = function() {
    var geometry = new THREE.SphereGeometry(1000, 128, 128);
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
      },
      vertexShader: require('./glsl/fb_bg.vs').default,
      fragmentShader: require('./glsl/fb_bg.fs').default,
      side: THREE.BackSide,
    });
    return new THREE.Mesh(geometry, material);
  };

  var createPlaneForFramebuffer = function() {
    var geometry = new THREE.PlaneGeometry(1000, 1000);
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
          value: render_target.texture,
        },
        texture2: {
          type: 't',
          value: render_target2.texture,
        },
      },
      vertexShader: require('./glsl/fb.vs').default,
      fragmentShader: require('./glsl/fb.fs').default,
      transparent: true
    });
    return new THREE.Mesh(geometry, material);
  };

  const initSketch = () => {
    force.anchor.set(1, 0);

    sub_camera2.force.position.anchor.set(1000, 300, 0);
    sub_camera2.force.look.anchor.set(0, 0, 0);
    bg_fb = createBackgroundInFramebuffer();
    points_fb = createPointsInFramebuffer();
    sub_scene2.add(bg_fb);
    sub_scene2.add(points_fb);
    sub_scene2.add(sub_light);

    points = createPointsForCrossFade();
    sub_scene.add(points);
    sub_camera.position.set(0, 0, 3000);
    sub_camera.force.look.anchor.set(0, 0, 0);

    framebuffer = createPlaneForFramebuffer();
    scene.add(framebuffer);
    bg = createBackground();
    scene.add(bg);
    bg_wf = createBackgroundWire();
    scene.add(bg_wf);
    obj = createObject();
    scene.add(obj);
    light.position.set(0, 1, 0)
    scene.add(light);
    camera.force.position.anchor.set(1000, 300, 0);
    camera.force.look.anchor.set(0, 0, 0);
  }

  //
  // common process
  //
  const resizeWindow = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    points.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    framebuffer.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  }
  const render = () => {
    points.material.uniforms.time.value++;
    framebuffer.lookAt(camera.position);
    framebuffer.material.uniforms.time.value++;

    bg_fb.material.uniforms.time.value++;
    points_fb.material.uniforms.time.value++;

    bg_wf.rotation.y = points.material.uniforms.time.value / 1000;
    obj.material.uniforms.time.value++;

    force.applyHook(0, 0.12);
    force.applyDrag(0.18);
    force.updateVelocity();
    camera.force.position.applyHook(0, 0.025);
    camera.force.position.applyDrag(0.2);
    camera.force.position.updateVelocity();
    camera.updatePosition();
    camera.force.look.anchor.y = Math.sin(points.material.uniforms.time.value / 100) * 100;
    camera.force.look.applyHook(0, 0.2);
    camera.force.look.applyDrag(0.4);
    camera.updateLook();
    sub_camera2.force.position.applyHook(0, 0.1);
    sub_camera2.force.position.applyDrag(0.2);
    sub_camera2.force.position.updateVelocity();
    sub_camera2.updatePosition();
    sub_camera2.force.look.applyHook(0, 0.2);
    sub_camera2.force.look.applyDrag(0.4);
    sub_camera2.force.look.updateVelocity();
    sub_camera2.updateLook();
    renderer.setRenderTarget(render_target2);
    renderer.render(sub_scene2, sub_camera2);
    renderer.setRenderTarget(render_target);
    renderer.render(sub_scene, sub_camera);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  }
  const on = () => {
    const vectorTouchStart = new THREE.Vector2();
    const vectorTouchMove = new THREE.Vector2();
    const vectorTouchEnd = new THREE.Vector2();

    const touchStart = (x, y, touch_event) => {
      vectorTouchStart.set(x, y);
      normalizeVector2(vectorTouchStart);
      force.anchor.set(2, 30);
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
      force.anchor.set(1, 0);
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
      force.anchor.set(1, 0);
    };

    window.addEventListener('resize', debounce(() => {
      resizeWindow();
    }), 1000);
    canvas.addEventListener('mousedown', function (event) {
      event.preventDefault();
      touchStart(event.clientX, event.clientY, false);
    });
    canvas.addEventListener('mousemove', function (event) {
      event.preventDefault();
      touchMove(event.clientX, event.clientY, false);
    });
    canvas.addEventListener('mouseup', function (event) {
      event.preventDefault();
      touchEnd(event.clientX, event.clientY, false);
    });
    canvas.addEventListener('touchstart', function (event) {
      event.preventDefault();
      touchStart(event.touches[0].clientX, event.touches[0].clientY, true);
    });
    canvas.addEventListener('touchmove', function (event) {
      event.preventDefault();
      touchMove(event.touches[0].clientX, event.touches[0].clientY, true);
    });
    canvas.addEventListener('touchend', function (event) {
      event.preventDefault();
      touchEnd(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
    });
    window.addEventListener('mouseout', function () {
      event.preventDefault();
      mouseOut();
    });
  }

  const init = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee, 0.0);
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(new THREE.Vector3());

    on();
    initSketch();
    resizeWindow();
    renderLoop();
  }
  init();
}
