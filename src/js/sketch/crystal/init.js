import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import WebGLContent from './WebGLContent';
import Drag from './Drag';

export default async function() {
  const webglContent = new WebGLContent();
  const resolution = new THREE.Vector2();
  const panPosition = new THREE.Vector3();
  const canvas = document.getElementById('canvas-webgl');
  const preloader = document.querySelector('.p-preloader');
  const dd = new Drag(resolution);

  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    webglContent.resize(resolution);
  };
  const touchstart = (e) => {
    dd.touchStart(e);
  }
  const touchmove = (e) => {
    dd.touchMove(e);
  }
  const touchend = (e) => {
    dd.touchEnd(e);
  }
  const on = () => {
    canvas.addEventListener('mousedown', touchstart, { passive: false });
    window.addEventListener('mousemove', (e) => {
      touchmove(e);
      panPosition.set(
        (e.clientX / resolution.x * 2 - 1) * 0.1,
        (-e.clientY / resolution.y * 2 + 1) * 0.1,
        0
      );
      webglContent.pan(panPosition);
    });
    document.addEventListener('mouseleave', (e) => {
      panPosition.set(0, 0, 0);
      webglContent.pan(panPosition);
    });
    window.addEventListener('mouseup', touchend);
    canvas.addEventListener('touchstart', touchstart, { passive: false });
    window.addEventListener('touchmove', touchmove, { passive: false });
    window.addEventListener('touchend', touchend);
    window.addEventListener('resize', debounce(resizeWindow, 100));
  };
  const update = () => {
    dd.update(resolution);
    webglContent.update(dd);
    requestAnimationFrame(update);
  };

  await webglContent.start(canvas);

  on();
  resizeWindow();
  preloader.classList.add('is-hidden');
  webglContent.play(dd);
  update();
}
