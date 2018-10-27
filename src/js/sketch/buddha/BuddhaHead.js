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
    this.obj;
  }
  async createObj() {
    // Load an obj file.
    const obj = await promiseOBJLoader('/sketch-threejs/model/buddha/buddha_head.obj');
    this.uniforms.tex.value = await promiseTextureLoader('/sketch-threejs/model/buddha/buddha_ao.jpg');

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/buddhaHead.vs'),
      fragmentShader: require('./glsl/buddhaHead.fs'),
      flatShading: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(obj.children[0].geometry, material);
    this.obj.position.y = 16.0;
    this.obj.scale.set(7, 7, 7);
  }
  render(time, rotateX, rotateY) {
    this.uniforms.time.value += time;
    this.obj.rotation.set(
      MathEx.radians(rotateX - 15),
      MathEx.radians(rotateY + 15 - this.uniforms.time.value * 5),
      MathEx.radians(-20)
    );
  }
}
