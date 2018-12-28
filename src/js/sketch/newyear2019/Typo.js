import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import promiseTextureLoader from '../../common/PromiseTextureLoader';

export default class Typo {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      time2: {
        type: 'f',
        value: 0
      },
      tex: {
        type: 't',
        value: null
      },
      drawBrightOnly: {
        type: 'f',
        value: 0
      },
    };
    this.isOver = false;
    this.obj;
  }
  async createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(36, 36);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/typo.vs'),
      fragmentShader: require('./glsl/typo.fs'),
      transparent: true,
      // blending: THREE.AdditiveBlending,
    });
    this.uniforms.tex.value = await promiseTextureLoader('/sketch-threejs/img/sketch/newyear2019/typo.png');

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.z = 40;
  }
  render(time) {
    this.uniforms.time.value += time;
    if (this.isOver === true) this.uniforms.time2.value += time;
  }
  over(time) {
    this.uniforms.time2.value = 0;
    this.isOver = true;
  }
  coolDown() {
    this.isOver = false;
  }
}
