const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class SkyOctahedronShell {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = this.createObj();
    this.obj.position.set(0, 180, 0);
  }
  createObj() {
    const geometry = new THREE.OctahedronBufferGeometry(120, 4);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../glsl/index/skyOctahedronShell.vs'),
        fragmentShader: glslify('../../../glsl/index/skyOctahedronShell.fs'),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
