import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

export default class Confetti extends THREE.InstancedMesh {
  constructor() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneGeometry(1.2, 1.2);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const NUM = 600;
    const ibaPositions = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3);
    const ibaColors = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3);
    const ibaRotates = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3);
    const ibaDelays = new THREE.InstancedBufferAttribute(new Float32Array(NUM), 1);
    for ( var i = 0, ul = NUM; i < ul; i++ ) {
      const radians = MathEx.radians(Math.random() * 360);
      const radius = Math.random() * 50 + 25;
      ibaPositions.setXYZ(
        i,
        Math.cos(radians) * radius,
        Math.sin(radians) * radius,
        Math.random() * 250 - 150
      );
      if (i % 2 === 1) {
        ibaColors.setXYZ(i, 0.8, 0.1, 0.1);
      } else {
        ibaColors.setXYZ(i, 1, 1, 1);
      }
      ibaRotates.setXYZ(
        i,
        MathEx.radians(Math.random() * 360),
        MathEx.radians(Math.random() * 360),
        MathEx.radians(Math.random() * 360)
      );
      ibaDelays.setXYZ(i, Math.random());
    }
    geometry.setAttribute('iPosition', ibaPositions);
    geometry.setAttribute('iColor', ibaColors);
    geometry.setAttribute('iRotate', ibaRotates);
    geometry.setAttribute('iDelay', ibaDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: require('./glsl/confetti.vs').default,
      fragmentShader: require('./glsl/confetti.fs').default,
      side: THREE.DoubleSide,
      transparent: true,
    });

    // Create Object3D
    super(geometry, material, NUM);
    this.name = 'InstanceMesh';
    this.frustumCulled = false;
    this.isOver = false;
  }
  render(time) {
    if (this.isOver === true) this.material.uniforms.time.value += time;
  }
  over(time) {
    this.material.uniforms.time.value = 0;
    this.isOver = true;
  }
  coolDown() {
    this.isOver = false;
  }
}
