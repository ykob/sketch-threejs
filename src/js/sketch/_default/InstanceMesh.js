import * as THREE from 'three';

import vs from './glsl/InstanceMesh.vs';
import fs from './glsl/InstanceMesh.fs';

const COUNT = 1000;

export default class InstanceMesh extends THREE.InstancedMesh {
  constructor() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxGeometry(10, 10, 10);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const ibaPositions = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    for (var i = 0, ul = num; i < ul; i++) {
      ibaPositions.setXYZ(i, 0, 0, 0);
    }
    geometry.setAttribute('iPosition', ibaPositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        }
      },
      vertexShader: vs,
      fragmentShader: fs
    });

    // Create Object3D
    super(geometry, material, COUNT);
    this.name = 'InstanceMesh';
    this.frustumCulled = false;
    this.isActive = false;
  }
  start() {
    this.isActive = true;
  }
  update(time) {
    if (this.isActive === false) return;
    this.material.uniforms.time.value += time;
  }
}
