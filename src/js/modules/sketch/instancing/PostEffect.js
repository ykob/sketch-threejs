const glslify = require('glslify');

export default class PostEffect {
  constructor(texture) {
    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(document.body.clientWidth, window.innerHeight)
      },
      texture: {
        type: 't',
        value: texture,
      }
    };
    this.obj = this.createObj();
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/instancing/postEffect.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/instancing/postEffect.fs'),
      })
    );
  }
}
