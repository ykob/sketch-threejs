import * as THREE from 'three';

import vs from './glsl/Image.vs';
import fs from './glsl/Image.fs';

export default class Image extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(27, 27);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        tImage: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Image';
  }
  start(tImage) {
    this.material.uniforms.tImage.value = tImage;
  }
}
