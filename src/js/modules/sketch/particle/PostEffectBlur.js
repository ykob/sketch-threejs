const glslify = require('glslify');

export default class PostEffectBlur {
  constructor(texture, x, y) {
    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
      },
      direction: {
        type: 'v2',
        value: new THREE.Vector2(x, y)
      },
      texture: {
        type: 't',
        value: texture
      }
    };
    this.obj = this.createObj();
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/particle/postEffect.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/particle/postEffectBlur.fs'),
      })
    );
  }
  resize() {
    this.uniforms.resolution.value.set(document.body.clientWidth, window.innerHeight);
  }
}
