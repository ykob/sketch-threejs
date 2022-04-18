import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import WebGLContent from './WebGLContent';

export default async function() {
  const webglContent = new WebGLContent();
  const resolution = new THREE.Vector2();
  const preloader = document.querySelector('.p-preloader');

  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    webglContent.resize(resolution);
  };
  const on = () => {
    window.addEventListener('resize', debounce(resizeWindow, 100));
  };
  const render = () => {
    webglContent.update();
    requestAnimationFrame(render);
  };

  on();
  resizeWindow();

  await webglContent.init(resolution);

  preloader.classList.add('is-hidden');
  webglContent.start();
  render();
}
