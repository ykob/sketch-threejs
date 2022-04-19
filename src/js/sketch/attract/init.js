import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import PhysicsRenderer from '../../common/PhysicsRenderer';
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
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    var uvs = new Float32Array(uvs_base);
    geometry.setAttribute('uv2', new THREE.BufferAttribute(uvs, 2));
    var colors = new Float32Array(colors_base);
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    var masses = new Float32Array(masses_base);
    geometry.setAttribute('mass', new THREE.BufferAttribute(masses, 1));
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
      vertexShader: require('./glsl/points.vs').default,
      fragmentShader: require('./glsl/points.fs').default,
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
    return vertices;
  }

  const initSketch = () => {
    physics_renderer = new PhysicsRenderer(
      require('./glsl/physicsRendererAcceleration.vs').default,
      require('./glsl/physicsRendererAcceleration.fs').default,
      require('./glsl/physicsRendererVelocity.vs').default,
      require('./glsl/physicsRendererVelocity.fs').default,
    );
    physics_renderer.init(renderer, createPointsIntVelocity());
    physics_renderer.accelerationMesh.material.uniforms.anchor = {
      type: 'v2',
      value: new THREE.Vector2(),
    }
    scene.add(points);
    camera.force.position.anchor.set(0, 15, 600);
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
  }
  const render = () => {
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
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
      physics_renderer.accelerationMesh.material.uniforms.anchor.value.copy(vectorTouchMove);
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
      physics_renderer.accelerationMesh.material.uniforms.anchor.value.set(0, 0, 0);
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
    renderer.setClearColor(0x111111, 1.0);
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(new THREE.Vector3());

    on();
    initSketch();
    resizeWindow();
    renderLoop();
  }
  init();
}
