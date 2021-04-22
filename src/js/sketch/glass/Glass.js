import * as THREE from 'three';

import vs from './glsl/Glass.vs';
import fs from './glsl/Glass.fs';

export default class Glass extends THREE.Mesh {
  constructor(geometry) {
    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        resolution: {
          value: new THREE.Vector2()
        },
        tScene: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Glass';
    this.isActive = false;
  }
  start(tScene) {
    this.isActive = true;
    this.material.uniforms.tScene.value = tScene;
  }
  update(time) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
  }
  resize(resolution) {
    this.material.uniforms.resolution.value.copy(resolution);
  }
}
