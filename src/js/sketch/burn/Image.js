import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Image.vs';
import fs from './glsl/Image.fs';

export default class Image extends THREE.Mesh {
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
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Image';
  }
  start(texNoise, easeTransition) {
    this.material.uniforms.texNoise.value = texNoise;
  }
  update(time, easeStep) {
    this.material.uniforms.time.value += time;
    this.material.uniforms.easeTransition.value = easeStep;
  }
  resize(size) {
    this.material.uniforms.imgRatio.value.set(
      Math.min(1, size.x / size.y),
      Math.min(1, size.y / size.x)
    );
    this.scale.copy(size);
  }
}
