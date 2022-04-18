import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

export default class Points {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const delays1 = [];
    const delays2 = [];
    for (var i = 0; i < 600 * 3; i += 3) {
      const radius = Math.random() * Math.random() * 60 + 20;
      const radian = MathEx.radians(Math.random() * 360);
      positions[i + 0] = Math.cos(radian) * radius;
      positions[i + 1] = 0;
      positions[i + 2] = Math.sin(radian) * radius;
      delays1[i / 3] = Math.random() * 120;
      delays2[i / 3] = Math.random() * 120;
    }
    const baPositions = new THREE.BufferAttribute(new Float32Array(positions), 3);
    const baDelays1 = new THREE.BufferAttribute(new Float32Array(delays1), 1);
    const baDelays2 = new THREE.BufferAttribute(new Float32Array(delays2), 1);
    geometry.setAttribute('position', baPositions);
    geometry.setAttribute('delay1', baDelays1);
    geometry.setAttribute('delay2', baDelays2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/points.vs').default,
      fragmentShader: require('./glsl/points.fs').default,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
