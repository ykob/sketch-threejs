import * as THREE from 'three';

import vs from './glsl/PostEffect.vs';
import fs from './glsl/PostEffectBlur.fs';

export default class PostEffectBlur extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        resolution: {
          value: new THREE.Vector2()
        },
        direction: {
          value: new THREE.Vector2()
        },
        texture: {
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'PostEffectBlur';
  }
  start(texture, x, y) {
    this.material.uniforms.texture.value = texture;
    this.material.uniforms.direction.value.set(x, y);
  }
  resize(x, y) {
    this.material.uniforms.resolution.value.set(x, y);
  }
}
