const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

const NUM = 40;

export default class Clouds {
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
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxGeometry(2, 2, 20, 2, 2, 6);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3);
    const instanceRotates = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3);
    const instanceScales = new THREE.InstancedBufferAttribute(new Float32Array(NUM * 3), 3);
    const speeds = new THREE.InstancedBufferAttribute(new Float32Array(NUM), 1);
    for ( var i = 0, ul = NUM; i < ul; i++ ) {
      const rx = MathEx.radians(((Math.random() * 2) - 1) * 30);
      const ry = MathEx.radians(((Math.random() * 2) - 1) * 180);
      const p = MathEx.spherical(
        rx,
        ry,
        Math.random() * 12 + 65
      );
      instancePositions.setXYZ(i, p[0], p[1], p[2]);
      instanceRotates.setXYZ(i, 0, ry, -rx);
      instanceScales.setXYZ(i, 1.0, Math.random() * 0.2 + 1.0, Math.random() * 0.4 + 0.8);
      speeds.setXYZ(i, Math.random() * 0.05 + 0.01);
    }
    geometry.setAttribute('instancePosition', instancePositions);
    geometry.setAttribute('instanceRotate', instanceRotates);
    geometry.setAttribute('instanceScale', instanceScales);
    geometry.setAttribute('speed', speeds);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/clouds.vs').default,
      fragmentShader: require('./glsl/clouds.fs').default,
    });

    // Create Object3D
    this.obj = new THREE.InstancedMesh(geometry, material, NUM);
    this.obj.frustumCulled = false;
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
