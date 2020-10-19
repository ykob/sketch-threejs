import * as THREE from 'three';

import vs from './glsl/Points.vs';
import fs from './glsl/Points.fs';

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the geometry
    const edgeCount = 20;
    const baPositions = new THREE.BufferAttribute(new Float32Array(Math.pow(edgeCount, 3) * 3), 3);
    for (let x = 0; x < edgeCount; x++) {
      const posX = x - edgeCount / 2;
      for (let y = 0; y < edgeCount; y++) {
        const posY = y - edgeCount / 2;
        for (let z = 0; z < edgeCount; z++) {
          const i = x * Math.pow(edgeCount, 2) + y * edgeCount + z
          const posZ = z - edgeCount / 2;
          baPositions.setXYZ(i, posX, posY, posZ);
        }
      }
    }
    geometry.setAttribute('position', baPositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2()
        },
        pixelRatio: {
          type: 'f',
          value: window.devicePixelRatio
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Points';
    this.isActive = false;
  }
  start() {
    this.isActive = true;
  }
  update(time) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
  }
  resize(resolution) {
    this.material.uniforms.resolution.value.copy(resolution);
  }
}
