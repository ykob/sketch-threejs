const THREE = require('three/build/three.js');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

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
    this.obj = null;
  }
  createObj() {
    const geometry = new THREE.SphereBufferGeometry(50, 128, 128);

    // Materialを定義
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/backgroundSphere.vs'),
      fragmentShader: glslify('./glsl/backgroundSphere.fs'),
      side: THREE.BackSide,
    });

    // Object3Dを作成
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time, force) {
    this.uniforms.time.value += time * (force * 1.2);
  }
}
