import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import PhysicsRenderer from './PhysicsRenderer';

import vs from './glsl/Mover.vs';
import fs from './glsl/Mover.fs';
import vsa from './glsl/physicsRendererAcceleration.vs';
import fsa from './glsl/physicsRendererAcceleration.fs';
import vsv from './glsl/physicsRendererVelocity.vs';
import fsv from './glsl/physicsRendererVelocity.fs';

export default class Mover extends THREE.InstancedMesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.ConeGeometry(0.1, 2, 5);

    // Add common attributes
    geometry.copy(baseGeometry);

    // Define attributes of the geometry
    const count = 30000;

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
      transparent: true
    });

    // Create Object3D
    super(geometry, material, count);
    this.name = 'Mover';
    this.frustumCulled = false;
    this.physicsRenderer;
    this.multiTime = new THREE.Vector2(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
  }
  start(renderer, noiseTex) {
    const { uniforms } = this.material;

    // Define PhysicsRenderer
    const aArrayBase = [];
    const vArrayBase = [];
    const aFirstArray = [];
    const vFirstArray = [];
    const delayArray = [];
    const massArray = [];

    for (var i = 0; i < this.count * 3; i+= 3) {
      const radian1 = MathEx.radians(Math.random() * 360);
      const radian2 = MathEx.radians(Math.random() * 360);
      const radius = 5;
      const spherical = MathEx.spherical(radian1, radian2, radius);

      aArrayBase[i + 0] = spherical[0] * 0.02;
      aArrayBase[i + 1] = spherical[1] * 0.02;
      aArrayBase[i + 2] = spherical[2] * 0.02;

      vArrayBase[i + 0] = spherical[0];
      vArrayBase[i + 1] = spherical[1];
      vArrayBase[i + 2] = spherical[2];

      aFirstArray[i + 0] = aArrayBase[i + 0] * 0.3;
      aFirstArray[i + 1] = aArrayBase[i + 1] * 0.3;
      aFirstArray[i + 2] = aArrayBase[i + 2] * 0.3;

      vFirstArray[i + 0] = vArrayBase[i + 0];
      vFirstArray[i + 1] = vArrayBase[i + 1];
      vFirstArray[i + 2] = vArrayBase[i + 2];

      delayArray[i + 0] = 0;
      delayArray[i + 1] = 0;
      delayArray[i + 2] = 0;

      massArray[i + 0] = Math.random();
      massArray[i + 1] = 0;
      massArray[i + 2] = 0;
    }

    this.physicsRenderer = new PhysicsRenderer(vsa, fsa, vsv, fsv);
    this.physicsRenderer.start(
      renderer,
      aArrayBase,
      vArrayBase
    );
    this.physicsRenderer.mergeAUniforms({
      noiseTex: {
        value: noiseTex
      },
      accelerationFirst: {
        value: this.physicsRenderer.createDataTexture(aFirstArray)
      },
      delay: {
        value: this.physicsRenderer.createDataTexture(delayArray)
      },
      mass: {
        value: this.physicsRenderer.createDataTexture(massArray)
      },
      multiTime: {
        value: this.multiTime
      }
    });
    this.physicsRenderer.mergeVUniforms({
      velocityFirst: {
        value: this.physicsRenderer.createDataTexture(vFirstArray)
      }
    });

    uniforms.acceleration.value = this.physicsRenderer.getCurrentAcceleration();
    uniforms.velocity.value = this.physicsRenderer.getCurrentVelocity();
    this.geometry.setAttribute(
      'uvVelocity',
      this.physicsRenderer.getBufferAttributeUv({
        instanced: true
      })
    );
  }
  update(renderer, time) {
    const { uniforms } = this.material;

    this.physicsRenderer.update(renderer, time);
    uniforms.acceleration.value = this.physicsRenderer.getCurrentAcceleration();
    uniforms.velocity.value = this.physicsRenderer.getCurrentVelocity();
    uniforms.time.value += time;
  }
}
