const THREE = require('three');

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
    const geometry = new THREE.OctahedronGeometry(150, 20);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/skyOctahedronShell.vs').default,
        fragmentShader: require('./glsl/skyOctahedronShell.fs').default,
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
