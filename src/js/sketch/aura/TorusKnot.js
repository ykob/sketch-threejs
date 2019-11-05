import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/TorusKnot.vs';
import fs from './glsl/TorusKnot.fs';

export default class TorusKnot extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.TorusKnotBufferGeometry(0.6 * 3, 0.6, 200, 32);

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
    this.rotation.set(
      MathEx.radians(Math.random() * 360),
      MathEx.radians(Math.random() * 360),
      MathEx.radians(Math.random() * 360)
    );
  }
  update(time) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
    this.rotation.set(
      this.rotation.x + time,
      this.rotation.y + time,
      this.rotation.z
    );
  }
}
