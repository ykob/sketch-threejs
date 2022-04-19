import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/sunshine.vs';
import fs from './glsl/sunshine.fs';

export default class SunShine extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.RingGeometry(4, 24, 64);

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
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.position.z = -5;
    this.name = 'SunShine';
  }
  start(texture) {
    this.material.uniforms.texture.value = texture;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
