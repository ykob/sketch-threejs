import * as THREE from 'three';
import debounce from 'js-util/debounce';

import WebGLContent from './WebGLContent';

export default async function() {
  const webglContent = new WebGLContent();
  const resolution = new THREE.Vector2();
  const panPosition = new THREE.Vector3();
  const preloader = document.querySelector('.p-preloader');

  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    webglContent.resize(resolution);
  };
  const on = () => {
    window.addEventListener('mousemove', (e) => {
      panPosition.set(
        e.clientX / resolution.x * 2 - 1,
        -e.clientY / resolution.y * 2 + 1,
        0
      );
      webglContent.pan(panPosition);
    });
    document.addEventListener('mouseleave', (e) => {
      panPosition.set(0, 0, 0);
      webglContent.pan(panPosition);
    });
    window.addEventListener('resize', debounce(resizeWindow, 100));
  };
  const render = () => {
    webglContent.update();
    requestAnimationFrame(render);
  };

  on();
  resizeWindow();

  await webglContent.init();

  preloader.classList.add('is-hidden');
  webglContent.start();
  render();
}
