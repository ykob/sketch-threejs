import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/crystal.vs';
import fs from './glsl/crystal.fs';

export default class Crystal extends THREE.Mesh {
  constructor(geometry) {
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
        normalMap: {
          type: 't',
          value: null
        },
        surfaceTex: {
          type: 't',
          value: null
        },
        fogTex: {
          type: 't',
          value: null
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      flatShading: true,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Mesh';
    this.rotation.z = MathEx.radians(10);
  }
  start(hex, normalMap, surfaceTex, fogTex) {
    this.material.uniforms.hsv.value.set(hex, 0.65, 0.0);
    this.material.uniforms.normalMap.value = normalMap;
    this.material.uniforms.surfaceTex.value = surfaceTex;
    this.material.uniforms.fogTex.value = fogTex;
  }
  update(time) {
    this.material.uniforms.time.value += time;
    this.rotation.y += time * 0.1;
  }
}
