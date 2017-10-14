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
    this.obj.visible = false;
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/butterfly/postEffect.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/butterfly/postEffectBloom.fs'),
      })
    );
  }
  render(renderer, scene, camera, renderTarget) {
    this.obj.visible = true;
    renderer.render(scene, camera, renderTarget);
    this.obj.visible = false;
  }
}
