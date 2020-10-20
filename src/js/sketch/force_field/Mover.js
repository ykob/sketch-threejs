import * as THREE from 'three';

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
    const count = 100000;
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
    this.physicsRenderer;
  }
  start(renderer, noiseTex) {
    const { uniforms } = this.material;

    // Define PhysicsRenderer
    const verticesBase = this.geometry.attributes.position.array;
    const velocityArrayBase = [];
    const accelerationArrayBase = [];

    for (var i = 0; i < verticesBase.length; i+= 3) {
      velocityArrayBase[i + 0] = (Math.random() * 2 - 1) * 2;
      velocityArrayBase[i + 1] = (Math.random() * 2 - 1) * 2;
      velocityArrayBase[i + 2] = (Math.random() * 2 - 1) * 2;
      accelerationArrayBase[i + 0] = 0.05;
      accelerationArrayBase[i + 1] = 0;
      accelerationArrayBase[i + 2] = 0;
    }

    const velocityFirstArray = [];
    const side = Math.ceil(Math.sqrt(velocityArrayBase.length / 3));

    for (var i = 0; i < Math.pow(side, 2) * 3; i += 3) {
      if (velocityArrayBase[i] != undefined) {
        velocityFirstArray[i + 0] = (Math.random() * 2 - 1) * 2;
        velocityFirstArray[i + 1] = (Math.random() * 2 - 1) * 2;
        velocityFirstArray[i + 2] = (Math.random() * 2 - 1) * 2;
      } else {
        velocityFirstArray[i + 0] = 0;
        velocityFirstArray[i + 1] = 0;
        velocityFirstArray[i + 2] = 0;
      }
    }
    const velocityFirstData = new THREE.DataTexture(
      new Float32Array(velocityFirstArray),
      side,
      side,
      THREE.RGBFormat,
      THREE.FloatType
    );
    velocityFirstData.needsUpdate = true;
    this.physicsRenderer = new PhysicsRenderer(vsa, fsa, vsv, fsv);
    this.physicsRenderer.mergeAUniforms({
      noiseTex: {
        value: noiseTex
      }
    });
    this.physicsRenderer.mergeVUniforms({
      velocityFirst: {
        value: velocityFirstData
      }
    });
    this.physicsRenderer.start(
      renderer,
      velocityArrayBase,
      accelerationArrayBase
    );
    uniforms.acceleration.value = this.physicsRenderer.getCurrentAcceleration();
    uniforms.velocity.value = this.physicsRenderer.getCurrentVelocity();
    this.geometry.setAttribute('uvVelocity', this.physicsRenderer.getBufferAttributeUv());
  }
  update(renderer, time) {
    const { uniforms } = this.material;

    this.physicsRenderer.update(renderer, time);
    uniforms.time.value += time;
  }
  resize(resolution) {
    const { uniforms } = this.material;

    uniforms.resolution.value.copy(resolution);
  }
}
