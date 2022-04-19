import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

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
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Mesh';

    this.rotation.set(
      MathEx.radians((Math.random() * 2 - 1) * 30),
      0,
      MathEx.radians((Math.random() * 2 - 1) * 30)
    );
    this.axisBodyRotate = new THREE.Vector3().copy(this.up).applyEuler(this.rotation);
    this.quaternionPrev = new THREE.Quaternion();
  }
  start(hex, normalMap, surfaceTex, fogTex) {
    this.material.uniforms.hsv.value.set(hex, 0.65, 0.0);
    this.material.uniforms.normalMap.value = normalMap;
    this.material.uniforms.surfaceTex.value = surfaceTex;
    this.material.uniforms.fogTex.value = fogTex;
  }
  update(time) {
    this.material.uniforms.time.value += time;
    this.quaternionPrev.copy(this.quaternion);
    this.quaternion.setFromAxisAngle(this.axisBodyRotate, time * 0.1).multiply(this.quaternionPrev);
  }
}
