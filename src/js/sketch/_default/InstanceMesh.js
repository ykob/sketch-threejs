import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class InstanceMesh extends THREE.Mesh {
  constructor() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(10, 10, 10);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const num = 1000;
    const ibaPositions = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    for (var i = 0, ul = num; i < ul; i++) {
      ibaPositions.setXYZ(i, 0, 0, 0);
    }
    geometry.addAttribute('iPosition', ibaPositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: require('./glsl/instanceMesh.vs').default,
      fragmentShader: require('./glsl/instanceMesh.fs').default,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'InstanceMesh';
    this.frustumCulled = false;
  }
  start() {
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
}
