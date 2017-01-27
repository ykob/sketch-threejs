const glslify = require('glslify');

export default class FrameObject {
  constructor() {
    this.uniforms = null;
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
    return new THREE.Line(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../glsl/index/frameObject.vs'),
        fragmentShader: glslify('../../../glsl/index/frameObject.fs'),
        linewidth: 2
      })
    )
  }
}
