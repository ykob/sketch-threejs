import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import PhysicsRenderer from './PhysicsRenderer';

import vs from './glsl/Mover.vs';
import fs from './glsl/Mover.fs';
import vsa from './glsl/physicsRendererAcceleration.vs';
import fsa from './glsl/physicsRendererAcceleration.fs';
import vsv from './glsl/physicsRendererVelocity.vs';
import fsv from './glsl/physicsRendererVelocity.fs';

export default class Mover extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define attributes of the geometry
    const count = 150000;
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
    const verticesBase = this.geometry.attributes.position.array;
    const vArrayBase = [];
    const aArrayBase = [];
    const velocityFirstArray = [];
    const delayArray = [];
    const massArray = [];

    for (var i = 0; i < verticesBase.length; i+= 3) {
      const radian = MathEx.radians(Math.random() * 360);
      const radius = Math.random() * 1 + 2;

      vArrayBase[i + 0] = -29.99;
      vArrayBase[i + 1] = Math.cos(radian) * radius;
      vArrayBase[i + 2] = Math.sin(radian) * radius;

      velocityFirstArray[i + 0] = vArrayBase[i + 0];
      velocityFirstArray[i + 1] = vArrayBase[i + 1];
      velocityFirstArray[i + 2] = vArrayBase[i + 2];

      delayArray[i + 0] = Math.random() * 10;
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
        value: this.physicsRenderer.createDataTexture(velocityFirstArray)
      }
    });

    uniforms.acceleration.value = this.physicsRenderer.getCurrentAcceleration();
    uniforms.velocity.value = this.physicsRenderer.getCurrentVelocity();
    this.geometry.setAttribute('uvVelocity', this.physicsRenderer.getBufferAttributeUv());
  }
  update(renderer, time) {
    const { uniforms } = this.material;

    this.physicsRenderer.update(renderer, time);
    uniforms.acceleration.value = this.physicsRenderer.getCurrentAcceleration();
    uniforms.velocity.value = this.physicsRenderer.getCurrentVelocity();
    uniforms.time.value += time;
  }
  resize(resolution) {
    const { uniforms } = this.material;

    uniforms.resolution.value.copy(resolution);
  }
}
