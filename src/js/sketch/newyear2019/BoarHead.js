import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

const promiseOBJLoader = require('../../common/PromiseOBJLoader').default;

export default class BoarHead {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  async createObj() {
    // Load an obj file.
    const obj = await promiseOBJLoader('/sketch-threejs/model/newyear2019/boar_head.obj');

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/boarHead.vs'),
      fragmentShader: require('./glsl/boarHead.fs'),
      flatShading: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(obj.children[0].geometry, material);
  }
  render(time, rotateX, rotateY) {
    this.uniforms.time.value += time;
    this.obj.rotation.set(
      MathEx.radians(rotateX),
      MathEx.radians(rotateY),
      0
    );
  }
}
