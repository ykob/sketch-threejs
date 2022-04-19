import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/points.vs';
import fs from './glsl/points.fs';

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the instancing geometry
    const num = 1200;
    const baPositions = new THREE.BufferAttribute(new Float32Array(num * 3), 3);
    const baDelay = new THREE.BufferAttribute(new Float32Array(num), 1, 1);
    const baSpeed = new THREE.BufferAttribute(new Float32Array(num), 1, 1);
    for (var i = 0, ul = num; i < ul; i++) {
      const radian1 = MathEx.radians(MathEx.randomArbitrary(0, 150) - 75);
      const radian2 = MathEx.radians(MathEx.randomArbitrary(0, 360));
      const radius = Math.random() * Math.random() * 8 + 6;
      const spherical = MathEx.spherical(radian1, radian2, radius);
      baPositions.setXYZ(i, spherical[0], spherical[1], spherical[2]);
      baDelay.setXYZ(i, Math.random());
      baSpeed.setXYZ(i, MathEx.randomArbitrary(5, 10) * (MathEx.randomInt(0, 1) * 2.0 - 1.0));
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
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Points';
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
