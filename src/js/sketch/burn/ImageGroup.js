import * as THREE from 'three';
import { easeInOutQuad } from 'easing-js';
import MathEx from 'js-util/MathEx';

import Image from './Image';
import ImageFire from './ImageFire';

const DURATION = 2.4;

export default class ImageGroup extends THREE.Group {
  constructor() {
    super();
    this.name = 'ImageGroup';
    this.size = new THREE.Vector3();
    this.margin = new THREE.Vector2();
    this.timeTransition = 0;

    this.image;
    this.imageFire;
  }
  start(noiseTex, imgTexes) {
    const image = new Image();
    const imageFire = new ImageFire();

    image.start(noiseTex, imgTexes);
    imageFire.start(noiseTex);

    this.add(image);
    this.add(imageFire);
  }
  update(time) {
    this.timeTransition += time;

    if (this.timeTransition / DURATION >= 1) {
      this.timeTransition = 0;
      this.children[0].changeTex();
      this.children[0].update(time, 0);
      this.children[1].update(time, 0);
    } else {
      const easeStep = easeInOutQuad(Math.min(this.timeTransition / DURATION, 1.0));

      this.children[0].update(time, easeStep);
      this.children[1].update(time, easeStep);
    }
  }
  resize(camera, resolution) {
    const height = Math.abs(
      (camera.position.z - this.position.z) * Math.tan(MathEx.radians(camera.fov) / 2) * 2
    );
    const width = height * camera.aspect;

    this.margin.set(
      (resolution.x > resolution.y) ? resolution.y * 0.2 : resolution.x * 0.3,
      (resolution.x > resolution.y) ? resolution.y * 0.2 : resolution.x * 0.3
    );
    this.size.set(
      width * (resolution.x - this.margin.x) / resolution.x,
      height * (resolution.y - this.margin.y) / resolution.y,
      1
    );
    this.children[0].resize(this.size);
    this.children[1].resize(this.size);
  }
}
