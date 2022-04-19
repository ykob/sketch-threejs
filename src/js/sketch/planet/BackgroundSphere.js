const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class BackgroundSphere {
  constructor(h) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      addH: {
        type: 'f',
        value: h + 0.3
      },
    };
    this.obj;
  }
  createObj() {
    const geometry = new THREE.SphereGeometry(200, 128, 128);

    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/backgroundSphere.vs').default,
      fragmentShader: require('./glsl/backgroundSphere.fs').default,
      side: THREE.BackSide,
    });

    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
