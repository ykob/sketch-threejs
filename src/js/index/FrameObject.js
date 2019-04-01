const THREE = require('three');


export default class FrameObject {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2()
      },
    };
    this.obj = this.createObj();
  }
  createObj() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0, Math.sqrt(3) / 2, 0,
      -1, Math.sqrt(3) / 2 * -1, 0,
      1, Math.sqrt(3) / 2 * -1, 0,
    ]);
    const indices = new Uint16Array([
      0, 1, 2, 0
    ]);
    geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    return new THREE.Line(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/frameObject.vs').default,
        fragmentShader: require('./glsl/frameObject.fs').default,
      })
    )
  }
}
