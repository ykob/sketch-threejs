import * as THREE from 'three';
import { easeOutCirc } from 'easing-js';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Fire.vs';
import fs from './glsl/Fire.fs';

const DURATION = 2;

export default class Fire extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 128, 128);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        easeTransition: {
          type: 'f',
          value: 0
        },
        texNoise: {
          type: 't',
          value: null
        },
        imgRatio: {
          type: 'v2',
          value: new THREE.Vector2()
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Fire';
    this.size = new THREE.Vector3();
    this.margin = new THREE.Vector2();
    this.timeTransition = 0;
  }
  start(texNoise) {
    this.material.uniforms.texNoise.value = texNoise;
  }
  update(time) {
    this.material.uniforms.time.value += time;
    this.timeTransition += time;
    this.material.uniforms.easeTransition.value = easeOutCirc(Math.min(this.timeTransition / DURATION, 1.0));
    if (this.timeTransition / DURATION >= 1) this.timeTransition = 0;
  }
  resize(camera, resolution) {
    const height = Math.abs(
      (camera.position.z - this.position.z) * Math.tan(MathEx.radians(camera.fov) / 2) * 2
    );
    const width = height * camera.aspect;

    this.margin.set(
      (resolution.x > resolution.y) ? resolution.x * 0.3 : resolution.x * 0.2,
      (resolution.x > resolution.y) ? resolution.y * 0.2 : resolution.y * 0.3
    );

    this.size.set(
      width * (resolution.x - this.margin.x) / resolution.x,
      height * (resolution.y - this.margin.y) / resolution.y,
      1
    );
    this.material.uniforms.imgRatio.value.set(
      Math.min(1, this.size.x / this.size.y),
      Math.min(1, this.size.y / this.size.x)
    );

    this.scale.copy(this.size);
  }
}
