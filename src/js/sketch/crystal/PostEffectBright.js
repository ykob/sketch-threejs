import * as THREE from 'three';

import vs from './glsl/PostEffect.vs';
import fs from './glsl/PostEffectBright.fs';

export default class PostEffectBright extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        minBright: {
          type: 'f',
          value: 0.5
        },
        texture: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'PostEffectBright';
  }
  start(texture) {
    this.material.uniforms.texture.value = texture;
  }
}
