const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class Pole {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      force: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxGeometry(1.2, 1.2, 18);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const num = 120;
    const iPositions = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    const iDelays = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);
    for ( var i = 0, ul = num; i < ul; i++ ) {
      const radius = Math.random() * Math.random() * 40 + 40;
      const radian = MathEx.radians(Math.random() * 360);
      iPositions.setXYZ(
        i,
        Math.cos(radian) * radius,
        Math.sin(radian) * radius,
        0
      );
      iDelays.setX(
        i,
        Math.random() * 8
      )
    }
    geometry.setAttribute('iPosition', iPositions);
    geometry.setAttribute('iDelay', iDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/pole.vs').default,
      fragmentShader: require('./glsl/pole.fs').default,
      transparent: true,
      depthWrite: false,
    });

    // Create Object3D
    this.obj = new THREE.InstancedMesh(geometry, material, num);
    this.obj.frustumCulled = false;
  }
  render(time, force) {
    this.uniforms.force.value = force;
    this.uniforms.time.value += time * (force * 1.2);
  }
}
