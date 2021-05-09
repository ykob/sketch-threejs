import * as THREE from 'three';

import vs from './glsl/Water.vs';
import fs from './glsl/Water.fs';

export default class Water extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(80, 80);

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
        },
        tNormal: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Water';
    this.rotation.x = Math.PI / 180 * -90;
  }
  start(tScene, tNormal) {
    const { uniforms } = this.material;

    uniforms.tScene.value = tScene;
    uniforms.tNormal.value = tNormal;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
  resize(resolution) {
    this.material.uniforms.resolution.value.copy(resolution);
  }
}
