import * as THREE from 'three';

import vs from './glsl/MoverCore.vs';
import fs from './glsl/MoverCore.fs';

export default class MoverCore extends THREE.InstancedMesh {
  constructor(count) {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneGeometry(2, 2);

    // Add common attributes
    geometry.copy(baseGeometry);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        acceleration: {
          value: null
        },
        velocity: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    // Create Object3D
    super(geometry, material, count);
    this.name = 'MoverCore';
    this.renderOrder = 2;
  }
  start(physicsRenderer) {
    const { uniforms } = this.material;

    uniforms.acceleration.value = physicsRenderer.getCurrentAcceleration();
    uniforms.velocity.value = physicsRenderer.getCurrentVelocity();
    this.geometry.setAttribute(
      'uvVelocity',
      physicsRenderer.getBufferAttributeUv({
        instanced: true
      })
    );
  }
  update(physicsRenderer, time) {
    const { uniforms } = this.material;

    uniforms.acceleration.value = physicsRenderer.getCurrentAcceleration();
    uniforms.velocity.value = physicsRenderer.getCurrentVelocity();
    uniforms.time.value += time;
  }
}
