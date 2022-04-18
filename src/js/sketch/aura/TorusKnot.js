import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/TorusKnot.vs';
import fs from './glsl/TorusKnot.fs';

export default class TorusKnot extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.TorusKnotGeometry(2.0, 0.5, 60, 4);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        alpha: {
          type: 'f',
          value: 0
        },
        renderOutline: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'TorusKnot';
    this.isActive = false;
  }
  start(alpha) {
    this.isActive = true;
    this.rotation.set(
      MathEx.radians(Math.random() * 360),
      MathEx.radians(Math.random() * 360),
      MathEx.radians(Math.random() * 360)
    );
    this.material.uniforms.alpha.value = alpha;
  }
  update(time, camera) {
    if (this.isActive === false) return;
    this.rotation.set(
      this.rotation.x + time,
      this.rotation.y + time,
      this.rotation.z
    );
    this.material.uniforms.time.value += time;
  }
}
