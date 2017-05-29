const glslify = require('glslify');

export default class Floor {
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
    const geometry = new THREE.BoxBufferGeometry(3000, 3000, 3000)
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/floor.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/floor.fs'),
        side: THREE.BackSide
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
