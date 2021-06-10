import * as THREE from 'three';

import vs from './glsl/Water.vs';
import fs from './glsl/Water.fs';

export default class Water extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(30, 30);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        tImage: {
          value: null
        },
        tNormal: {
          value: null
        },
        normalScale: {
          value: 1
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
  start(tImage, tNormal) {
    const { uniforms } = this.material;

    uniforms.tImage.value = tImage;
    uniforms.tNormal.value = tNormal;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
