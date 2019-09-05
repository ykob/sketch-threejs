import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Fire.vs';
import fs from './glsl/Fire.fs';


export default class Fire extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 64, 64);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        duration: {
          type: 'f',
          value: 1.6
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
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Fire';
    this.size = new THREE.Vector3();
    this.margin = new THREE.Vector2();
  }
  start(texNoise) {
    this.material.uniforms.texNoise.value = texNoise;
  }
  update(time) {
    this.material.uniforms.time.value += time;
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
