import * as THREE from 'three';

import vs from './glsl/Fog.vs';
import fs from './glsl/Fog.fs';

export default class Fog extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(60, 60);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        hsv: {
          type: 'v3',
          value: new THREE.Vector3()
        },
        fogTex: {
          type: 't',
          value: null
        },
        maskTex: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Fog';
  }
  start(hex, fogTex, maskTex) {
    this.material.uniforms.hsv.value.set(hex, 0.65, 0.5);
    this.material.uniforms.fogTex.value = fogTex;
    this.material.uniforms.maskTex.value = maskTex;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
