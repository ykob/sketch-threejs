import * as THREE from 'three';

import vs from './glsl/Plane.vs';
import fs from './glsl/Plane.fs';

const SEGMENT = 3;

export default class Plane extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(30, 30, SEGMENT, SEGMENT);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        noiseTex: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      wireframe: true
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Plane';
  }
  start(noiseTex) {
    const { uniforms } = this.material;

    uniforms.noiseTex.value = noiseTex;

    console.log(this.geometry);
  }
  update(time) {
    const { uniforms } = this.material;

    uniforms.time.value += time;
  }
}
