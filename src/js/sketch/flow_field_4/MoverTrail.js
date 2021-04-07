import * as THREE from 'three';

import vs from './glsl/MoverTrail.vs';
import fs from './glsl/MoverTrail.fs';

export default class MoverTrail extends THREE.InstancedMesh {
  constructor(count, heightSegments) {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.CylinderGeometry(0, 2.5, 2, 6, heightSegments, true);

    // Add common attributes
    geometry.copy(baseGeometry);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        acceleration: {
          value: null
        },
        velocity: {
          value: null
        },
        time: {
          value: 0
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    // Create Object3D
    super(geometry, material, count);
    this.name = 'MoverTrail';
    this.frustumCulled = false;
    this.multiTime = new THREE.Vector2(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
  }
  start(physicsRenderers) {
    const { uniforms } = this.material;

    for (let i = 0; i < physicsRenderers.length; i++) {
      if (i > 0) {
        uniforms[`velocity${i}`] = {
          value: physicsRenderers[i].getCurrentVelocity()
        };
      }
    }
    uniforms.acceleration.value = physicsRenderers[0].getCurrentAcceleration();
    uniforms.velocity.value = physicsRenderers[0].getCurrentVelocity();

    this.geometry.setAttribute(
      'uvVelocity',
      physicsRenderers[0].getBufferAttributeUv({
        instanced: true
      })
    );
  }
  update(physicsRenderers, time) {
    const { uniforms } = this.material;

    for (let i = 0; i < physicsRenderers.length; i++) {
      const fr = physicsRenderers[i];
      if (i === 0) {
        uniforms.acceleration.value = fr.getCurrentAcceleration();
        uniforms.velocity.value = fr.getCurrentVelocity();
      } else {
        uniforms[`velocity${i}`].value = fr.getCurrentVelocity();
      }
    }
    uniforms.time.value += time;
  }
}
