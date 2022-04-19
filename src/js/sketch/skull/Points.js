import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/Points.vs';
import fs from './glsl/Points.fs';

const DURATION = 4;
const NUM = 360;

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the geometry
    const baPositions = new THREE.BufferAttribute(new Float32Array(NUM * 3), 3);
    const baDelays = new THREE.BufferAttribute(new Float32Array(NUM), 1);
    for (var i = 0, ul = NUM; i < ul; i++) {
      const radian = MathEx.radians(Math.random() * 360);
      const radius = Math.random() * 4 + 1;
      baPositions.setXYZ(
        i,
        Math.cos(radian) * radius,
        0,
        Math.sin(radian) * radius
      );
      baDelays.setX(i, Math.random() * DURATION);
    }
    geometry.setAttribute('position', baPositions);
    geometry.setAttribute('delay', baDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        duration: {
          type: 'f',
          value: DURATION
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2()
        },
        pixelRatio: {
          type: 'f',
          value: window.devicePixelRatio
        },
        noiseTex: {
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
    this.name = 'Points';
  }
  start(noiseTex) {
    this.material.uniforms.noiseTex.value = noiseTex;
  }
  update(time) {
    this.material.uniforms.time.value += time;
    this.rotation.set(
      0,
      this.material.uniforms.time.value * 0.2,
      0
    );
  }
  resize(resolution) {
    this.material.uniforms.resolution.value.copy(resolution);
  }
}
