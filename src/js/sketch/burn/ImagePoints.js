import * as THREE from 'three';

import vs from './glsl/ImagePoints.vs';
import fs from './glsl/ImagePoints.fs';

export default class ImagePoints extends THREE.Points {
  constructor() {
    // Define Geometry
    const gaseGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute('position', gaseGeometry.attributes.position);
    geometry.setAttribute('uv', gaseGeometry.attributes.uv);

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
        noiseTex: {
          type: 't',
          value: null
        },
        imgRatio: {
          type: 'v2',
          value: new THREE.Vector2()
        },
        pixelRatio: {
          type: 'f',
          value: window.devicePixelRatio
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'ImagePoints';
  }
  start(noiseTex) {
    this.material.uniforms.noiseTex.value = noiseTex;
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
