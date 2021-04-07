import * as THREE from 'three';

import vs from './glsl/postEffect.vs';
import fs from './glsl/postEffect.fs';

export default class PostEffect extends THREE.Mesh {
  constructor(texture) {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0,
        },
        texture: {
          type: 't',
          value: texture,
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
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
  resize(x, y) {
    this.material.uniforms.resolution.value.set(x, y);
  }
}
