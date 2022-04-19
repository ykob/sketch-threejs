import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/Fog.vs';
import fs from './glsl/Fog.fs';

export default class Fog extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(55, 55);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        hex: {
          type: 'f',
          value: 0
        },
        fogTex: {
          type: 't',
          value: null
        },
        maskTex: {
          type: 't',
          value: null
        },
        direction: {
          type: 'v2',
          value: new THREE.Vector2()
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

    const radians = MathEx.radians(Math.random() * 360);
    this.material.uniforms.direction.value.set(
      Math.cos(radians),
      Math.sin(radians)
    )
  }
  start(hex, fogTex, maskTex) {
    this.material.uniforms.hex.value = hex;
    this.material.uniforms.fogTex.value = fogTex;
    this.material.uniforms.maskTex.value = maskTex;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
