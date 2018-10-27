const THREE = require('three/build/three.js');
const glslify = require('glslify');

export default class PostEffectBloom {
  constructor(texture1, texture2) {
    this.uniforms = {
      texture1: {
        type: 't',
        value: texture1
      },
      texture2: {
        type: 't',
        value: texture2
      }
    };
    this.obj = this.createObj();
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/postEffect.vs'),
        fragmentShader: require('./glsl/postEffectBloom.fs'),
      })
    );
  }
}
