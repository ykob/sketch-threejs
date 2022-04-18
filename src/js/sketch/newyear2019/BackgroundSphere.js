import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

export default class BackgroundSphere extends THREE.Mesh {
  constructor() {
    // Define the geometry.
    const geometry = new THREE.SphereGeometry(100, 128, 128);

    // Define the material.
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: require('./glsl/backgroundSphere.vs').default,
      fragmentShader: require('./glsl/backgroundSphere.fs').default,
      side: THREE.BackSide,
      depthWrite: false,
    });

    // Create Object3D.
    super(geometry, material);
    this.position.y = 16.0;
    this.isOvered = false;
  }
  render(time) {
    if (this.isOvered === true) {
      this.material.uniforms.time.value += time;
    } else {
      this.material.uniforms.time.value -= time;
    }
    this.material.uniforms.time.value = MathEx.clamp(this.material.uniforms.time.value, 0, 0.8);
  }
  over() {
    this.material.uniforms.time.value = 0;
    this.isOvered = true;
  }
  coolDown() {
    this.material.uniforms.time.value = 0.2;
    this.isOvered = false;
  }
}
