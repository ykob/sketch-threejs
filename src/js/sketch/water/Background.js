import * as THREE from 'three';

import vs from './glsl/Background.vs';
import fs from './glsl/Background.fs';

export default class Background extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.SphereGeometry(100, 64, 64);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        texture: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.BackSide
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Background';
  }
  start(texture) {
    const { uniforms } = this.material;

    uniforms.texture.value = texture;
  }
}
