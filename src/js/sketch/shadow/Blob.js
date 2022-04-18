import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/Blob.vs';
import fs from './glsl/Blob.fs';

export default class Blob extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.TorusKnotGeometry(2.4, 0.8, 200, 32);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        ...THREE.UniformsLib['lights'],
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      lights: true,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Blob';
    this.position.set(0, 8, 0);
    this.castShadow = true;
    this.receiveShadow = false;
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
    this.rotation.set(
      this.material.uniforms.time.value,
      this.material.uniforms.time.value,
      0
    );
  }
}
