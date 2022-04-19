import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/crystalSparkle.vs';
import fs from './glsl/crystalSparkle.fs';

const NUM = 500;

export default class CrystalSparkle extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the instancing geometry
    const baPositions = new THREE.BufferAttribute(new Float32Array(NUM * 3), 3);
    const baDelay = new THREE.BufferAttribute(new Float32Array(NUM), 1, 1);
    const baSpeed = new THREE.BufferAttribute(new Float32Array(NUM), 1, 1);
    for (var i = 0, ul = NUM; i < ul; i++) {
      const radian1 = MathEx.radians(MathEx.randomArbitrary(0, 150) - 75);
      const radian2 = MathEx.radians(MathEx.randomArbitrary(0, 360));
      const radius = Math.random() * Math.random() * 4 + 2;
      const spherical = MathEx.spherical(radian1, radian2, radius);
      baPositions.setXYZ(i, spherical[0], spherical[1], spherical[2]);
      baDelay.setXYZ(i, Math.random());
      baSpeed.setXYZ(i, MathEx.randomArbitrary(1, 10) * (MathEx.randomInt(0, 1) * 2.0 - 1.0));
    }
    geometry.setAttribute('position', baPositions);
    geometry.setAttribute('delay', baDelay);
    geometry.setAttribute('speed', baSpeed);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        pixelRatio: {
          type: 'f',
          value: window.devicePixelRatio
        },
        hex: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });


    // Create Object3D
    super(geometry, material);
    this.name = 'CrystalSparkle';
  }
  start(hex) {
    this.material.uniforms.hex.value = hex;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
