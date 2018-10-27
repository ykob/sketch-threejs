const THREE = require('three');

const MathEx = require('js-util/MathEx');

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
    const geometry = new THREE.SphereBufferGeometry(10000, 128, 128);

    // Materialを定義
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/backgroundSphere.vs'),
      fragmentShader: require('./glsl/backgroundSphere.fs'),
      side: THREE.BackSide,
    });

    // Object3Dを作成
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
