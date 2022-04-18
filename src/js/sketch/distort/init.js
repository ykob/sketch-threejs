import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import Force2 from '../../old/Force2';
import ForceCamera from '../../old/ForceCamera';

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
  var sphere = null;
  var bg = null;
  var light = new THREE.HemisphereLight(0xffffff, 0x666666, 1);
  var sub_scene = new THREE.Scene();
  var sub_camera = new ForceCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
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
    var geometry = new THREE.OctahedronGeometry(200, 16);
    var material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
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
        }
      ]),
      vertexShader: require('./glsl/object.vs').default,
      fragmentShader: require('./glsl/object.fs').default,
      lights: true,
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
    var geometry = new THREE.PlaneGeometry(2, 2);
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
          value: render_target.texture,
        },
      },
      vertexShader: require('./glsl/posteffect.vs').default,
      fragmentShader: require('./glsl/posteffect.fs').default,
    });
    return new THREE.Mesh(geometry, material);
  }

  const initSketch = () => {
    document.body.className = 'bg-white';
    sphere = createSphere();
    sub_scene.add(sphere);
    bg = createBackground();
    sub_scene.add(bg);
    sub_scene.add(sub_light);
    sub_camera.force.position.anchor.set(1800, 1800, 0);
    sub_camera.force.look.anchor.set(0, 0, 0);

    framebuffer = createPlaneForPostProcess();
    scene.add(framebuffer);
    scene.add(light);
    camera.force.position.anchor.set(1800, 1800, 0);
    camera.force.look.anchor.set(0, 0, 0);
    force.anchor.set(1, 0);
    force.anchor.set(1, 0);
    force.velocity.set(1, 0);
    force.k = 0.045;
    force.d = 0.16;
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
    render_target.setSize(window.innerWidth, window.innerHeight);
    sub_camera.resize(window.innerWidth, window.innerHeight);
    framebuffer.material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  }
  const render = () => {
    force.applyHook(0, force.k);
    force.applyDrag(force.d);
    force.updateVelocity();
    sphere.material.uniforms.time.value += time_unit;
    sphere.material.uniforms.radius.value = force.velocity.x;
    sphere.material.uniforms.distort.value = force.velocity.x / 2 - 0.1;
    sub_camera.force.position.applyHook(0, 0.025);
    sub_camera.force.position.applyDrag(0.2);
    sub_camera.force.position.updateVelocity();
    sub_camera.updatePosition();
    sub_camera.force.look.applyHook(0, 0.2);
    sub_camera.force.look.applyDrag(0.4);
    sub_camera.force.look.updateVelocity();
    sub_camera.updateLook();

    framebuffer.material.uniforms.time.value += time_unit;
    framebuffer.material.uniforms.acceleration.value = force.acceleration.length();
    camera.force.position.applyHook(0, 0.025);
    camera.force.position.applyDrag(0.2);
    camera.force.position.updateVelocity();
    camera.updatePosition();
    camera.force.look.applyHook(0, 0.2);
    camera.force.look.applyDrag(0.4);
    camera.force.look.updateVelocity();
    camera.lookAt(camera.force.look.velocity);

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
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
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
