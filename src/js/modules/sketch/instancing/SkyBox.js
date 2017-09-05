const glslify = require('glslify');

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
    this.obj = null;
  }
  init(texture) {
    this.uniforms.cubeTex.value = texture;
    this.obj = this.createObj();
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.BoxBufferGeometry(30000, 30000, 30000, 1, 1, 1),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/instancing/skybox.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/instancing/skybox.fs'),
        side: THREE.BackSide,
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
