const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class BackgroundSphere {
  constructor(h) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      force: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  createObj() {
    const geometry = new THREE.SphereGeometry(150, 128, 128, 0, 6.3, 0, 1.6);

    // Materialを定義
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/backgroundSphere.vs').default,
      fragmentShader: require('./glsl/backgroundSphere.fs').default,
      side: THREE.BackSide,
    });

    // Object3Dを作成
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.rotation.set(
      MathEx.radians(-90),
      0,
      0
    );
  }
  render(time, force) {
    this.uniforms.force.value = force;
    this.uniforms.time.value += time * (force * 1.2);
  }
}
