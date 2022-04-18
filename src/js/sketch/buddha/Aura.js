import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

export default class Aura {
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
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(60, 60, 512, 512);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/aura.vs').default,
      fragmentShader: require('./glsl/aura.fs').default,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.y = 16.0;
    this.obj.position.z = -30.0;
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
