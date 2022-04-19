import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import ForceCamera from '../../old/ForceCamera';
import ForcePointLight from '../../old/ForcePointLight';
import Mover from '../../old/Mover';
import Points from '../../old/Points';
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
  const movers_num = 10000;
  const movers = [];
  const points = new Points();
  const light = new ForcePointLight(0xff6600, 1, 1800, 1);
  const positions = new Float32Array(movers_num * 3);
  const colors = new Float32Array(movers_num * 3);
  const opacities = new Float32Array(movers_num);
  const sizes = new Float32Array(movers_num);
  const gravity = new THREE.Vector3(0, 0.1, 0);

  let bg = null;
  let last_time_activate = Date.now();
  let is_draged = false;

  var updateMover =  function() {
    for (var i = 0; i < movers.length; i++) {
      var mover = movers[i];
      if (mover.is_active) {
        mover.time++;
        mover.applyForce(gravity);
        mover.applyDrag(0.01);
        mover.updateVelocity();
        if (mover.time > 50) {
          mover.size -= 0.7;
          mover.a -= 0.009;
        }
        if (mover.a <= 0) {
          mover.init(new THREE.Vector3(0, 0, 0));
          mover.time = 0;
          mover.a = 0.0;
          mover.inactivate();
        }
      }
      positions[i * 3 + 0] = mover.velocity.x - points.velocity.x;
      positions[i * 3 + 1] = mover.velocity.y - points.velocity.y;
      positions[i * 3 + 2] = mover.velocity.z - points.velocity.z;
      opacities[i] = mover.a;
      sizes[i] = mover.size;
    }
    points.updatePoints();
  };
  var activateMover =  function() {
    var count = 0;
    var now = Date.now();
    if (now - last_time_activate > 10) {
      for (var i = 0; i < movers.length; i++) {
        var mover = movers[i];
        if (mover.is_active) continue;
        var rad1 = Util.getRadian(Math.log(Util.getRandomInt(0, 256)) / Math.log(256) * 260);
        var rad2 = Util.getRadian(Util.getRandomInt(0, 360));
        var range = (1- Math.log(Util.getRandomInt(32, 256)) / Math.log(256)) * 12;
        var vector = new THREE.Vector3();
        var force = Util.getPolarCoord(rad1, rad2, range);
        vector.add(points.velocity);
        mover.activate();
        mover.init(vector);
        mover.applyForce(force);
        mover.a = 0.2;
        mover.size = Math.pow(12 - range, 2) * Util.getRandomInt(1, 24) / 10;
        count++;
        if (count >= 6) break;
      }
      last_time_activate = Date.now();
    }
  };
  var updatePoints =  function() {
    points.updateVelocity();
    light.obj.position.copy(points.velocity);
  };
  var movePoints = function(vector) {
    var y = vector.y * window.innerHeight / 3;
    var z = vector.x * window.innerWidth / -3;
    points.anchor.y = y;
    points.anchor.z = z;
    light.force.anchor.y = y;
    light.force.anchor.z = z;
  }
  var createTexture =  function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var grad = null;
    var texture = null;

    canvas.width = 200;
    canvas.height = 200;
    grad = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
    ctx.fill();

    texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
  };
  var createBackground =  function() {
    var geometry = new THREE.OctahedronGeometry(1500, 3);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      flatShading: true,
      side: THREE.BackSide
    });
    return new THREE.Mesh(geometry, material);
  };
  const initSketch = () => {
    for (var i = 0; i < movers_num; i++) {
      var mover = new Mover();
      var h = Util.getRandomInt(0, 45);
      var s = Util.getRandomInt(60, 90);
      var color = new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');

      mover.init(new THREE.Vector3(Util.getRandomInt(-100, 100), 0, 0));
      movers.push(mover);
      positions[i * 3 + 0] = mover.velocity.x;
      positions[i * 3 + 1] = mover.velocity.y;
      positions[i * 3 + 2] = mover.velocity.z;
      color.toArray(colors, i * 3);
      opacities[i] = mover.a;
      sizes[i] = mover.size;
    }
    points.init({
      scene: scene,
      vs: require('../../old/glsl/points.vs').default,
      fs: require('../../old/glsl/points.fs').default,
      positions: positions,
      colors: colors,
      opacities: opacities,
      sizes: sizes,
      texture: createTexture(),
      blending: THREE.AdditiveBlending
    });
    scene.add(light);
    bg = createBackground();
    scene.add(bg);
    camera.setPolarCoord(Util.getRadian(25), 0, 1000);
    light.setPolarCoord(Util.getRadian(25), 0, 200);
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
    points.applyHook(0, 0.08);
    points.applyDrag(0.2);
    points.updateVelocity();
    light.force.applyHook(0, 0.08);
    light.force.applyDrag(0.2);
    light.force.updateVelocity();
    light.updatePosition();
    activateMover();
    updateMover();
    camera.force.position.applyHook(0, 0.004);
    camera.force.position.applyDrag(0.1);
    camera.force.position.updateVelocity();
    camera.updatePosition();
    camera.lookAtCenter();
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
      movePoints(vectorTouchStart);
      is_draged = true;
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
      if (is_draged) {
        movePoints(vectorTouchMove);
      }
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
      is_draged = false;
      points.anchor.set(0, 0, 0);
      light.force.anchor.set(0, 0, 0);
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
      is_draged = false;
      points.anchor.set(0, 0, 0);
      light.force.anchor.set(0, 0, 0);
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
    renderer.setClearColor(0x000000, 1.0);
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(new THREE.Vector3());

    on();
    initSketch();
    resizeWindow();
    renderLoop();
  }
  init();
}
