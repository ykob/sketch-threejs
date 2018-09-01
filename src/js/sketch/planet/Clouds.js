const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Clouds {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.num = 100;
    this.obj = null;
  }
  createObj() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(10, 10, 10);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      instancePositions.setXYZ(i, 0, 60, 0);
    }
    geometry.addAttribute('instancePosition', instancePositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/clouds.vs'),
      fragmentShader: glslify('./glsl/clouds.fs'),
      flatShading: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.frustumCulled = false;
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
