import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

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
    const baseGeometry = new THREE.ConeBufferGeometry(0.5, 1.5, 5);

    // Add common attributes
    geometry.copy(baseGeometry);

    // Define attributes of the geometry
    const count = 10000;
    const baColors = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    for (let i = 0; i < count; i++) {
      baColors.setXYZ(i, 0, 0, 0);
    }
    geometry.setAttribute('color', baColors);

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
    const verticesBase = this.geometry.attributes.color.array;
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
    this.geometry.setAttribute(
      'uvVelocity',
      this.physicsRenderer.getBufferAttributeUv(
        this.geometry.attributes.position.count
      )
    );
  }
  update(renderer, time) {
    const { uniforms } = this.material;

    this.physicsRenderer.update(renderer, time);
    uniforms.time.value += time;
  }
}
