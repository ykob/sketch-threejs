import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class Confetti {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.num = 800;
    this.obj;
  }
  createObj() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(1, 1);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const ibaPositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3);
    const ibaColors = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3);
    const ibaRotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3);
    const ibaDelays = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      const radians = MathEx.radians(Math.random() * 360);
      const radius = Math.random() * 50 + 25;
      ibaPositions.setXYZ(
        i,
        Math.cos(radians) * radius,
        Math.sin(radians) * radius,
        Math.random() * 150 - 100
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
    geometry.addAttribute('iPosition', ibaPositions);
    geometry.addAttribute('iColor', ibaColors);
    geometry.addAttribute('iRotate', ibaRotates);
    geometry.addAttribute('iDelay', ibaDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/confetti.vs'),
      fragmentShader: require('./glsl/confetti.fs'),
      side: THREE.DoubleSide,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.name = 'InstanceMesh';
    this.obj.frustumCulled = false;
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
