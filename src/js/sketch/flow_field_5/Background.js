import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/Background.vs';
import fs from './glsl/Background.fs';

export default class Background extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(1, 1);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        resolution: {
          value: new THREE.Vector2()
        },
        noiseTex: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Background';
    this.position.z = -1000;
  }
  start(texture) {
    const { uniforms } = this.material;

    uniforms.noiseTex.value = texture;
  }
  update(time) {
    const { uniforms } = this.material;

    uniforms.time.value += time;
  }
  resize(camera, resolution) {
    const { uniforms } = this.material;
    const height = Math.abs(
      (camera.position.z - this.position.z) *
        Math.tan(MathEx.radians(camera.fov) / 2) *
        2
    );
    const width = height * camera.aspect;

    this.scale.set(width, height, 1);
    uniforms.resolution.value.copy(resolution);
  }
}
