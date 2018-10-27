const THREE = require('three');

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
  }
  createObj() {
    const geometry = new THREE.OctahedronBufferGeometry(150, 4);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/skyOctahedronShell.vs'),
        fragmentShader: require('./glsl/skyOctahedronShell.fs'),
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
