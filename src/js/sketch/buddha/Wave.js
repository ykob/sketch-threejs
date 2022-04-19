import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

export default class Wave {
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
    const geometry = new THREE.PlaneGeometry(70, 70, 512, 512);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/wave.vs').default,
      fragmentShader: require('./glsl/wave.fs').default,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.rotation.set(
      MathEx.radians(-90),
      0,
      0
    );
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
