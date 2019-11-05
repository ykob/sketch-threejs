import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Aura.vs';
import fs from './glsl/Aura.fs';

export default class Aura extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(10, 10);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Mesh';
    this.isActive = false;
  }
  start() {
    this.isActive = true;
  }
  update(time, camera) {
    if (this.isActive === false) return;
    this.rotation.copy(camera.rotation);
    this.material.uniforms.time.value += time;
  }
  resize(camera) {
    const height = Math.abs(
      (camera.position.z - this.position.z) * Math.tan(MathEx.radians(camera.fov) / 2) * 2
    );
  }
}
