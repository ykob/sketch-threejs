import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/shell.vs';
import fs from './glsl/shell.fs';

export default class Shell extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.SphereGeometry(7.5, 128, 128);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        texture: {
          type: 't',
          value: null
        },
        textureNormal: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Shell';
  }
  start(texture, textureNormal) {
    this.material.uniforms.texture.value = texture;
    this.material.uniforms.textureNormal.value = textureNormal;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
