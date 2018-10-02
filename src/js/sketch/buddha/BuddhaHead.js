const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

const promiseOBJLoader = require('../../common/PromiseOBJLoader').default;
const promiseTextureLoader = require('../../common/PromiseTextureLoader').default;

export default class BuddhaHead {
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
    this.obj = null;
  }
  async createObj() {
    // Load an obj file.
    const obj = await promiseOBJLoader('../../../model/buddha/buddha_head.obj');
    this.uniforms.tex.value = await promiseTextureLoader('../../../model/buddha/buddha_ao.jpg');

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/buddhaHead.vs'),
      fragmentShader: glslify('./glsl/buddhaHead.fs'),
    });

    // Create Object3D
    this.obj = new THREE.Mesh(obj.children[0].geometry, material);
    this.obj.scale.set(8, 8, 8);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
