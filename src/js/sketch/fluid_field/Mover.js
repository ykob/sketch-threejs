import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

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
    this.physicsRenderer;
  }
  start(renderer, noiseTex) {
    const { uniforms } = this.material;

    // Define PhysicsRenderer
    const verticesBase = this.geometry.attributes.position.array;
    const velocityArrayBase = [];
    const accelerationArrayBase = [];

    for (var i = 0; i < verticesBase.length; i+= 3) {
      const radian = MathEx.radians(Math.random() * 360);
      const radius = Math.random() * 2 + 2;
      velocityArrayBase[i + 0] = -29.99;
      velocityArrayBase[i + 1] = Math.cos(radian) * radius;
      velocityArrayBase[i + 2] = Math.sin(radian) * radius;
    }

    const velocityFirstArray = [];
    const delayArray = [];
    const massArray = [];
    const side = Math.ceil(Math.sqrt(velocityArrayBase.length / 3));

    for (var j = 0; j < Math.pow(side, 2) * 3; j += 3) {
      if (velocityArrayBase[j] != undefined) {
        velocityFirstArray[j + 0] = velocityArrayBase[j + 0];
        velocityFirstArray[j + 1] = velocityArrayBase[j + 1];
        velocityFirstArray[j + 2] = velocityArrayBase[j + 2];
        delayArray[j + 0] = Math.random() * 10;
        massArray[j + 0] = Math.random();
      } else {
        velocityFirstArray[j + 0] = 0;
        velocityFirstArray[j + 1] = 0;
        velocityFirstArray[j + 2] = 0;
        delayArray[j + 0] = 0;
        massArray[j + 0] = 0;
      }
      delayArray[j + 1] = 0;
      delayArray[j + 2] = 0;
      massArray[j + 1] = 0;
      massArray[j + 2] = 0;
    }
    const velocityFirstData = new THREE.DataTexture(
      new Float32Array(velocityFirstArray),
      side,
      side,
      THREE.RGBFormat,
      THREE.FloatType
    );
    const delayData = new THREE.DataTexture(
      new Float32Array(delayArray),
      side,
      side,
      THREE.RGBFormat,
      THREE.FloatType
    );
    const massData = new THREE.DataTexture(
      new Float32Array(massArray),
      side,
      side,
      THREE.RGBFormat,
      THREE.FloatType
    );
    this.physicsRenderer = new PhysicsRenderer(vsa, fsa, vsv, fsv);
    this.physicsRenderer.mergeAUniforms({
      noiseTex: {
        value: noiseTex
      },
      delay: {
        value: delayData
      },
      mass: {
        value: massData
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
