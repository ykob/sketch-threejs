import * as THREE from 'three';

import vs from './glsl/PostEffect.vs';
import fs from './glsl/PostEffect.fs';

export default class PostEffect extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
        texture: {
          type: 't',
          value: null,
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(),
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'PostEffect';
    this.isActive = false;
  }
  start(texture) {
    this.material.uniforms.texture.value = texture;
    this.isActive = true;
  }
  update(time) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
  }
  resize(x, y) {
    this.material.uniforms.resolution.value.set(x, y);
  }
}
