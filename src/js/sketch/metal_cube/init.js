import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import Force3 from '../../old/Force3';
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
  var raycaster = new THREE.Raycaster();
  var intersects = null;
  var cube_force = new Force3();
  var cube_force2 = new Force3();
  var vactor_raycast = null;
  cube_force.mass = 1.4;

  var createPlaneForRaymarching = function() {
    var geometry = new THREE.PlaneGeometry(6.0, 6.0);
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
      vertexShader: require('./glsl/object.vs').default,
      fragmentShader: require('./glsl/object.fs').default,
      transparent: true
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'MetalCube';
    return mesh;
  };
  var createBackground =  function() {
    var geometry = new THREE.OctahedronGeometry(30, 4);
    var material = new THREE.ShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
        acceleration: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: require('./glsl/background.vs').default,
      fragmentShader: require('./glsl/background.fs').default,
      side: THREE.BackSide
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = 'Background';
    return mesh;
  };

  var moveMetalCube = function(scene, camera, vector) {
    if (cube_force.acceleration.length() > 0.1 || !vector) return;
    raycaster.setFromCamera(vector, camera);
    intersects = raycaster.intersectObjects(scene.children)[0];
    if(intersects && intersects.object.name == 'MetalCube') {
      cube_force.anchor.copy(Util.getPolarCoord(
        Util.getRadian(Util.getRandomInt(-20, 20)),
        Util.getRadian(Util.getRandomInt(0, 360)),
        Util.getRandomInt(30, 90) / 10
      ));
      cube_force2.applyForce(new THREE.Vector3(1, 0, 0));
    }
  };

  var plane = createPlaneForRaymarching();
  var bg = createBackground();

  const initSketch = () => {
    scene.add(plane);
    scene.add(bg);
    camera.setPolarCoord(0, Util.getRadian(90), 24);
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
    plane.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  }
  const render = () => {
    moveMetalCube(scene, camera, vactor_raycast);
    cube_force.applyHook(0, 0.12);
    cube_force.applyDrag(0.01);
    cube_force.updateVelocity();
    cube_force2.applyHook(0, 0.005);
    cube_force2.applyDrag(0.2);
    cube_force2.updateVelocity();
    plane.position.copy(cube_force.velocity);
    plane.material.uniforms.time.value++;
    plane.material.uniforms.time2.value += 1 + Math.floor(cube_force.acceleration.length() * 4);
    plane.material.uniforms.acceleration.value = cube_force.acceleration.length();
    bg.material.uniforms.time.value++;
    bg.material.uniforms.acceleration.value = cube_force2.velocity.length();
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
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
      vactor_raycast = vectorTouchMove;
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
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
    renderer.setClearColor(0xeeeeee, 1.0);
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(new THREE.Vector3());

    on();
    initSketch();
    resizeWindow();
    renderLoop();
  }
  init();
}
