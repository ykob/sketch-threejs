import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class BackgroundSphere {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
    this.isOvered = false;
  }
  createObj() {
    const geometry = new THREE.SphereBufferGeometry(100, 128, 128);

    // Materialを定義
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/backgroundSphere.vs'),
      fragmentShader: require('./glsl/backgroundSphere.fs'),
      side: THREE.BackSide,
      depthWrite: false,
    });

    // Object3Dを作成
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.y = 16.0;
  }
  render(time) {
    if (this.isOvered === true) {
      this.uniforms.time.value += time;
    } else {
      this.uniforms.time.value -= time;
    }
    this.uniforms.time.value = MathEx.clamp(this.uniforms.time.value, 0, 0.8);
  }
  over() {
    this.uniforms.time.value = 0;
    this.isOvered = true;
  }
  coolDown() {
    this.uniforms.time.value = 0.2;
    this.isOvered = false;
  }
}
