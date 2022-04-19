import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import Mover from '../../old/Mover';
import Points from '../../old/Points';
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
  var image = new Image();
  var image_vertices = [];
  var movers = [];
  var positions = null;
  var colors = null;
  var opacities = null;
  var sizes = null;
  var length_side = 400;
  var points = new Points();
  var created_points = false;

  var loadImage = function(callback) {
    image.src = '../img/sketch/image_data/elephant.png';
    image.onload = function() {
      callback();
    };
  };

  var getImageData = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = length_side;
    canvas.height = length_side;
    ctx.drawImage(image, 0, 0);
    var image_data = ctx.getImageData(0, 0, length_side, length_side);
    for (var y = 0; y < length_side; y++) {
      if (y % 3 > 0) continue;
      for (var x = 0; x < length_side; x++) {
        if (x % 3 > 0) continue;
        if(image_data.data[(x + y * length_side) * 4] > 0) {
          image_vertices.push(0, (y - length_side / 2) * -1, (x - length_side/ 2) * -1);
        }
      }
    }
  };

  var buildPoints = function(scene) {
    positions = new Float32Array(image_vertices);
    colors = new Float32Array(image_vertices.length);
    opacities = new Float32Array(image_vertices.length / 3);
    sizes = new Float32Array(image_vertices.length / 3);
    for (var i = 0; i < image_vertices.length / 3; i++) {
      var mover = new Mover();
      var color = new THREE.Color(
                                  'hsl(' + (image_vertices[i * 3 + 2] + image_vertices[i * 3 + 1] + length_side) / 5
                                  + ', 60%, 80%)');
      mover.init(new THREE.Vector3(image_vertices[i * 3], image_vertices[i * 3 + 1], image_vertices[i * 3 + 2]));
      mover.is_activate = true;
      movers.push(mover);
      color.toArray(colors, i * 3);
      opacities[i] = 1;
      sizes[i] = 12;
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
      blending: THREE.NormalBlending
    });
    created_points = true;
  };

  var applyForceToPoints = function() {
    for (var i = 0; i < movers.length; i++) {
      var mover = movers[i];
      var rad1 = Util.getRadian(Util.getRandomInt(0, 360));
      var rad2 = Util.getRadian(Util.getRandomInt(0, 360));
      var scalar = Util.getRandomInt(40, 80);
      mover.is_activate = false;
      mover.applyForce(Util.getPolarCoord(rad1, rad2, scalar));
    }
  };

  var updateMover =  function() {
    for (var i = 0; i < movers.length; i++) {
      var mover = movers[i];
      mover.time++;
      if (mover.acceleration.length() < 1) {
        mover.is_activate = true;
      }
      if (mover.is_activate) {
        mover.applyHook(0, 0.18);
        mover.applyDrag(0.26);
      } else {
        mover.applyDrag(0.035);
      }
      mover.updateVelocity();
      mover.velocity.sub(points.velocity);
      positions[i * 3 + 0] = mover.velocity.x - points.velocity.x;
      positions[i * 3 + 1] = mover.velocity.y - points.velocity.x;
      positions[i * 3 + 2] = mover.velocity.z - points.velocity.x;
      mover.size = Math.log(Util.getRandomInt(1, 128)) / Math.log(128) * Math.sqrt(document.body.clientWidth);
      sizes[i] = mover.size;
    }
    points.updatePoints();
  };

  var createTexture = function() {
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

  const initSketch = () => {
    loadImage(function() {
      getImageData();
      buildPoints(scene);
    });
    camera.setPolarCoord(0, 0, 1400);
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
    if (created_points) {
      updateMover();
      points.updatePoints();
    }
    camera.force.position.applyHook(0, 0.025);
    camera.force.position.applyDrag(0.2);
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
      applyForceToPoints();
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
      camera.force.position.anchor.z = vectorTouchMove.x * 1000;
      camera.force.position.anchor.y = vectorTouchMove.y * -1000;
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
      camera.force.position.anchor.z = 0;
      camera.force.position.anchor.y = 0;
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
