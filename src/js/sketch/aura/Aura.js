import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Aura.vs';
import fs from './glsl/Aura.fs';

export default class Aura extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(10, 10);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        objOutline: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Aura';
    this.isActive = false;
  }
  start(objOutline) {
    this.isActive = true;
    this.material.uniforms.objOutline.value = objOutline;
  }
  update(time, camera) {
    if (this.isActive === false) return;
    this.rotation.copy(camera.rotation);
    this.material.uniforms.time.value += time;
  }
}
