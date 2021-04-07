const THREE = require('three');

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
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/postEffect.vs').default,
        fragmentShader: require('./glsl/postEffectBlur.fs').default,
      })
    );
  }
  resize(x, y) {
    this.uniforms.resolution.value.set(x, y);
  }
}
