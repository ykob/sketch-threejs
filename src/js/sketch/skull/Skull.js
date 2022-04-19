import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/Skull.vs';
import fs from './glsl/Skull.fs';

export default class Skull extends THREE.Group {
  constructor(geometry1, geometry2) {
    // Create Object3D
    super();

    // Define Material
    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        renderOutline: {
          type: 'f',
          value: 0
        },
        noiseTex: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    this.head = new THREE.Mesh(geometry1, this.material);
    this.jaw = new THREE.Mesh(geometry2, this.material);

    this.add(this.head);
    this.add(this.jaw);

    this.name = 'Skull';
    this.isActive = false;
  }
  start(noiseTex) {
    this.isActive = true;
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  update(time, camera) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
    this.head.rotation.set(MathEx.radians(-(Math.sin(this.material.uniforms.time.value) * 0.7 + 0.7) * 8), 0, 0);
    this.jaw.rotation.set(MathEx.radians((Math.sin(this.material.uniforms.time.value) * 0.7 + 0.7) * 8), 0, 0);
  }
}
