import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Plane.vs';
import fs from './glsl/Plane.fs';

const margin = new THREE.Vector2();

export default class Plane extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(1, 1);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        imgRatio: {
          type: 'v2',
          value: new THREE.Vector2()
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Mesh';
    this.size = new THREE.Vector3();
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
  resize(camera, resolution) {
    const height = Math.abs(
      (camera.position.z - this.position.z) * Math.tan(MathEx.radians(camera.fov) / 2) * 2
    );
    const width = height * camera.aspect;

    margin.set(
      (resolution.x > resolution.y) ? resolution.x * 0.3 : resolution.x * 0.2,
      (resolution.x > resolution.y) ? resolution.y * 0.2 : resolution.y * 0.3
    );

    this.size.set(
      width * (resolution.x - margin.x) / resolution.x,
      height * (resolution.y - margin.y) / resolution.y,
      1
    );
    this.material.uniforms.imgRatio.value.set(
      Math.min(1, this.size.x / this.size.y),
      Math.min(1, this.size.y / this.size.x)
    );

    this.scale.copy(this.size);
  }
}
