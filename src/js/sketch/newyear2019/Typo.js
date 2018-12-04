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
      tex: {
        type: 't',
        value: null
      },
    };
    this.obj;
  }
  async createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(32, 32);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/typo.vs'),
      fragmentShader: require('./glsl/typo.fs'),
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    this.uniforms.tex.value = await promiseTextureLoader('/sketch-threejs/img/sketch/newyear2019/typo.png');

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.z = 40;
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
