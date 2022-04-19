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
    const touchstart = (e) => {
      webglContent.touchStart(e, resolution);
    }
    const touchmove = (e) => {
      webglContent.touchMove(e, resolution);
    }
    const touchend = () => {
      webglContent.touchEnd();
    }
    canvas.addEventListener('mousedown', touchstart, { passive: false });
    window.addEventListener('mousemove', touchmove, { passive: false });
    window.addEventListener('mouseup', touchend);
    canvas.addEventListener('touchstart', touchstart, { passive: false });
    window.addEventListener('touchmove', touchmove, { passive: false });
    window.addEventListener('touchend', touchend);
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
