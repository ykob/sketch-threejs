const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class InstanceMesh {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.num = 1000;
    this.obj = null;
  }
  createObj() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(100, 100, 100);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      instancePositions.setXYZ(i, 0, 0, 0);
    }
    geometry.addAttribute('instancePosition', instancePositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/xxx/instanceMesh.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/xxx/instanceMesh.fs'),
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
