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
    this.num = 50;
    this.obj = null;
  }
  createObj() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    // const baseGeometry = new THREE.SphereBufferGeometry(2, 6, 18);
    const baseGeometry = new THREE.BoxBufferGeometry(2, 2, 20, 2, 2, 6);
    // baseGeometry.scale(1, 5, 1);
    // baseGeometry.rotateX(MathEx.radians(90));

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    const instanceRotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    const speeds = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      const rx = MathEx.radians(((Math.random() * 2) - 1) * 30);
      const ry = MathEx.radians(((Math.random() * 2) - 1) * 180);
      const p = MathEx.spherical(
        rx,
        ry,
        Math.random() * 20 + 70
      );
      instancePositions.setXYZ(i, p[0], p[1], p[2]);
      instanceRotates.setXYZ(i, 0, ry, -rx);
      speeds.setXYZ(i, Math.random() * 0.05 + 0.01);
    }
    geometry.addAttribute('instancePosition', instancePositions);
    geometry.addAttribute('instanceRotate', instanceRotates);
    geometry.addAttribute('speed', speeds);

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
