import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import Force2 from '../../old/Force2';
import ForceCamera from '../../old/ForceCamera';

export default function(id, options={}) {
  let { interactive = true, width = window.innerWidth, height = window.innerHeight } = options
  const canvas = document.getElementById(id);
  const renderer = new THREE.WebGL1Renderer({
    antialias: false,
    canvas: canvas,
    alpha: true
  });

  //
  // process for this sketch.
  //
  var sphere = null;
  var sub_scene = new THREE.Scene();
  var sub_camera = new ForceCamera(45, width / height, 1, 10000);
  var sub_light = new THREE.HemisphereLight(0xffffff, 0x666666, 1);
  var force = new Force2();
  var time_unit = 0.6;
  var alpha = 1.0;

  var createSphere = function() {
    var geometry = new THREE.OctahedronGeometry(200, 16);
    var material = new THREE.ShaderMaterial({
      transparent: true,
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
          },
          alpha: {
            type: 'f',
            value: alpha
          }
        }
      ]),
      vertexShader: require('./glsl/object.vs').default,
      fragmentShader: require('./glsl/object.fs').default,
      lights: true,
    });
    return new THREE.Mesh(geometry, material);
  };

  const initSketch = () => {
    sphere = createSphere();
    sub_scene.add(sphere);
    sub_scene.add(sub_light);
    if (interactive) {
      sub_camera.force.position.anchor.set(1800, 1800, 0);
    } else {
      sub_camera.force.position.anchor.set(700, 700, 0);
    }
    sub_camera.force.look.anchor.set(0, 0, 0);

    //scene.add(framebuffer);
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
    canvas.width = width;
    canvas.height = height;
    renderer.setSize(width, height);
    sub_camera.resize(width, height);
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

    renderer.render(sub_scene, sub_camera);
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
        force.k += 0.00025;
        force.d -= 0.01;
        force.anchor.x += 0.4;
      } else {
        force.k = 0.05;
        force.d = 0.16;
        force.anchor.x = 1.0;
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

    if (interactive) {
      canvas.addEventListener('mousedown', function (event) {
        event.preventDefault();
        touchStart(event.clientX, event.clientY, false);
      });
    }
  }

  const setAlpha = newAlpha => {
    alpha = newAlpha
    sphere.material.uniforms.alpha.value = alpha
  }

  const updateDimensions = ({_width, _height}) => {
    width = _width
    height = _height
    resizeWindow();
  }

  const init = () => {
    renderer.setSize(width, height);
    renderer.setClearColor(0xfbfbfb, 0.0);

    on();
    initSketch();
    resizeWindow();
    renderLoop();
  }
  init();

  return { setAlpha, updateDimensions }
}
