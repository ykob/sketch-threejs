const THREE = require('three');
const { debounce } = require('@ykob/js-util');

import normalizeVector2 from '../../common/normalizeVector2';
import ForceCamera from '../../old/ForceCamera';
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
  var movers_num = 20000;
  var movers = [];
  var points = new Points();
  var positions = new Float32Array(movers_num * 3);
  var colors = new Float32Array(movers_num * 3);
  var opacities = new Float32Array(movers_num);
  var sizes = new Float32Array(movers_num);
  var gravity = new THREE.Vector3(1.5, 0, 0);
  var last_time_activate = Date.now();
  var is_touched = false;

  var updateMover = function() {
    for (var i = 0; i < movers.length; i++) {
      var mover = movers[i];
      if (mover.is_active) {
        mover.time++;
        mover.applyForce(gravity);
        mover.applyDrag(0.1);
        mover.updateVelocity();
        if (mover.a < 0.8) {
          mover.a += 0.02;
        }
        if (mover.velocity.x > 1000) {
          mover.init(new THREE.Vector3(0, 0, 0));
          mover.time = 0;
          mover.a = 0.0;
          mover.inactivate();
        }
      }
      positions[i * 3 + 0] = mover.velocity.x;
      positions[i * 3 + 1] = mover.velocity.y;
      positions[i * 3 + 2] = mover.velocity.z;
      opacities[i] = mover.a;
      sizes[i] = mover.size;
    }
    points.updatePoints();
  };

  var activateMover = function() {
    var count = 0;
    var now = Date.now();
    if (now - last_time_activate > gravity.x * 16) {
      for (var i = 0; i < movers.length; i++) {
        var mover = movers[i];
        if (mover.is_active) continue;
        var rad = Util.getRadian(Util.getRandomInt(0, 120) * 3);
        var range = Math.log(Util.getRandomInt(2, 128)) / Math.log(128) * 160 + 60;
        var y = Math.sin(rad) * range;
        var z = Math.cos(rad) * range;
        var vector = new THREE.Vector3(-1000, y, z);
        vector.add(points.velocity);
        mover.activate();
        mover.init(vector);
        mover.a = 0;
        mover.size = Util.getRandomInt(5, 60);
        count++;
        if (count >= Math.pow(gravity.x * 3, gravity.x * 0.4)) break;
      }
      last_time_activate = Date.now();
    }
  };

  var updatePoints = function() {
    points.updateVelocity();
  };

  var createTexture = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var grad = null;
    var texture = null;

    canvas.width = 256;
    canvas.height = 256;
    grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.arc(128, 128, 128, 0, Math.PI / 180, true);
    ctx.fill();

    texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  var changeGravity = function() {
    if (is_touched) {
      if (gravity.x < 6) gravity.x += 0.02;
    } else {
      if (gravity.x > 1.5) gravity.x -= 0.1;
    }
  };

  var initSketch = function() {
    for (var i = 0; i < movers_num; i++) {
      var mover = new Mover();
      var h = Util.getRandomInt(60, 210);
      var s = Util.getRandomInt(30, 90);
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
    camera.force.position.anchor.set(800, 0, 0);
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
  const initStats = () => {
    stats.showPanel(0);
    document.body.appendChild(stats.dom);
  }
  const render = () => {
    changeGravity();
    activateMover();
    updateMover();
    camera.force.position.applyHook(0, 0.008);
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
      is_touched = true;
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
      camera.force.position.anchor.z = vectorTouchMove.x * 120;
      camera.force.position.anchor.y = vectorTouchMove.y * -120;
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
      camera.force.position.anchor.z = 0;
      camera.force.position.anchor.y = 0;
      is_touched = false;
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
      camera.force.position.anchor.z = 0;
      camera.force.position.anchor.y = 0;
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
