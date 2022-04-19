import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import WebGLContent from './WebGLContent';

export default async function() {
  const webglContent = new WebGLContent();
  const resolution = new THREE.Vector2();
  const canvas = document.getElementById('canvas-webgl');
  const preloader = document.querySelector('.p-preloader');

  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    webglContent.resize(resolution);
  };
  const on = () => {
    window.addEventListener('blur', () => {
      webglContent.pause();
    });
    window.addEventListener('focus', () => {
      webglContent.play();
    });
    window.addEventListener('resize', debounce(resizeWindow, 100));
  };
  const update = () => {
    webglContent.update();
    requestAnimationFrame(update);
  };

  await webglContent.start(canvas);

  on();
  resizeWindow();
  preloader.classList.add('is-hidden');
  webglContent.play();
  update();
}
