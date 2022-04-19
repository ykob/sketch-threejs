import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import Force2 from '../../old/Force2';
import ForceCamera from '../../old/ForceCamera';
import ForcePointLight from '../../old/ForcePointLight';
import ForceHemisphereLight from '../../old/ForceHemisphereLight';
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

  //
  // process for this sketch.
  //
  var movers_num = 10000;
  var movers = [];
  var mover_activate_count = 2;
  var points = new Points();
  var hemi_light = null;
  var comet_light1 = null;
  var comet_light2 = null;
  var positions = new Float32Array(movers_num * 3);
  var colors = new Float32Array(movers_num * 3);
  var opacities = new Float32Array(movers_num);
  var sizes = new Float32Array(movers_num);
  var comet = null;
  var comet_radius = 30;
  var comet_scale = new Force2();
  var comet_color_h = 140;
  var color_diff = 45;
  var planet = null;
  var last_time_activate = Date.now();
  var last_time_plus_activate = Date.now();
  var last_time_bounce = Date.now();
  var last_time_touch = Date.now();
  var plus_acceleration = 0;
  var is_touched = false;
  var is_plus_activate = false;
  var track_points = true;

  var updateMover = function() {
    for (var i = 0; i < movers.length; i++) {
      var mover = movers[i];
      if (mover.is_active) {
        mover.time++;
        mover.applyDrag(0.1);
        mover.updateVelocity();
        if (mover.time > 10) {
          mover.size -= 2;
          //mover.a -= 0.04;
        }
        if (mover.size <= 0) {
          mover.init(new THREE.Vector3(0, 0, 0));
          mover.time = 0;
          mover.a = 0.0;
          mover.inactivate();
        }
      }
      positions[i * 3 + 0] = mover.velocity.x - points.velocity.x;
      positions[i * 3 + 1] = mover.velocity.y - points.velocity.y;
      positions[i * 3 + 2] = mover.velocity.z - points.velocity.z;
      colors[i * 3 + 0] = mover.color.r;
      colors[i * 3 + 1] = mover.color.g;
      colors[i * 3 + 2] = mover.color.b;
      opacities[i] = mover.a;
      sizes[i] = mover.size;
    }
    points.updatePoints();
  };

  var activateMover = function() {
    var count = 0;
    var now = Date.now();
    if (now - last_time_activate > 10) {
      for (var i = 0; i < movers.length; i++) {
        var mover = movers[i];
        if (mover.is_active) continue;
        var rad1 = Util.getRadian(Util.getRandomInt(0, 360));
        var rad2 = Util.getRadian(Util.getRandomInt(0, 360));
        var range = Util.getRandomInt(1, 30);
        var vector = Util.getPolarCoord(rad1, rad2, range);
        var force = Util.getPolarCoord(rad1, rad2, range / 20);
        var h = Util.getRandomInt(comet_color_h - color_diff, comet_color_h + color_diff) - plus_acceleration / 1.5;
        var s = Util.getRandomInt(60, 80);
        vector.add(points.velocity);
        mover.activate();
        mover.init(vector);
        mover.color.setHSL(h / 360, s / 100, 0.7);
        mover.applyForce(force);
        mover.a = 1;
        mover.size = 25;
        count++;
        if (count >= mover_activate_count) break;
      }
      last_time_activate = Date.now();
    }
  };

  var rotateComet = function() {
    comet.rotation.x += 0.03 + plus_acceleration / 1000;
    comet.rotation.y += 0.01 + plus_acceleration / 1000;
    comet.rotation.z += 0.01 + plus_acceleration / 1000;
    points.rad1_base += Util.getRadian(.6);
    points.rad1 = Util.getRadian(Math.sin(points.rad1_base) * 45 + plus_acceleration / 100);
    points.rad2 += Util.getRadian(0.8 + plus_acceleration / 100);
    points.rad3 += 0.01;
    return Util.getPolarCoord(points.rad1, points.rad2, 350);
  };

  var rotateCometColor = function() {
    var radius = comet_radius * 0.8;
    comet_light1.position.copy(Util.getPolarCoord(Util.getRadian(0),  Util.getRadian(0), radius).add(points.velocity));
    comet_light2.position.copy(Util.getPolarCoord(Util.getRadian(180), Util.getRadian(0), radius).add(points.velocity));
  };

  var bounceComet = function() {
    if (Date.now() - last_time_bounce > 1000 - plus_acceleration * 3) {
      comet_scale.applyForce(new THREE.Vector2(0.08 + plus_acceleration / 5000, 0));
      last_time_bounce = Date.now();
      is_plus_activate = true;
      last_time_plus_activate = Date.now();
    }
    if (is_plus_activate && Date.now() - last_time_plus_activate < 500) {
      mover_activate_count = 6 + Math.floor(plus_acceleration / 40);
    } else {
      mover_activate_count = 1 + Math.floor(plus_acceleration / 40);
    }
    comet_scale.applyHook(0, 0.1);
    comet_scale.applyDrag(0.12);
    comet_scale.updateVelocity();
    comet.scale.set(1 + comet_scale.velocity.x, 1 + comet_scale.velocity.x, 1 + comet_scale.velocity.x);
  };

  var createTexture = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var grad = null;
    var texture = null;

    canvas.width = 200;
    canvas.height = 200;
    grad = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
    grad.addColorStop(0.9, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
    ctx.fill();

    texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
  };

  var createCommet = function() {
    var geometry = new THREE.OctahedronGeometry(comet_radius, 2);
    var material = new THREE.MeshPhongMaterial({
      color: new THREE.Color('hsl(' + comet_color_h + ', 100%, 100%)'),
      flatShading: true
    });
    return new THREE.Mesh(geometry, material);
  };

  var createPlanet = function() {
    var geometry = new THREE.OctahedronGeometry(250, 4);
    var material = new THREE.MeshPhongMaterial({
      color: 0x222222,
      flatShading: true
    });
    return new THREE.Mesh(geometry, material);
  };

  var accelerateComet = function() {
    if (is_touched && plus_acceleration < 200) {
      plus_acceleration += 1;
    } else if(plus_acceleration > 0) {
      plus_acceleration -= 1;
    }
  };

  const initSketch = () => {
    comet = createCommet();
    scene.add(comet);
    planet = createPlanet();
    scene.add(planet);
    for (var i = 0; i < movers_num; i++) {
      var mover = new Mover();
      var h = Util.getRandomInt(comet_color_h - color_diff, comet_color_h + color_diff);
      var s = Util.getRandomInt(60, 80);
      mover.init(new THREE.Vector3(Util.getRandomInt(-100, 100), 0, 0));
      mover.color = new THREE.Color('hsl(' + h + ', ' + s + '%, 70%)');
      movers.push(mover);
      positions[i * 3 + 0] = mover.velocity.x;
      positions[i * 3 + 1] = mover.velocity.y;
      positions[i * 3 + 2] = mover.velocity.z;
      colors[i * 3 + 0] = mover.color.r;
      colors[i * 3 + 1] = mover.color.g;
      colors[i * 3 + 2] = mover.color.b;
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
      blending: THREE.NormalBlending
    });
    points.rad1 = 0;
    points.rad1_base = 0;
    points.rad2 = 0;
    points.rad3 = 0;
    hemi_light = new ForceHemisphereLight(
      new THREE.Color('hsl(' + (comet_color_h - color_diff) + ', 50%, 60%)').getHex(),
      new THREE.Color('hsl(' + (comet_color_h + color_diff) + ', 50%, 60%)').getHex(),
      1
    );
    scene.add(hemi_light);
    comet_light1 = new ForcePointLight('hsl(' + (comet_color_h - color_diff) + ', 60%, 50%)', 1, 500, 1);
    scene.add(comet_light1);
    comet_light2 = new ForcePointLight('hsl(' + (comet_color_h - color_diff) + ', 60%, 50%)', 1, 500, 1);
    scene.add(comet_light2);
    camera.anchor = new THREE.Vector3(1500, 0, 0);
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
    accelerateComet();
    points.velocity = rotateComet();
    if (track_points === true) {
      camera.force.position.anchor.copy(
        points.velocity.clone().add(
          points.velocity.clone().sub(points.obj.position).normalize().multiplyScalar(-400)
        )
      );
      camera.force.position.anchor.y += points.velocity.y * 2;
      camera.force.look.anchor.copy(points.velocity);
    }
    points.updatePoints();
    comet.position.copy(points.velocity);
    hemi_light.color.setHSL((comet_color_h - color_diff - plus_acceleration / 1.5) / 360, 0.5, 0.6);
    hemi_light.groundColor.setHSL((comet_color_h + color_diff - plus_acceleration / 1.5) / 360, 0.5, 0.6);
    comet_light1.position.copy(points.velocity);
    comet_light1.color.setHSL((comet_color_h - color_diff - plus_acceleration / 1.5) / 360, 0.5, 0.6);
    comet_light2.position.copy(points.velocity);
    comet_light2.color.setHSL((comet_color_h + color_diff - plus_acceleration / 1.5) / 360, 0.5, 0.6);
    activateMover();
    updateMover();
    camera.force.position.applyHook(0, 0.025);
    camera.force.position.applyDrag(0.2);
    camera.force.position.updateVelocity();
    camera.updatePosition();
    camera.force.look.applyHook(0, 0.2);
    camera.force.look.applyDrag(0.4);
    camera.force.look.updateVelocity();
    camera.updateLook();
    rotateCometColor();
    bounceComet();
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
      last_time_touch = Date.now();
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
      is_touched = false;
      if (Date.now() - last_time_touch < 100) {
        if (track_points === true) {
          camera.force.position.anchor.set(1200, 1200, 0);
          camera.force.look.anchor.set(0, 0, 0);
          track_points = false;
        } else {
          track_points = true;
        }
      }
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
      is_touched = false;
      if (Date.now() - last_time_touch < 100) {
        if (track_points === true) {
          camera.force.position.anchor.set(1200, 1200, 0);
          camera.force.look.anchor.set(0, 0, 0);
          track_points = false;
        } else {
          track_points = true;
        }
      }
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
