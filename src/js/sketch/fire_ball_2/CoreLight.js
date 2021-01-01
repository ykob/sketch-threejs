import * as THREE from 'three';

import vs from './glsl/CoreLight.vs';
import fs from './glsl/CoreLight.fs';

export default class CoreLight extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(30, 30);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        noiseTex: {
          value: null
        },
        acceleration: {
          value: new THREE.Vector3()
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'CoreLight';
  }
  start(noiseTex) {
    const { uniforms } = this.material;

    uniforms.noiseTex.value = noiseTex;
  }
  update(time, core) {
    const { uniforms } = this.material;

    uniforms.time.value += time;
    uniforms.acceleration.value.copy(core.acceleration);
    this.position.copy(core.position);
  }
}
