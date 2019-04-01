import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class Points extends THREE.Points {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: require('./glsl/points.vs').default,
      fragmentShader: require('./glsl/points.fs').default,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Points';
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
