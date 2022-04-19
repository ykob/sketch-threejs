const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class backgroundSphere {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  createObj() {
    const geometry = new THREE.SphereGeometry(10000, 128, 128);

    // Materialを定義
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/backgroundSphere.vs').default,
      fragmentShader: require('./glsl/backgroundSphere.fs').default,
      side: THREE.BackSide,
    });

    // Object3Dを作成
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
