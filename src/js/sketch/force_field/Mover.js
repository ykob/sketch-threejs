import * as THREE from 'three';

import PhysicsRenderer from './PhysicsRenderer';

import vs from './glsl/Mover.vs';
import fs from './glsl/Mover.fs';
import fsa from './glsl/physicsRendererAcceleration.fs';
import fsv from './glsl/physicsRendererVelocity.fs';

export default class Mover extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the geometry
    const count = 5000;
    const baPositions = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    for (let i = 0; i < count; i++) {
      baPositions.setXYZ(i, 0, 0, 0);
    }
    geometry.setAttribute('position', baPositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        resolution: {
          value: new THREE.Vector2()
        },
        pixelRatio: {
          value: window.devicePixelRatio
        },
        noiseTex: {
          value: null
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
    super(geometry, material);
    this.name = 'Mover';
  }
  start(renderer, noiseTex) {
    const { uniforms } = this.material;

    // Define PhysicsRenderer
    const verticesBase = this.geometry.attributes.position.array;
    const velocityArrayBase = [];
    const accelerationArrayBase = [];
    for (var i = 0; i < verticesBase.length; i+= 3) {
      velocityArrayBase[i + 0] = -20 - Math.random() * 100;
      velocityArrayBase[i + 1] = (Math.random() * 2 - 1) * 5;
      velocityArrayBase[i + 2] = (Math.random() * 2 - 1) * 5;
      accelerationArrayBase[i + 0] = 0.1;
      accelerationArrayBase[i + 1] = 0;
      accelerationArrayBase[i + 2] = 0;
    }
    this.physicsRenderer = new PhysicsRenderer(fsa, fsv);
    this.physicsRenderer.start(renderer, velocityArrayBase, accelerationArrayBase);
    uniforms.acceleration.value = this.physicsRenderer.getCurrentAcceleration();
    uniforms.velocity.value = this.physicsRenderer.getCurrentVelocity();
    this.geometry.setAttribute('uvVelocity', this.physicsRenderer.getBufferAttributeUv());

    uniforms.noiseTex.value = noiseTex;
  }
  update(renderer, time) {
    const { uniforms } = this.material;

    this.physicsRenderer.update(renderer, time);
    uniforms.time.value += time;
  }
  resize(resolution) {
    const { uniforms } = this.material;

    uniforms.resolution.value.copy(resolution);
    if (this.physicsRenderer) {
      this.physicsRenderer.resize();
    }
  }
}
