import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/Image.vs';
import fs from './glsl/Image.fs';

export default class Image extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(1, 1, 64, 64);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        easeTransition: {
          type: 'f',
          value: 0
        },
        noiseTex: {
          type: 't',
          value: null
        },
        imgPrevTex: {
          type: 't',
          value: null
        },
        imgNextTex: {
          type: 't',
          value: null
        },
        imgRatio: {
          type: 'v2',
          value: new THREE.Vector2()
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Image';
    this.imgIndexPrev = 0;
    this.imgIndexNext = 1;
  }
  start(noiseTex, imgTexes) {
    this.imgTexes = imgTexes;
    this.material.uniforms.noiseTex.value = noiseTex;
    this.material.uniforms.imgPrevTex.value = this.imgTexes[this.imgIndexPrev];
    this.material.uniforms.imgNextTex.value = this.imgTexes[this.imgIndexNext];
  }
  update(time, easeStep) {
    this.material.uniforms.time.value += time;
    this.material.uniforms.easeTransition.value = easeStep;
  }
  resize(size) {
    this.material.uniforms.imgRatio.value.set(
      Math.min(1, size.x / size.y),
      Math.min(1, size.y / size.x)
    );
    this.scale.copy(size);
  }
  changeTex() {
    this.imgIndexPrev = this.imgIndexNext;
    this.imgIndexNext = (this.imgIndexNext + 1 >= this.imgTexes.length)
      ? 0
      : this.imgIndexNext + 1;
    this.material.uniforms.imgPrevTex.value = this.imgTexes[this.imgIndexPrev];
    this.material.uniforms.imgNextTex.value = this.imgTexes[this.imgIndexNext];
  }
}
