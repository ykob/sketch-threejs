const THREE = require('three');

export default class SkyBox {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      cubeTex: {
        type: 't',
        value: null
      }
    };
    this.obj;
  }
  init(texture) {
    this.uniforms.cubeTex.value = texture;
    this.obj = this.createObj();
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.BoxGeometry(30000, 30000, 30000, 1, 1, 1),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/skybox.vs').default,
        fragmentShader: require('./glsl/skybox.fs').default,
        side: THREE.BackSide,
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
