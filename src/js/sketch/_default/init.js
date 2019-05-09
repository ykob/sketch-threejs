import * as THREE from 'three';
import debounce from 'js-util/debounce';

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
    window.addEventListener('blur', () => {
      webglContent.pause();
    });
    window.addEventListener('focus', () => {
      webglContent.play();
    });
    window.addEventListener('resize', debounce(resizeWindow, 100));
  };

  on();
  resizeWindow();

  await webglContent.init();

  preloader.classList.add('is-hidden');

  webglContent.start();
}
